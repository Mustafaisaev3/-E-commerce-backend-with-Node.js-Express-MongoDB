const { Schema, model } = require('mongoose')

const ProductModel = new Schema({
    title: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    salePrice: {
        type: Number,
        required: false,
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{type: String, required: false}],
    options: [{
        option: {
            type: Schema.Types.ObjectId,
            ref: 'Option',
        },
        values: [
            {
                // id: {
                //     type: Schema.Types.ObjectId,
                //     ref: 'OptionValue',
                // },
                value: String,
                quantity: Number,
                price: Number
            }
        ]
        // values: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'OptionValue',
        //     }
        // ]
    }],
    characteristics: [
        {
            characteristic: String,
            text: String
        }
    ],
    // images: [
    //     {
    //         public_id: {
    //             type: String,
    //             required: true,
    //             default: 0
    //         },
    //         url: {
    //             type: String,
    //             required: true
    //         },
    //     }
    // ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select category for this product'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    // reviews: [
    //     {
    //         user: {
    //             type: mongoose.Schema.ObjectId,
    //             ref: 'User',
    //             required: true
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         rating: {
    //             type: Number,
    //             required: true
    //         },
    //         comment: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, {timestamps: true})

module.exports = model('Product', ProductModel)