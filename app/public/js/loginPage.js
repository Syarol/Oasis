/**
 * Oasis bookstore site
 *
 * Login page
 * 
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import ServerInteract from './ServerInteraction.js';

/**
 * Global variables
*/

var formConfirmBtn = document.getElementsByClassName('login-form-btn')[0];
var passwordInput = document.getElementsByClassName('ibb-ic-password')[0];
var loginInput = document.getElementsByClassName('ibb-ic-email')[0];
var errorMessage = document.getElementsByClassName('error-message')[0];

/**
 * Functions
**/

function showError(error){
	errorMessage.classList.add('show-error');
	errorMessage.classList.remove('hide-error');
}

function hideError(){
	errorMessage.classList.remove('show-error');
	errorMessage.classList.add('hide-error');	
}

/**
 * Event Listeners
*/

formConfirmBtn.onclick = () => {
	if (loginInput.value != '' && passwordInput.value != '') {
		ServerInteract.logInUser({
			email: document.getElementsByClassName('ibb-ic-email')[0].value,
			password: passwordInput.value
		})
			.then((isAuth) => {
				console.log(isAuth);
				if (isAuth.isAuth) {
					history.back();
				} else {
					showError();
					passwordInput.value = '';
				}
			});
	} else {
		showError();
	}
};
