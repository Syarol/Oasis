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

var contactModal = document.getElementById('contact-us-wrapper');
var goodsInCart = [];
var openCart = document.getElementById('cart_open');
var ServerInteraction;

/**
 * Event Listeners
*/
 
document.addEventListener('DOMContentLoaded', () => {
	let cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('RECOMMEND', document.getElementById('recommends-carousel-wrapper'), Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('BESTSELLERS', document.getElementById('bestsellers-carousel-wrapper'), Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('ARRIVALS', document.getElementById('arrivals-carousel-wrapper'), Render.carouselItems, cart);

	new GoogleMap();//connect and load map of shop location
});

document.getElementById('show-everything-text').onclick = () => {
	window.location.href = "/search?query=&searchType=search-full";
};

contactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('contact').onclick = () => contactModal.style.display = 'flex';

document.getElementById('close-contact-modal').onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));
