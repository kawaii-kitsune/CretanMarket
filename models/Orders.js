const {
    json
} = require('body-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const session = require('express-session');
const path = require('path');

const OrdersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    citystate: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Greece'
    },
    address: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    // itemsPrice: {
    //     type: String,
    //     required: true
    // }
});

const Order = mongoose.model('Order', OrdersSchema);

module.exports = Order;