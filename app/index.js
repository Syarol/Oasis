const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const getCart     = require('./lib/getCart');
const sendMessage = require('./lib/sendMessage');
const bodyParser  = require('body-parser');
const getCatalogItems = require('./lib/getCatalogItems'); 
const getItemData = require('./lib/getItemData');
const searchInCatalog = require('./lib/searchInCatalog.js');
var getCatalog = new getCatalogItems();
var searchCatalog = new searchInCatalog();

const app = express();

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!');
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/blog', function(req, res){
  res.sendFile(path.join(__dirname + '/views/blog.html'));
});

app.get('/shop', function(req, res){
  res.sendFile(path.join(__dirname + '/views/shop.html'));
});

app.get('/search', function(req, res){
  	res.sendFile(path.join(__dirname + '/views/search.html'));
});

app.get('/getSearchResults', function(req, res){
	//searchCatalog.full(query, res);
});

app.post('/getItemData', function(req, res) {
	getItemData(req, res);
});

app.post('/getCart', function(req, res) {
	getCart(req, res);
});

app.get('/getSpecialMarked', function(req, res){
	console.log('53: ' + req.query.type);
	getCatalog.specialMarked(res, req.query.type);
});

app.get('/getCategoriesList', function(req, res) {
	getCatalog.categories(res);
});

app.post('/sameCart', function(req, res) {
	let data = req.body;
	req.session.booksInCart = data;
	res.send(JSON.stringify(data));
});

app.post('/sendMessage', function(req, res) {
	let message = req.body;
	res.send(sendMessage(message));
});

app.listen(3000);

