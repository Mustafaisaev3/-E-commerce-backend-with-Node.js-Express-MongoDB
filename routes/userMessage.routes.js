const Router = require('express')
const router = new Router()
const UserMessageController = require('../controllers/userMessageController')

router.post('/user_message', UserMessageController.createMessage)

module.exports = router