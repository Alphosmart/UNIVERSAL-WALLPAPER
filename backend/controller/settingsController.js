const userModel = require('../models/userModel');
const settingsModel = require('../models/settingsModel');

// Get admin settings
async function getAdminSettings(req, res) {
    try {
        // Check if user is admin
        const sessionUser = await userModel.findById(req.userId);
        
        if (sessionUser?.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied",
                error: true,
                success: false
            });
        }

        // Get settings from database
        const settings = await settingsModel.getSettings();

        res.json({
            message: "Settings retrieved successfully",
            error: false,
            success: true,
            data: settings
        });

    } catch (err) {
        console.error('Error in getAdminSettings:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update admin settings
async function updateAdminSettings(req, res) {
    try {
        // Check if user is admin
        const sessionUser = await userModel.findById(req.userId);
        
        if (sessionUser?.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied",
                error: true,
                success: false
            });
        }

        const settings = req.body;

        // Validate settings structure
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({
                message: "Invalid settings data",
                error: true,
                success: false
            });
        }

        // Validate specific settings
        if (settings.security) {
            if (settings.security.sessionTimeout && (settings.security.sessionTimeout < 5 || settings.security.sessionTimeout > 480)) {
                return res.status(400).json({
                    message: "Session timeout must be between 5 and 480 minutes",
                    error: true,
                    success: false
                });
            }

            if (settings.security.maxLoginAttempts && (settings.security.maxLoginAttempts < 3 || settings.security.maxLoginAttempts > 10)) {
                return res.status(400).json({
                    message: "Max login attempts must be between 3 and 10",
                    error: true,
                    success: false
                });
            }

            if (settings.security.passwordMinLength && (settings.security.passwordMinLength < 6 || settings.security.passwordMinLength > 20)) {
                return res.status(400).json({
                    message: "Password minimum length must be between 6 and 20 characters",
                    error: true,
                    success: false
                });
            }
        }

        if (settings.payment) {
            if (settings.payment.commissionRate && (settings.payment.commissionRate < 0 || settings.payment.commissionRate > 20)) {
                return res.status(400).json({
                    message: "Commission rate must be between 0 and 20 percent",
                    error: true,
                    success: false
                });
            }

            if (settings.payment.minimumPayout && (settings.payment.minimumPayout < 10 || settings.payment.minimumPayout > 100)) {
                return res.status(400).json({
                    message: "Minimum payout must be between $10 and $100",
                    error: true,
                    success: false
                });
            }
        }

        // Update settings in database
        const updatedSettings = await settingsModel.updateSettings(settings);

        res.json({
            message: "Settings updated successfully",
            error: false,
            success: true,
            data: updatedSettings
        });

    } catch (err) {
        console.error('Error in updateAdminSettings:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getAdminSettings,
    updateAdminSettings
};
