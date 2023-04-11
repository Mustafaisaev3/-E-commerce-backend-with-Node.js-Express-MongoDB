const Router = require('express')
const router = new Router()
const CustumersController = require('../controllers/custumerController')

router.get('/custumers', CustumersController.getAllCustumers)

module.exports = router