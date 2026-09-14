const { clearAuthCookie } = require('../utils/authCookie');

async function userLogout(req, res) {
    try {
        // Must use the same options as when the cookie was set, or browsers keep it
        clearAuthCookie(res);

        res.json({
            message: "Logged out successfully",
            error: false,
            success: true,
            data: []
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userLogout;
