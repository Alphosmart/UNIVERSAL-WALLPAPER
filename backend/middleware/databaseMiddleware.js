const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Middleware to check database connection before processing requests
const checkDatabaseConnection = (req, res, next) => {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
        logger.warn('Database not connected, rejecting request', {
            path: req.path,
            method: req.method,
            readyState: mongoose.connection.readyState
        });
        
        return res.status(503).json({
            success: false,
            message: 'Database service temporarily unavailable. Please try again later.',
            error: 'Database connection not ready'
        });
    }
    
    next();
};

// Middleware to handle database errors gracefully
const handleDatabaseError = (error, req, res, next) => {
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
        logger.error('Database operation error', {
            error: error.message,
            path: req.path,
            method: req.method
        });
        
        return res.status(500).json({
            success: false,
            message: 'Database operation failed. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
        });
    }
    
    next(error);
};

module.exports = {
    checkDatabaseConnection,
    handleDatabaseError
};
