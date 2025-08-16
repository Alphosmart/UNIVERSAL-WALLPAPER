const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
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

// Start server first, then connect to MongoDB
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Connect to MongoDB
connectDB().then(() => {
    console.log(`Connected to DB`)
}).catch((err) => {
    console.log("Database connection failed:", err)
    console.log("Server running without database connection")
})
