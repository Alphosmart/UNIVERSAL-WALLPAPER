const express = require('express')

const app = express()

// Basic middleware
app.use(express.json())

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

// Add minimal routes
const minimalRoutes = require('./routes/minimal')
app.use('/api', minimalRoutes)

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
