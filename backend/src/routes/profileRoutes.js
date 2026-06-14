import express from "express"
import { getProfile, updateProfile } from "../controllers/profileController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// Both routes require the user to be logged in
router.get("/", authMiddleware, getProfile)
router.put("/", authMiddleware, updateProfile)

export default router