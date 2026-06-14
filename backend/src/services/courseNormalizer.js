/**
 * courseNormalizer.js
 *
 * Centralised text normalisation for course name matching.
 * All names stored in Course.aliases and all incoming names from PDFs / chat
 * go through this normaliser before comparison, so matching is always
 * language-agnostic, case-insensitive, and robust to common OCR/typing variants.
 */

// ─────────────────────────────────────────────
// Arabic character normalization map
// ─────────────────────────────────────────────
const ARABIC_REPLACEMENTS = [
  // Alef variants → bare alef
  [/[أإآٱ]/g, "ا"],
  // Taa marbuta → haa
  [/ة/g, "ه"],
  // Yaa variants → bare yaa
  [/[ىئ]/g, "ي"],
  // Remove tatweel (kashida stretching)
  [/ـ/g, ""],
  // Remove all diacritics (harakat)
  [/[\u064B-\u065F]/g, ""]
]

// ─────────────────────────────────────────────
// Prefixes to strip (common on Egyptian university forms)
// ─────────────────────────────────────────────
const STRIP_PREFIXES = [
  /^E\s+/i,   // "E نظم دعم القرار" → "نظم دعم القرار"
  /^ال/       // leading "ال" stripped for root matching
]

/**
 * Normalize a course name for comparison.
 *
 * Steps:
 *  1. Trim whitespace
 *  2. Collapse internal whitespace to single spaces
 *  3. Strip known form prefixes
 *  4. Apply Arabic character normalisations
 *  5. Lowercase (handles English names)
 *
 * @param {string} name
 * @returns {string} normalised form
 */
export const normalizeName = (name) => {
  if (!name || typeof name !== "string") return ""

  let n = name.trim()

  // Collapse multiple spaces
  n = n.replace(/\s+/g, " ")

  // Strip form prefixes
  for (const prefix of STRIP_PREFIXES) {
    n = n.replace(prefix, "")
  }
  n = n.trim()

  // Arabic normalisations
  for (const [pattern, replacement] of ARABIC_REPLACEMENTS) {
    n = n.replace(pattern, replacement)
  }

  // Lowercase for English case-insensitivity
  n = n.toLowerCase()

  return n
}

/**
 * Build the full set of normalized aliases for a course document.
 * Called by the seed script and whenever a Course is updated.
 *
 * @param {object} course  plain object with { arabicName, englishName, aliases? }
 * @returns {string[]} deduplicated array of normalised alias strings
 */
export const buildNormalizedAliases = (course) => {
  const raw = [
    course.arabicName,
    course.englishName,
    ...(course.aliases || [])
  ]

  const seen = new Set()
  const result = []

  for (const name of raw) {
    if (!name) continue
    const normalized = normalizeName(name)
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      result.push(normalized)
    }
  }

  return result
}
