const express = require('express')

const app = express()

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' })
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
