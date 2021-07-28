const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('dotenv/config');
const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  host: process.env.SMTPHOST,
  port: 2525,
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPASS
  }
});
// Load User model
const User = require('../models/User');
const Products = require('../models/Products');
const Cart = require('../models/Cart');
const Email = require('../models/Email');
const Contactmessage = require('../models/contact-message');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

router.post('/:id/client-support', ensureAuthenticated, (req, res, next) => {
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
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      user: req.user
    });
  });
});
router.post('/:id/checkout', ensureAuthenticated, async (req, res, next) => {
  var cart = new Cart(req.session.cart);
  const {
    username,
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
          user: req.user
        });
      });
    }
  });
});
router.post('/client-support', ensureAuthenticated, async (req, res, next) => {
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
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      user: req.user
    });
  });
});
// Register
router.post('/register', (req, res, next) => {
  const {
    name,
    surname,
    username,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('user/connect', {
      errors,
      name,
      surname,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
        res.render('user/connect', {
          cart: new Cart(req.session.cart ? req.session.cart : {}),
          errors,
          name,
          surname,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          username,
          surname,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                errors.push({
                  msg: 'You are now registered and can log in'
                })
                res.render('user/connect', {
                  cart: new Cart(req.session.cart ? req.session.cart : {}),
                  errors
                });
              })
              .catch(err => res.send(err));
          });
        });
      }
    });
  }
});
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/register',
    failureFlash: true
  })(req, res, next);
});
// Register Page
router.get('/register', forwardAuthenticated, (req, res, next) => res.render('user/connect', {
  errors: [],
  cart: new Cart(req.session.cart ? req.session.cart : {})
}));
// Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, async (req, res, next) => {
  const products = await Products.find();
  res.render('user/home', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    products,
    user: req.user
  })
});
router.get('/reduce/:uid/:id', ensureAuthenticated, function (req, res, next) {
  var userid = req.params.uid
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.reduceByOne(productId);
  res.redirect('/user/' + userid + '/cart-view');
});
router.get('/remove-from-cart/:uid/:id', ensureAuthenticated, function (req, res, next) {
  var userid = req.params.uid
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  req.session.cart = cart.deleteFromCart(productId);
  res.redirect('/user/' + userid + '/cart-view');
});
router.get('/cart-view/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id
    });
    const products = await Products.find();
    res.render('shop/cart', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products,
      user: req.user
    });
  } catch {
    res.render('error');
  }
});
router.get('/:id/checkout', ensureAuthenticated, async (req, res, next) => {
  try {

    const products = await Products.find();
    res.render('shop/checkout', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products,
      user: req.user
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
      products,
      user:req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:category/:page/:limit', ensureAuthenticated, async (req, res, next) => {
  try {
    var page = req.params.page;
    var category = req.params.category;
    var sorting = 0;
    var limit = req.params.limit;
    const products = await Products.find({
      category: category
    }).limit(limit * 1).skip((page - 1) * limit);
    res.render('shop/products', {
      limit,
      sorting,
      category,
      page,
      user: req.user,
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      products
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:category/:page/:limit/price/:sorting', ensureAuthenticated, async (req, res, next) => {
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
        products,
        user: req.user
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
router.get('/:category/:page/:limit/:sorting', ensureAuthenticated, async (req, res, next) => {
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
        products,
        user: req.user
      });
    }
    else if (sorting == 'desc') {

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

router.get('/:category/:productId', ensureAuthenticated, async (req, res, next) => {

  try {
    const category = req.params.category;
    const product = await Products.findOne({
      _id: req.params.productId
    });
    res.render('shop/productDetails', {
      cart: new Cart(req.session.cart ? req.session.cart : {}),
      product,
      category,
      user: req.user
    })
  } catch (err) {

    res.send({
      message: err
    });
  }
});
router.get('/client-support', ensureAuthenticated, function (req, res, next) {

  res.render('contactUs', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });
});

router.get('/delivery', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/delivery', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/termsAndConds', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/tmc', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/policy', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/policy', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/security', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/security', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/franchise', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/franchise', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/respo', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/respo', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
router.get('/cmarket', ensureAuthenticated, async (req, res, next) => {

  res.render('footerRed/cmarket', {
    cart: new Cart(req.session.cart ? req.session.cart : {}),
    user: req.user
  });

});
module.exports = router;