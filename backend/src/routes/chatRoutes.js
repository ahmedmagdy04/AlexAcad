import express from "express"
import {
  sendMessage,
  getCourses,
  createConversation,
  listConversations,
  getConversation,
  deleteConversation,
  renameConversation
} from "../controllers/chatController.js"
import { uploadRegistration } from "../controllers/registrationController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

// ── Utility ──────────────────────────────────────────
router.get("/courses", authMiddleware, getCourses)

// ── Registration upload ───────────────────────────────
router.post(
  "/upload-registration",
  authMiddleware,
  upload.single("registration"),
  uploadRegistration
)

// ── Conversation CRUD ─────────────────────────────────
router.post("/conversation",            authMiddleware, createConversation)
router.get("/conversations",            authMiddleware, listConversations)
router.get("/conversation/:id",         authMiddleware, getConversation)
router.put("/conversation/:id",         authMiddleware, renameConversation)
router.delete("/conversation/:id",      authMiddleware, deleteConversation)

// ── Messaging ─────────────────────────────────────────
router.post("/send/:conversationId",    authMiddleware, sendMessage)

export default router