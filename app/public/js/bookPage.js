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
var openCart = document.getElementsByClassName('header-cart-wrapper')[0];

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
	};
}

document.addEventListener('DOMContentLoaded', () => {
	let cart = new Cart(openCart, document.getElementsByClassName('header-cart-count')[0]);
	
	let addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];

	ServerInteract.getDataById(addToCartButton.getAttribute('data-book-id'), (res) => {addToCartButton.onclick = () => cart.add(res);});

	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

document.onclick = function(e) {
	if (e.target == contactModal) 
		contactModal.style.display = 'none';
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteract.sendMessage(document.getElementsByClassName('cu-form')[0]);

