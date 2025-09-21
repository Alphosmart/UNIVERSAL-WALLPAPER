// const { AppError } = require('./errors');

/**
 * Standardized API response handler
 */
class ResponseHandler {
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            error: false,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
        const response = {
            success: false,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        if (process.env.NODE_ENV === 'development' && res.locals.stack) {
            response.stack = res.locals.stack;
        }

        return res.status(statusCode).json(response);
    }

    static created(res, data = null, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }

    static badRequest(res, message = 'Bad request', errors = null) {
        return this.error(res, message, 400, errors);
    }

    static unauthorized(res, message = 'Authentication required') {
        return this.error(res, message, 401);
    }

    static forbidden(res, message = 'Access denied') {
        return this.error(res, message, 403);
    }

    static conflict(res, message = 'Resource conflict') {
        return this.error(res, message, 409);
    }

    static validationError(res, errors, message = 'Validation failed') {
        return this.error(res, message, 400, errors);
    }

    static serverError(res, message = 'Internal server error') {
        return this.error(res, message, 500);
    }
}

/**
 * Async wrapper to catch errors in async functions
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for monitoring
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
        error = new Error(message);
        error.statusCode = 409;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        const message = 'Validation failed';
        error = new Error(message);
        error.statusCode = 400;
        return ResponseHandler.validationError(res, errors, message);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please login again';
        error = new Error(message);
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your session has expired. Please login again';
        error = new Error(message);
        error.statusCode = 401;
    }

    // Development vs Production error response
    if (process.env.NODE_ENV === 'development') {
        res.locals.stack = err.stack;
    }

    // Send error response
    return ResponseHandler.error(
        res,
        error.message || 'Something went wrong',
        error.statusCode || 500,
        error.errors || null
    );
};

/**
 * Handle 404 for undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server`;
    const error = new Error(message);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    ResponseHandler,
    catchAsync,
    globalErrorHandler,
    notFoundHandler
};
