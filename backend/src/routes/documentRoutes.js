import express from "express"
import upload from "../middleware/uploadMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import { analyzeTranscriptPDF } from "../services/aiService.js"


const router = express.Router()

router.post(
  "/certificate",
  authMiddleware,
  upload.single("certificate"),
  async (req, res) => {
    try {
      const analysis = await analyzeTranscriptPDF(
        req.file.path
      )

      let parsed

      try {
        parsed = JSON.parse(
          analysis.replace(/```json/g, "").replace(/```/g, "")
        )
      } catch (error) {
        return res.status(500).json({
          message: "AI returned invalid JSON",
          raw: analysis
        })
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          cumulativeGPA: parsed.cgpa,

          completedCourses: parsed.completedCourses.map(course =>
            typeof course === "string" ? course : course.name
          ),

          failedCourses: parsed.failedCourses.map(course =>
            typeof course === "string" ? course : course.name
          ),

          transcriptData: {
            cgpa: parsed.cgpa,
            completedCourses: parsed.completedCourses,
            failedCourses: parsed.failedCourses,
            extractedAt: new Date()
          }
        },
        { new: true }
      )

      console.log("===== SAVED USER =====")
      console.log(updatedUser.completedCourses)
      console.log(updatedUser.transcriptData)

      res.json({
        success: true,
        transcriptData: parsed
      })

    } catch (error) {
      console.error(error)

      res.status(500).json({
        message: error.message
      })
    }
  }
)

export default router