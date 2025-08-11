const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB = require('./config/db')
// Temporarily use minimal routes to debug
const router = require('./routes/index-minimal')
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

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// Increase payload size limits for image uploads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use("/api", router)

// Handle undefined routes
app.all('*', notFoundHandler)

// Error logging middleware (before global error handler)
app.use(logger.middleware.errorLogger)

// Global error handling middleware
app.use(globalErrorHandler)

const PORT = process.env.PORT || 8080

// Connect to MongoDB first, then start server
async function startServer() {
    try {
        await connectDB()
        console.log(`Connected to DB`)
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.log("Database connection failed:", err)
        console.log("Starting server without database connection")
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} (without database)`)
        })
    }
}

startServer()
