const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { ResponseHandler, catchAsync } = require('../utils/responseHandler');
const { AuthenticationError, ValidationError } = require('../utils/errors');
const { validateUserLogin, handleValidationErrors } = require('../middleware/validation');

const userSignInController = catchAsync(async (req, res) => {
    // Run validation
    await Promise.all(validateUserLogin.map(validation => validation.run(req)));
    
    // Handle validation errors
    const validationResult = handleValidationErrors(req, res);
    if (validationResult) return validationResult;

    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    
    if (!user) {
        console.log('❌ User not found for email:', email);
        throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const tokenData = {
        _id: user._id,
        email: user.email,
    };
    
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

    // Set secure cookie with proper production settings
    const isProduction = process.env.NODE_ENV === 'production';
    const tokenOptions = {
        httpOnly: true,
        secure: isProduction, // Use secure cookies in production (HTTPS)
        sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production, 'lax' for localhost
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    };

    res.cookie("token", token, tokenOptions);

    // Return success response without sensitive data
    return ResponseHandler.success(res, {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role
        }
    }, 'Login successful');
});

module.exports = userSignInController;