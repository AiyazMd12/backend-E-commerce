const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    subTitle: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    productId: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    productDetails: {
        brand: {
            type: String,
            required: false
        },
        brandFitName: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        pattern: {
            type: String,
            required: false
        },
        occasion: {
            type: String,
            required: false
        },
        packedBy: {
            type: String,
            required: false
        },
        marketedBy: {
            type: String,
            required: false
        },
    },
    category: {
        type: Array,
        required: false
    },
    inStock: {
        type: Boolean,
        required: false
    },
    availableStocks: {
        type: Number,
        required: false
    },
    displayImageUrl: {
        type: String,
        required: false
    },
    productImageUrls: {
        type: Array,
        required: false
    },
    availableSizes: {
        type: Array
    },
    suggestions: {
        type: Array,
        required: false
    },
    filter: {
        type: Array,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
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
  

module.exports = mongoose.model('product', productSchema)