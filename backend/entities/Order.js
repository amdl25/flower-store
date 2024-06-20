const mongoose = require('mongoose');

const Order = mongoose.model("Order", {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: function() {
            return this.deliveryMethod === 'livrare';
        }
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    deliveryMethod: {
        type: String,
        required: true,
        enum: ['livrare', 'ridicare personala']
    },
    paymentMethod: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            time: {
                type: String,
                required: true
            },
            greetingMessage: {
                type: String
            },
            selectedOptions: {
                type: Object
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Order;
