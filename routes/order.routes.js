const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/orders', OrderController.fetchOrders)
router.post('/order', OrderController.addOrder)
router.put('/order', OrderController.updateOrder)
router.delete('/order', OrderController.deleteOrder)
router.post('/order/:id/status', OrderController.changeOrderStatus)
router.get('/orders/user/:id', OrderController.fetchUserOrders)


module.exports = router