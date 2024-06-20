const mongoose = require('mongoose');

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: false
    },
    productQuantity: {
        type: Number,
        required: true
    },
    flowers: [
        { 
            flower: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    occasions: [
        {
            type: Number,
            required: true
        }
    ],
    isSurprise: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
});

module.exports = Product;