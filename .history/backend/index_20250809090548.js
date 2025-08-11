const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB = require('./config/db')
const { globalErrorHandler, notFoundHandler } = require('./utils/responseHandler')

const app = express()

// Database connection
connectDB()

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
