const logger = require('../utils/logger');

/**
 * Performance monitoring middleware
 */
class PerformanceMonitor {
    static trackRequest(req, res, next) {
        req.startTime = Date.now();
        
        // Track memory usage
        const initialMemory = process.memoryUsage();
        req.initialMemory = initialMemory;

        // Override res.end to capture response time
        const originalEnd = res.end;
        res.end = function(...args) {
            const duration = Date.now() - req.startTime;
            const finalMemory = process.memoryUsage();
            
            // Calculate memory delta
            const memoryDelta = {
                rss: finalMemory.rss - initialMemory.rss,
                heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
                heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
                external: finalMemory.external - initialMemory.external
            };

            // Log performance metrics
            const perfData = {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                duration,
                memoryDelta,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                userId: req.userId || null
            };

            // Log slow requests (> 1 second)
            if (duration > 1000) {
                logger.performance.slowQuery(req.originalUrl, duration, 1000);
            }

            // Log performance data
            logger.performance.apiCall(
                req.method,
                req.originalUrl,
                duration,
                res.statusCode,
                req.userId
            );

            // Log detailed performance in debug mode
            if (process.env.NODE_ENV !== 'production') {
                logger.debug('Request performance', perfData);
            }

            originalEnd.apply(this, args);
        };

        next();
    }

    static trackDatabase(operation, collection) {
        return {
            start: Date.now(),
            end: function(success = true) {
                const duration = Date.now() - this.start;
                logger.performance.dbQuery(operation, collection, duration, success);
                
                if (duration > 500) { // Log slow DB operations
                    logger.warn('Slow database operation', {
                        operation,
                        collection,
                        duration
                    });
                }
            }
        };
    }

    static async wrapDatabaseOperation(operation, collection, fn) {
        const tracker = this.trackDatabase(operation, collection);
        try {
            const result = await fn();
            tracker.end(true);
            return result;
        } catch (error) {
            tracker.end(false);
            throw error;
        }
    }

    static getSystemMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        
        return {
            timestamp: new Date().toISOString(),
            memory: {
                rss: Math.round(memUsage.rss / 1024 / 1024), // MB
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
                external: Math.round(memUsage.external / 1024 / 1024) // MB
            },
            cpu: {
                user: cpuUsage.user,
                system: cpuUsage.system
            },
            uptime: process.uptime(),
            nodeVersion: process.version
        };
    }

    static startSystemMonitoring() {
        // Log system metrics every 5 minutes
        setInterval(() => {
            const metrics = this.getSystemMetrics();
            logger.info('System metrics', metrics);
        }, 5 * 60 * 1000);
    }
}

/**
 * Rate limiting monitoring
 */
class RateLimitMonitor {
    constructor() {
        this.requests = new Map();
        this.suspiciousIPs = new Set();
    }

    trackRequest(ip, endpoint) {
        const key = `${ip}:${endpoint}`;
        const now = Date.now();
        const windowStart = now - (60 * 1000); // 1 minute window

        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }

        const requests = this.requests.get(key);
        
        // Remove old requests outside the window
        const recentRequests = requests.filter(time => time > windowStart);
        recentRequests.push(now);
        this.requests.set(key, recentRequests);

        // Check for suspicious activity
        if (recentRequests.length > 60) { // More than 60 requests per minute
            if (!this.suspiciousIPs.has(ip)) {
                this.suspiciousIPs.add(ip);
                logger.security.suspiciousActivity(
                    'High request rate',
                    { 
                        requestCount: recentRequests.length,
                        endpoint,
                        timeWindow: '1 minute'
                    },
                    ip,
                    'System Monitor'
                );
            }
        }

        return recentRequests.length;
    }

    middleware() {
        return (req, res, next) => {
            const requestCount = this.trackRequest(req.ip, req.originalUrl);
            req.requestCount = requestCount;
            next();
        };
    }

    cleanup() {
        // Clean up old data every 10 minutes
        setInterval(() => {
            const now = Date.now();
            const cutoff = now - (10 * 60 * 1000); // 10 minutes ago

            for (const [key, requests] of this.requests.entries()) {
                const recentRequests = requests.filter(time => time > cutoff);
                if (recentRequests.length === 0) {
                    this.requests.delete(key);
                } else {
                    this.requests.set(key, recentRequests);
                }
            }

            // Reset suspicious IPs every hour
            if (now % (60 * 60 * 1000) < 10 * 60 * 1000) {
                this.suspiciousIPs.clear();
            }
        }, 10 * 60 * 1000);
    }
}

const rateLimitMonitor = new RateLimitMonitor();
rateLimitMonitor.cleanup();

module.exports = {
    PerformanceMonitor,
    RateLimitMonitor,
    rateLimitMonitor
};
