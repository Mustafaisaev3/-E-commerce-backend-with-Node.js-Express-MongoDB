const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')


router.get('/products', ProductController.getProducts)
router.post('/admin/product/new', ProductController.newProduct)
router.get('/product/:id', ProductController.getProductById)
router.put('/admin/product/:id', ProductController.updateProduct)
router.delete('/admin/product/:id', ProductController.deleteProduct)


module.exports = router