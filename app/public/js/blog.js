/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {Cart} from './cart.js';
import {GoogleMap} from './googleMap.js';

/**
 * Global variables
*/

var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var readMoreModal = document.getElementById('read_more_modal');
var countInsideCart = document.getElementById('count_inside_cart');
var openCart = document.getElementById('cart_open');
var at = encodeURIComponent('@');
var cart;

/**
 * Functions
*/

function getCartFromServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	oRq.open('post', '/getCart');
	oRq.send();

	oRq.onload = function () {
	   	goodsInCart = JSON.parse(this.responseText);
	   	console.log(goodsInCart);
	   	updateAllGoodsTotal();
	};
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

	for (let item of document.getElementsByClassName('button-read-more')){
		item.onclick = () => readMoreModal.style.display = 'flex';
	}

	var locationMap = new GoogleMap();//connect and load map of shop location

});

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == readMoreModal) {
    	readMoreModal.style.display = 'none';
	}
}; 

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

var closeReadMoreModal = document.getElementById('close_read_more_modal');

closeReadMoreModal.onclick = () => readMoreModal.style.display = 'none';

document.getElementById('send_message').onclick = () => sendMessageToShop();

/**
 * Export
*/

export {goodsInCart};