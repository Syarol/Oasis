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
import createNewEl from './createNewElement.js';
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';

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
	serverInteraction.getCart();
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
	serverInteraction.syncCart();

	function newItemInCart(item){
		item.count = 1;
		item.total = Number(item.price.replace(/\$/, ''));
		goodsInCart.push(item);
	}	
}

function renderBestseller(parent, data){
   	bestsellerPreview(parent[0], data[0]);
   	bestsellerModal(parent[1], data[0]);

	function bestsellerPreview(parent, data){
		createNewEl('div', parent, {
			class: 'book-photo-container center-cover-no-repeat',
			style: 'background-image:url(' + data.thumbnailUrl + ')'
		});
		createNewEl('span', parent, {
			class: 'text-container',
			content: data.shortDescription
		});
		createNewEl('span', parent, {
			id: 'open_bestseller_modal',
			class: 'button grid-center-items',
			content: 'Quick view',
			event: {click: {
				call: () => bestsellerModalWrapper.style.display = 'flex'
			}}
		});
	}

	function bestsellerModal(parent, data){
		createNewEl('h3', parent, {
			content: data.title
		});
		createNewEl('img', parent, {
			class: 'modal-photo',
			src:  data.thumbnailUrl
		});
		createNewEl('span', parent, {
			class: 'author',
			content: 'by ' + data.author
		});
		createNewEl('span', parent, {
			class: 'category',
			content: data.categories
		});
		createNewEl('span', parent, {
			class: 'text-container',
			content: data.description
		});
		createNewEl('span', parent, {
			class: 'price',
			content: data.price,
			nested:[
				createNewEl('input', false, {
					type: 'button',
					name: data.title,
					class: 'button',
					value: 'Add to cart',
					title: 'Add to cart',
					event: {click: {
						call: () => addToCartArray(data)
					}}
				})
			]
		});
	}
}

function renderExclusiveBooks(parent, data){
	for (let item of data){
		createNewEl('div', parent, {
			class: 'arrival-item carousel-item',
			style: 'background-image:url(' + item.thumbnailUrl + ')',
			nested: [
				createNewEl('div', false, {
					class: 'arrival-item-inf grid-center-items',
					nested: [
						createNewEl('h3', false, {
							content: item.title
						}),
						createNewEl('span', false, {
							content: 'by ' + item.author
						}),
						createNewEl('span', false, {
							content: item.price
						}),
						createNewEl('span', false, {
							content: item.categories
						}),
						createNewEl('input', false, {
							type: 'button',
							title: item.title,
							class: 'button',
							value: 'Add to cart',
							event: {click: {
								call: () => addToCartArray(data)
							}}
						}),
						createNewEl('span', false, {
							class: 'on-sale',
							content: 'SALE!'
						})
					]
				})
			]
		});
	}
}

function renderCategoriesList(column, list, parent){
	for (let item of list){
	   	createNewEl('option', parent, {
	   		content: item
	   	});
	}
}

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	serverInteraction = new ServerInteract();
	serverInteraction.getCart();

	cart = new Cart(openCart, goodsInCart);

	serverInteraction.getCarousel(arrivalCarouselMain, 'ARRIVALS');

	new Carousel(document.getElementById('arrivals_right'), document.getElementById('arrivals_left'), arrivalCarouselMain);

	serverInteraction.getSpecialMarked('BESTSELLER', [document.getElementById('bestseller_preview'), document.getElementById('bestseller_modal')], renderBestseller);
	serverInteraction.getSpecialMarked('EXCLUSIVE', document.getElementById('exclusives_container'), renderExclusiveBooks);

	serverInteraction.getList('categories', document.getElementById('category-select'), renderCategoriesList);

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

document.getElementById('send_message').onclick = () => serverInteraction.sendMessage(document.getElementById('contact-form'));

/**
 * Export
*/

export {goodsInCart};