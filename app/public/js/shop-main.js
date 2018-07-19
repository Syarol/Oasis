/**
 * Oasis bookstore site
 *
 * Shop page
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {Carousel} from './carousel.js';
import Cart from './cart.js';
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';
import RenderElements from './RenderElements.js';

/**
 * Global variables
*/

var recommendCarouselMain = document.getElementById('recommend_carousel');
var bestsellersCarouselMain = document.getElementById('bestsellers_carousel');
var arrivesCarouselMain = document.getElementById('arrives_carousel');
var leftButtons = document.getElementsByClassName('left-control');
var rightButtons = document.getElementsByClassName('right-control');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var countInsideCart = document.getElementById('count_inside_cart');
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

/**
 * Event Listeners
*/
 
document.addEventListener('DOMContentLoaded', () => {
	ServerInteraction = new ServerInteract();

	cart = new Cart(openCart, goodsInCart);

	let Render = new RenderElements(); 

	ServerInteraction.getSpecialMarked('RECOMMEND', recommendCarouselMain, Render.carouselItems, cart, ServerInteraction);
	ServerInteraction.getSpecialMarked('BESTSELLERS', bestsellersCarouselMain, Render.carouselItems, cart, ServerInteraction);
	ServerInteraction.getSpecialMarked('ARRIVALS', arrivesCarouselMain, Render.carouselItems, cart, ServerInteraction);

	new Carousel(rightButtons[0], leftButtons[0], recommendCarouselMain);
	new Carousel(rightButtons[1], leftButtons[1], bestsellersCarouselMain);
	new Carousel(rightButtons[2], leftButtons[2], arrivesCarouselMain);

	new GoogleMap();//connect and load map of shop location
});

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));


/**
 * Export
*/

export {goodsInCart};