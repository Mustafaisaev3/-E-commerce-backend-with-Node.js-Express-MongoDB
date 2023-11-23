const { Schema, model } = require('mongoose')
const validator = require('validator')

const UserMessageModel = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    message: {
        type: String,
        required: [true, 'Please enter your email'],
    },

})  

module.exports = model('UserMessage', UserMessageModel)