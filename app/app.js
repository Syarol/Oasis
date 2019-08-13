'use strict';

const {port, secret} = require('./lib/config.js');
const {redisClient} = require('./lib/redis.js');
const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const RedisStore = require('connect-redis')(session);
const cart = new (require('./lib/cart'))();
const Message = require('./lib/Message');
//const User = require('./lib/User');
const bodyParser  = require('body-parser');
const searchInCatalog = new (require('./lib/searchInCatalog'))();
const router = require('./routes/index');
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname));
app.use(router);

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: secret,
  resave: false,
  secure: true,
  HttpOnly: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  saveUninitialized: false
}));
app.use(bodyParser.json());

app.post('/getSearchResults', function(req, res){
  console.log(req.body);
	searchInCatalog.full(req.body, res);
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

/*app.post('/regNewUser', function(req, res){
  User.checkEmailAvailability(req.body.email)
    .register(req.body);
  let userData = req.body;
  console.log(userData);
});

app.post('/logInUser', function(req, res){
  User.logIn(req.headers.authorization, (user) => {
    if (user[0]) {
      req.session.user = user[0];
      res.send({isAuth: true});
    } else res.send({isAuth: false});
  });
});

app.get('/logout', function(req, res){
  User.logOut(req);
});*/

app.get('/getBySimpleColumn', function(req, res) {
	searchInCatalog.bySimpleColumn({[req.query.column]: req.query.value}, res);
});

app.get('/getList', function(req, res){
	searchInCatalog.byColumn(req.query.column, res);
});

app.get('/getLowHighPrice', function(req, res){
  searchInCatalog.lowHighPrice(res);
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


