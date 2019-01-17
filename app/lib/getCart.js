const express	  = require('express');
const session	  = require('express-session');

const app = express();
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

function getCart(req, res){
  if (!req.session.booksInCart){
  	req.session.booksInCart = [];
  } 
  res.send(JSON.stringify(req.session.booksInCart));
}

module.exports = getCart; 