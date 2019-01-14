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
var openCart = document.getElementsByClassName('header-cart-container')[0];
var cart;
var ServerInteraction;

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
	
	ServerInteraction = new ServerInteract();

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('ARRIVALS', arrivalCarouselSection, Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('BESTSELLER', [document.getElementsByClassName('bae-bestseller-container')[0], document.getElementsByClassName('bae-book-photo')[0]], Render.bestseller, cart);
	ServerInteraction.getSpecialMarked('EXCLUSIVE', document.getElementsByClassName('bae-exclusives-container')[0], Render.exclusiveBooks, cart);

	ServerInteraction.getList('categories', document.getElementsByClassName('sf-select')[0], Render.categoriesList);

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

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteraction.sendMessage(document.getElementsByClassName('cu-form')[0]);

document.getElementsByClassName('sf')[0].onsubmit = function(){clearEmptyInputs(this)};
