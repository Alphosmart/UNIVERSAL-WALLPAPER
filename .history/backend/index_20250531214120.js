const express = require('express')
const cors = require('cors')
required ('dotenv').config()


const app = express()
app.use(cors())

const PORT =  process.env.PORT || 3000