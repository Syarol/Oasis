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
const deleteAccountFrom = document.getElementsByClassName('delete-account-form')[0];

/* Input fields */
const firstName = document.getElementsByName('first-name')[0];
const lastName = document.getElementsByName('last-name')[0];
const email = document.getElementsByName('email')[0];
const login = document.getElementsByName('login')[0];
const phone = document.getElementsByName('phone')[0];
const oldPassword = document.getElementsByName('old-password')[0];
const newPassword = document.getElementsByName('new-password')[0];
const newPasswordRepeat = document.getElementsByName('new-password-repeat')[0];
const deleteEmail = document.getElementsByName('delete-email')[0];
const deletePassword = document.getElementsByName('delete-password')[0];

/* 'Confirm' buttons */
const updateDataBtn = dataForm.getElementsByClassName('update-data-btn')[0];
const changePasswordBtn = passwordForm.getElementsByClassName('change-password-btn')[0];
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];
const confirmDeleteAccountBtn = deleteAccountFrom.getElementsByClassName('confirm-account-delete-btn')[0];

/* Message texts */
const passwordFormMessage = passwordForm.getElementsByClassName('password-form-message')[0];
const deleteAccountMessage = deleteAccountFrom.getElementsByClassName('delete-account-form-message')[0];

/* Dialog windows */
const deleteAccountDialog = document.getElementsByClassName('delete-account-dialog')[0];

/**
 * Functions
**/

/* Changes message and color of form message text */
function formMessage(field, isError, message){
	if (isError){
		field.classList.add('warning');
		field.classList.remove('success');
	} else {
		field.classList.remove('warning');
		field.classList.add('success');
	}

	field.textContent = message;
}

/**
 * Event Listeners
*/

changePasswordBtn.onclick = () => {
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

deleteAccountBtn.onclick = () => {
	deleteAccountDialog.setAttribute('open', '');
	
	confirmDeleteAccountBtn.onclick = () => {
		if (deleteEmail.value === '' || deletePassword.value === ''){
			formMessage(deleteAccountMessage, true, 'Fields can\'t be empty!');
		} else if (deletePassword.value.length < 6){
			formMessage(deleteAccountMessage, true, 'Password too short!');
		} else {
			ServerInteract.isThisUser(deleteEmail.value, deletePassword.value)
				.then(isOK => {
					console.log(isOK.isOK);
					if (isOK.isOK) {
						ServerInteract.deleteUserAccount()
							.then(isDeleted => {
								if (isDeleted.isOK) {
									/*should change to informaitve window about success*/
									window.location.href = '/login';
								} else {
									formMessage(deleteAccountMessage, true, 'Something went wrong. Try again later!');
								}
							});
					}  else
						formMessage(deleteAccountMessage, true, 'Password and/or email not matches!');
				})

		}
	}



}