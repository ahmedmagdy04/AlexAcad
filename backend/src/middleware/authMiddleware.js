import jwt from "jsonwebtoken"
import User from "../models/User.js"

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" })
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" })
        }

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" })
        }

        req.user = { id: user._id }
        next()
    } catch (error) {
        console.error("Authentication error:", error)
        return res.status(401).json({ message: "Unauthorized: Invalid token" })
    }
}

export const protect = authMiddleware
export default authMiddleware   