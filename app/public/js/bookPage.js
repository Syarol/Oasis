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
var openCart = document.getElementsByClassName('header-cart-container')[0];
var cart;

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
	cart = new Cart(openCart);
	
	let addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];
	console.log(addToCartButton.title);
	ServerInteract.getDataByTitle(addToCartButton.title).then(
		function(res){
			console.log(res);
			addToCartButton.onclick = () => cart.add(res);
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

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteract.sendMessage(document.getElementsByClassName('cu-form')[0]);

