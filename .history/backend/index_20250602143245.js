const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')


const app = express()
app.use(cors())

const PORT = 8080 || process.env.PORT

// Connect to MongoDB
connectDB().then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err)
}
app.listen(PORT, () => {
    console.log(`Server is running`)
})