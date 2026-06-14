import mongoose from "mongoose"

const curriculumSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        enum: [
            "General",
            "Accounting",
            "Customs",
            "Business Administration",
            "MIS",
            "Statistics"
        ]
    },
    level: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4]
    },
    semester: {
        type: String,
        required: true,
        enum: ["Fall", "Spring"]
    },
    subjects: {
        type: [String],
        required: true
    }
}, { timestamps: true })

// Prevent duplicate entries for same dept + level + semester
curriculumSchema.index(
    { department: 1, level: 1, semester: 1 },
    { unique: true }
)

export default mongoose.model("Curriculum", curriculumSchema)
