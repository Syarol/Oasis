/**
 * Module with functions that interact with server 
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import createNewEl from './createNewElement.js';

/**
 * Functions
*/

function updateAllGoodsTotal(goodsInCart){
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

		let countInsideCart = document.getElementById('count_inside_cart');

		if (allTotal == 0) countInsideCart.textContent = '';
		else countInsideCart.textContent = ' (' + allTotal + ')';    
	} 
}

/**
 * Class
*/

export default class ServerInteract{
	constructor(){
	}

	/*Receives cart contents*/
	getCart(inCart){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/getCart'); //initialization of query
		xHr.send(); //send query

		/*when the request has been processed*/
		xHr.onload = function () {
		   	inCart = JSON.parse(this.responseText); //save cart contents in variable
		   	console.log(inCart);
		   	updateAllGoodsTotal(inCart); //update count of goods inside cart
		};

		return inCart; //returns variable with cart contents
	}

	/*Synchronizes cart beetwen client and server*/
	syncCart(goodsInCart){
		let goods = JSON.stringify(goodsInCart); //converts array to string
		
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/sameCart'); //initialization of query
		xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
		xHr.send(goods); //send query 

		xHr.onload = () => {
		   	console.log(JSON.parse(xHr.responseText));
		   	updateAllGoodsTotal(goodsInCart);	
		   	this.getCart();
		};
	}

	getCarousel(parent, mark, addToCartArray){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getSpecialMarked?type=' + mark); //initialization of query
		xHr.send();//send query

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

	getFoundedAndRender(query, renderFunction){
		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('post', '/getSearchResults');
		oRq.setRequestHeader('Content-Type', 'application/json');
		oRq.send(JSON.stringify(query));

		oRq.onload = function () {
		   	let founded = JSON.parse(this.responseText);
		   	for (let item of founded) renderFunction(item);
		};
	}

	getList(column, parent, renderFunction){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getList?column=' + column);
		xHr.send();
		xHr.onload = function (){
			let categoriesList = JSON.parse(this.responseText);
		   	renderFunction(column, categoriesList, parent);
		};
	}

	getSpecialMarked(type, parent, renderFunction){
		var oRq = new XMLHttpRequest(); //Create the object
		oRq.open('get', '/getSpecialMarked?type=' + type);
		oRq.send();
		oRq.onload = function () {
			let data = JSON.parse(this.responseText);
	   		renderFunction(parent, data);
		};
	}


	/*Send message to shop (form from contact modal)*/
	sendMessage(parent){
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
}