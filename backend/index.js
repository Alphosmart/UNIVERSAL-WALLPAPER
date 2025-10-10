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
// require('./models/shippingModel') // Removed - single company model

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
        /\.onrender\.com$/
    ],
    credentials: true
}))

// Body parsing middleware - increased limits for image uploads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Root route for Render deployment
app.get('/', (req, res) => {
    res.json({ 
        message: 'Universal Wallpaper API Server',
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    })
})

// Health check route
app.get('/health', (req, res) => {
    const fs = require('fs')
    const frontendBuildPath = path.join(__dirname, '../frontend/build')
    const indexPath = path.join(frontendBuildPath, 'index.html')
    
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        spa_config: {
            frontend_build_path: frontendBuildPath,
            build_exists: fs.existsSync(frontendBuildPath),
            index_exists: fs.existsSync(indexPath),
            is_production: process.env.NODE_ENV === 'production'
        }
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
    const fs = require('fs')
    let frontendBuildPath = path.join(__dirname, '../frontend/build')
    
    // Log the build path for debugging
    console.log('🔍 Frontend build path:', frontendBuildPath)
    
    // Check if build directory exists at different possible locations
    const possiblePaths = [
        path.join(__dirname, '../frontend/build'),
        path.join(__dirname, '../../frontend/build'),
        path.join(process.cwd(), 'frontend/build'),
        path.join(__dirname, '../build'),
        path.join(__dirname, 'build')
    ]
    
    let buildFound = false
    for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
            frontendBuildPath = testPath
            buildFound = true
            console.log('✅ Frontend build directory found at:', testPath)
            break
        } else {
            console.log('❌ Not found at:', testPath)
        }
    }
    
    if (!buildFound) {
        console.log('❌ Frontend build directory NOT found at any location')
        console.log('🔄 Attempting to build frontend now...')
        
        // Try to build the frontend dynamically
        const { exec } = require('child_process')
        exec('cd frontend && npm install && npm run build', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ Dynamic build failed:', error.message)
            } else {
                console.log('✅ Dynamic build completed:', stdout)
            }
        })
    }
    
    // Check if index.html exists
    const indexPath = path.join(frontendBuildPath, 'index.html')
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found')
    } else {
        console.log('❌ index.html NOT found at:', indexPath)
    }
    
    // Serve static assets from the build folder
    app.use(express.static(frontendBuildPath))
    
    // SPA catch-all handler: serve index.html for all non-API routes
    app.use((req, res, next) => {
        // Only serve index.html for non-API routes and GET requests
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
            // Check if it's a request for a static file
            const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
            const hasStaticExtension = staticExtensions.some(ext => req.path.toLowerCase().endsWith(ext));
            
            if (!hasStaticExtension) {
                const indexPath = path.join(frontendBuildPath, 'index.html')
                
                // Log SPA routing attempt
                console.log(`🔄 SPA routing: ${req.path} -> index.html`)
                
                // Check if index.html exists before serving
                if (fs.existsSync(indexPath)) {
                    return res.sendFile(indexPath);
                } else {
                    console.log('❌ index.html not found for SPA routing:', indexPath)
                    
                    // Fallback: serve a basic HTML page with React mounting point
                    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Universal Wallpaper</title>
</head>
<body>
    <div id="root">
        <div style="text-align: center; padding: 50px; font-family: Arial;">
            <h1>Universal Wallpaper</h1>
            <p>Loading...</p>
            <p><small>Frontend build not found. Please check deployment configuration.</small></p>
        </div>
    </div>
</body>
</html>`;
                    return res.send(fallbackHtml);
                }
            }
        }
        next();
    });
} 

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
