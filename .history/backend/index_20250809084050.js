const express = require('express')

const app = express()

// Basic middleware
app.use(express.json())

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

// Add original routes
const router = require('./routes/index')
app.use('/api', router)

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
