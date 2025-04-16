const mongoose = require('mongoose');

const pinCodeSchema = new mongoose.Schema({
    pinCodes: {
        type: Array,
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

  

module.exports = mongoose.model('pinCode', pinCodeSchema)