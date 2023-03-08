const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect('mongodb://localhost:27017/ecommerce')
        .then(con => {
            console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
        })
}

module.exports = connectDatabase