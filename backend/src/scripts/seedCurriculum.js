import mongoose from "mongoose"
import dotenv from "dotenv"
import Curriculum from "../models/Curriculum.js"
import curriculumData from "../data/curriculumData.js"

dotenv.config()

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Connected to MongoDB")

        // Clear existing curriculum
        await Curriculum.deleteMany({})
        console.log("🗑️  Cleared existing curriculum data")

        // Insert fresh data
        await Curriculum.insertMany(curriculumData)
        console.log(`🌱 Seeded ${curriculumData.length} curriculum entries`)

        mongoose.connection.close()
        console.log("✅ Done — connection closed")

    } catch (err) {
        console.error("❌ Seed failed:", err)
        process.exit(1)
    }
}

seed()
