const User = require("../models/userModel");
const mongoose = require("mongoose");

async function userDetailsController(req, res) {
    try {
        // Check if the userId is a mock ID (starts with "mock_user_")
        if (req.userId && req.userId.toString().startsWith("mock_user_")) {
            return res.status(200).json({
                data: {
                    _id: req.userId,
                    email: "mock@user.com",
                    name: "Mock User",
                    role: "GENERAL"
                },
                error: false,
                success: true,
                message: "User details (Mock user - Database not connected when token was created)"
            });
        }

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database not connected");
        }

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
            throw new Error("Invalid user ID format");
        }

        const user = await User.findById(req.userId);

        if (!user) {
            throw new Error("User not found");
        }

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        });

    } catch (err) {
        console.log("Database error in userDetails:", err.message);
        res.status(400).json({
            data: null,
            error: true,
            success: false,
            message: "Error fetching user details: " + err.message
        });
    }
}

module.exports = userDetailsController;
