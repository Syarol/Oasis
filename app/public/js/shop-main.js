/**
 * Oasis bookstore site
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
	var xHr = new XMLHttpRequest(); //Create the object
	xHr.open('get', '/getSpecialMarked?type=' + type);
	xHr.send();
	xHr.onload = function () {
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
							event: {click: {
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
	let goods = JSON.stringify(goodsInCart);
	
	var xHr = new XMLHttpRequest(); //Create the object
	xHr.open('post', '/sameCart');
	xHr.setRequestHeader('Content-Type', 'application/json');
	xHr.send(goods);

	xHr.onload = function () {
	  	//console.log(this.responseText);
	   	console.log(JSON.parse(this.responseText));
	   	updateAllGoodsTotal();	
	   	getCartFromServer();
	};
}

function getCartFromServer(){
	var xHr = new XMLHttpRequest(); //Create the object
	xHr.open('post', '/getCart'); //initialization of query
	xHr.send(); //send query

	/*when the request has been processed, ....*/
	xHr.onload = function () {
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
	   	updateAllGoodsTotal();
	};
}

/*Send message to shop (form from contact modal)*/
function sendMessageToShop(parent){
	let message = {}; //initialization of message object

	/*getting message main data*/
	message.name = parent.querySelector('input[name=name]').value; 
	message.email = parent.querySelector('input[name=email]').value;

	/*if requested fields not empty then resume function*/
	if (message.name != '' && message.email != '' && message.email.includes('@')) {
		message.subject = parent.querySelector('input[name=subject]').value;
		message.message = parent.querySelector('textarea[name=message]').value;

		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/sendMessage'); //initialization of query
		xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
		xHr.send(JSON.stringify(message)); //send query
		
		/*when the request has been processed, then clear the fields*/
		xHr.onload = function () {
		    console.log(this.responseText);

			parent.querySelector('input[name=name]').value = '';
			parent.querySelector('input[name=email]').value = '';
			parent.querySelector('input[name=subject]').value = '';
			parent.querySelector('textarea[name=message]').value = '';

			document.getElementById('about_section_wrapper').style.display = 'none';
		};
	}
}

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	getCartFromServer();

	cart = new Cart(openCart, goodsInCart);

	getCarousel(recommendCarouselMain, 'RECOMMEND');
	getCarousel(bestsellersCarouselMain, 'BESTSELLERS');
	getCarousel(arrivesCarouselMain, 'ARRIVALS');

	new Carousel(rightButtons[0], leftButtons[0], recommendCarouselMain);
	new Carousel(rightButtons[1], leftButtons[1], bestsellersCarouselMain);
	new Carousel(rightButtons[2], leftButtons[2], arrivesCarouselMain);

	new GoogleMap();//connect and load map of shop location
});

contactModal.onclick = () => contactModal.style.display = 'none';

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => sendMessageToShop(document.getElementById('contact-form'));


/**
 * Export
*/

export {goodsInCart};