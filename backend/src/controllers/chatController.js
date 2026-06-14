/**
 * chatController.js
 *
 * Handles all conversation and messaging logic.
 *
 * Key upgrade in sendMessage():
 *  - resolveCourseMention() scans the message for any known course name using
 *    findCourse() (alias-aware, bilingual).
 *  - If a course is found, its prerequisites are loaded from the DB.
 *  - canTakeCourse() is run when the message is an eligibility question.
 *  - All of this is injected into buildAdvisorPrompt() as courseContext so the
 *    LLM receives real database data and never guesses prerequisites.
 */

import Conversation from "../models/Conversation.js"
import User from "../models/User.js"
import Course from "../models/Course.js"
import { loadStudentCourses } from "../services/courseLoader.js"
import { canTakeCourse } from "../services/courseEligibilityChecker.js"
import { findCourse, getCoursesByCodes } from "../services/courseFinder.js"
import { askAI, askAIWithHistory } from "../services/aiService.js"
import { buildAdvisorPrompt } from "../services/promptBuilder.js"

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

/** Truncate the first user message to build an automatic title */
const generateTitle = (message) =>
  message.length > 40 ? message.slice(0, 40).trimEnd() + "…" : message

/** Verify the conversation exists and belongs to the requesting user */
const getOwnedConversation = async (conversationId, userId) => {
  const conv = await Conversation.findById(conversationId)
  if (!conv) return { error: "Conversation not found", status: 404 }
  if (conv.userId.toString() !== userId.toString())
    return { error: "Forbidden", status: 403 }
  return { conv }
}

/**
 * Scan a message for any course name known to the catalog.
 *
 * Strategy:
 *  1. Load all Course documents (small collection — cached by Mongoose).
 *  2. For each course, check whether any of its aliases appear in the
 *     normalised message text.
 *  3. Return the first match found, or null.
 *
 * This is deliberately broad — it catches Arabic names, English names,
 * abbreviations, and any alias stored in the Course document.
 *
 * @param {string} message
 * @returns {Promise<import("../models/Course.js").default | null>}
 */
const resolveCourseMention = async (message) => {
  if (!message) return null

  const lower = message.toLowerCase().trim()

  // Load all courses (Mongoose caches connections; this is fast for small DBs)
  const allCourses = await Course.find({}).lean()

  for (const course of allCourses) {
    // Check English name
    if (course.englishName && lower.includes(course.englishName.toLowerCase())) {
      return course
    }

    // Check Arabic name
    if (course.arabicName && message.includes(course.arabicName)) {
      return course
    }

    // Check all stored aliases (already normalised at seed time)
    if (course.aliases && Array.isArray(course.aliases)) {
      for (const alias of course.aliases) {
        if (alias && lower.includes(alias.toLowerCase())) {
          return course
        }
      }
    }
  }

  return null
}

/**
 * Classify what the student is asking regarding a course.
 *
 * Checks both the lowercased message (for English) and the original message
 * (for Arabic) so that Arabic prerequisite questions are caught correctly.
 *
 * @param {string} lower    lowercased message
 * @param {string} original original message (preserves Arabic)
 * @returns {"eligibility" | "prerequisites" | "info"}
 */
const classifyCourseIntent = (lower, original = "") => {
  const eligibilityKeywords = [
    "can i take",
    "can i register",
    "am i allowed",
    "eligible",
    "هل يمكنني",
    "هل أستطيع",
    "هل استطيع",
    "هل انا مؤهل",
    "هل يمكن",
    "مؤهل",
    "مسجل",
    "يمكنني تسجيل",
    "اسجل",
    "أسجل",
    "هل اقدر",
    "هل أقدر",
  ]

  const prerequisiteKeywords = [
    // English
    "prerequisite",
    "prerequisites",
    "what do i need",
    "what courses do i need",
    "need before",
    "requirements for",
    "required for",
    "what is required",
    "before i can take",
    "before taking",
    // Arabic — checked against original to preserve diacritics/forms
    "متطلب",
    "متطلبات",
    "المتطلب",
    "المتطلبات",
    "ماذا احتاج",
    "ما هي المتطلبات",
    "ما المتطلبات",
    "مطلوب",
    "مواد مطلوبة",
    "ما الذي احتاج",
    "قبل التسجيل",
    "قبل اخذ",
    "قبل أخذ",
    "لتسجيل",
    "كي اسجل",
    "كي أسجل",
    "graduation project",
    "مشروع تخرج",
  ]

  // Check eligibility
  if (eligibilityKeywords.some((kw) => lower.includes(kw.toLowerCase()) || original.includes(kw)))
    return "eligibility"

  // Check prerequisites against both forms
  if (
    prerequisiteKeywords.some(
      (kw) => lower.includes(kw.toLowerCase()) || original.includes(kw)
    )
  )
    return "prerequisites"

  return "info"
}

