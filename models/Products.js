const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  sale: {
    type: Number,
    default: false
  },
  suggestions: {
    type: String,
    required: true
  },
  allegations: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});
const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products;