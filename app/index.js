const express	  = require('express');
const path   	  = require('path');
const session	  = require('express-session');
const getCart     = require('./lib/getCart');
const sendMessage = require('./lib/sendMessage');
const bodyParser  = require('body-parser');
const getCatalogItems = require('./lib/getCatalogItems'); 
const getItemData = require('./lib/getItemData');
var getCatalog = new getCatalogItems();

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

app.post('/getItemData', function(req, res) {
	getItemData(req, res);
});

app.get('/getCart', function(req, res) {
	getCart(req, res);
});

app.get('/getArrivalCarousel', function(req, res) {
	getCatalog.arrivals(req, res);
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

