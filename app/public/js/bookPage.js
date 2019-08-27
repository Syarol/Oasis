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

import contactModal from './contactModal.js'; 

/**
 * Global variables
*/

var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];
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

	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

