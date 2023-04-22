const { Schema, model } = require('mongoose')

const OptionShema = new Schema({
    title: {
        require: true,
        type: String
    },
    // optionValues: [{type: Schema.Types.ObjectId, ref: 'OptionValue', require: true}]
    values: [
        {
            value: {
                require: true,
                type: String
            },
            title: {
                require: true,
                type: String
            },
            image: {type: String, required: false},
        }
    ]
}, { timestamps: true })

module.exports = model('Option', OptionShema)