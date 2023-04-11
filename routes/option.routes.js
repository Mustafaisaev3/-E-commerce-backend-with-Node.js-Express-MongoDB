const Router = require('express')
const router = new Router()
const OptionController = require('../controllers/optionController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

router.get('/options', OptionController.fetchOptions)
router.post('/option', upload.array('img'), OptionController.newOption)
// router.put('/order', OrderController.updateOrder)
// router.delete('/order', OrderController.deleteOrder)
// router.post('/order/:id/status', OrderController.changeOrderStatus)
// router.get('/orders/user/:id', OrderController.fetchUserOrders)


module.exports = router