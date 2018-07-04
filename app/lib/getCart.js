const express	  = require('express');
const session	  = require('express-session');

const app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

function getCart(req, res){
  	if (req.session.booksInCart){
  		let inCart = req.session.booksInCart;
  		console.log(inCart);
  		res.send(JSON.stringify(inCart));
  	} else {
  		req.session.booksInCart = [];
  		res.send(JSON.stringify([]));
  	}
}

module.exports = getCart; 