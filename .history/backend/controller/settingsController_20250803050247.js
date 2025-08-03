const userModel = require('../models/userModel');

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

        // Default settings structure
        const defaultSettings = {
            general: {
                siteName: 'E-Commerce Platform',
                siteDescription: 'Your trusted online marketplace',
                maintenanceMode: false,
                allowRegistration: true,
                defaultLanguage: 'en',
                timezone: 'UTC',
                currency: 'USD'
            },
            notifications: {
                emailNotifications: true,
                orderNotifications: true,
                stockAlerts: true,
                userRegistration: true,
                sellerApplications: true,
                systemAlerts: true
            },
            security: {
                requireEmailVerification: true,
                twoFactorAuth: false,
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                passwordMinLength: 6,
                requireStrongPassword: true
            },
            payment: {
                enablePayPal: true,
                enableStripe: true,
                commissionRate: 3.0,
                minimumPayout: 25.0,
                payoutSchedule: 'weekly'
            }
        };

        // In a real application, you would retrieve these from a settings collection
        // For now, return the default settings
        res.json({
            message: "Settings retrieved successfully",
            error: false,
            success: true,
            data: defaultSettings
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

        // In a real application, you would save these to a settings collection
        // For now, just return success
        console.log('Settings updated:', settings);

        res.json({
            message: "Settings updated successfully",
            error: false,
            success: true,
            data: settings
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
