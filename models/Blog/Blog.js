const { model, Schema, ObjectId } = require('mongoose')

const BlogSchema = new Schema({
    title: {
        require: true,
        type: String
    },
    description: {
        require: true,
        type: String
    },
    image: {
        require: false,
        type: String
    },
    category: {type: Schema.Types.ObjectId, ref: 'BlogCategory', require: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    numLikes: {
        type: Number,
        default: 0,
    },
    numDislikes: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
    }

}, {timestamps: true})

module.exports = model('Blog', BlogSchema)