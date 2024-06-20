const mongoose = require('mongoose');

const Flower = mongoose.model("Flower", {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = Flower;