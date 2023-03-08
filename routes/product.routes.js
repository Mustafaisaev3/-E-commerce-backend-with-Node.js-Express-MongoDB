const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')


router.get('/products', ProductController.getProducts)


module.exports = router