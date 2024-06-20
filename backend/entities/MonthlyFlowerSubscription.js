const mongoose = require('mongoose');

const MonthlyFlowerSubscription = new mongoose.model( "MonthlyFlowerSubscription", {
    id: {
        type: Number,
        required: true,
        unique: true
    },

    month: {
        type: String,
        required: true,
        unique: true
    },
    flowerName: {
        type: String,
        required: true
    },
    flowerImage: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = MonthlyFlowerSubscription