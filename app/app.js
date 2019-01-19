'use strict';

const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const getCart     = require('./lib/getCart');
const sendMessage = require('./lib/sendMessage');
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
  secret: 'keyboard cat',
  resave: true,
  secure: true,
  HttpOnly: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  saveUninitialized: true
}));
app.use(bodyParser.json());

app.post('/getSearchResults', function(req, res){
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

app.get('/getBySimpleColumn', function(req, res) {
  console.log(req.query);
	searchInCatalog.bySimpleColumn({[req.query.column]: req.query.value}, res);
});

app.get('/getList', function(req, res){
	searchInCatalog.byColumn(req.query.column, res);
});

app.get('/getLowHighPrice', function(req, res){
  searchInCatalog.lowHighPrice(res);
});

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

app.listen(3000);


