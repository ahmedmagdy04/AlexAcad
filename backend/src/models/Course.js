import mongoose from "mongoose"

/**
 * Course — the single source of truth for every academic course in the system.
 *
 * Identity:  code  (unique, e.g. "MIS401")
 * Names:     arabicName + englishName
 * Discovery: aliases[]  — any alternate name, abbreviation, or typo variant
 * Structure: department, level, semester, credits
 * Rules:     prerequisites[] — array of course codes that must be completed first
 */
const courseSchema = new mongoose.Schema(
  {
    // Primary key used everywhere internally
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    // Official Arabic name exactly as it appears on university documents
    arabicName: {
      type: String,
      required: true,
      trim: true
    },

    // Official English name
    englishName: {
      type: String,
      required: true,
      trim: true
    },

    /**
     * All known surface forms:
     * – official Arabic name
     * – official English name
     * – abbreviations (DSS, MIS, …)
     * – common misspellings / prefix variants (e.g. "E نظم دعم القرار")
     * These are stored normalized (see courseNormalizer) to enable fast matching.
     */
    aliases: {
      type: [String],
      default: []
    },

    // Array of course CODES that must be passed before this course
    prerequisites: {
      type: [String],
      default: []
    },

    // Owning department; "General" for Level 1–2 shared courses
    department: {
      type: String,
      required: true,
      enum: [
        "General",
        "Accounting",
        "Customs",
        "Business Administration",
        "MIS",
        "Statistics",
        "Marketing",
        "Finance",
        "Human Resources"
      ]
    },

    // Academic level (1–4)
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },

    // Which semester this course is normally offered
    semester: {
      type: String,
      required: true,
      enum: ["Fall", "Spring", "Both"]
    },

    // Credit hours (default 3, can override per course)
    credits: {
      type: Number,
      default: 3
    }
  },
  { timestamps: true }
)

// Fast lookup by department / level / semester (for curriculum listing)
courseSchema.index({ department: 1, level: 1, semester: 1 })

export default mongoose.model("Course", courseSchema)
