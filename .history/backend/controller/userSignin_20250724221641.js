const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw new Error("Please provide email");
        }
        if (!password) {
            throw new Error("Please provide password");
        }

        try {
            // Try to find user in database
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("User not found");
            }

            const checkPassword = await bcrypt.compare(password, user.password);

            if (checkPassword) {
                const tokenData = {
                    _id: user._id,
                    email: user.email,
                };
                
                const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

                const tokenOption = {
                    httpOnly: true,
                    secure: true
                };

                res.cookie("token", token, tokenOption).status(200).json({
                    message: "Login successful",
                    data: token,
                    success: true,
                    error: false
                });

            } else {
                throw new Error("Please check password");
            }

        } catch (dbError) {
            // Re-throw the error to be handled by the outer catch block
            throw dbError;
        }

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;