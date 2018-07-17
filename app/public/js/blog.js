/**
 * Oasis bookstore site
 *
 * Blog page
 *
 * @Author Oleh Yaroshchuk 
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

var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var readMoreModal = document.getElementById('read_more_modal');
var openCart = document.getElementById('cart_open');
var serverInteraction;

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	serverInteraction = new ServerInteract();

	new Cart(openCart, goodsInCart);

	for (let item of document.getElementsByClassName('button-read-more')){
		item.onclick = () => readMoreModal.style.display = 'flex';
	}

	new GoogleMap();//connect and load map of shop location
});

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == readMoreModal) {
    	readMoreModal.style.display = 'none';
	}
}; 

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

var closeReadMoreModal = document.getElementById('close_read_more_modal');

closeReadMoreModal.onclick = () => readMoreModal.style.display = 'none';

document.getElementById('send_message').onclick = () => serverInteraction.sendMessage(document.getElementById('contact-form'));

/**
 * Export
*/

export {goodsInCart};