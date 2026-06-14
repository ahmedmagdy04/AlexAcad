import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"

dotenv.config()

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is working 🚀")
})

app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/documents", documentRoutes)

export default app