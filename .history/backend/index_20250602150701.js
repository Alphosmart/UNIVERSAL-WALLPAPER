const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors())
app.use(express.json())

const PORT = 8080 || process.env.PORT

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`connected to DB`)
    console.log(`Server is running`)
})
})
