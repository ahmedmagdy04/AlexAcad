import User from "../models/User.js"
import Conversation from "../models/Conversation.js"
import {
  extractRegistrationFromPdf,
  resolveCourseNames,
  saveRegistrationToUser,
  validateRegistration
} from "../services/registrationService.js"

// POST /api/chat/upload-registration
export const uploadRegistration = async (req, res) => {
  // 1. Guard: file must be present
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Please attach a PDF registration form."
    })
  }

  // 2. Guard: only accept PDFs
  const isPdf =
    req.file.mimetype === "application/pdf" ||
    req.file.originalname?.toLowerCase().endsWith(".pdf")

  if (!isPdf) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Only PDF files are accepted."
    })
  }

  try {
    // 3. Fetch the authenticated user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
    }

    // 4. Extract raw course names from the PDF via AI
    let extracted
    try {
      extracted = await extractRegistrationFromPdf(req.file.path)
    } catch (err) {
      return res.status(422).json({
        success: false,
        message: err.message
      })
    }

    const { registeredCourses: rawNames } = extracted

    if (!rawNames || rawNames.length === 0) {
      return res.status(422).json({
        success: false,
        message: "No registered courses could be detected in the PDF."
      })
    }

    // 5. Resolve raw names → Course catalog records (bilingual, code-based)
    const resolved = await resolveCourseNames(rawNames)

    // 6. Persist canonical Arabic names on the user document
    const updatedUser = await saveRegistrationToUser(user._id, resolved)

    // 7. Validate each resolved course against the student's academic standing
    const validation = await validateRegistration(updatedUser, resolved)

    // 8. Persist both turns into the active conversation (if provided)
    //    This makes the validation bubble survive page reloads.
    const conversationId = req.body?.conversationId || req.query?.conversationId

    if (conversationId) {
      try {
        const conv = await Conversation.findOne({
          _id: conversationId,
          userId: req.user.id
        })

        if (conv) {
          // User turn: the upload action
          conv.messages.push({
            role: "user",
            content: "📎 Uploaded registration PDF for review."
          })

          // Assistant turn: system message + validation results
          conv.messages.push({
            role: "assistant",
            content: "Registration uploaded successfully. I have analyzed your registered courses.",
            validation
          })

          await conv.save()
        }
      } catch (convErr) {
        // Non-fatal: log but don't fail the upload response
        console.error("Failed to save registration to conversation:", convErr.message)
      }
    }

    // 9. Return the full response
    return res.status(200).json({
      success: true,
      registeredCourses: updatedUser.registeredCourses,
      validation
    })

  } catch (error) {
    console.error("UPLOAD-REGISTRATION ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred: " + error.message
    })
  }
}
