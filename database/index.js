'use strict';

/* Load dependencies */
const Mongoose = require('mongoose');

/* Connect to mongo database Promise */
const connectToMongo = async mongoURI => {
    try {
        await Mongoose.connect(mongoURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    } catch (err) {
        throw err;
    }
};

module.exports = connectToMongo;
