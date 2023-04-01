const { model, Schema } = require('mongoose')
 
const CategorySchema = new Schema({
    name: {
        require: true,
        type: String
    },
    title: {
        require: true,
        type: String
    },
    // price: Boolean,
    // photos_num: Number,
    // image:  {type: Schema.Types.ObjectId, ref: 'Image', require: false},
    image:  String,
    // color: String,
    // options: [{type: Schema.Types.ObjectId, ref: 'Option'}],
    parent: {type: Schema.Types.ObjectId, ref: 'Category', require: false},
    children: [{type: Schema.Types.ObjectId, ref: 'Category', require: false}],
}, {timestamps: true})

module.exports = model('Category', CategorySchema)