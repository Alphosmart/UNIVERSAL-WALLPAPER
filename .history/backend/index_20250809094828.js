const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
// Load environment variables first
require('dotenv').config()
const connectDB = require('./config/db')
const { globalErrorHandler, notFoundHandler } = require('./utils/responseHandler')
const logger = require('./utils/logger')
const { PerformanceMonitor, rateLimitMonitor } = require('./middleware/monitoring')

const app = express()

// Start system monitoring
PerformanceMonitor.startSystemMonitoring()

// Logging middleware (before other middleware)
app.use(logger.middleware.requestLogger)

// Performance monitoring
app.use(PerformanceMonitor.trackRequest)

// Rate limiting monitoring
app.use(rateLimitMonitor.middleware())

// Enable compression for all responses
app.use(compression())

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))

// Body parsing middleware - increased limits for image uploads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

// Add original routes
const router = require('./routes/index')
app.use('/api', router)

// Handle undefined routes - using middleware instead of app.all('*') to avoid Express 5 issues
app.use((req, res, next) => {
    notFoundHandler(req, res, next)
})

// Global error handling middleware
app.use(globalErrorHandler)

const PORT = process.env.PORT || 8080

// Graceful server startup with database connection
async function startServer() {
    console.log('🚀 Starting server...')
    
    // Start the server first
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`)
        logger.info(`Server started successfully on port ${PORT}`)
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
    
    // Try to connect to database in the background
    try {
        console.log('📡 Attempting to connect to database...')
        await connectDB()
        console.log('✅ Database connected successfully')
        logger.info('Database connected successfully')
    } catch (error) {
        console.log('❌ Database connection failed:', error.message)
        logger.error('Database connection failed:', error)
        console.log('⚠️  Server running without database connection')
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err)
    console.error('Uncaught Exception:', err)
    process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err)
    console.error('Unhandled Rejection:', err)
    process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully')
    process.exit(0)
})

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully')
    process.exit(0)
})

// Start the server
startServer()

module.exports = app
