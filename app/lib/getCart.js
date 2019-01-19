//get items inside cart from session
function getCart(req, res){
	if (!req.session.booksInCart){
  	req.session.booksInCart = [];
	} 
	res.send(JSON.stringify(req.session.booksInCart));
}

//set items inside cart at session
function setCart(req, res, inCart){
	req.session.booksInCart = inCart;
	res.send(JSON.stringify(req.session.booksInCart));
}

module.exports = {
	get: getCart,
	set: setCart
}; 