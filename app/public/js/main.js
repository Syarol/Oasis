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
var bestsellerModalWrapper = document.getElementsByClassName('bm-wrapper')[0];
var openCart = document.getElementsByClassName('header-cart-wrapper')[0];
var cart;

/**
 * Functions
**/

function clearEmptyInputs(form){
	let allInputs = form.getElementsByTagName('input');

	for (var i = 0; i < allInputs.length; i++) {
		var input = allInputs[i];

		if (input.name && !input.value) {
			input.name = '';
		}
	}
}

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart);
	
	let Render = new RenderElements(); 

	ServerInteract
		.getSpecialMarked('ARRIVALS', Render.carouselItems, {
			parent: arrivalCarouselSection, 
			cart: cart
		})
		.getSpecialMarked('BESTSELLER', Render.bestseller, {
			parent: document.getElementsByClassName('bae-bestseller-container')[0],
			cart: cart
		})
		.getSpecialMarked('EXCLUSIVE', Render.exclusiveBooks, {
			parent: document.getElementsByClassName('bae-exclusives-container')[0], 
			cart: cart
		})
		.getList('categories', Render.categoriesList, document.getElementsByClassName('sf-select')[0]);

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

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteract.sendMessage(document.getElementsByClassName('cu-form')[0]);

document.getElementsByClassName('sf')[0].onsubmit = function(){clearEmptyInputs(this);};
