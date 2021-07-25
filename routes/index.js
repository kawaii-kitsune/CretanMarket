const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
//models
const Products = require('../models/Products');
const Cart = require('../models/Cart');
const Email = require('../models/Email');
const Contactmessage = require('../models/contact-message');
const Order = require('../models/Orders');


var transport = nodemailer.createTransport({
  host: process.env.SMTPHOST,
  port: 2525,
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPASS
  }
});


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
router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(productId, function (err, product) {
    if (err) {
      return res.redirect(req.get('referer'));
    }

    req.session.cart = cart.add(product, product.id);
    console.log(req.session.cart)
    res.redirect(req.get('shop/cart'));
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.reduceByOne(productId);
  res.redirect('/cart-view');
});
router.get('/remove-from-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.deleteFromCart(productId);
  res.redirect('/cart-view');
});
router.get('/delivery', (req, res) => {

  res.render('footerRed/delivery', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/termsAndConds', (req, res) => {

  res.render('footerRed/tmc', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/policy', (req, res) => {

  res.render('footerRed/policy', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/security', (req, res) => {

  res.render('footerRed/security', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/franchise', (req, res) => {

  res.render('footerRed/franchise', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/respo', (req, res) => {

  res.render('footerRed/respo', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });

});
router.get('/cmarket', (req, res) => {

  res.render('footerRed/cmarket', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),

  });

});
router.get('/client-support', function (req, res) {

  res.render('contactUs', {
    cart: new Cart(req.session.cart ? req.session.cart : {})
  });
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
router.get('/checkout', async (req, res) => {
  try {

    const products = await Products.find();
    res.render('shop/checkout', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch {

    res.render('error');
  }
});
router.get('/sales/:page/:limit', async (req, res, next) => {
  try {
    var sorting = 0;
    var page = req.params.page;
    var category = 'sales';
    var limit = req.params.limit;
    const products = await Products.find({
      sale: {
        $gte: 1
      }
    });
    res.render('shop/products', {
      sorting,
      limit,
      category,
      page,
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:category/:page/:limit', async (req, res, next) => {
  try {
    var sorting = 0;
    var page = req.params.page;
    var category = req.params.category;
    var limit = req.params.limit;
    const products = await Products.find({
      category: category
    }).limit(limit * 1).skip((page - 1) * limit);
    res.render('shop/products', {
      sorting,
      limit,
      category,
      page,
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:category/:page/:limit/price/:sorting', async (req, res, next) => {
  try {

    var sorting = req.params.sorting;
    var category = req.params.category;
    var page = req.params.page;
    var limit = req.params.limit;
    if (sorting == 'asc') {
      const products = await Products.find({
        category: category
      }).limit(limit * 1).skip((page - 1) * limit).sort({
        price: 1
      });
      res.render('shop/products', {
        limit,
        sorting,
        category,
        page,
        cart: new Cart(req.session.cart ? req.session.cart : {}),
        products
      });
    }
    else if (sorting == 'desc') {
      console.log('ENTERED DESC')
      const products = await Products.find({
        category: category
      }).limit(limit * 1).skip((page - 1) * limit).sort({
        price: -1
      });
      res.render('shop/products', {
        limit,
        sorting,
        category,
        page,
        cart: new Cart(req.session.cart ? req.session.cart : {}),
        products
      });
    }

  } catch (error) {
    res.send({
      message: req.error
    });
  }
});
router.get('/:category/:page/:limit/:sorting', async (req, res, next) => {
  try {

    var sorting = req.params.sorting;
    var category = req.params.category;
    var page = req.params.page;
    var limit = req.params.limit;
    if (sorting == 'asc') {
      const products = await Products.find({
        category: category
      }).limit(limit * 1).skip((page - 1) * limit).sort({
        price: 1
      });
      res.render('shop/products', {
        limit,
        sorting,
        category,
        page,
        cart: new Cart(req.session.cart ? req.session.cart : {}),
        products
      });
    }
    else if (sorting == 'desc') {
      console.log('ENTERED DESC')
      const products = await Products.find({
        category: category
      }).limit(limit * 1).skip((page - 1) * limit).sort({
        price: -1
      });
      res.render('shop/products', {
        limit,
        sorting,
        category,
        page,
        cart: new Cart(req.session.cart ? req.session.cart : {}),
        products
      });
    }

  } catch (error) {
    res.send({
      message: req.error
    });
  }
});


router.get('/:category/:productId', async (req, res) => {

  try {

    const product = await Products.findOne({
      _id: req.params.productId
    });
    const category = req.params.category;
    res.render('shop/productDetails', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      product,
      category
    })
  } catch {

    res.render('error');
  }
});
router.post('/newsletter', (req, res, next) => {
  var errors = []
  const {
    email
  } = req.body;
  Email.findOne({
    email: email
  }).then(email => {
    if (email) {
      errors.push({
        msg: 'Email already exists'
      });
      res.render('emailSub', {
        cart: new Cart(req.session.cart ? req.session.cart : {}),
        errors
      });
    } else {
      newemail = new Email(req.body);
      console.log(newemail);
      newemail.save(function (err, doc) {
        if (err) return console.error(err);
        res.render('emailSub', {
          cart: new Cart(req.session.cart ? req.session.cart : {})
        });
      });
    }
  });


});
router.post('/client-support', (req, res, next) => {
  const {
    FirstName,
    LastName,
    email,
    message
  } = req.body;
  newemail = new Contactmessage(req.body);
  newemail.save(function (err, doc) {
    if (err) return console.error(err);
    res.render('contactUs', {
      message: 'Ευχαριστούμε που μοιραστήκατε μαζί μας την γνώμη σας',
      cart: new Cart(req.session.cart ? req.session.cart : {})
    });
  });
});
router.post('/checkout', async (req, res, next) => {
  var cart = new Cart(req.session.cart);
  const {
    name,
    surname,
    address,
    address2,
    email,
    citystate,
    zip,
    country
  } = req.body;

  const message = {
    from: 'noreply@cretanmarket.com', // Sender address
    to: email, // List of recipients
    subject: 'Η αγορά σας έγινε με επιτυχία', // Subject line
    text: 'Eυχαριστούμε' + name + '. Η παραγγελία σας για' + address + ',' + citystate + ',' + zip + ',' + country +
      'καταχωρήθηκε στο σύστημα ' // Plain text body
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      newOrder = new Order(req.body);
      newOrder.save(function (err, doc) {
        if (err) return console.error(err);
        req.session.cart = cart.clearCart()
        res.render('thankyou', {
          message: 'Η αγορά σας έγινε με επιτυχία!',
          cart: new Cart(req.session.cart ? req.session.cart : {}),
        });
      });
    }
  });
});


module.exports = router;