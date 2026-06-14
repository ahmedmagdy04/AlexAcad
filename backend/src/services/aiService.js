import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import axios from "axios"
import fs from "fs"


dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY
const GROK_API_KEY = process.env.GROK_API_KEY || process.env.grok_api_key
const GROK_MODEL = process.env.GROK_MODEL || "grok-3"

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const formatAIError = (err) => {
    if (err?.response?.data) return err.response.data
    if (err?.message) return err.message
    return err
}

const isGrokUnavailableError = (err) => {
    return err?.response?.status === 403 || err?.response?.data?.code === "permission-denied"
}

const ensureGrokKey = () => {
    if (!GROK_API_KEY) {
        throw new Error("Missing GROK_API_KEY for fallback AI requests")
    }
}

const getTextLanguage = (text) => {
    const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/
    const hasArabic = arabicChars.test(text)
    const hasLatin = /[A-Za-z]/.test(text)

    if (hasArabic && !hasLatin) return "Arabic"
    if (hasLatin && !hasArabic) return "English"
    if (hasArabic && hasLatin) return "Mixed"
    return "English"
}

/**
 * askGemini — single-turn (used only internally as a fallback).
 */
const askGemini = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch (err) {
        console.error("Gemini single-turn failed:", formatAIError(err))
        throw err
    }
}

/**
 * askGeminiWithHistory — multi-turn chat.
 *
 * @param {string} systemPrompt  The full system+context prompt (first "user" turn).
 * @param {Array<{role:"user"|"assistant", content:string}>} history
 *   Previous turns from conv.messages (does NOT include the current message).
 * @param {string} userMessage   The new message from the student.
 */
const askGeminiWithHistory = async (systemPrompt, history, userMessage) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Gemini's chat history format uses "user" / "model" roles.
    // We prepend the system context as the first user+model exchange so that
    // the advisor rules and student data are always in scope.
    const formattedHistory = [
        // System context injection as the very first exchange
        {
            role: "user",
            parts: [{ text: systemPrompt }],
        },
        {
            role: "model",
            parts: [{ text: "Understood. I am ready to assist the student." }],
        },
        // Previous conversation turns (skip the very first pair if it duplicates the above)
        ...history.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        })),
    ]

    const chat = model.startChat({ history: formattedHistory })
    const result = await chat.sendMessage(userMessage)
    return result.response.text()
}

/**
 * askGrok — single-turn fallback using xAI Grok.
 * Includes history as a messages array so context is preserved even on fallback.
 */
const askGrok = async (systemPrompt, history, userMessage) => {
    ensureGrokKey()
    const currentLanguage = getTextLanguage(userMessage)
    const languageInstruction = `Latest student message language: ${currentLanguage}.
- If the current question is English, answer ONLY in English.
- If the current question is Arabic, answer ONLY in Arabic.
- If the current question is mixed, answer in the dominant language.
- Do NOT mix Arabic and English unless the student explicitly asks for both.
- If the answer is English and any course or context text is in Arabic, translate those names into English.
`
    const systemPromptWithLanguage = `${languageInstruction}\n\n${systemPrompt}`

    const messages = [
        { role: "system", content: systemPromptWithLanguage },
        ...history.map((msg) => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
        })),
        { role: "user", content: userMessage },
    ]

    try {
        const res = await axios.post(
            "https://api.x.ai/v1/chat/completions",
            { model: GROK_MODEL, messages },
            {
                headers: {
                    Authorization: `Bearer ${GROK_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )

        return res.data.choices[0].message.content
    } catch (err) {
        console.error("Grok fallback failed:", formatAIError(err))
        if (isGrokUnavailableError(err)) {
            throw new Error(
                "GROK_FALLBACK_UNAVAILABLE: Grok fallback is unavailable. Please check your xAI account permissions, credits, or license."
            )
        }
        throw err
    }
}

// ⭐ Single-turn (legacy, kept for PDF analysis helpers)
export const askAI = async (prompt) => {
    try {
        return await askGemini(prompt)
    } catch (err) {
        console.log("Gemini failed → switching to Grok (single-turn)")
        ensureGrokKey()
        const currentLanguage = getTextLanguage(prompt)
        const languageInstruction = `Latest student message language: ${currentLanguage}.
- If the current question is English, answer ONLY in English.
- If the current question is Arabic, answer ONLY in Arabic.
- If the current question is mixed, answer in the dominant language.
- Do NOT mix Arabic and English unless the student explicitly asks for both.
- If the answer is English and any course or context text is in Arabic, translate those names into English.
`
        const res = await axios.post(
            "https://api.x.ai/v1/chat/completions",
            { model: GROK_MODEL, messages: [{ role: "system", content: languageInstruction }, { role: "user", content: prompt }] },
            {
                headers: {
                    Authorization: `Bearer ${GROK_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )
        return res.data.choices[0].message.content
    }
}

/**
 * ⭐ Multi-turn chat — USE THIS for the chat controller.
 *
 * @param {string} systemPrompt  Built by buildAdvisorPrompt() (student data + rules)
 * @param {Array}  history       conv.messages BEFORE the current message
 * @param {string} userMessage   The student's current message
 */
export const askAIWithHistory = async (systemPrompt, history = [], userMessage) => {
    try {
        return await askGeminiWithHistory(systemPrompt, history, userMessage)
    } catch (err) {
        console.error("Gemini multi-turn failed:", formatAIError(err))
        console.log("Gemini failed → switching to Grok (multi-turn)")
        return await askGrok(systemPrompt, history, userMessage)
    }
}



export const analyzeRegistrationPDF = async (filePath) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    })

    const fileBuffer = fs.readFileSync(filePath)

    const prompt = `
You are analyzing a university course registration form.

Return ONLY valid JSON.

{
  "registeredCourses": [
    "Course 1",
    "Course 2"
  ]
}

Rules:
- Extract only the registered course names.
- Ignore student name.
- Ignore GPA.
- Ignore department.
- Ignore semester information.
- Ignore course codes if course names exist.
- Preserve Arabic exactly as written.
- Return JSON only.
`

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: "application/pdf"
            }
        }
    ])

    return result.response.text()
}

export const analyzeTranscriptPDF = async (filePath) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    })

    const fileBuffer = fs.readFileSync(filePath)

    const prompt = `
You are analyzing a university transcript.

Return ONLY valid JSON.

{
  "cgpa": number,
  "completedCourses": [
    {
      "name": string,
      "grade": string
    }
  ],
  "failedCourses": [
    {
      "name": string,
      "grade": string
    }
  ]
}

Rules:
- Read Arabic correctly.
- Extract all courses.
- Preserve Arabic exactly as written.
- Courses with passing grades belong in completedCourses.
- Failed courses belong in failedCourses.
- Return JSON only.
`

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: "application/pdf"
            }
        }
    ])

    return result.response.text()
}