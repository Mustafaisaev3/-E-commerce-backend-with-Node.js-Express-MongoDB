const Router = require('express')
const router = new Router()
const HomeController = require('../controllers/homeController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

router.get('/main-banner', HomeController.getMainBanner)
router.post('/main-banner', upload.array('img'), HomeController.createMainBannerSliderItems)
// router.put('/order', OrderController.updateOrder)
// router.delete('/order', OrderController.deleteOrder)
// router.post('/order/:id/status', OrderController.changeOrderStatus)
// router.get('/orders/user/:id', OrderController.fetchUserOrders)


module.exports = router