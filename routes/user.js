const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('dotenv/config');
// Load User model
const User = require('../models/User');
const Products = require('../models/Products');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
//change Things

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('user/connect'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('user/connect'));

// Register
router.post('/register', (req, res) => {
  const {
    name,
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
    res.render('register', {
      errors,
      name,
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
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
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
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/user/login');
              })
              .catch(err => console.log(err));
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
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});




router.get('/profile', ensureAuthenticated, async (req, res, next) => {
  const products = await Products.find();
  res.render('dashboard', {
    products,
    user: req.user
  })
});
router.get('/pets', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Για κατοικίδια"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })

  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/fruits', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Οπωροπωλείο"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/meatandfish', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Φρέσκο Κρέας & Ψάρια"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/galaktokomika', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Γαλακτοκομικά"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/olagiatospiti', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Όλα για το σπίτι"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/sanitize', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Αντισυπτική Προστασία"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/personalHygiene', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Είση Προσωπικής Περιποίησης"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/cleaning', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      category: "Καθαριστικά"
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});

router.get('/sales', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await Products.find({
      sale: {
        $gte: 1
      }
    });
    res.render('shop/products', {
      products,
      user: req.user
    })
  } catch (err) {
    res.send({
      message: err
    });
  }
});
router.get('/:productId', ensureAuthenticated, async (req, res) => {

  try {

    const product = await Products.findOne({
      _id: req.params.productId
    });
    res.render('shop/productDetails', {
      product,
      user: req.user
    })
  } catch {

    res.send("error");
  }
});
module.exports = router;