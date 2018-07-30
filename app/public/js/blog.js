/**
 * Oasis bookstore site
 *
 * Blog page
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

var contactModal = document.getElementById('contact-us-wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
//var readMoreModal = document.getElementById('read_more_modal');
var openCart = document.getElementById('cart_open');
var ServerInteraction;

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();

	/*for (let item of document.getElementsByClassName('button-read-more')){
		item.onclick = () => readMoreModal.style.display = 'flex';
	}*/

	new GoogleMap();//connect and load map of shop location
});

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	/*if (e.target == readMoreModal) {
    	readMoreModal.style.display = 'none';
	}*/
}; 

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

//var closeReadMoreModal = document.getElementById('close_read_more_modal');

//closeReadMoreModal.onclick = () => readMoreModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));
