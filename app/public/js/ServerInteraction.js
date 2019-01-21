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

/**
 * Class
*/

export default class ServerInteract{
	/*Receives cart contents*/
	static getCart(cb){
		fetch('/getCart', {
			method: 'POST'
		})
			.then(res => res.json())
			.then(json => cb(json))
			.catch(err => console.log(err));

		return this;
	}

	/*Synchronizes cart beetwen client and server*/
	static syncCart(goodsInCart){
		let goods = JSON.stringify(goodsInCart); //converts array to string

		var xHr = new XMLHttpRequest(); //Create the object
		xHr.open('post', '/setCart'); //initialization of query
		xHr.setRequestHeader('Content-Type', 'application/json'); //setting HTTP header
		xHr.send(goods); //send query 

		/*when the request has been processed receive cart contents*/
		xHr.onload = () => {
		   	updateAllGoodsTotal(JSON.parse(xHr.responseText)); //update count of goods inside cart
		};
	}

	/*Find goods*/
	static getFinded(query, cb){
		fetch('/getSearchResults', {
			method: 'POST',
			body: query
		})
			.then(res => res.json())
			.then(json => cb(json))
			.catch(err => console.log(err));

		return this;
	}

	/*Find and render goods details list by specified colum (categories, author, publiser)*/
	static getList(column, cb, cbData = null){
		fetch('/getList?column=' + column, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json, cbData, column))
			.catch(err => console.log(err));
		
		return this;
	}

	/*Find and render special marked goods*/
	static getSpecialMarked(title, cb, cbData){
		fetch('/getBySimpleColumn?column=specialMark&value=' + title, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(cbData.parent, json, cbData.cart))
			.catch(err => console.log(err));
		
		return this;
	}

	/*Find goods by their title*/
	static getDataById(id, cb){
		fetch('/getBySimpleColumn?column=id&value=' + id, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json))
			.catch(err => console.log(err));
		
		return this;
	}

	static getLowHigh(cb){
		fetch('/getLowHighPrice', {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json))
			.catch(err => console.log(err));
		
		return this;
	}

	/*Send message to shop (form from contact modal)*/
	static sendMessage(form){
		if([...form.querySelectorAll('input[required=""]')].every(el => el.checkValidity())){
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