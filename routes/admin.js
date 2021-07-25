const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  dirname
} = require('path');

require('dotenv/config');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

const Products = require('../models/Products');
const User = require('../models/User');
const Email = require('../models/Email');
const Orders = require('../models/Orders');
const Contactmessage = require('../models/contact-message');

router.get('/:id/home', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/home', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/mailbox', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/email-view', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/registerprod', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/registerProduct', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/showproducts', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/products-view', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/:category/showproducts', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  const filteredproducts = await Products.find({
    category: req.params.category
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find({});
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/category', {
        user,
        products,
        allUsers,
        filteredproducts,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/showadmins', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find({
        isAdmin: true
      });
      res.render('user/admin/users', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/showusers', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if (user.isAdmin) {
    try {
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/users', {
        user,
        allUsers,
        products,
        email,
        cmess
      });
    } catch {
      res.render('error');
    }

  }
});
router.get('/:id/:productId/delete', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    await Products.deleteOne({
      _id: req.params.productId
    }, function (err, results) {
      if (err) {
        console.log("failed");
        throw err;
      }
      console.log("success");
    });
    return res.redirect(req.get('referer'));
  }
});
router.post('/:id/registerprod', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user.isAdmin) {
    try {
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
          res.redirect(req.get('referer'));
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
              res.redirect(req.get('referer'));
            })
            .catch(err => console.log(err));
        }
      });
    } catch {
      res.render('error');
    }
  }
});
router.get('/editUser/:id/:secondId', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    const products = await Products.find({});
    const email = await Email.find();
    const cmess = await Contactmessage.find();
    const allUsers = await User.find();
    const editingUser = await User.findById(req.params.secondId);
    try {
      res.render('user/admin/category', {
        user,
        products,
        allUsers,
        filteredproducts,
        email,
        cmess,
        editingUser
      });
    } catch {
      res.render('error');
    }
  }
});
router.get('/:id/:secondId/editProduct', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    const editProduct = await Products.findById(req.params.secondId);
  }
});

router.get('/:id/orders', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    try {
      const orders = await Orders.find();
      const products = await Products.find();
      const email = await Email.find();
      const cmess = await Contactmessage.find();
      const allUsers = await User.find();
      res.render('user/admin/orders', {
        orders,
        products,
        email,
        cmess,
        allUsers,
        user
      });
    } catch {
      res.render('error');
    }


  }
});
router.get('/order/delete/:id/:secondId', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    await Orders.deleteOne({
      _id: req.params.secondId
    }, function (err, results) {
      if (err) {
        console.log("failed");
        throw err;
      }
      console.log("success");
    });
    return res.redirect(req.get('referer'));
  }
});
router.get('/email/delete/:id/:secondId', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    await Contactmessage.deleteOne({
      _id: req.params.secondId
    }, function (err, results) {
      if (err) {
        console.log("failed");
        throw err;
      }
      console.log("success");
    });
    return res.redirect(req.get('referer'));
  }
});
router.get('/delete/users/:id/:secondId', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.isAdmin) {
    await User.deleteOne({
      _id: req.params.secondId
    }, function (err, results) {
      if (err) {
        console.log("failed");
        throw err;
      }
      console.log("success");
    });
    return res.redirect(req.get('referer'));
  }
});
module.exports = router;