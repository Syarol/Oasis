/**
 * Module with functions that interact with server 
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

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
	static setCart(goodsInCart){
		fetch('/setCart', {
			method: 'POST', //setting request method
			headers: {
	            'Content-Type': 'application/json', //setting HTTP header
        	},
			body: JSON.stringify(goodsInCart) //setting request body
		})
			.catch(err => console.log(err));

		return this;
	}

	/*Find goods*/
	static getFinded(query, cb){
		fetch('/getSearchResults', {
			method: 'POST',
			headers: {
	            'Content-Type': 'application/json',
        	},
			body: JSON.stringify(query)
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