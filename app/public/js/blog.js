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
import contactModal from './contactModal.js'; 

/**
 * Global variables
*/

var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];
var openCart = document.getElementsByClassName('header-cart-wrapper')[0];

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	new Cart(openCart, document.getElementsByClassName('header-cart-count')[0]);
	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
});