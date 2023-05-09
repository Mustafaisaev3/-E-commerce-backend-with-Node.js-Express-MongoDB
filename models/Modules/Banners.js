const { model, Schema, ObjectId } = require('mongoose')

const BannerSchema = new Schema({
    title: String,
    link: String,
    items: [
        {   
            title: String, 
            subtitle: String, 
            link: String, 
            image: String,
        }
    ]

}, {timestamps: true})

module.exports = model('Banner', BannerSchema)

