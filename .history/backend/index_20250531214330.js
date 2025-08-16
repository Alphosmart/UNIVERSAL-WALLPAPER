const express = require('express')
const cors = require('cors')
required('dotenv').con


const app = express()
app.use(cors())

const PORT = 8080 || process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running`)
})