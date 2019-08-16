/**
 * Oasis bookstore site
 *
 * Registration page
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

var formConfirmBtn = document.getElementsByClassName('register-btn')[0];

/**
 * Functions
**/

/**
 * Event Listeners
*/

formConfirmBtn.onclick = () => {
	if (document.getElementsByClassName('bb-ic-password')[0].value === document.getElementsByClassName('bb-ic-password-repeat')[0].value) {
		ServerInteract.registerNewUser({
			firstName: document.getElementsByClassName('bb-ic-name')[0].value,
			lastName: document.getElementsByClassName('bb-ic-surname')[0].value,
			email: document.getElementsByClassName('bb-ic-email')[0].value,
			password: document.getElementsByClassName('bb-ic-password')[0].value
		}, () => history.back());
	}
};