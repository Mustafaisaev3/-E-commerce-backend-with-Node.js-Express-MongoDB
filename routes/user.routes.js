const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/auth', authMiddleware, UserController.auth)


module.exports = router