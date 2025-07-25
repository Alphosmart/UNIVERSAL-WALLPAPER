const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')

const app = express()
app.use(cors())

const PORT = process.env.PORT || 8080

// Connect to MongoDB
connectDB()
app.listen(PORT, () => {
    console.log(`Server is running`)
})