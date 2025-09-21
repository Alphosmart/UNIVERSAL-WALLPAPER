const settingsModel = require('../models/settingsModel');
const logger = require('../utils/logger');

/**
 * Get maintenance mode status (public endpoint)
 */
async function getMaintenanceStatus(req, res) {
    try {
        // Get maintenance mode setting from database
        const maintenanceSettings = await settingsModel.findOne({ systemId: 'main_settings' });
        
        const isMaintenanceMode = maintenanceSettings?.general?.maintenanceMode || false;
        
        res.json({
            message: "Maintenance status retrieved successfully",
            data: {
                maintenanceMode: isMaintenanceMode,
                timestamp: new Date().toISOString()
            },
            success: true,
            error: false
        });

    } catch (error) {
        logger.error('Error getting maintenance status:', error);
        
        // If there's an error, assume maintenance is off to prevent blocking users
        res.json({
            message: "Maintenance status retrieved (fallback)",
            data: {
                maintenanceMode: false,
                timestamp: new Date().toISOString(),
                fallback: true
            },
            success: true,
            error: false
        });
    }
}

module.exports = {
    getMaintenanceStatus
};
