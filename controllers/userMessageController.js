const UserMessage = require("../models/UserMessage")

class UserMessageController {
    async createMessage (req, res) {
        try {
            const { name, email, message } = req.body

            if (!name || !email || !message) {
                res.status(404).json({status: 'error', message: 'Enter valid data'})
            }

            const Message = await UserMessage.create({name, email, message})

            res.status(200).json({status: 'success', message: 'Message delivered'})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
}

module.exports = new UserMessageController()
