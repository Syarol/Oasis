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

	static getPublishers(cb, cbData = null){
		fetch('/getPublishers', {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json, cbData))
			.catch(err => console.log(err));
		
		return this;
	}

	static getAuthors(cb, cbData = null){
		fetch('/getAuthors', {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json, cbData))
			.catch(err => console.log(err));
		
		return this;
	}

	static getCategories(cb, cbData = null){
		fetch('/getCategories', {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => cb(json, cbData))
			.catch(err => console.log(err));
		
		return this;
	}

	/*Find and render special marked goods*/
	static getMarked(title, cb, cbData){
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
	static sendMessage(form, modal = null){
		fetch('/sendMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			//setting values that passed to server
			body: JSON.stringify({
				name: form.querySelector('input[name=name]').value, 
				email: form.querySelector('input[name=email]').value,
				subject: form.querySelector('input[name=subject]').value,
				message: form.querySelector('textarea[name=message]').value
			})
		})
			.then(() => {
				form.reset(); //restores default value of input fields
				if (modal) modal.style.display = 'none'; //closes modal window
			})
			.catch(err => console.log(err));

		return this;
	}

	static registerNewUser(data){
		return fetch('/regNewUser', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		    },
			method: 'POST',
			body: JSON.stringify(data)
		})
			.catch(err => console.log(err));
	}

	static isEmailUsed(email){
		return fetch('/isEmailUsed', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			method: 'POST',
			body: JSON.stringify({email: email})
		})
			.catch(err => console.log(err))
			.then(data => data.json());
	}

	static logInUser(data){
		return fetch('/logInUser', {
			headers: {
		      'Authorization': 'Basic ' + btoa(JSON.stringify({[data.email]: data.password}))
		    },
			method: 'POST'
		})
			.catch(err => console.log(err))
			.then(data => data.json());
	}

	static changePassword(oldPassword, newPassword){
		return fetch('/changePassword', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			method: 'POST',
			body: JSON.stringify({
				old: oldPassword, 
				new: newPassword
			})
		})
			.catch(err => console.log(err))
			.then(status => status.json());
	}
}