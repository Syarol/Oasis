'use strict';

const {port, redisUrl} = require('./lib/config.js');
const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const RedisStore = require('connect-redis')(session);
const getCart     = require('./lib/getCart');
const sendMessage = require('./lib/sendMessage');
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

/*Redis connection*/
const redis = require('redis');
const redisClient = redis.createClient(redisUrl); // this creates a new client

redisClient.on('connect', function() {
  console.log('Redis client connected');
});

redisClient.on('error', function (err) {
  console.log('Something went wrong: ' + err);
});


app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'keyboard cat',
  resave: false,
  secure: true,
  HttpOnly: true,
  //cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  saveUninitialized: false
}));
app.use(bodyParser.json());

app.post('/getSearchResults', function(req, res){
  console.log(req.body);
	searchInCatalog.full(req.body, res);
});

app.post('/getCart', function(req, res) {
  getCart.get(req, res);
});

app.post('/setCart', function(req, res) {
  getCart.set(req, res, req.body);
});

app.post('/sendMessage', function(req, res) {
  let message = req.body;
  res.send(sendMessage(message));
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
  res.render(path.join(__dirname + '/../app/views/errorPage.pug'), {
      code: 404,
      description: 'Sorry, but page is not found 😥'
    });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render(path.join(__dirname + '/../app/views/errorPage.pug'), {
    code: 500,
    description: 'Something broken!😥'
  });
});

app.listen(process.env.PORT || port);


