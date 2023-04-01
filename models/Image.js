const {Schema, model} = require('mongoose')

const ImageSchema = new Schema({
    name: String,
    url: String,
    size: Number,
    cloudinary_id: String
}, {timestamps: true})

module.exports = model('Image', ImageSchema)