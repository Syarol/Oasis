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
var serverInteraction;

/**
 * Functions
*/

function updateAllGoodsTotal(){
	let temp = 0;
	for (let item of goodsInCart){
		temp += item.total;
	}

	cartAllGoodsTotal.textContent = '$' + temp.toFixed(2);

	allGoodsCount();   

	function allGoodsCount(){
		let allTotal = 0;
		for (let item of goodsInCart){
			allTotal += item.count;
		}

		if (allTotal == 0) countInsideCart.textContent = '';
		else countInsideCart.textContent = ' (' + allTotal + ')';    
	} 
}

function addToCartArray(goods){
	serverInteraction.getCart(goodsInCart);
	cart.updateInCart(goodsInCart);

	if (goodsInCart.length != 0) {
		let found = false;
		for (let item of goodsInCart) {
		    if (item.title == goods.title) {
	    		item.count++; 
	    		item.total = Number(item.price.replace(/\$/, '')) * item.count;
		    	found = true;
				break;
			}
		}
		if (!found) {
			newItemInCart(goods);
		}
	} else {
		newItemInCart(goods);
	}
	updateAllGoodsTotal();	
	serverInteraction.syncCart(goodsInCart);

	function newItemInCart(item){
		item.count = 1;
		item.total = Number(item.price.replace(/\$/, ''));
		goodsInCart.push(item);
	}	
}

/**
 * Event Listeners
*/
 
document.addEventListener('DOMContentLoaded', () => {
	serverInteraction = new ServerInteract();

	cart = new Cart(openCart, goodsInCart);

	let Render = new RenderElements(addToCartArray); 

	serverInteraction.getSpecialMarked('RECOMMEND', recommendCarouselMain, Render.carouselItems, addToCartArray);
	serverInteraction.getSpecialMarked('BESTSELLERS', bestsellersCarouselMain, Render.carouselItems, addToCartArray);
	serverInteraction.getSpecialMarked('ARRIVALS', arrivesCarouselMain, Render.carouselItems, addToCartArray);

	new Carousel(rightButtons[0], leftButtons[0], recommendCarouselMain);
	new Carousel(rightButtons[1], leftButtons[1], bestsellersCarouselMain);
	new Carousel(rightButtons[2], leftButtons[2], arrivesCarouselMain);

	new GoogleMap();//connect and load map of shop location
});

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => serverInteraction.sendMessage(document.getElementById('contact-form'));


/**
 * Export
*/

export {goodsInCart};