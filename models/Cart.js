const { model, Schema, ObjectId } = require('mongoose')

const CartSchema = new Schema({
    products: [
        {
            product: {type: Schema.Types.ObjectId, ref: 'Product'},
            count: Number,
        },
    ],
    cartTotal: {
        require: true,
        type: Number
    },
    totalAfterDiscount: {
        require: true,
        type: Number
    },
    user: {type: Schema.Types.ObjectId, ref: 'User', require: false},

}, {timestamps: true})

module.exports = model('Cart', CartSchema)