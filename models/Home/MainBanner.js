const { model, Schema, ObjectId } = require('mongoose')

const MainBannerSchema = new Schema({
    slides: [
        {
            title: String, 
            subtitle: String, 
            link: String, 
            image: String,
            status: {
                type: Boolean,
                default: true
            }
        },
    ],
    banners: [
        {
            title: String, 
            subtitle: String,   
            link: String, 
            image: String
        },
    ],


}, {timestamps: true})

module.exports = model('MainBanner', MainBannerSchema)

