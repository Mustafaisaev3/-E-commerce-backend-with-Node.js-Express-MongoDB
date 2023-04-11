const Order = require("../models/Order")

class OrderController {
    async fetchOrders (req, res) {
        try {
            const orders = await Order.find({}).populate('user').populate('products.product')
            // .populate({
            //     path: 'products',
            //     populate: {
            //         path: 'product'
            //     }
            // })

            res.status(200).json({status: 'success', data: orders})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    
    async addOrder (req, res) {
        try {
            // const { products, address, phone, paymantMethod, orderStatus, user } = req.body
            const reqBody = req.body

            console.log(reqBody)

            const order = await Order.create({...reqBody})
            
            res.status(200).json({status: 'success', data: order})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateOrder (req, res) {
        try {
            const { products, phone, paymantMethod, orderStatus, user, address} = req.body 
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const order = await Order.findById(id)

            if(!order) {
                res.status(404).json({status: 'error', message: 'Order not found'})
            }
            if (order) {
                order.products = products
                order.phone = phone
                order.paymantMethod = paymantMethod
                order.orderStatus = orderStatus
                order.user = user
                order.address = address

                order.save()


                res.status(200).json({status: 'success', data: order})
            } else {
                res.status(400).json({status: 'error', message: 'Category not found!'})
            }
        } catch (error) {
            res.status(400).json({status: 'error', message: 'some error'})
        }
    }

    async changeOrderStatus (req, res) {
        try {
            const { orderStatus } = req.body
            const { id } = req.params

            const order = await Order.findById(id)

            if(!order) {
                res.status(404).json({status: 'error', message: 'Order not found'})
            }

            order.orderStatus = orderStatus
            order.save()
            
            res.status(200).json({status: 'success', data: order})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteOrder (req, res) {
        try {
            const { id } = req.params

            const order = await Order.findById(id)

            if(!order) {
                res.status(404).json({status: 'error', message: 'Order not found'})
            }

            await order.deleteOne()
            
            res.status(200).json({status: 'success', message: 'Order deleted!'})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async fetchUserOrders (req, res) {
        try {
            const { id } = req.params

            const userOrders = await Order.find({user: id})

            if(!userOrders) {
                res.status(404).json({status: 'error', message: 'Orders not found'})
            } else {
                res.status(200).json({status: 'success', data: userOrders})
            }
            
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }


}

module.exports = new OrderController()

