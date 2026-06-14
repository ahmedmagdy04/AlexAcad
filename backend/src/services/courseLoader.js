/**
 * courseLoader.js
 *
 * Loads the set of courses a student can register for this semester.
 * Uses the Course catalog (bilingual, code-based) instead of Curriculum strings.
 *
 * Returns Course documents (with arabicName, englishName, code, prerequisites)
 * so callers have full information.
 */

import Course from "../models/Course.js"
import { CURRENT_SEMESTER } from "../config/semester.js"

// User.department → Course.department mapping
const DEPT_MAP = {
  "Management Information Systems": "MIS",
  "Accounting":                      "Accounting",
  "Business Administration":         "Business Administration",
  "Customs":                         "Customs",
  "Statistics":                      "Statistics"
}

/**
 * Load all courses a student should be able to see/register.
 *
 * @param {object} user - Mongoose User document
 * @returns {Promise<{ semester: string, currentCourses: object[] }>}
 *   currentCourses is an array of Course documents (lean)
 */
export const loadStudentCourses = async (user) => {
  try {
    if (!user) throw new Error("User not found")

    // Levels 1–2 are General; Levels 3–4 are department-specific
    const department =
      Number(user.level) <= 2
        ? "General"
        : DEPT_MAP[user.department] ?? user.department

    // Fetch courses for the current semester AND "Both"
    const courses = await Course.find({
      department,
      level: Number(user.level),
      $or: [
        { semester: CURRENT_SEMESTER },
        { semester: "Both" }
      ]
    }).lean()

    // Apply extra / blocked course overrides
    const extraNames   = user.extraCourses   || []
    const blockedNames = user.blockedCourses  || []
    const failedNames  = user.failedCourses   || []

    // Build working set from catalog results
    const courseMap = new Map(courses.map(c => [c.code, c]))

    // Add failed courses so they appear as retake opportunities
    for (const name of failedNames) {
      const failed = await Course.findOne({
        $or: [{ arabicName: name }, { englishName: name }, { aliases: name }]
      }).lean()
      if (failed && !courseMap.has(failed.code)) {
        courseMap.set(failed.code, { ...failed, _retake: true })
      }
    }

    // Add explicitly extra courses
    for (const name of extraNames) {
      const extra = await Course.findOne({
        $or: [{ arabicName: name }, { englishName: name }, { aliases: name }]
      }).lean()
      if (extra && !courseMap.has(extra.code)) {
        courseMap.set(extra.code, extra)
      }
    }

    // Remove blocked courses
    for (const name of blockedNames) {
      const blocked = await Course.findOne({
        $or: [{ arabicName: name }, { englishName: name }, { aliases: name }]
      }).lean()
      if (blocked) courseMap.delete(blocked.code)
    }

    return {
      semester: CURRENT_SEMESTER,
      currentCourses: Array.from(courseMap.values())
    }

  } catch (error) {
    console.error("Course Loader Error:", error)
    return { semester: CURRENT_SEMESTER, currentCourses: [] }
  }
}