const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Validation middleware for user registration
const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('Email must not exceed 100 characters'),
    
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    // Custom validation to check password confirmation if provided
    body('confirmPassword')
        .optional()
        .custom((value, { req }) => {
            if (value && value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
];

// Validation middleware for user login
const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1 })
        .withMessage('Password cannot be empty')
];

// Validation middleware for password reset request
const validatePasswordResetRequest = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

// Validation middleware for password reset
const validatePasswordReset = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required')
        .isLength({ min: 10 })
        .withMessage('Invalid reset token format'),
    
    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Validation middleware for profile updates
const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('address.street')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Street address must not exceed 100 characters'),
    
    body('address.city')
        .optional()
        .isLength({ max: 50 })
        .withMessage('City must not exceed 50 characters'),
    
    body('address.state')
        .optional()
        .isLength({ max: 50 })
        .withMessage('State must not exceed 50 characters'),
    
    body('address.zipCode')
        .optional()
        .isPostalCode('any')
        .withMessage('Please provide a valid postal code'),
    
    body('address.country')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Country must not exceed 50 characters')
];

// Validation middleware for product creation
const validateProductCreation = [
    body('productName')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters'),
    
    body('brandName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand name must be between 2 and 50 characters'),
    
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['wallpapers', 'wall-paint', 'ceiling-paint', 'wood-stain', 'primer', 'brushes-rollers', 'decorative-panels', 'wall-decals', 'murals', 'tiles', 'flooring', 'curtains', 'blinds', 'lighting', 'mirrors'])
        .withMessage('Invalid category selected'),
    
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    
    body('sellingPrice')
        .isFloat({ min: 0.01 })
        .withMessage('Selling price must be a positive number')
        .custom((value, { req }) => {
            if (parseFloat(value) > parseFloat(req.body.price)) {
                throw new Error('Selling price cannot be higher than regular price');
            }
            return true;
        }),
    
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next = null) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        
        if (next) {
            const validationError = new ValidationError('Validation failed');
            validationError.errors = errorMessages;
            return next(validationError);
        }
        
        return res.status(400).json({
            success: false,
            error: true,
            message: 'Validation failed',
            errors: errorMessages,
            timestamp: new Date().toISOString()
        });
    }
    
    if (next) {
        next();
    } else {
        return null;
    }
};

// Additional custom validators
const customValidators = {
    // Check if email is already taken (for registration)
    checkEmailExists: async (email) => {
        const User = require('../models/userModel');
        try {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                throw new Error('Email is already registered');
            }
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    // Validate file upload
    validateFileUpload: (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSize = 5 * 1024 * 1024) => {
        if (!file) {
            throw new Error('File is required');
        }
        
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }
        
        if (file.size > maxSize) {
            throw new Error(`File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        }
        
        return true;
    }
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validatePasswordResetRequest,
    validatePasswordReset,
    validateProfileUpdate,
    validateProductCreation,
    handleValidationErrors,
    customValidators
};
