/**
 * Oasis bookstore site
 *
 * Main page
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
import RenderElements from './RenderElements.js';

/**
 * Global variables
*/

var arrivalCarouselSection = document.getElementsByClassName('cr-arrivals-section')[0];
var contactModal = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactModalLink = document.getElementsByClassName('footer-contact')[0];
var closeContactModal = document.getElementsByClassName('cu-modal-close')[0];
var bestsellerModalWrapper = document.getElementById('book-modal-wrapper');
var goodsInCart = [];
var openCart = document.getElementsByClassName('header-cart-container')[0];
var cart;
var ServerInteraction;

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('ARRIVALS', arrivalCarouselSection, Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('BESTSELLER', [document.getElementById('bestseller-container'), document.getElementById('book-modal-container')], Render.bestseller, cart);
	ServerInteraction.getSpecialMarked('EXCLUSIVE', document.getElementById('exclusives_container'), Render.exclusiveBooks, cart);

	ServerInteraction.getList('categories', document.getElementById('category-select'), Render.categoriesList);

	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
});

bestsellerModalWrapper.getElementsByClassName('close-modal')[0].onclick = () => bestsellerModalWrapper.style.display = 'none';

document.onclick = function(e) {
	if (e.target == bestsellerModalWrapper) {
		bestsellerModalWrapper.style.display = 'none';
	}

	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementsByClassName('cu-form-send-button')[0].onclick = () => ServerInteraction.sendMessage(document.getElementsByClassName('cu-form')[0]);
