const jwt = require('jsonwebtoken');

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
                        message: "Session expired. Please login again.",
                        error: true,
                        success: false,
                        expired: true
                    });
                }
                
                // Log other JWT errors (not expiration)
                if (err.name !== 'TokenExpiredError') {
                    console.log("JWT auth error:", err.name, err.message);
                }
                
                return res.status(401).json({
                    message: "Invalid token. Please login again.",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
