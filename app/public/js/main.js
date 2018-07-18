/**
 * Oasis bookstore site
 *
 * Main page
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

var closeBestsellerModal = document.getElementById('close-bestseller-modal');
var arrivalCarouselMain = document.getElementById('new_arrival_list');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var bestsellerModalWrapper = document.getElementById('bestseller_modal_wrapper');
var goodsInCart = [];
var countInsideCart = document.getElementById('count_inside_cart');
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

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
	ServerInteraction.getCart();
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
	ServerInteraction.syncCart();

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
	ServerInteraction = new ServerInteract();
	ServerInteraction.getCart();

	cart = new Cart(openCart, goodsInCart);

	let Render = new RenderElements(addToCartArray); 

	ServerInteraction.getSpecialMarked('ARRIVALS', arrivalCarouselMain, Render.carouselItems, addToCartArray);

	new Carousel(document.getElementById('arrivals_right'), document.getElementById('arrivals_left'), arrivalCarouselMain);

	ServerInteraction.getSpecialMarked('BESTSELLER', [document.getElementById('bestseller_preview'), document.getElementById('bestseller_modal')], Render.bestseller, addToCartArray);
	ServerInteraction.getSpecialMarked('EXCLUSIVE', document.getElementById('exclusives_container'), Render.exclusiveBooks, addToCartArray);

	ServerInteraction.getList('categories', document.getElementById('category-select'), Render.categoriesList);

	new GoogleMap();//connect and load map of shop location
});

closeBestsellerModal.onclick = () => bestsellerModalWrapper.style.display = 'none';

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

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));

/**
 * Export
*/

export {goodsInCart};