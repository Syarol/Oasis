/**
 * Oasis bookstore site
 *
 * Shop page
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import Cart from './cart.js';
import GoogleMap from './googleMap.js'; //for connecting and loading map of shop location
import ServerInteract from './ServerInteraction.js'; //for swap data between server and client
import RenderElements from './RenderElements.js'; //for render DOM elements

/**
 * Global variables
*/

var contactModal = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactModalLink = document.getElementsByClassName('footer-contact')[0];
var closeContactModal = document.getElementsByClassName('cu-modal-close')[0];
var openCart = document.getElementsByClassName('header-cart-wrapper')[0];

/**
 * Event Listeners
*/
 
document.addEventListener('DOMContentLoaded', () => {
	let cart = new Cart(openCart, document.getElementsByClassName('header-cart-count')[0]);
	let Render = new RenderElements(); 

	ServerInteract
		.getSpecialMarked('RECOMMEND', Render.carouselItems, {
			parent: document.getElementsByClassName('cr-recommends-section')[0], 
			cart: cart
		})
		.getSpecialMarked('BESTSELLERS', Render.carouselItems, {
			parent: document.getElementsByClassName('cr-bestsellers-section')[0], 
			cart: cart
		})
		.getSpecialMarked('ARRIVALS', Render.carouselItems, {
			parent: document.getElementsByClassName('cr-arrivals-section')[0], 
			cart: cart
		});

	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
});

document.getElementsByClassName('sb-all-link')[0].onclick = () => {
	window.location.href = '/search?query=&searchType=search-full';
};

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteract.sendMessage(document.getElementsByClassName('cu-form')[0]);
