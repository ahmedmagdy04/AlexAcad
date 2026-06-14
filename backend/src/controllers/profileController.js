import User from "../models/User.js"

// @desc    Get current logged-in user's profile
// @route   GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ user })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        })
    }
}

// @desc    Update user's academic profile
// @route   PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const {
            department,
            level,
            cumulativeGPA,
            warnings,
            failedCourses,
            blockedCourses,
            extraCourses
        } = req.body

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (department !== undefined) user.department = department
        if (level !== undefined) user.level = level
        if (cumulativeGPA !== undefined) user.cumulativeGPA = cumulativeGPA
        if (warnings !== undefined) user.warnings = warnings
        if (failedCourses !== undefined) user.failedCourses = failedCourses
        if (blockedCourses !== undefined) user.blockedCourses = blockedCourses
        if (extraCourses !== undefined) user.extraCourses = extraCourses

        const updatedUser = await user.save()

        const { password, ...safeUser } = updatedUser.toObject()

        res.status(200).json({
            message: "Profile updated successfully",
            user: safeUser
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        })
    }
}