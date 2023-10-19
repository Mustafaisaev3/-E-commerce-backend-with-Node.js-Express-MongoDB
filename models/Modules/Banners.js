const { model, Schema, ObjectId } = require('mongoose')

const BannerSchema = new Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    link: {
        require: false,
        type: String
    },
    items: [
        {   
            title: String, 
            subtitle: String, 
            link: String, 
            image: String,
        }
    ],
    type: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})

module.exports = model('Banner', BannerSchema)

