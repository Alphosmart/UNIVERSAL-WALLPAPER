const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        if (stack) {
            log += `\n${stack}`;
        }
        if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        return log;
    })
);

// Create transports
const transports = [
    // Console transport for development
    new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: consoleFormat,
        handleExceptions: true
    }),

    // File transport for all logs
    new DailyRotateFile({
        filename: path.join(logsDir, 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        maxSize: '20m',
        format: logFormat,
        level: 'info'
    }),

    // File transport for errors only
    new DailyRotateFile({
        filename: path.join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        maxSize: '20m',
        format: logFormat,
        level: 'error'
    }),

    // File transport for security events
    new DailyRotateFile({
        filename: path.join(logsDir, 'security-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '90d',
        maxSize: '20m',
        format: logFormat,
        level: 'warn'
    })
];

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: logFormat,
    transports,
    exitOnError: false,
    handleExceptions: true,
    handleRejections: true
});

// Create specialized loggers
const securityLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(logsDir, 'security-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '90d',
            maxSize: '20m',
            format: logFormat
        })
    ]
});

const performanceLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(logsDir, 'performance-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            format: logFormat
        })
    ]
});

// Helper functions for structured logging
const loggers = {
    // Main application logger
    info: (message, meta = {}) => logger.info(message, meta),
    warn: (message, meta = {}) => logger.warn(message, meta),
    error: (message, meta = {}) => logger.error(message, meta),
    debug: (message, meta = {}) => logger.debug(message, meta),

    // Security events
    security: {
        loginAttempt: (email, success, ip, userAgent) => {
            securityLogger.info('Login attempt', {
                type: 'LOGIN_ATTEMPT',
                email,
                success,
                ip,
                userAgent,
                timestamp: new Date().toISOString()
            });
        },
        
        loginFailure: (email, reason, ip, userAgent) => {
            securityLogger.warn('Login failure', {
                type: 'LOGIN_FAILURE',
                email,
                reason,
                ip,
                userAgent,
                timestamp: new Date().toISOString()
            });
        },

        passwordReset: (email, ip) => {
            securityLogger.info('Password reset requested', {
                type: 'PASSWORD_RESET',
                email,
                ip,
                timestamp: new Date().toISOString()
            });
        },

        suspiciousActivity: (activity, details, ip, userAgent) => {
            securityLogger.warn('Suspicious activity detected', {
                type: 'SUSPICIOUS_ACTIVITY',
                activity,
                details,
                ip,
                userAgent,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Performance monitoring
    performance: {
        apiCall: (method, url, duration, statusCode, userId = null) => {
            performanceLogger.info('API call performance', {
                type: 'API_PERFORMANCE',
                method,
                url,
                duration,
                statusCode,
                userId,
                timestamp: new Date().toISOString()
            });
        },

        dbQuery: (operation, collection, duration, success = true) => {
            performanceLogger.info('Database query performance', {
                type: 'DB_PERFORMANCE',
                operation,
                collection,
                duration,
                success,
                timestamp: new Date().toISOString()
            });
        },

        slowQuery: (query, duration, threshold = 1000) => {
            if (duration > threshold) {
                performanceLogger.warn('Slow query detected', {
                    type: 'SLOW_QUERY',
                    query,
                    duration,
                    threshold,
                    timestamp: new Date().toISOString()
                });
            }
        }
    },

    // Request logging middleware
    middleware: {
        requestLogger: (req, res, next) => {
            const start = Date.now();
            
            // Log request
            logger.info('Request received', {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: req.userId || null
            });

            // Override res.end to log response
            const originalEnd = res.end;
            res.end = function(...args) {
                const duration = Date.now() - start;
                
                // Log response
                logger.info('Request completed', {
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    duration,
                    ip: req.ip,
                    userId: req.userId || null
                });

                // Log performance
                loggers.performance.apiCall(
                    req.method,
                    req.originalUrl,
                    duration,
                    res.statusCode,
                    req.userId
                );

                originalEnd.apply(this, args);
            };

            next();
        },

        errorLogger: (err, req, res, next) => {
            logger.error('Request error', {
                error: err.message,
                stack: err.stack,
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: req.userId || null,
                body: req.body,
                params: req.params,
                query: req.query
            });

            next(err);
        }
    }
};

module.exports = loggers;
