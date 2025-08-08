const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectD


const app = express()
app.use(cors())

const PORT = 8080 || process.env.PORT

// Connect to MongoDB
connectDB()
app.listen(PORT, () => {
  console.log(`Server is running`)
})