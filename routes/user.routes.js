const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.post('/auth', authMiddleware, UserController.auth)
router.get('/refresh', UserController.refreshToken)


module.exports = router