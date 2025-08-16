const jwt = require('jsonwebtoken');
const { ResponseHandler } = require('../utils/responseHandler');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please log in to access your account.",
                error: true,
                success: false,
                redirectTo: "/login",
                requiresAuth: true
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                // Handle token expiration without spamming console
                if (err.name === 'TokenExpiredError') {
                    // Clear the expired cookie
                    res.clearCookie('token');
                    return res.status(401).json({
                        message: "Your session has expired. Please log in again to continue.",
                        error: true,
                        success: false,
                        expired: true,
                        redirectTo: "/login",
                        requiresAuth: true
                    });
                }
                
                // Log other JWT errors (not expiration)
                if (err.name !== 'TokenExpiredError') {
                    console.log("JWT auth error:", err.name, err.message);
                }
                
                return res.status(401).json({
                    message: "Invalid authentication token. Please log in again to access your account.",
                    error: true,
                    success: false,
                    redirectTo: "/login",
                    requiresAuth: true
                });
            }

            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        return ResponseHandler.serverError(res, err.message || 'Authentication failed');
    }
}

module.exports = authToken;
