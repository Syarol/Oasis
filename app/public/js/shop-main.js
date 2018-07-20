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
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';
import RenderElements from './RenderElements.js';

/**
 * Global variables
*/

var recommendCarouselMain = document.getElementById('we_recommend');
var bestsellersCarouselMain = document.getElementById('bestsellers');
var arrivesCarouselMain = document.getElementById('new_arrives');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

/**
 * Event Listeners
*/
 
document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('RECOMMEND', recommendCarouselMain, Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('BESTSELLERS', bestsellersCarouselMain, Render.carouselItems, cart);
	ServerInteraction.getSpecialMarked('ARRIVALS', arrivesCarouselMain, Render.carouselItems, cart);

	new GoogleMap();//connect and load map of shop location
});

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));
