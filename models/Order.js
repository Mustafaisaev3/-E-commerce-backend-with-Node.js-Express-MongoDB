const { model, Schema } = require('mongoose')

const OrderSchema = new Schema({
    products: [
        {
            product: {type: Schema.Types.ObjectId, ref: 'Product'},
            count: Number,
        },
    ],
    address: {
        require: true,
        type: String
    },
    phone: {
        require: true,
        type: String
    },
    paymantMethod: {
        require: true,
        type: String
    },
    orderStatus: {
        require: true,
        type: String
    },
    user:  {type: Schema.Types.ObjectId, ref: 'User', require: false},

}, {timestamps: true})

module.exports = model('Order', OrderSchema)