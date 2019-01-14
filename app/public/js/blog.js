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

var contactModal = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactModalLink = document.getElementsByClassName('footer-contact')[0];
var closeContactModal = document.getElementsByClassName('cu-modal-close')[0];
var openCart = document.getElementsByClassName('header-cart-container')[0];
var ServerInteraction;

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	new Cart(openCart);
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
	
	ServerInteraction = new ServerInteract();
});

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}
}; 

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteraction.sendMessage(document.getElementsByClassName('cu-form')[0]);
