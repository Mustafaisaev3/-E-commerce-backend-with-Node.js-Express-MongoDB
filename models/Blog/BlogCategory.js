const { model, Schema, ObjectId } = require('mongoose')

const BlogCategorySchema = new Schema({
    title: {
        require: true,
        type: String
    },
    name: {
        require: true,
        type: String
    }
}, { timestamps: true })

module.exports = model('BlogCategory', BlogCategorySchema)