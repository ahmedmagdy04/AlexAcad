/**
 * courseEligibilityChecker.js
 *
 * Determines whether a student is allowed to register a given course.
 * Works entirely with Course codes internally; accepts any surface form
 * (Arabic, English, alias) from the caller.
 */

import { findCourse, getCoursesByCodes } from "./courseFinder.js"

/**
 * Check whether a user can take a course identified by any name.
 *
 * @param {object}  user       - Mongoose User document
 * @param {string}  rawName    - course name in any language / form
 * @returns {Promise<{ allowed: boolean, reason: string, course?: object }>}
 */
export const canTakeCourse = async (user, rawName) => {
  if (!user || !rawName) {
    return { allowed: false, reason: "Missing user or course name" }
  }

  // ── 1. Resolve name → Course document ──────────────────────────────
  const course = await findCourse(rawName)

  if (!course) {
    return {
      allowed: false,
      reason: `Course "${rawName}" was not found in the catalog.`
    }
  }

  // ── 2. GPA restriction ──────────────────────────────────────────────
  if (user.cumulativeGPA !== null && user.cumulativeGPA < 2.0) {
    return {
      allowed: false,
      reason: `GPA is ${user.cumulativeGPA} (below 2.0). Only retakes and improvement courses are allowed.`,
      course
    }
  }

  // ── 3. Warning restriction ──────────────────────────────────────────
  if (user.warnings >= 2) {
    return {
      allowed: false,
      reason: `You have ${user.warnings} academic warnings. Registration is restricted.`,
      course
    }
  }

  // ── 4. Already passed? ──────────────────────────────────────────────
  // completedCourses stores Arabic names from transcripts.
  // We resolve each to a code for a reliable comparison.
  const completedNames = user.completedCourses || []
  const completedCodesResolved = await Promise.all(
    completedNames.map(async (name) => {
      const c = await findCourse(name)
      return c ? c.code : null
    })
  )
  const completedCodes = new Set(completedCodesResolved.filter(Boolean))

  const alreadyPassed = completedCodes.has(course.code)
  const failedNames = user.failedCourses || []
  const failedCodesResolved = await Promise.all(
    failedNames.map(async (name) => {
      const c = await findCourse(name)
      return c ? c.code : null
    })
  )
  const failedCodes = new Set(failedCodesResolved.filter(Boolean))

  if (alreadyPassed && !failedCodes.has(course.code)) {
    return {
      allowed: false,
      reason: `You have already passed "${course.arabicName}" (${course.englishName}).`,
      course
    }
  }

  if (failedCodes.has(course.code)) {
    return {
      allowed: true,
      reason: `Retake allowed — you previously failed "${course.arabicName}" (${course.englishName}).`,
      course
    }
  }

  // ── 5. Prerequisites check ──────────────────────────────────────────
  const prereqCodes = course.prerequisites || []

  if (prereqCodes.length > 0) {
    const missingPrereqs = []

    for (const prereqCode of prereqCodes) {
      if (!completedCodes.has(prereqCode)) {
        // Look up the prereq for a user-friendly name
        const prereqDocs = await getCoursesByCodes([prereqCode])
        const prereqName = prereqDocs[0]
          ? `${prereqDocs[0].arabicName} (${prereqDocs[0].englishName})`
          : prereqCode

        missingPrereqs.push(prereqName)
      }
    }

    if (missingPrereqs.length > 0) {
      return {
        allowed: false,
        reason: `Missing prerequisites: ${missingPrereqs.join(", ")}`,
        course
      }
    }
  }

  // ── 6. All checks passed ────────────────────────────────────────────
  return {
    allowed: true,
    reason: `Meets all academic requirements for "${course.arabicName}" (${course.englishName}).`,
    course
  }
}