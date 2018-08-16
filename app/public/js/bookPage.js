/**
 * Oasis bookstore site
 *
 * Book page
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import Cart from './cart.js';
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';

/**
 * Global variables
*/

var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var contactModal = document.getElementById('contact-us-wrapper');
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

/**
 * Functions
*/



/**
 * Event Listeners
*/

for (let element of document.getElementsByClassName('input-number')){
	element.oninput = function(){
		if (this.type == 'number')
			this.value = this.value.replace(/\D/g, '');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();
	let addToCartButton = document.getElementsByClassName('add-to-cart-button')[0];
	ServerInteraction.getDataByTitle(addToCartButton.title).then(
		function(res){
			addToCartButton.onclick = () => cart.addToCartArray(res);
		},
		function(err){
			console.log(err);
		}
	);

	new GoogleMap();//connect and load map of shop location
}); 

document.onclick = function(e) {
	if (e.target == contactModal) 
		contactModal.style.display = 'none';
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));

