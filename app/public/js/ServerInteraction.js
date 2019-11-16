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
	static getCart(){
		return fetch('/getCart', {
			method: 'POST'
		})
			.then(res => res.json())
			.catch(err => console.log(err));
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
		return fetch('/getSearchResults', {
			method: 'POST',
			headers: {
	            'Content-Type': 'application/json',
        	},
			body: JSON.stringify(query)
		})
			.then(res => res.json())
			.catch(err => console.log(err));
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

	/*Find goods by one of columns*/
	static getFromCatalog(column, value){
		return fetch(`/getByColumn?column=${column}&value=` + value, {
			method: 'GET'
		})
			.then(res => res.json())
			.catch(err => console.log(err));
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

	static isUniqueUsed(uniquePair){
		return fetch('/isUniqueUsed', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			method: 'POST',
			body: JSON.stringify(uniquePair)
		})
			.catch(err => console.log(err))
			.then(res => res.json());
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

	static checkAndDeleteUser(email, password){
		return fetch('/checkAndDelete', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			method: 'post',
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
			.catch(err => console.log(err))
			.then(result => result.json());
	}

	static updateUserData(data){
		return fetch('/updateUserData', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}, 
			method: 'post',
			body: JSON.stringify(data)
		})
			.catch(err => console.log(err))
			.then(result => result.json());
	}

	static isUserAuthorized(){
		return fetch('/isAuth', {
			method: 'POST'
		})
			.catch(err => console.log(err))
			.then(result => result.json());
	}
}