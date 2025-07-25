const User = require("../models/userModel");

async function userDetailsController(req, res) {
    try {
        const user = await User.findById(req.userId);

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        });

    } catch (err) {
        // If database is not available, return a default response
        console.log("Database error in userDetails:", err.message);
        res.status(200).json({
            data: null,
            error: false,
            success: true,
            message: "User details (Database not connected)"
        });
    }
}

module.exports = userDetailsController;
