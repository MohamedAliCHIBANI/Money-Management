const mongoose = require('mongoose');

// Define the schema for User
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'], // Example status values, modify as needed
        default: 'Active',
    },
    card: {
        cardType: {
            type: String,
            enum: ['Credit', 'Debit', 'Prepaid'], // Example card types, modify as needed
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
            match: /^[0-9]{16}$/, // Ensures a 16-digit number
        },
        expireDate: {
            type: String,
            required: true,
            match: /^(0[1-9]|1[0-2])\/[0-9]{2}$/, // Ensures format MM/YY
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'JPY','DNT'], // Example currencies, modify as needed
            required: true,
        },
    },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);
