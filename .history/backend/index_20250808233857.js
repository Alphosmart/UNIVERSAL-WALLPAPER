const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB = require('./config/db')
const router = require('./routes')
const { globalErrorHandler, notFoundHandler } = require('./utils/responseHandler')

const app = express()

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle payload too large error
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            message: "File too large. Please upload smaller images (max 50MB total).",
            error: true,
            success: false
        });
    }
    
    // Handle other errors
    res.status(500).json({
        message: err.message || "Internal server error",
        error: true,
        success: false
    });
});

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
