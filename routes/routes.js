var express = require('express');
var passport = require('passport');
var Product = require('../models/product');
var User = require('../models/user');
var Cart = require('../models/cart');

var router = express.Router();

router.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

router.get('/', function(req, res, next) {
  Product.find({})
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      res.render('index', { title: 'MiniCart', product_list: list_products })
    });
});

router.get('/signup', function (req, res) {
  res.render('signup', { title: 'User Account Signup'});
});

router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({username: username}, function (err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect('/signup');
    }

    var newUser = new User ({
      username: username,
      email: email,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/login', function (req, res) {
  res.render('login', {title: 'User Login'});
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('info', 'You must be logged in to see this page.');
    res.redirect('/login');
  }
}

router.get('/profile', ensureAuthenticated, function (req, res) {
  res.render('profile', {title: 'User Profile'});
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res) {
  if (!req.session.cart) {
    return res.render('shopping-cart', {products: []});
  }
  var cart = new Cart(req.session.cart);
  res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, count: 1});
});

router.get('/checkout', ensureAuthenticated, function (req, res) {
  res.render('checkout');
});

module.exports = router;