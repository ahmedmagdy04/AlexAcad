import mongoose from "mongoose"

// models/User.js
const userSchema = new mongoose.Schema({
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },

    completedCourses: {
        type: [String],
        default: []
    },

    // Academic Info
    department: {
        type: String,
        required: true,
        enum: ['Accounting', 'Customs', 'Business Administration', 'Management Information Systems', 'Statistics']
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },

    // Academic Standing
    cumulativeGPA: { type: Number, default: null },
    warnings: { type: Number, default: 0 },
    isUnderMonitoring: { type: Boolean, default: false },

    // Registered Courses (current semester registration)
    registeredCourses: {
        type: [String],
        default: []
    },

    // Course Exceptions
    failedCourses: [{ type: String }],
    blockedCourses: [{ type: String }],
    extraCourses: [{ type: String }],
    transcriptData: {
        cgpa: Number,

        completedCourses: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },

        failedCourses: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },

        extractedAt: Date

    }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    if (this.cumulativeGPA !== null) {
        this.isUnderMonitoring = this.cumulativeGPA < 2.0
    }
})


export default mongoose.model("User", userSchema)