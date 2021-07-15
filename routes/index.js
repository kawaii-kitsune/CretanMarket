const express = require('express');
const router = express.Router();

const passport = require('passport');
const Products = require('../models/Products');
const Cart = require('../models/Cart');
router.get('/', async (req, res, next) => {

  try {
    const products = await Products.find({
      sale: {
        $gte: 1
      }
    });
    res.render('dashboard', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),

      products
    })

  } catch (err) {
    res.send({
      message: err
    });
  }

});

router.get('/cart-view', async (req, res) => {
  try {
    const products = await Products.find();
    res.render('shop/cart', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch {

    res.render('error');
  }
});
router.get('/pets', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Για κατοικίδια"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })

  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/fruits', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Οπωροπωλείο"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/meatandfish', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Φρέσκο Κρέας & Ψάρια"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/galaktokomika', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Γαλακτοκομικά"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/olagiatospiti', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Όλα για το σπίτι"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/sanitize', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Αντισυπτική Προστασία"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/personalHygiene', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Είση Προσωπικής Περιποίησης"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/cleaning', async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Καθαριστικά"
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});

router.get('/sales', async (req, res, next) => {
  try {
    const products = await Products.find({
      sale: {
        $gte: 1
      }
    });
    res.render('shop/products', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:productId', async (req, res) => {

  try {

    const product = await Products.findOne({
      _id: req.params.productId
    });
    res.render('shop/productDetails', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      product
    })
  } catch {

    res.render('error');
  }
});
router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(productId, function (err, product) {
    if (err) {
      return res.redirect(req.get('referer'));
    }

    req.session.cart = cart.add(product, product.id);
    console.log(req.session.cart)
    res.redirect(req.get('referer'));
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.reduceByOne(productId);
  res.redirect(req.get('/cart-view'));
});
router.get('/remove-from-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.deleteFromCart(productId);
  res.redirect(req.get('/cart-view'));
});
module.exports = router;