const Router = require('express')
const router = new Router()
const CategoryController = require('../controllers/categoryController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

router.get('/category', CategoryController.getAllCategories)
router.post('/category', upload.single('img'), CategoryController.createCategory)
router.delete('/category/:id', CategoryController.deleteCategory)
router.put('/category/:id', upload.single('img'), CategoryController.updateCategory)
// router.post('/category', upload.array('img', 3), CategoryController.createCategory)
// router.get('/product/:id', ProductController.getProductById)
// router.put('/admin/product/:id', ProductController.updateProduct)
// router.delete('/admin/product/:id', ProductController.deleteProduct)


module.exports = router