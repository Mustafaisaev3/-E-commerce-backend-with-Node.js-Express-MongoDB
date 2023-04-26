const express = require('express')
const errorMiddleware = require('./middleware/errors')
const cookie_parser = require('cookie-parser')
const cloudinary = require('cloudinary')
const cors = require('./middleware/corsMiddleware')

// Route Imports
const productRotes = require('./routes/product.routes')
const userRotes = require('./routes/user.routes')
const categoryRoutes = require('./routes/category.routes')
const orderRoutes = require('./routes/order.routes')
const custumerRoutes = require('./routes/custumer.routes')
const optionRoutes = require('./routes/option.routes')
const blogRoutes = require('./routes/blog.routes')
const modulesRoutes = require('./routes/modules.routes')


const app = express()
app.use(express.json())
app.use(cookie_parser())


cloudinary.config({
    cloud_name: 'dmsxzw5rd', 
    api_key: '453662451246126', 
    api_secret: 'z5GFgsaI6iQyVTyQwuYhFLyVqxA'
})
app.use(cors)

app.use('/api/v1', productRotes)
app.use('/api/v1', userRotes)
app.use('/api/v1', categoryRoutes)
app.use('/api/v1', orderRoutes)
app.use('/api/v1', custumerRoutes)
app.use('/api/v1', optionRoutes)
app.use('/api/v1', blogRoutes)
app.use('/api/v1', modulesRoutes)


// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app