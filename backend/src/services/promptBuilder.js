import { REGULATION_TEXT } from "../ai/rules/regulation.js"

// ─────────────────────────────────────────────
// Helper: format a course object or string for prompt display
// ─────────────────────────────────────────────
const formatCourse = (c) => {
  if (!c) return ""
  if (typeof c === "string") return c
  if (c.arabicName && c.englishName) return `${c.arabicName} (${c.englishName})`
  return c.arabicName || c.englishName || String(c)
}

const getMessageLanguage = (text) => {
  if (!text) return "unknown"
  const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/
  const hasArabic = arabicChars.test(text)
  const hasLatin = /[A-Za-z]/.test(text)

  if (hasArabic && !hasLatin) return "Arabic"
  if (hasLatin && !hasArabic) return "English"
  if (hasArabic && hasLatin) return "Mixed"
  return "English"
}

// ─────────────────────────────────────────────
// 1. Academic Advisor Prompt
//
// courseContext (optional):
//   {
//     course: Course document,
//     prerequisites: Course[],          // resolved prereq documents
//     eligibility?: { allowed, reason } // result of canTakeCourse()
//   }
// ─────────────────────────────────────────────
export const buildAdvisorPrompt = (user, courses, message, courseContext = null) => {
  const name        = user?.name              ?? "the student"
  const department  = user?.department        ?? "unknown department"
  const level       = user?.level             ?? "unknown level"
  const gpa         = user?.cumulativeGPA     ?? null
  const warnings    = user?.warnings          ?? 0
  const isMonitored = user?.isUnderMonitoring ? "yes" : "no"

  const currentCourses    = (courses?.currentCourses || []).map(formatCourse)
  const failedCourses     = (user?.failedCourses     || []).map(formatCourse)
  const completedCourses  = (user?.completedCourses  || []).map(formatCourse)
  const registeredCourses = (user?.registeredCourses || []).map(formatCourse)

  // ── Build the structured course-context block ──────────────────
  let courseBlock = ""

  if (courseContext && courseContext.course) {
    const c = courseContext.course
    const prereqs = courseContext.prerequisites || []

    const prereqList = prereqs.length > 0
      ? prereqs.map(p => `  - ${p.arabicName} (${p.englishName}) [${p.code}]`).join("\n")
      : "  None"

    courseBlock = `
COURSE DETAILS (retrieved from database — use ONLY this data, do NOT invent anything):
  Name:         ${c.arabicName} (${c.englishName})
  Code:         ${c.code}
  Department:   ${c.department}
  Level:        ${c.level}
  Semester:     ${c.semester}
  Credits:      ${c.credits}
  Prerequisites:
${prereqList}`

    if (courseContext.eligibility) {
      const e = courseContext.eligibility
      courseBlock += `
  Eligibility:  ${e.allowed ? "✅ ALLOWED" : "❌ NOT ALLOWED"}
  Reason:       ${e.reason}`
    }
  }

  const messageLanguage = getMessageLanguage(message)

  return `
You are an expert academic advisor for the Faculty of Business, Alexandria University.

STYLE RULES:
- Do NOT greet the student.
- Do NOT say hello or introduce yourself.
- Keep responses short and to the point.
- Be natural, human, and conversational.
- You may use bullet points when listing courses or prerequisites.
- Maximum 5–8 lines per response.
- Explain only what is necessary.
- If the current question is in English, answer ONLY in English.
- If the current question is in Arabic, answer ONLY in Arabic.
- If the current question contains both languages, answer in the language that is most dominant.
- Do NOT mix Arabic and English unless the student explicitly asks for both.
- If the question is English and any course name appears in Arabic in the context, translate it to English in your answer.
- Use English course names for English questions even if Arabic names are shown in the prompt.

Current Question Language: ${messageLanguage}

════════════════════════════════════════
UNIVERSITY ACADEMIC REGULATIONS
(This is your ONLY source of truth for all academic policy questions)
════════════════════════════════════════
${REGULATION_TEXT}
════════════════════════════════════════

STUDENT DATA:
Name: ${name}
Department: ${department}
Level: ${level}
GPA: ${gpa}
Warnings: ${warnings}
Under Monitoring: ${isMonitored}

Completed Courses: ${completedCourses.join(", ") || "None"}
Failed Courses:    ${failedCourses.join(", ")    || "None"}
Current Registration (uploaded): ${registeredCourses.join(", ") || "Not uploaded yet"}
Available Courses This Semester: ${currentCourses.join(", ")    || "None"}
${courseBlock}

RULES:
- For ALL academic policy questions (level progression, hours, warnings, GPA rules, etc.) use ONLY the regulations above.
- For course-specific questions (prerequisites, eligibility), use COURSE DETAILS if present, otherwise use the regulations.
- Never say you don't have access to university rules — you have the full regulation text above.
- If GPA < 2.0, mention risk briefly in one sentence.
- If warnings exist, mention only if relevant.
- If a course was not found in the database, say so clearly.
- Remember and use the context from the entire conversation history provided.
${message ? `\nQUESTION:\n${message}` : ""}
`
}

// ─────────────────────────────────────────────
// 2. Transcript Extraction Prompt (text-based fallback)
// ─────────────────────────────────────────────
export const buildTranscriptPrompt = (text) => {
  return `
You are analyzing a university transcript.

Return ONLY valid JSON:

{
  "cgpa": number,
  "completedCourses": [{ "name": "", "grade": "" }],
  "failedCourses": [{ "name": "", "grade": "" }]
}

Rules:
- Preserve Arabic course names exactly as written.
- Courses with passing grades go in completedCourses.
- Courses with failing grades (F, absent, deprived) go in failedCourses.
- Return JSON only — no markdown, no explanation.

Transcript:
${text}
`
}

// ─────────────────────────────────────────────
// 3. Registration Extraction Prompt (text-based fallback)
// ─────────────────────────────────────────────
export const buildRegistrationExtractionPrompt = (text) => {
  return `
You are analyzing a university course registration form.

Return ONLY valid JSON:

{
  "registeredCourses": ["Course Name 1", "Course Name 2"]
}

Rules:
- Extract ONLY the names of registered courses.
- Ignore student name, ID, GPA, semester, department, credit hours.
- Preserve Arabic exactly as written.
- Return JSON only — no markdown, no explanation.

Registration Form Text:
${text}
`
}