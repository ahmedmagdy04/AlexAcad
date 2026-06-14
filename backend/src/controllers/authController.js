import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      birthdate,
      department,
      level,
      cumulativeGPA,
      warnings,
      failedCourses,
      blockedCourses,
      extraCourses
    } = req.body

    // 1. Check existing user
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Clean GPA (IMPORTANT FIX)
    const gpaValue =
      cumulativeGPA === "" || cumulativeGPA === undefined
        ? null
        : Number(cumulativeGPA)

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      birthdate,
      department,
      level,
      cumulativeGPA: isNaN(gpaValue) ? null : gpaValue,
      warnings: warnings || 0,
      failedCourses: failedCourses || [],
      blockedCourses: blockedCourses || [],
      extraCourses: extraCourses || []
    })

    // 5. Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 6. Remove password before sending response
    const { password: _, ...safeUser } = user.toObject()

    return res.status(201).json({
      token,
      user: safeUser
    })

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error)

    return res.status(500).json({
      message: error.message
    })
  }
}


// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const { password: _, ...safeUser } = user.toObject()

    return res.json({
      message: "Login successful",
      token,
      user: safeUser
    })

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error)
    return res.status(500).json({
      message: error.message
    })
  }
}