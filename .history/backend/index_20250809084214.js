const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const { globalErrorHandler, notFoundHandler } = require('./utils/responseHandler')

const app = express()

// Database connection
connectDB()

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

// Add original routes
const router = require('./routes/index')
app.use('/api', router)

// Handle undefined routes
app.all('*', notFoundHandler)

// Global error handling middleware
app.use(globalErrorHandler)

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
