const { model, Schema } = require('mongoose')
 
const CategorySchema = new Schema({
    name: {
        require: true,
        type: String
    },
    // price: Boolean,
    // photos_num: Number,
    // image: String,
    image: Array,
    // color: String,
    // options: [{type: Schema.Types.ObjectId, ref: 'Option'}],
    parent: {type: Schema.Types.ObjectId, ref: 'Category'},
    children: [{type: Schema.Types.ObjectId, ref: 'Category'}],
}, {timestamps: true})

module.exports = model('Category', CategorySchema)