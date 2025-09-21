const userModel = require('../models/userModel');
const CurrencyService = require('../services/currencyService');

// Get user preferences
async function getUserPreferences(req, res) {
    try {
        const userId = req.userId;
        
        const user = await userModel.findById(userId, 'preferences');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Set default preferences if they don't exist
        const preferences = user.preferences || {
            currency: 'NGN',
            language: 'en',
            timezone: 'Africa/Lagos'
        };

        res.json({
            message: "User preferences retrieved successfully",
            error: false,
            success: true,
            data: preferences
        });

    } catch (err) {
        console.error('Error in getUserPreferences:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

// Update user preferences
async function updateUserPreferences(req, res) {
    try {
        const userId = req.userId;
        const { currency, language, timezone } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Initialize preferences if they don't exist
        if (!user.preferences) {
            user.preferences = {
                currency: 'NGN',
                language: 'en',
                timezone: 'Africa/Lagos'
            };
        }

        // Update preferences
        if (currency && CurrencyService.isCurrencySupported(currency)) {
            user.preferences.currency = currency;
        } else if (currency) {
            return res.status(400).json({
                message: `Unsupported currency: ${currency}`,
                error: true,
                success: false
            });
        }

        if (language) {
            user.preferences.language = language;
        }

        if (timezone) {
            user.preferences.timezone = timezone;
        }

        await user.save();

        res.json({
            message: "User preferences updated successfully",
            error: false,
            success: true,
            data: user.preferences
        });

    } catch (err) {
        console.error('Error in updateUserPreferences:', err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = {
    getUserPreferences,
    updateUserPreferences
};
