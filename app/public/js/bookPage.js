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

var contactModal = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactModalLink = document.getElementsByClassName('footer-contact')[0];
var closeContactModal = document.getElementsByClassName('cu-modal-close')[0];
var goodsInCart = [];
var openCart = document.getElementsByClassName('header-cart-container')[0];
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

	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

document.onclick = function(e) {
	if (e.target == contactModal) 
		contactModal.style.display = 'none';
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementsByClassName('cu-form')[0]);

