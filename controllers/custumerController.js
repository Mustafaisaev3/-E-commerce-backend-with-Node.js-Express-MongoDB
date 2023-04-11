const User = require('../models/User')


class CustumerController {
    async getAllCustumers (req, res) {
        try {
            const AllCustumers = await User.find({})
            
            res.status(200).json({status: 'success', data: AllCustumers})
        } catch (error) {
            res.status(400).json({status: 'error', message: error})
        }
    }

}

module.exports = new CustumerController()
