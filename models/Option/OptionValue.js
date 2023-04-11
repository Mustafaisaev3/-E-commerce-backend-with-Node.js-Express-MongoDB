const { Schema, model } = require('mongoose')

const OptionValueShema = new Schema({
    value: {
        require: true,
        type: String
    },
    image: {type: String, required: false},
})

module.exports = model('OptionValue', OptionValueShema)