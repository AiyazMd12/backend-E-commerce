const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        required: false 
    },
    userId: {
        type: String,
        required: false
    },
    customer: {
        name: { 
            type: String, 
            required: false 
        },
        email: { 
            type: String, 
            required: false 
        },
        phone: { 
            type: String, 
            required: false 
        },
    },
    date: { 
        type: Date, 
        required: false 
    },
    total: { 
        type: Number, 
        required: false 
    },
    status: {
      type: String,
      enum: ["pending", "placed", "processing", "shipped", "delivered", "cancelled"],
      required: false,
    },
    payment: {
        method: { 
            type: String, 
            required: false
        },
        details: { 
            type: String, 
            required: false
        },
        status: {
            type: String,
            enum: ["paid", "pending"],
            required: false,
        },
    },
    shipping: {
        name: { 
            type: String, 
            required: false 
        },
        addressLine1: { 
            type: String, 
            required: false 
        },
        addressLine2: { 
            type: String,
            required: false
        },
        city: { 
            type: String, 
            required: false 
        },
        state: { 
            type: String, 
            required: false 
        },
        zip: { 
            type: String, 
            required: false 
        },
        country: { 
            type: String, 
            required: false 
        },
    },
    billing: {
        name: { 
            type: String, 
            required: false 
        },
        addressLine1: { 
            type: String, 
            required: false 
        },
        addressLine2: { 
            type: String,
            required: false
        },
        city: { 
            type: String, 
            required: false 
        },
        state: { 
            type: String, 
            required: false 
        },
        zip: { 
            type: String, 
            required: false 
        },
        country: { 
            type: String, 
            required: false 
        },
    },
    items: [
        {
            productId: { 
                type: String, 
                required: false 
            },
            title: { 
                type: String, 
                required: false 
            },
            size: { 
                type: String, 
                required: false 
            },
            price: { 
                type: Number, 
                required: false 
            },
            quantity: { 
                type: Number, 
                required: false 
            },
            imageUrl: { 
                type: String, 
                required: false 
            },
        },
    ],
    summary: {
        subtotal: { 
            type: Number, 
            required: false 
        },
        shipping: { 
            type: Number, 
            required: false 
        },
        tax: { 
            type: Number, 
            required: false 
        },
        total: { 
            type: Number, 
            required: false 
        },
    },
    timeline: [
        {
            status: { 
                type: String, 
                required: false 
            },
            date: { 
                type: Date, 
                required: false 
            },
            note: { 
                type: String,
                required: false
            },
        },
    ],
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
  },
  { timestamps: false }
);


module.exports = mongoose.model('order', orderSchema);