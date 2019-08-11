/**
  * Class
**/

class Cart {
	//get items inside cart from session
	getItems(req) {
		if (!req.session.inCart){
			req.session.inCart = [];
		}
		return req.session.inCart;
	}

	//set items inside cart at session
	setItems(req) {
		req.session.inCart = req.body;
	}

	//clean the contents of cart
	clear(req) {
		req.session.inCart = [];
	}

	//checks if some lying in cart 
	isEmpty(req) {
		if (req.session.inCart.length === 0) {
			return true;
		} else return false;
	}
}

/**
  * Export
**/

module.exports = Cart; 