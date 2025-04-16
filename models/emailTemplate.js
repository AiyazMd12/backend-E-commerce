const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
});


module.exports = mongoose.model('emailTemplate', emailTemplateSchema)