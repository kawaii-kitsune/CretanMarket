const {
  json
} = require('body-parser');
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', UsersSchema);

module.exports = User;