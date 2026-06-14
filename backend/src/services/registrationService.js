/**
 * registrationService.js
 *
 * Handles the full lifecycle of a semester registration upload:
 *  1. Extract course names from PDF via AI
 *  2. Resolve each name to a Course document (Arabic / English / alias)
 *  3. Save canonical Arabic names (and optionally codes) to the user
 *  4. Validate each course against the student's academic standing
 */

import fs from "fs"
import { findCourse } from "./courseFinder.js"
import { canTakeCourse } from "./courseEligibilityChecker.js"
import User from "../models/User.js"
import { analyzeRegistrationPDF } from "./aiService.js"

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

/**
 * Strip markdown fences and parse the AI JSON response.
 */
const parseRegistrationJson = (raw) => {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim()

  const parsed = JSON.parse(cleaned)

  if (!parsed.registeredCourses || !Array.isArray(parsed.registeredCourses)) {
    throw new Error("AI response is missing 'registeredCourses' array")
  }

  return parsed
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * Extract course names from a registration PDF using AI.
 * Cleans up the uploaded file regardless of success/failure.
 *
 * @param {string} filePath
 * @returns {Promise<{ registeredCourses: string[] }>}
 */
export const extractRegistrationFromPdf = async (filePath) => {
  try {
    const raw = await analyzeRegistrationPDF(filePath)
    return parseRegistrationJson(raw)
  } catch (err) {
    throw new Error("Failed to analyze registration PDF: " + err.message)
  } finally {
    try { fs.unlinkSync(filePath) } catch (_) {}
  }
}

/**
 * Resolve raw course names (any language) to Course documents.
 * Returns an array of { rawName, course | null } pairs.
 *
 * @param {string[]} rawNames
 * @returns {Promise<Array<{ rawName: string, course: object|null }>>}
 */
export const resolveCourseNames = async (rawNames) => {
  return Promise.all(
    rawNames.map(async (rawName) => ({
      rawName,
      course: await findCourse(rawName)
    }))
  )
}

/**
 * Persist the registered courses on the user document.
 * Stores the canonical Arabic name when a Course record is found,
 * otherwise falls back to the raw extracted name so nothing is lost.
 *
 * @param {string}   userId
 * @param {Array}    resolved  - output of resolveCourseNames()
 * @returns {Promise<User>}
 */
export const saveRegistrationToUser = async (userId, resolved) => {
  const registeredCourses = resolved.map(({ rawName, course }) =>
    course ? course.arabicName : rawName
  )

  const updated = await User.findByIdAndUpdate(
    userId,
    { registeredCourses },
    { new: true }
  )

  if (!updated) {
    throw new Error("User not found when saving registration")
  }

  return updated
}

/**
 * Validate each resolved course against the student's academic standing.
 *
 * @param {object}  user
 * @param {Array}   resolved  - output of resolveCourseNames()
 * @returns {Promise<Array<{ course, code, arabicName, englishName, allowed, reason }>>}
 */
export const validateRegistration = async (user, resolved) => {
  const results = []

  for (const { rawName, course } of resolved) {
    if (!course) {
      results.push({
        course: rawName,
        code: null,
        arabicName: rawName,
        englishName: null,
        allowed: false,
        reason: `"${rawName}" was not found in the course catalog.`
      })
      continue
    }

    const eligibility = await canTakeCourse(user, course.arabicName)

    results.push({
      course: course.arabicName,       // user-facing display name
      code: course.code,
      arabicName: course.arabicName,
      englishName: course.englishName,
      allowed: eligibility.allowed,
      reason: eligibility.reason
    })
  }

  return results
}
