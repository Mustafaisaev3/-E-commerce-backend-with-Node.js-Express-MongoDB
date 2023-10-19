const Router = require('express')
const router = new Router()
const ModulesController = require('../controllers/modulesController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

// All Modules
router.get('/all-modules', ModulesController.getAllModules)

// Pages Layouts
router.get('/get-page-layout/:name', ModulesController.getPageLayout)
router.post('/create-page-layout', ModulesController.createPageLayout)

// Main Banner
router.get('/main-banner', ModulesController.getMainBanner)
router.post('/main-banner', upload.array('img'), ModulesController.createMainBannerSliderItems)

// Slider
router.get('/sliders', ModulesController.getSliders)
router.post('/slider', ModulesController.newSlider)
router.put('/slider/:id', ModulesController.updateSlider)
router.delete('/slider/:id', ModulesController.deleteSlider)

// Popular Categories
router.get('/popular-categories', ModulesController.getPopularCategories)
router.post('/popular-categories', upload.array('img'), ModulesController.createPopularCategories)

// Triple Banner
router.get('/triple-banner', ModulesController.getTripleBanner)
router.post('/triple-banner', upload.array('img'), ModulesController.createTripleBanner)

// Brands Banner
router.get('/brands-banner', ModulesController.getBrands)
router.post('/brands-banner', upload.array('img'), ModulesController.createBrands)

// Blog Slider
router.get('/blog-slider', ModulesController.getBlogSlider)
router.post('/blog-slider', ModulesController.updateBlogSlider)

// router.put('/order', OrderController.updateOrder)
// router.delete('/order', OrderController.deleteOrder)
// router.post('/order/:id/status', OrderController.changeOrderStatus)
// router.get('/orders/user/:id', OrderController.fetchUserOrders)


module.exports = router