/**
 * seedCourses.js
 *
 * Populates (or refreshes) the Course collection from courseData.js.
 *
 * Safe to run multiple times — uses upsert on code so existing data is
 * updated rather than duplicated.
 *
 * Run:
 *   node src/scripts/seedCourses.js
 */

import mongoose from "mongoose"
import dotenv from "dotenv"
import Course from "../models/Course.js"
import courseData from "../data/courseData.js"
import { buildNormalizedAliases } from "../services/courseNormalizer.js"

dotenv.config()

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB")

    let inserted = 0
    let updated = 0

    for (const rawCourse of courseData) {
      // Build the full normalized alias set
      const normalizedAliases = buildNormalizedAliases(rawCourse)

      const result = await Course.findOneAndUpdate(
        { code: rawCourse.code.toUpperCase() },
        {
          $set: {
            ...rawCourse,
            code: rawCourse.code.toUpperCase(),
            aliases: normalizedAliases
          }
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )

      if (result.createdAt === result.updatedAt) {
        inserted++
      } else {
        updated++
      }
    }

    console.log(`🌱 Seed complete: ${inserted} inserted, ${updated} updated`)
    console.log(`📚 Total courses in catalog: ${courseData.length}`)

    // Verify a key course
    const dss = await Course.findOne({ code: "MIS402" })
    if (dss) {
      console.log("\n🔍 Verification — MIS402 (Decision Support Systems):")
      console.log(`   Arabic:  ${dss.arabicName}`)
      console.log(`   English: ${dss.englishName}`)
      console.log(`   Aliases: ${dss.aliases.join(" | ")}`)
      console.log(`   Prereqs: ${dss.prerequisites.join(", ") || "None"}`)
    }

    await mongoose.connection.close()
    console.log("\n✅ Done — connection closed")

  } catch (err) {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  }
}

seed()
