const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/'
    };
};

const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        ...getAuthCookieOptions(),
        maxAge: 8 * 60 * 60 * 1000
    });
};

const clearAuthCookie = (res) => {
    res.clearCookie('token', getAuthCookieOptions());
};

module.exports = { setAuthCookie, clearAuthCookie };
