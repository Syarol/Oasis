/**
 * Oasis bookstore site
 *
 * Profile page
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

/* Forms */
const dataForm = document.getElementsByClassName('user-data-form')[0];
const passwordForm = document.getElementsByClassName('password-form')[0];

/* Input fields */
const firstName = document.getElementsByName('first-name')[0];
const lastName = document.getElementsByName('last-name')[0];
const email = document.getElementsByName('email')[0];
const login = document.getElementsByName('login')[0];
const phone = document.getElementsByName('phone')[0];
const oldPassword = document.getElementsByName('old-password')[0];
const newPassword = document.getElementsByName('new-password')[0];
const newPasswordRepeat = document.getElementsByName('new-password-repeat')[0];

/* 'Confirm' buttons */
const updateDataBtn = dataForm.getElementsByClassName('update-data-btn')[0];
const changePasswordBtn = passwordForm.getElementsByClassName('change-password-btn')[0];

/* Message texts*/
const passwordFormMessage = passwordForm.getElementsByClassName('password-form-message')[0];

/**
 * Functions
**/

/* Changes message and color of form message text */
function formMessage(field, isError, message){
	if (isError){
		field.classList.add('error');
		field.classList.remove('success');
	} else {
		field.classList.remove('error');
		field.classList.add('success');
	}

	field.textContent = message;
}

/**
 * Event Listeners
*/

changePasswordBtn.onclick = () => {
					clearFormInputs(passwordForm);
	if (newPassword.value != newPasswordRepeat.value){
		formMessage(passwordFormMessage, true, 'New password not matches!');
	} else if (oldPassword.value === newPassword.value){
		formMessage(passwordFormMessage, true, 'New password can\'t be same as old!');
	} else {
		ServerInteract.changePassword(oldPassword.value, newPassword.value)
			.then(status => {
				if (status.status){
					passwordForm.reset(); //clears input fields
					formMessage(passwordFormMessage, false, 'Password changed successfully!');
				} else {
					formMessage(passwordFormMessage, true, 'Wrong old password!');
				}
			});
	}
}