const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

// Reset admin password for development/testing purposes
async function resetAdminPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        
        // Default values for development
        const adminEmail = email || "alpho4luv@gmail.com";
        const password = newPassword || "admin123";
        
        // Find the admin user
        const adminUser = await userModel.findOne({ 
            email: adminEmail,
            role: 'ADMIN' 
        });
        
        if (!adminUser) {
            return res.status(404).json({
                message: "Admin user not found",
                error: true,
                success: false
            });
        }

        // Hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        // Update password
        await userModel.findByIdAndUpdate(adminUser._id, {
            password: hashPassword
        });

        res.json({
            message: `Admin password reset successfully! Email: ${adminEmail}, Password: ${password}`,
            data: {
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
            },
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error resetting admin password:", error);
        res.status(500).json({
            message: error.message || "Failed to reset admin password",
            error: true,
            success: false
        });
    }
}

module.exports = resetAdminPassword;
