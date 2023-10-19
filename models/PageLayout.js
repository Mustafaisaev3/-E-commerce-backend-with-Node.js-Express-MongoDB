const { model, Schema, ObjectId } = require('mongoose')

const PageLayoutSchema = new Schema({
    name: {
        require: true,
        type: String
    },
    // left: [{type: Schema.Types.ObjectId, require: false}],
    // right: [{type: Schema.Types.ObjectId, require: false}],
    // top: [{type: Schema.Types.ObjectId, require: false}],
    // bottom: [{type: Schema.Types.ObjectId, require: false}],
    left: [{
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
        items: Array,
        type: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    right: [{
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
        items: Array,
        type: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    top: [{
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
        items: Array,
        type: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    }],
    bottom: [{
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
        items: Array,
        type: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    }],

}, {timestamps: true})

module.exports = model('PageLayout', PageLayoutSchema)
