/**
 * Module with functions that interact with server 
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Functions
*/

function updateAllGoodsTotal(goodsInCart){
	let priceTotal = goodsInCart.reduce((acc, item) => acc + item.total, 0);
	document.getElementsByClassName('cm-all-items-total')[0].textContent = '$' + priceTotal.toFixed(2);

	allGoodsCount();   

	function allGoodsCount(){
		let countTotal = goodsInCart.reduce((acc, item) => acc + item.count, 0);
		let countTotalContainer = document.getElementsByClassName('header-cart-count')[0];

		countTotalContainer.textContent = countTotal === 0 ? '' : ' (' + countTotal + ') ';  
	} 
}

function getObjectFromUrlQuery(){
	if (window.location.search.length != 0)
		return window.location.search
	  		.slice(1)
			.split('&')
			.map(p => p.split('='))
			.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
	else return null;
}

function syncPriceInputs(hiddenInput, priceInput){
	for (let item of hiddenInput){
		item.value = priceInput.value;
	}
}

/**
 * Class
*/

export default class ServerInteract{
	/*Receives cart contents*/
	static getCart(){
		return new Promise(function(resolve, reject){
			var xHr = new XMLHttpRequest(); //Create the object
			xHr.open('post', '/getCart'); //initialization of query
			xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
			xHr.send(); //send query

			/*when the request has been processed*/
			xHr.onload = function () {
			   	let inCart = JSON.parse(this.responseText); //save cart contents in variable
			   	console.log(inCart);
			   	updateAllGoodsTotal(inCart); //update count of goods inside cart
			   	resolve(inCart); //returns variable with cart contents
			};

			xHr.onerror = (err) => reject(err); //on error return error message
		});
	}

	/*Synchronizes cart beetwen client and server*/
	static syncCart(goodsInCart){
		let goods = JSON.stringify(goodsInCart); //converts array to string

		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/sameCart'); //initialization of query
		xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
		xHr.send(goods); //send query 

		/*when the request has been processed receive cart contents*/
		xHr.onload = () => {
		   	console.log(JSON.parse(xHr.responseText));
		   	updateAllGoodsTotal(JSON.parse(xHr.responseText)); //update count of goods inside cart
		};
	}

	/*Find goods*/
	static getFinded(query){
		return new Promise(function(resolve, reject){
			var xHr = new XMLHttpRequest(); //Create the object
			xHr.open('post', '/getSearchResults'); //initialization of query
			xHr.setRequestHeader('Content-Type', 'application/json');
			xHr.send(JSON.stringify(query)); //send query 

			/*when the request has been processed send finded*/
			xHr.onload = () => {
			   	resolve(JSON.parse(xHr.responseText)); //returns variable with finded items
			};

			xHr.onerror = (err) => reject(err); //on error return error message
		});
	}

	/*Find and render goods details list by specified colum (categories, author, publiser)*/
	static getList(column, cb, cbData = null){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getList?column=' + column); //initialization of query
		xHr.send(); //send query 

		/*when the request has been processed render finded*/
		xHr.onload = function (){
		   	cb(JSON.parse(this.responseText), cbData, column);
		};

		return this;
	}

	/*Find and render special marked goods*/
	static getSpecialMarked(title, parent, cb, cart){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getBySimpleColumn?column=specialMark&title=' + title); //initialization of query
		xHr.send(); //send query 

		/*when the request has been processed render finded*/
		xHr.onload = () => {
	   		cb(parent, JSON.parse(xHr.responseText), cart);
		};

		return this;
	}

	/*Find goods by their title*/
	static getDataByTitle(title){
		return new Promise(function(resolve, reject){
			var xHr = new XMLHttpRequest(); //Create the object
			xHr.open('get', '/getBySimpleColumn?column=title&title=' + title); //initialization of query
			xHr.send(); //send query 

			/*when the request has been processed return goods data*/
			xHr.onload = () => resolve(JSON.parse(xHr.responseText));
		});
	}

	/*Gets lowest and highest price in catalog*/
	static getLowHigh(lowInput, highInput){
		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('get', '/getLowHighPrice'); //initialization of query
		xHr.send(); //send query 

		/*when the request has been processed return goods data*/
		xHr.onload = () => {
			let prices = JSON.parse(xHr.responseText)[0];
			let pageUrlObj = getObjectFromUrlQuery();

			if (pageUrlObj.lowPrice){
				lowInput.value = pageUrlObj.lowPrice;
				syncPriceInputs(document.getElementsByClassName('sf-low-price'), lowInput);
			} else 
				lowInput.value = prices.low.toFixed(2);

			if (pageUrlObj.highPrice){
				highInput.value = pageUrlObj.highPrice;
				syncPriceInputs(document.getElementsByClassName('sf-high-price'), highInput);
			} else 	
				highInput.value = prices.high.toFixed(2);
		};

		return this;
	}

	/*Send message to shop (form from contact modal)*/
	static sendMessage(form){
		if(form.querySelectorAll('input[required=""]').every(el => el.checkValidity())){
			let message = {}; //initialization of message object

			/*getting message main data*/
			message.name = form.querySelector('input[name=name]').value; 
			message.email = form.querySelector('input[name=email]').value;
			message.subject = form.querySelector('input[name=subject]').value;
			message.message = form.querySelector('textarea[name=message]').value;

			var xHr = new XMLHttpRequest(); //Create the object
			xHr.open('post', '/sendMessage'); //initialization of query
			xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
			xHr.send(JSON.stringify(message)); //send query
			
			/*when the request has been processed, then clear the fields*/
			xHr.onload = function () {
				form.querySelector('input[name=name]').value = '';
				form.querySelector('input[name=email]').value = '';
				form.querySelector('input[name=subject]').value = '';
				form.querySelector('textarea[name=message]').value = '';

				document.getElementsByClassName('cu-modal-wrapper')[0].style.display = 'none';
			};
		}

		return this;
	}
}