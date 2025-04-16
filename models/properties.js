const mongoose = require('mongoose');

const propertiesSchema = new mongoose.Schema({
    propKey: {
        type: String,
        required: false
    },
    propValue: {
        type: String,
        required: false
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
});


module.exports = mongoose.model('properties', propertiesSchema)