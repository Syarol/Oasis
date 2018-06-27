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
var plus = encodeURIComponent('+');
var hashtag = encodeURIComponent('#');
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
	if (goodsInCart.length != 0) {
		let found = false;
		for(let item of goodsInCart) {
		    if (item.name == goods.name) {
	    		item.count++; 
		    	found = true;
				break;
			}
		}
		if (!found) {
			goodsInCart.push({name: goods.name, count: 1});
		}
	} else goodsInCart.push({name: goods.name, count: 1});

	getGoodsInf();
	updateAllGoodsTotal();	
	syncCartwithServer();	
}

function getGoodsInf(){
	for (let item of goodsInCart){
		let replaced = item.name.replace(/\+/g, plus);
		   	replaced = replaced.replace(/\#/g, hashtag);

		var oReq = new XMLHttpRequest(); //Create the object
		oReq.open('GET', 'get-data.php?title='+replaced, false);

		oReq.onreadystatechange = function () {
		    if (oReq.readyState == 4 && oReq.status == 200) {
		        let res = JSON.parse(this.responseText);
		        item.author = res.author;
		        item.price = res.price;
		        item.total = Number(res.price.replace(/\$/, ''));
		    }
		};

		oReq.send();
	}
}

function syncCartwithServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	let goods = JSON.stringify(goodsInCart);
	let replaced = goods.replace(/\+/g, plus);
	   	replaced = replaced.replace(/\#/g, hashtag);
	console.log(JSON.parse(goods));
	oRq.open('get', 'variableBeetwenPages.php?books='+replaced, true);
	oRq.send();
	oRq.onreadystatechange = function () {
		    if (oRq.readyState == 4 && oRq.status == 200) {
		    	console.log(this.responseText);
		      	console.log(JSON.parse(this.responseText));
		    }
	};
}

function getCartFromServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('get', 'sendCartToJS.php', true);
	oRq.send();
	oRq.onreadystatechange = function () {
		if (oRq.readyState == 4 && oRq.status == 200) {
		   	console.log(JSON.parse(this.responseText));
		   	goodsInCart = JSON.parse(this.responseText);
		   	if (!cart){
				cart = new Cart(openCart, goodsInCart);
			}
		   	updateAllGoodsTotal();
			getGoodsInf();
		}
	};
}

function sendMessageToShop(){
	let message = {};
	message.name = document.querySelector('input[name=name]').value;
	message.email = document.querySelector('input[name=email]').value.replace(/\@/g, at);
	if (message.name != '' && message.email != '') {
		message.subject = document.querySelector('input[name=subject]').value;
		message.message = document.querySelector('textarea[name=message]').value;

		let messageString = JSON.stringify(message);

		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('get', 'sendMessage.php?message='+messageString, true);
		oRq.send();
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
	var arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);

	//if long name of book than make font-size smaller
	for (let item of document.querySelectorAll('.arrival-item-inf h3')){
		if (item.textContent.length > 12) item.style.fontSize  = '1em';
	}

	for (let item of document.querySelectorAll('input[type=button]')){
		item.onclick = () => addToCartArray(item);
	}	

	getCartFromServer();

	if(document.getElementById('googleMap') === null){
		loadGoogleMap();
	}
});

closeBestsellerModal.onclick = () => bestsellerModalWrapper.style.display = 'none';

document.getElementById('open_bestseller_modal').onclick = () => bestsellerModalWrapper.style.display = 'flex';

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