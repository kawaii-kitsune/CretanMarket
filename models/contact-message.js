const {
    json
} = require('body-parser');
const mongoose = require('mongoose');

const ContactmessageSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }

});

const Contactmessage = mongoose.model('Contact-message', ContactmessageSchema);

module.exports = Contactmessage;