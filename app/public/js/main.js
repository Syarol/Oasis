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

function loadGoogleMap(){
	let script = document.createElement('script');
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps';
	script.type = 'text/javascript';
	script.id ='googleMap';
	document.getElementsByTagName('body')[0].append(script);
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
	//getGoodsInf();
	updateAllGoodsTotal();	
	syncCartwithServer();

	function newItemInCart(item){
		item.count = 1;
		item.total = Number(item.price.replace(/\$/, ''));
		goodsInCart.push(item);
	}	
}

/*function getGoodsInf(){
	for (let item of goodsInCart){

/*var oReq = new XMLHttpRequest(); //Create the object
		oReq.open('POST', '/getItemData', false);
		oReq.setRequestHeader('Content-Type', 'application/json');
		oReq.send(JSON.stringify({title: item.title}));

		oReq.onload = function () {
	        let res = JSON.parse(this.responseText);
	        item.author = res.author;
	        item.price = res.price;
	        item.total = Number(res.price.replace(/\$/, '')) * item.count;
		};
	}
}*/

function syncCartwithServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	let goods = JSON.stringify(goodsInCart);

	oRq.open('post', '/sameCart');
	oRq.setRequestHeader('Content-Type', 'application/json');
	oRq.send(goods);

	oRq.onload = function () {
	  	//console.log(this.responseText);
	   	console.log(JSON.parse(this.responseText));
	};
}

function getCartFromServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getCart', false);
	oRq.send();

	oRq.onload = function () {
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
		//getGoodsInf();
	   	updateAllGoodsTotal();
	};
}

function getArrivalCarousel(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', '/getArrivalCarousel');
	oRq.send();
	oRq.onload = function () {
	   	console.log(JSON.parse(this.responseText));
	   	for (let item of JSON.parse(this.responseText)){
	   		carouselItem(arrivalCarouselMain, item);
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

window.loadMaps = () => {
	var map = new google.maps.Map(document.getElementById('map-container'), {
		center: {lat:50.745151, lng:25.322764},
		zoom: 17,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false
	});

	var marker = new google.maps.Marker({
		position: {lat:50.745151, lng:25.322764},
		map: map,
		title: 'Oasis bookstore'
	});

	google.maps.event.addDomListener(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize');
	});
};

document.addEventListener('DOMContentLoaded', () => {
	getCartFromServer();

	if (!cart){
		cart = new Cart(openCart, goodsInCart);
	}

	getArrivalCarousel();

	var arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);

	if(document.getElementById('googleMap') === null){
		loadGoogleMap();
	}

});

closeBestsellerModal.onclick = () => bestsellerModalWrapper.style.display = 'none';

//document.getElementById('open_bestseller_modal').onclick = () => bestsellerModalWrapper.style.display = 'flex';

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