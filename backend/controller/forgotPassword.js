const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store password reset tokens temporarily (in production, use Redis or database)
const passwordResetTokens = new Map();

// Configure email transporter (you'll need to update with your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Please provide email");
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Store token temporarily (in production, save to database)
        passwordResetTokens.set(email, {
            token: resetToken,
            expiry: resetTokenExpiry
        });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Request - AshAmSmart',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your AshAmSmart account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <p>This link will expire in 1 hour for security reasons.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from AshAmSmart. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        // Send email (for demo purposes, we'll just log it)
        // In production, uncomment the line below:
        // await transporter.sendMail(mailOptions);
        
        console.log('Password reset email would be sent to:', email);
        console.log('Reset URL:', resetUrl);

        res.json({
            data: {
                message: "Password reset email sent successfully",
                // For demo purposes, include the reset URL in response
                resetUrl: resetUrl
            },
            success: true,
            error: false,
            message: "Password reset email sent successfully"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

async function verifyResetTokenController(req, res) {
    try {
        const { token, email } = req.query;

        if (!token || !email) {
            throw new Error("Token and email are required");
        }

        // Check if token exists and is valid
        const storedTokenData = passwordResetTokens.get(email);
        
        if (!storedTokenData) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
                error: true,
                success: false
            });
        }

        if (storedTokenData.token !== token) {
            return res.status(400).json({
                message: "Invalid reset token",
                error: true,
                success: false
            });
        }

        if (Date.now() > storedTokenData.expiry) {
            passwordResetTokens.delete(email);
            return res.status(400).json({
                message: "Reset token has expired",
                error: true,
                success: false
            });
        }

        res.json({
            data: {
                valid: true,
                email: email
            },
            success: true,
            error: false,
            message: "Token is valid"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

async function resetPasswordController(req, res) {
    try {
        const { token, email, newPassword } = req.body;

        if (!token || !email || !newPassword) {
            throw new Error("Token, email, and new password are required");
        }

        if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        // Verify token
        const storedTokenData = passwordResetTokens.get(email);
        
        if (!storedTokenData || storedTokenData.token !== token || Date.now() > storedTokenData.expiry) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
                error: true,
                success: false
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        // Update user password
        await userModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        });

        // Remove the used token
        passwordResetTokens.delete(email);

        res.json({
            data: {
                message: "Password reset successfully"
            },
            success: true,
            error: false,
            message: "Password reset successfully"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = {
    forgotPasswordController,
    verifyResetTokenController,
    resetPasswordController
};
