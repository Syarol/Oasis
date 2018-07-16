/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {Carousel} from './carousel.js';
import {Cart} from './cart.js';
import {createNewEl} from './createNewElement.js';
import {GoogleMap} from './googleMap.js';

/**
 * Global variables
*/

var closeBestsellerModal = document.getElementById('close-bestseller-modal');
var arrivalCarouselMain = document.getElementById('new_arrival_list');
var arrivalsLeft = document.getElementById('arrivals_left');
var arrivalsRight = document.getElementById('arrivals_right');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var bestsellerModalWrapper = document.getElementById('bestseller_modal_wrapper');
var goodsInCart = [];
var countInsideCart = document.getElementById('count_inside_cart');
var openCart = document.getElementById('cart_open');
var at = encodeURIComponent('@');
var cart;

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
	getCartFromServer();
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
	syncCartwithServer();

	function newItemInCart(item){
		item.count = 1;
		item.total = Number(item.price.replace(/\$/, ''));
		goodsInCart.push(item);
	}	
}

function syncCartwithServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	let goods = JSON.stringify(goodsInCart);

	oRq.open('post', '/sameCart');
	oRq.setRequestHeader('Content-Type', 'application/json');
	oRq.send(goods);

	oRq.onload = function () {
	  	//console.log(this.responseText);
	   	console.log(JSON.parse(this.responseText));
	   	updateAllGoodsTotal();	
	   	getCartFromServer(); 
	};
}

function getCartFromServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('post', '/getCart', true);
	oRq.send();

	oRq.onload = function () {
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
	   	updateAllGoodsTotal();
	};
}

function getCarousel(parent, mark){
	let type = encodeURIComponent(mark);
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getSpecialMarked?type=' + type);
	oRq.send();
	oRq.onload = function () {
	   	//console.log(JSON.parse(this.responseText));
	   	for (let item of JSON.parse(this.responseText)){
	   		carouselItem(parent, item);
	    }
	};

	function carouselItem(parent, data){
		createNewEl('div', parent, {
			class: 'arrival-item carousel-item',
			style: 'background-image:url(' + data.thumbnailUrl + ')',
			nested: [
				createNewEl('div', false, {
					class: 'arrival-item-inf grid-center-items',
					nested: [
						createNewEl('h3', false, {
							content: data.title
						}),
						createNewEl('span', false, {
							content: 'by ' + data.author
						}),
						createNewEl('span', false, {
							content: data.price
						}),
						createNewEl('span', false, {
							content: data.categories
						}),
						createNewEl('input', false, {
							type: 'button',
							title: data.title,
							class: 'button',
							value: 'Add to cart',
							callback: {click: {
								call: () => addToCartArray(data)
							}}
						})
					]
				})
			]
		});
	}
}

function getBestsellerBook(){
	let type = encodeURIComponent('BESTSELLER');
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getSpecialMarked?type=' + type);
	oRq.send();
	oRq.onload = function () {
		let book = JSON.parse(this.responseText)[0];
   		bestsellerPreview(document.getElementById('bestseller_preview'), book);
   		bestsellerModal(document.getElementById('bestseller_modal'), book );
	};

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
			callback: {click: {
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
					callback: {click: {
						call: () => addToCartArray(data)
					}}
				})
			]
		});
	}
}

function getExclusiveBooks(){
	let type = encodeURIComponent('EXCLUSIVE');
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getSpecialMarked?type=' + type);
	oRq.send();
	oRq.onload = function () {
		let exclusiveBooksList = JSON.parse(this.responseText);
	   	for (let item of exclusiveBooksList){
	   		exclusiveBooks(document.getElementById('exclusives_container'), item);
	    }
	};

	function exclusiveBooks(parent, data){
		createNewEl('div', parent, {
			class: 'arrival-item carousel-item',
			style: 'background-image:url(' + data.thumbnailUrl + ')',
			nested: [
				createNewEl('div', false, {
					class: 'arrival-item-inf grid-center-items',
					nested: [
						createNewEl('h3', false, {
							content: data.title
						}),
						createNewEl('span', false, {
							content: 'by ' + data.author
						}),
						createNewEl('span', false, {
							content: data.price
						}),
						createNewEl('span', false, {
							content: data.categories
						}),
						createNewEl('input', false, {
							type: 'button',
							title: data.title,
							class: 'button',
							value: 'Add to cart',
							callback: {click: {
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

function getCategoriesList(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getList?column=categories');
	oRq.send();
	oRq.onload = function () {
		console.log(this.responseText);
		let categoriesList = JSON.parse(this.responseText);
	   	for (let item of categoriesList){
	   		createNewEl('option', document.getElementById('category-select'), {
	   			content: item
	   		});
	    }
	};
}

function sendMessageToShop(){
	let message = {};
	message.title = document.querySelector('input[title=title]').value;
	message.email = document.querySelector('input[title=email]').value.replace(/\@/g, at);
	if (message.title != '' && message.email != '') {
		message.subject = document.querySelector('input[title=subject]').value;
		message.message = document.querySelector('textarea[title=message]').value;

		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('post', '/sendMessage');
		oRq.setRequestHeader('Content-Type', 'application/json');
		oRq.send(JSON.stringify(message));

		oRq.onreadystatechange = function () {
			if (oRq.readyState == 4 && oRq.status == 200) {
			    console.log(this.responseText);

				document.querySelector('input[title=title]').value = '';
				document.querySelector('input[title=email]').value = '';
				document.querySelector('input[title=subject]').value = '';
				document.querySelector('textarea[title=message]').value = '';

				document.getElementById('about_section_wrapper').style.display = 'none';
			}
		};
	}
}

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	getCartFromServer();

	if (!cart){
		cart = new Cart(openCart, goodsInCart);
	}

	getCarousel(arrivalCarouselMain, 'ARRIVALS');

	let arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);

	getBestsellerBook();
	getExclusiveBooks();
	getCategoriesList();

	var locationMap = new GoogleMap();//connect and load map of shop location
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

document.getElementById('send_message').onclick = () => sendMessageToShop();

/**
 * Export
*/

export {goodsInCart};