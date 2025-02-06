const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Income', incomeSchema);