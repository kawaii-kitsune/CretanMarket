const express = require('express');
const router = express.Router();
const {
  dirname
} = require('path');
require('dotenv/config');
const Products = require('../models/Products');
router.get('/', (req, res) => {
  res.render('adminDash')
});
router.get('/registerprod', (req, res) => {
  res.render('productData')
});
router.post('/registerprod', (req, res) => {
  const {
    title,
    brand,
    description,
    category,
    price,
    stock,
    date,
    sale,
    suggestions,
    allegations,
    image
  } = req.body;
  console.log(req.body)
  let errors = [];
  Products.findOne({
    title: title
  }).then(product => {
    if (product) {
      errors.push({
        msg: 'Name already exists'
      });
      res.render('productData', {
        title,
        brand,
        description,
        category,
        price,
        stock,
        date,
        sale,
        suggestions,
        allegations,
        image
      });
    } else {
      const newproduct = new Products({
        title,
        brand,
        description,
        category,
        price,
        stock,
        date,
        sale,
        suggestions,
        allegations,
        image
      });

      newproduct.save()
        .then(product => {
          console.log(
            'success_msg',
            'Your Product is now registered'
          );
          res.redirect('/pets');
        })
        .catch(err => console.log(err));
    }
  })
});
module.exports = router;