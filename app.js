const express = require('express')

// Route Imports
const productRotes = require('./routes/product.routes')

const app = express()
app.use(express.json())

app.use('/api/v1', productRotes)

module.exports = app