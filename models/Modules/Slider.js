const { model, Schema, ObjectId } = require('mongoose')

const SliderSchema = new Schema({
    name: {
        require: true,
        type: String
    },
    link: {
        require: false,
        type: String
    },
    items: [{type: Schema.Types.ObjectId, require: true}],
    status: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})

module.exports = model('Slider', SliderSchema)