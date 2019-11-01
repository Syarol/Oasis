'use strict';

const {port} = require('./lib/config.js');
const express	  = require('express');
const path   	  = require('path');
const cart = new (require('./lib/cart'))();
const Message = require('./lib/Message');
const User = require('./lib/User');
const bodyParser  = require('body-parser');
const Catalog = require('./lib/Catalog');
const router = require('./routes/index');
const app = express();
const session = require('./lib/session.js');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname));
app.use(session);
app.use(router);
app.use(bodyParser.json());

app.post('/getSearchResults', function(req, res){
  console.log(req.body);
	Catalog.search(req.body, res);
});

app.post('/getCart', function(req, res) {
  res.send(cart.getItems(req));
});

app.post('/setCart', function(req, res) {
  cart.setItems(req, res);
  res.send();
});

app.post('/sendMessage', function(req, res) {
  Message.send(req.body)
    .then(() => res.send());
});


app.get('/getBySimpleColumn', function(req, res) {
	Catalog.bySimpleColumn({[req.query.column]: req.query.value})
    .then(result => res.send(JSON.stringify(result)));
});

app.get('/getCategories', function(req, res){
  Catalog.getAllCategories()
    .then(data => res.send(data));
});

app.get('/getAuthors', function(req, res){
  Catalog.getAllAuthors()
    .then(data => res.send(data));
});

app.get('/getCategories', function(req, res){
  Catalog.getAllCategories()
    .then(data => res.send(data));
});

app.get('/getPublishers', function(req, res){
	Catalog.getAllPublishers()
    .then(data => res.send(data));
});

app.get('/getLowHighPrice', function(req, res){
  Catalog.getlowHighPrice(res);
});

/* User profile interaction */

app.post('/regNewUser', function(req, res){
  User.isUniqueUsed('email', req.body.email)
    .then(() => User.register(req.body));
});

app.post('/logInUser', function(req, res){
  User.logIn(req.headers.authorization)
    .then(user => {
      if (user) {
        req.session.user = user;
        res.send(JSON.stringify({isAuth: true}));
      } else res.send(JSON.stringify({isAuth: false}));
    });
});

app.post('/isThisUser', function(req, res){
  User.isThisUser(req.session.user, req.body)
    .then(isOK => {
      res.send(JSON.stringify({isOK: isOK}));
    });
});

app.get('/deleteAccount', function(req, res){
  User.delete(req.session.user)
    .then(isOK => {
      res.send(JSON.stringify({isOK: isOK}));
    });
});

app.post('/checkAndDelete', function(req, res){
  User.isCurrent(req.session.user, req.body)
    .then(isOK => {
      if (isOK) {
        User.delete(req.session.user)
          .then(isDeleted => {
            if (isDeleted){
              req.session.destroy(); //clears session and opens login/register pages
              res.send(JSON.stringify({
                error: false,
                message: 'Account successfully deleted!'
              }));
            } else{
              res.send(JSON.stringofy({
                error: true,
                message: 'Something went wrong. Try again later!'
              }));
            }
          })
      } else res.send(JSON.stringify({
        error: true,
        message: 'Password and/or email not matches!'
      }));
    });
});

app.post('/isUniqueUsed', function(req, res){
  let key = Object.keys(req.body)[0]; //have to be passed onlu one key-value pair
  User.isUniqueUsed(key, req.body[key], req.session.user)
    .then(data => res.send(JSON.stringify({isUsed: data})));
});

app.get('/logout', function(req, res){
  User.logOut(req);
});

app.get('/getUserData', function(req, res){
  User.getAllData(req.session.user)
    .then(data => res.send(JSON.stringify(data)));
});

app.post('/changePassword', function(req, res){
  User.changePassword(req, req.body)
    .then(isOK => res.send(JSON.stringify({status: isOK})));
});

app.post('/updateUserData', function(req, res){
  User.updateData(req.session.user, req.body)
    .then(isOK => res.send(JSON.stringify({status: isOK})));
});

/**
 * Errors handling
**/

app.use(function(req, res, next){
  res.status(404);
  res.render('errorPage.pug', {
      root: path.join(__dirname + '/../app/views'),
      code: 404,
      description: 'Sorry, but page is not found 😥'
    });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('errorPage.pug', {
    root: path.join(__dirname + '/../app/views'),
    code: 500,
    description: 'Something broken!😥'
  });
});

/**
 * Binds and listens for connections on port
**/

app.listen(process.env.PORT || port);