/** Auto-generate title on first message, then save conversation */
async function _autoTitleAndSave(conv, firstUserMessage) {
  if (conv.title === "New Chat" && conv.messages.length <= 2) {
    conv.title = generateTitle(firstUserMessage)
  }
  await conv.save()
}

// ─────────────────────────────────────────────
// POST /api/chat/conversation
// ─────────────────────────────────────────────
export const createConversation = async (req, res) => {
  try {
    const conv = await Conversation.create({
      userId: req.user.id,
      title: "New Chat",
      messages: [],
    })
    return res.status(201).json(conv)
  } catch (err) {
    console.error("CREATE CONVERSATION ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// GET /api/chat/conversations
// ─────────────────────────────────────────────
export const listConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .select("_id title updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .lean()

    return res.json(conversations)
  } catch (err) {
    console.error("LIST CONVERSATIONS ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// GET /api/chat/conversation/:id
// ─────────────────────────────────────────────
export const getConversation = async (req, res) => {
  try {
    const { conv, error, status } = await getOwnedConversation(
      req.params.id,
      req.user.id
    )
    if (error) return res.status(status).json({ message: error })

    return res.json(conv)
  } catch (err) {
    console.error("GET CONVERSATION ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// DELETE /api/chat/conversation/:id
// ─────────────────────────────────────────────
export const deleteConversation = async (req, res) => {
  try {
    const { conv, error, status } = await getOwnedConversation(
      req.params.id,
      req.user.id
    )
    if (error) return res.status(status).json({ message: error })

    await conv.deleteOne()
    return res.json({ success: true, message: "Conversation deleted" })
  } catch (err) {
    console.error("DELETE CONVERSATION ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// PUT /api/chat/conversation/:id
// ─────────────────────────────────────────────
export const renameConversation = async (req, res) => {
  try {
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" })
    }

    const { conv, error, status } = await getOwnedConversation(
      req.params.id,
      req.user.id
    )
    if (error) return res.status(status).json({ message: error })

    conv.title = title.trim().slice(0, 120)
    await conv.save()

    return res.json({ _id: conv._id, title: conv.title, updatedAt: conv.updatedAt })
  } catch (err) {
    console.error("RENAME CONVERSATION ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// POST /api/chat/send/:conversationId
// ─────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { conversationId } = req.params

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" })
    }

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" })
    }

    // ── 1. Load user ───────────────────────────────────────────────
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // ── 2. Authorise conversation ──────────────────────────────────
    const { conv, error, status } = await getOwnedConversation(
      conversationId,
      req.user.id
    )
    if (error) return res.status(status).json({ message: error })

    // ── 3. Load available courses ──────────────────────────────────
    const courses = await loadStudentCourses(user)
    const lowerMessage = message.toLowerCase().trim()

    // ── 4. Detect any course mention in the message ────────────────
    //
    // Complex, multi-question advisory messages (long messages, numbered
    // lists, many question marks, "my friend" scenarios) must bypass the
    // course fast-path completely and go straight to the AI so that the
    // full context is analysed holistically.
    //
    // A message is "complex" if ANY of the following are true:
    //   • longer than 280 characters
    //   • contains a numbered list  (1. … 2. … or 1) … 2) …)
    //   • contains 3 or more question marks
    //   • explicitly mentions a third party ("my friend", "his", "her" + data)
    //
    const questionMarkCount = (message.match(/\?/g) || []).length
    const hasNumberedList   = /(?:^|\n)\s*[1-9][.)]\s/m.test(message)
    const hasThirdPartyCtx  = /\b(my friend|his gpa|her gpa|about him|about her|for him|for her)\b/i.test(message)

    const isComplexQuery =
      message.length > 280 ||
      questionMarkCount >= 3 ||
      hasNumberedList ||
      hasThirdPartyCtx

    // Only run course-mention detection for simple, focused questions.
    const mentionedCourse = isComplexQuery ? null : await resolveCourseMention(message)
    const intent = mentionedCourse ? classifyCourseIntent(lowerMessage, message) : null

    let courseContext = null

    if (mentionedCourse) {
      // Load the prerequisite Course documents
      const prereqCodes = mentionedCourse.prerequisites || []
      const prerequisites = prereqCodes.length > 0
        ? await getCoursesByCodes(prereqCodes)
        : []

      courseContext = { course: mentionedCourse, prerequisites }

      // ── Fast path: eligibility question ───────────────────────────
      if (intent === "eligibility") {
        const eligibility = await canTakeCourse(user, mentionedCourse.arabicName)
        courseContext.eligibility = eligibility

        const icon = eligibility.allowed ? "✅" : "❌"
        const verdict = eligibility.allowed ? "YES — you can take" : "NO — you cannot take"

        const prereqLine = prerequisites.length > 0
          ? `\n📚 Prerequisites: ${prerequisites.map(p => `${p.arabicName} (${p.englishName})`).join(", ")}`
          : "\n📚 Prerequisites: None"

        const reply = `${icon} ${verdict} "${mentionedCourse.arabicName}" (${mentionedCourse.englishName}).` +
          `\n📌 ${eligibility.reason}` +
          prereqLine

        conv.messages.push(
          { role: "user", content: message },
          { role: "assistant", content: reply }
        )
        await _autoTitleAndSave(conv, message)

        return res.json({ reply, type: "course-check", conversationId: conv._id })
      }

      // ── Fast path: prerequisites-only question ────────────────────
      if (intent === "prerequisites") {
        let reply

        if (prerequisites.length === 0) {
          reply =
            `📚 "${mentionedCourse.arabicName}" (${mentionedCourse.englishName}) has no prerequisites — ` +
            `you can register it directly as long as you meet GPA requirements.`
        } else {
          // Resolve the student's completed courses to codes for comparison
          const completedNames = user.completedCourses || []
          const completedCodesResolved = await Promise.all(
            completedNames.map(async (name) => {
              const c = await findCourse(name)
              return c ? c.code : null
            })
          )
          const completedCodes = new Set(completedCodesResolved.filter(Boolean))

          const prereqLines = prerequisites
            .map((p, i) => {
              const done = completedCodes.has(p.code)
              const status = done ? "✅" : "❌ not yet completed"
              return `  ${i + 1}. ${p.arabicName} (${p.englishName}) [${p.code}] — ${status}`
            })
            .join("\n")

          const allDone = prerequisites.every((p) => completedCodes.has(p.code))
          const summary = allDone
            ? "\n✅ You have completed all prerequisites."
            : "\n⚠️ You are missing one or more prerequisites."

          reply =
            `📚 Prerequisites for "${mentionedCourse.arabicName}" (${mentionedCourse.englishName}):\n` +
            prereqLines +
            summary
        }

        conv.messages.push(
          { role: "user", content: message },
          { role: "assistant", content: reply }
        )
        await _autoTitleAndSave(conv, message)

        return res.json({ reply, type: "prerequisites", conversationId: conv._id })
      }

      // For "info" intent, fall through to the AI path with courseContext injected
    }

    // ── 5. Registration review guard ────────────────────────────────
    const isRegistrationReview =
      lowerMessage.includes("review my registration") ||
      lowerMessage.includes("can i take these courses") ||
      lowerMessage.includes("are there conflicts") ||
      lowerMessage.includes("do i meet prerequisites") ||
      lowerMessage.includes("check my registration") ||
      lowerMessage.includes("validate my registration")

    const registeredCourses = user.registeredCourses || []

    if (isRegistrationReview && registeredCourses.length === 0) {
      const reply =
        "You haven't uploaded a registration form yet. Please upload your semester registration PDF so I can review it."

      conv.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: reply }
      )
      await _autoTitleAndSave(conv, message)

      return res.json({
        reply,
        type: "registration-review",
        conversationId: conv._id,
      })
    }

    // ── 6. General AI path ──────────────────────────────────────────
    //
    // We build the system prompt including the student's current message so
    // language rules and translation guidance apply to this turn.
    // courseContext injects real DB data for course-related questions.
    //
    const systemPrompt = buildAdvisorPrompt(user, courses, message, courseContext)

    // Snapshot the existing messages BEFORE appending the new turn.
    // These are the prior turns the AI should remember.
    const priorHistory = [...conv.messages]

    const aiReply = await askAIWithHistory(systemPrompt, priorHistory, message)

    conv.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiReply }
    )
    await _autoTitleAndSave(conv, message)

    return res.json({
      reply: aiReply,
      courses,
      conversationId: conv._id,
    })

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// GET /api/chat/courses  (kept for compatibility)
// ─────────────────────────────────────────────
export const getCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const courses = await loadStudentCourses(user)
    return res.json(courses)
  } catch (err) {
    console.error("COURSES ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}