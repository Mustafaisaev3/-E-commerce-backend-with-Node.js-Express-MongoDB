const express = require('express')
const errorMiddleware = require('./middleware/errors')
const cookie_parser = require('cookie-parser')

// Route Imports
const productRotes = require('./routes/product.routes')
const userRotes = require('./routes/user.routes')
const categoeyRoutes = require('./routes/category.routes')


const app = express()
app.use(express.json())
app.use(cookie_parser())

app.use('/api/v1', productRotes)
app.use('/api/v1', userRotes)
app.use('/api/v1', categoeyRoutes)


// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app