const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api", router)

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
