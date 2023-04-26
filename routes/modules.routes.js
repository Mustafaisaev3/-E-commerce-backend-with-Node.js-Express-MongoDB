const Router = require('express')
const router = new Router()
const HomeController = require('../controllers/modulesController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

// Main Banner
router.get('/main-banner', HomeController.getMainBanner)
router.post('/main-banner', upload.array('img'), HomeController.createMainBannerSliderItems)

// Slider
router.get('/sliders', HomeController.getSliders)
router.post('/slider', HomeController.newSlider)
router.put('/slider/:id', HomeController.updateSlider)
router.delete('/slider/:id', HomeController.deleteSlider)

// router.put('/order', OrderController.updateOrder)
// router.delete('/order', OrderController.deleteOrder)
// router.post('/order/:id/status', OrderController.changeOrderStatus)
// router.get('/orders/user/:id', OrderController.fetchUserOrders)


module.exports = router