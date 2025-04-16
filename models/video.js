const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    filter: {
        type: String,
        required: false
    },
    videoUrl: {
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

  

module.exports = mongoose.model('video', videoSchema)