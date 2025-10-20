const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
// Load environment variables first with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Ensure JWT secret is available
if (!process.env.TOKEN_SECRET_KEY) {
    // Set a fallback for production deployment
    const fallbackSecret = 'universal-wallpaper-jwt-secret-key-' + process.env.NODE_ENV + '-' + Date.now()
    process.env.TOKEN_SECRET_KEY = fallbackSecret
    console.warn('⚠️  TOKEN_SECRET_KEY not found in environment, using fallback. Please set this in production!')
}

const connectDB = require('./config/db')
const { globalErrorHandler, notFoundHandler } = require('./utils/responseHandler')
const logger = require('./utils/logger')
const { PerformanceMonitor, rateLimitMonitor } = require('./middleware/monitoring')

// Import models to ensure they are registered with Mongoose
require('./models/userModel')
require('./models/productModel')
require('./models/cartModel')
require('./models/orderModel')
require('./models/bannerModel')
require('./models/backupModel')
require('./models/settingsModel')
require('./models/contactMessageModel')

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

// Security headers middleware
app.use((req, res, next) => {
    // Set security headers
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
})

// CORS configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3001',
        'http://192.168.1.100:3000',
        'http://192.168.1.100:3001',
        'https://universaldotwallpaper.onrender.com',
        'https://universal-wallpaper.onrender.com',
        'https://www.universaldotwallpaper.com',
        'https://universaldotwallpaper.com',
        'https://www.universaldotwalpaper.com',
        'https://universaldotwalpaper.com',
        'https://universal-wallpaper.vercel.app',
        /\.onrender\.com$/,
        /\.vercel\.app$/
    ],
    credentials: true
}))

// Body parsing middleware - increased limits for image uploads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Root route - will be handled by SPA routing middleware in production

// Health check route
app.get('/health', (req, res) => {
    const FRONTEND_URL = 'https://universaldotwalpaper.com'
    
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        architecture: 'Separate Frontend/Backend Deployments',
        deployment_info: {
            backend_url: 'https://universaldotwallpaper.onrender.com',
            frontend_url: FRONTEND_URL,
            api_endpoints: 'https://universaldotwallpaper.onrender.com/api/*',
            main_website: FRONTEND_URL
        },
        message: 'This is the API server. For the website, visit: ' + FRONTEND_URL
    })
})

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

// Add original routes
const router = require('./routes/index')
const { handleDatabaseError } = require('./middleware/databaseMiddleware')
app.use('/api', router)

// Database error handling middleware
app.use(handleDatabaseError)

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Production mode: Separate frontend/backend deployments')
    console.log('📍 Frontend: https://universaldotwalpaper.com')
    console.log('📍 Backend: API only')
    
    // Backend API server only - no frontend files served
    
    // No SPA routing needed - frontend deployed separately
} else {
    // Development mode - let the undefined routes handler work
    // Handle undefined routes - using middleware instead of app.all('*') to avoid Express 5 issues
    app.use((req, res, next) => {
        notFoundHandler(req, res, next)
    })
}

// Global error handling middleware
app.use(globalErrorHandler)

const PORT = process.env.PORT || 8080

// Graceful server startup with database connection
async function startServer() {
    console.log('🚀 Starting server...')
    
    // Connect to database FIRST before starting server
    try {
        console.log('📡 Connecting to database...')
        const dbConnected = await connectDB()
        
        if (dbConnected) {
            console.log('✅ Database connected successfully')
            logger.info('Database connected successfully')
        } else {
            console.log('⚠️  Database connection failed, but server will continue')
            logger.warn('Database connection failed, server continuing without DB')
        }
    } catch (error) {
        console.log('❌ Database connection error:', error.message)
        logger.error('Database connection error:', error)
        console.log('⚠️  Server starting without database connection')
    }
    
    // Start the server after database connection attempt
    const server = app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`)
        logger.info(`Server started successfully on port ${PORT}`)
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
    
    return server
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
