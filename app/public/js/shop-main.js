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
		//console.log(this.responseText);
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
	   	updateAllGoodsTotal();
	};
}

function sendMessageToShop(){
	let message = {};
	message.name = document.querySelector('input[name=name]').value;
	message.email = document.querySelector('input[name=email]').value.replace(/\@/g, at);
	if (message.name != '' && message.email != '') {
		message.subject = document.querySelector('input[name=subject]').value;
		message.message = document.querySelector('textarea[name=message]').value;

		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('post', '/sendMessage');
		oRq.setRequestHeader('Content-Type', 'application/json');
		oRq.send(JSON.stringify(message));
		
		oRq.onreadystatechange = function () {
			if (oRq.readyState == 4 && oRq.status == 200) {
			    console.log(this.responseText);

				document.querySelector('input[name=name]').value = '';
				document.querySelector('input[name=email]').value = '';
				document.querySelector('input[name=subject]').value = '';
				document.querySelector('textarea[name=message]').value = '';

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

	getCarousel(recommendCarouselMain, 'RECOMMEND');
	getCarousel(bestsellersCarouselMain, 'BESTSELLERS');
	getCarousel(arrivesCarouselMain, 'ARRIVALS');

	let recommendCarousel = new Carousel(rightButtons[0], leftButtons[0], recommendCarouselMain);
	let bestsellersCarousel = new Carousel(rightButtons[1], leftButtons[1], bestsellersCarouselMain);
	let arrivesCarousel = new Carousel(rightButtons[2], leftButtons[2], arrivesCarouselMain);

	var locationMap = new GoogleMap();//connect and load map of shop location
});

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => sendMessageToShop();


/**
 * Export
*/

export {goodsInCart};