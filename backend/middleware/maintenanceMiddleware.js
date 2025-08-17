const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Middleware to check if the application is in maintenance mode
 * Blocks non-admin users when maintenance mode is enabled
 */
const checkMaintenanceMode = async (req, res, next) => {
    try {
        // Skip maintenance check for specific routes that should always be available
        const allowedRoutes = [
            '/api/health',
            '/api/test',
            '/api/maintenance-status',
            '/api/current-user', // Allow checking user status
            '/api/login',
            '/api/logout'
        ];

        // Skip maintenance check for admin routes - admins should always have access
        const isAdminRoute = req.path.startsWith('/api/admin/');
        
        // Skip check for allowed routes
        if (allowedRoutes.includes(req.path) || isAdminRoute) {
            return next();
        }

        // Get maintenance mode setting from database
        let maintenanceSettings;
        try {
            maintenanceSettings = await settingsModel.findOne({ systemId: 'main_settings' });
        } catch (dbError) {
            // If database is not available, allow access (fail open for availability)
            logger.warn('Database unavailable for maintenance check, allowing access', {
                path: req.path,
                error: dbError.message
            });
            return next();
        }

        // If no settings found or maintenance mode is disabled, continue normally
        if (!maintenanceSettings || !maintenanceSettings.general?.maintenanceMode) {
            return next();
        }

        // Maintenance mode is enabled - check if user is admin
        if (req.userId) {
            try {
                const user = await userModel.findById(req.userId);
                if (user && user.role === 'ADMIN') {
                    // Admin users can access during maintenance
                    logger.info('Admin user accessing during maintenance mode', {
                        userId: req.userId,
                        userEmail: user.email,
                        path: req.path
                    });
                    return next();
                }
            } catch (userError) {
                logger.error('Error checking user role during maintenance', {
                    userId: req.userId,
                    error: userError.message
                });
            }
        }

        // Non-admin user or unauthenticated user - block access
        logger.info('Maintenance mode active: blocking non-admin access', {
            path: req.path,
            method: req.method,
            userId: req.userId || 'unauthenticated',
            ip: req.ip
        });

        return res.status(503).json({
            message: "The application is currently under maintenance. Please try again later.",
            error: true,
            success: false,
            maintenanceMode: true,
            retryAfter: 3600 // Suggest retry after 1 hour (in seconds)
        });

    } catch (error) {
        logger.error('Error in maintenance middleware', {
            error: error.message,
            path: req.path,
            stack: error.stack
        });
        
        // On error, fail open (allow access) to prevent complete service disruption
        return next();
    }
};

module.exports = {
    checkMaintenanceMode
};
