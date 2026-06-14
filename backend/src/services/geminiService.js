import dotenv from "dotenv"
dotenv.config()

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const formatAIError = (err) => {
  if (err?.response?.data) return err.response.data
  if (err?.message) return err.message
  return err
}

export const askGemini = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const prompt = `
You are AlexAcad, an AI academic advisor for Alexandria University students.

LANGUAGE RULES:
- If the student writes in Arabic, respond ONLY in Arabic.
- If the student writes in English, respond ONLY in English.
- Never mix Arabic and English unless the student explicitly asks for both.
- Match the student's language automatically.

BEHAVIOR:
- Be helpful, accurate, and concise.
- Help with courses, prerequisites, registration, academic planning, GPA, and university procedures.
- If information is missing, ask follow-up questions.
- Do not invent university regulations.

Student Message:
${userMessage}
`

    const result = await model.generateContent(prompt)
    const response = await result.response

    return response.text()

  } catch (err) {
    console.error("❌ Gemini failed:", formatAIError(err))
    throw new Error("GEMINI_FAILED")
  }
}

export const analyzeTranscript = async (transcriptText) => {
  const prompt = `
You are an academic system.

Extract ONLY JSON:

{
  "cgpa": number,
  "completedCourses": [
    { "name": "", "grade": "" }
  ],
  "failedCourses": [
    { "name": "", "grade": "" }
  ]
}

Transcript:
${transcriptText}
`

  return await askGemini(prompt)
}