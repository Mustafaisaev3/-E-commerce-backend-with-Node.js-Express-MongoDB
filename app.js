const express = require('express')
const errorMiddleware = require('./middleware/errors')

// Route Imports
const productRotes = require('./routes/product.routes')

const app = express()
app.use(express.json())

app.use('/api/v1', productRotes)

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app