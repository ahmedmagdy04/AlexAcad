/**
 * courseFinder.js
 *
 * The single entry-point for resolving any surface form of a course name
 * (Arabic, English, alias, abbreviation) to the canonical Course document.
 *
 * Used by:
 *  - courseEligibilityChecker
 *  - registrationService (validation)
 *  - chatController (fast-path course check)
 *  - future recommendation engine
 */

import Course from "../models/Course.js"
import { normalizeName } from "./courseNormalizer.js"

/**
 * Find a Course document by any known surface form.
 *
 * The lookup goes through the pre-computed `aliases` array stored on each
 * Course document (all aliases are stored normalised at seed time).
 *
 * @param {string} rawName  - any name as typed / extracted from a PDF
 * @returns {Promise<import("../models/Course.js").default | null>}
 */
export const findCourse = async (rawName) => {
  if (!rawName || typeof rawName !== "string") return null

  const normalized = normalizeName(rawName)
  if (!normalized) return null

  // Primary: match against the pre-normalised aliases array
  const course = await Course.findOne({ aliases: normalized })
  if (course) return course

  // Fallback: in-memory normalization of arabicName / englishName
  // (catches records added without going through the seed script)
  const all = await Course.find({})
  for (const c of all) {
    if (
      normalizeName(c.arabicName) === normalized ||
      normalizeName(c.englishName) === normalized
    ) {
      return c
    }
  }

  return null
}

/**
 * Resolve a course name to its code.
 *
 * @param {string} rawName
 * @returns {Promise<string | null>}  course code or null if not found
 */
export const resolveCourseCode = async (rawName) => {
  const course = await findCourse(rawName)
  return course ? course.code : null
}

/**
 * Get all courses for a specific department / level / semester.
 * Returns Course documents (not plain strings).
 *
 * @param {string} department
 * @param {number} level
 * @param {string} semester  "Fall" | "Spring" | "Both"
 * @returns {Promise<Array>}
 */
export const getCoursesByContext = async (department, level, semester) => {
  const query = { department, level }
  if (semester) {
    query.$or = [{ semester }, { semester: "Both" }]
  }
  return Course.find(query).lean()
}

/**
 * Given an array of course codes, return the Course documents.
 * Missing codes are silently ignored.
 *
 * @param {string[]} codes
 * @returns {Promise<Array>}
 */
export const getCoursesByCodes = async (codes) => {
  if (!codes || codes.length === 0) return []
  return Course.find({ code: { $in: codes } }).lean()
}
