const mongoose = require('mongoose');

const Occasion = mongoose.model("Occasion", {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = Occasion;