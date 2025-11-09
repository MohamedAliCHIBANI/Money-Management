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
        default : Date.now
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
  });



  
module.exports = Expence;

