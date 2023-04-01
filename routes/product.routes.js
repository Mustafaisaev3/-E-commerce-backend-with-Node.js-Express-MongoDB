const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')


const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

router.get('/products', ProductController.getProducts)
router.post('/product/new', upload.array('img'), ProductController.newProduct)
router.get('/product/:id', ProductController.getProductById)
router.put('/product/:id', upload.array('img'), ProductController.updateProduct)
router.delete('/product/:id', ProductController.deleteProduct)

// router.get('/products', authMiddleware, ProductController.getProducts)
// router.post('/admin/product/new', ProductController.newProduct)
// router.get('/product/:id', ProductController.getProductById)
// router.put('/admin/product/:id', ProductController.updateProduct)
// router.delete('/admin/product/:id', ProductController.deleteProduct)

module.exports = router