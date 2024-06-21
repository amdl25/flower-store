const mongoose = require('mongoose');

const PromoCode = mongoose.model('PromoCode', {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: ['procent', 'sumă fixă'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    criteria: {
        type: String,
        required: true
    }
});

module.exports = PromoCode;
