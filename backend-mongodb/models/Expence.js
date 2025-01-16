const mongoose = require('mongoose');
const Expence = mongoose.model('Expence', {
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
    },
    date: {
        type: Date,
        default : new Date()
    },
  });



  
module.exports = Expence;

