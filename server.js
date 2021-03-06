require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// Setup middleware
app.use(cors())
app.use(express.json())

// Setup MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

// Setup routers
const predictionsRouter = require('./routes/predictions')

app.use('/predictions', predictionsRouter)

// Start listening
app.listen(process.env.PORT, () => console.log('Server started'))