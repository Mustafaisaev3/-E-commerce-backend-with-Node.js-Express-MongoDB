const Router = require('express')
const router = new Router()
const BlogController = require('../controllers/blogController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

router.get('/posts', BlogController.getBlogPosts)
router.get('/post/:id', BlogController.createBlogPost)
router.post('/post', upload.single('img'), BlogController.createBlogPost)
router.delete('/post/:id', BlogController.deleteBlogPost)
router.put('/post/:id', upload.single('img'), BlogController.updateBlogPost)

// Blog Categories Routs
router.get('/blog-categories', BlogController.getBlogCategories)
router.post('/blog-categories', BlogController.createBlogCategory)
router.put('/blog-categories/:id', BlogController.updateBlogCategory)
router.delete('/blog-categories/:id', BlogController.deleteBlogCategory)



module.exports = router