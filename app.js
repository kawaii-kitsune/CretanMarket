const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('./config/auth');
/* Import database connection */
const dbConnection = require('./database');

require('dotenv/config');

/* Create express app */
const app = express();
app.set('views', path.join(__dirname, 'views')); // Set views files path
app.set('view engine', 'ejs'); // Set view engine
app.use(express.json()); // Parse json middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

const mongoURI = process.env.MONGO_URI;
dbConnection(mongoURI)
  .then(() => console.info('\x1b[34m%s\x1b[0m', 'Connected to mongo server'))
  .catch(err => console.error('\x1b[31m%s\x1b[0m', err));

//passport require
require('./config/passport')(passport);

// Express body parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Connect flash
app.use(flash());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//ROUTES
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));
app.use('/admin', require('./routes/admin.js'));

app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', {
      url: req.url
    });
    return;
  }

});





const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on  ${PORT}`));