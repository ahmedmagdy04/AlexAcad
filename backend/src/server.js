import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import authRoutes from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"

dotenv.config()
console.log("MONGO_URI:", process.env.MONGO_URI)
const app = express()

// =====================
// MIDDLEWARE
// =====================
app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json())
app.get("/", (req, res) => {
    res.send("🚀 AlexAcad Backend is Running")
})

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/profile", profileRoutes)

// =====================
// MONGO CONNECTION
// =====================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ MongoDB Connected")
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message)
        process.exit(1)
    }
}

// =====================
// START SERVER ONLY AFTER DB CONNECTS
// =====================
const startServer = async () => {
    await connectDB()

    const PORT = process.env.PORT || 8000

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`)
    })
}

startServer()