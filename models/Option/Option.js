const { Schema, model } = require('mongoose')

const OptionShema = new Schema({
    title: {
        require: true,
        type: String
    },
    optionValues: [{type: Schema.Types.ObjectId, ref: 'OptionValue', require: true}]
}, { timestamps: true })

module.exports = model('Option', OptionShema)