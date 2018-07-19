/**
 * Module with functions that interact with server 
 *
 * @Author Oleh Yaroshchuk 
 */

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

		/*when the request has been processed receive cart contents*/
		xHr.onload = () => {
		   	console.log(JSON.parse(xHr.responseText));
		   	this.getCart(goodsInCart);
		};
	}

	/*Found and render goods*/
	getFoundedAndRender(query, renderFunction, cart, ServerInteraction){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/getSearchResults'); //initialization of query
		xHr.setRequestHeader('Content-Type', 'application/json');
		xHr.send(JSON.stringify(query)); //send query 

		/*when the request has been processed render founded*/
		xHr.onload = () => {
		   	renderFunction(JSON.parse(xHr.responseText), cart, ServerInteraction);
		};
	}

	/*Found and render goods details list by specified colum (categories, author, publiser)*/
	getList(column, parent, renderFunction){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getList?column=' + column); //initialization of query
		xHr.send(); //send query 

		/*when the request has been processed render founded*/
		xHr.onload = function (){
		   	renderFunction(JSON.parse(this.responseText), parent, column);
		};
	}

	/*Found and render special marked goods*/
	getSpecialMarked(type, parent, renderFunction, cart, serverInteraction){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getSpecialMarked?type=' + type); //initialization of query
		xHr.send(); //send query 

		/*when the request has been processed render founded*/
		xHr.onload = () => {
	   		renderFunction(parent, JSON.parse(xHr.responseText), cart, serverInteraction);
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