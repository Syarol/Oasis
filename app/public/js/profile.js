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

import Cart from './cart.js';
import ServerInteract from './ServerInteraction.js';
import GoogleMap from './googleMap.js';
import contactModal from './contactModal.js'; 


/**
 * Global variables
*/

const details = document.getElementsByClassName('user-details')[0];
var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];
const openCart = document.getElementsByClassName('cart-open-btn');
const openSlider = document.getElementsByClassName('slide-open-menu')[0];
const slider = document.getElementsByClassName('header-wide')[0];
const closeSlider = document.getElementsByClassName('slide-close-menu')[0];

/* Dialog windows */
const deleteAccountDialog = document.getElementsByClassName('delete-account-dialog')[0];
const infoDialog = document.getElementsByClassName('info-dialog')[0];

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
const infoDialogBtn = infoDialog.getElementsByClassName('info-dialog-btn')[0];

/* Message texts */
const dataMessage = dataForm.getElementsByClassName('user-data-message')[0];
const passwordFormMessage = passwordForm.getElementsByClassName('password-form-message')[0];
const deleteAccountMessage = deleteAccountFrom.getElementsByClassName('delete-account-form-message')[0];
const infoDialogMessage = infoDialog.getElementsByClassName('info-dialog-text')[0];

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

function hideMessage(field){
	field.classList.remove('warning');
	field.classList.remove('success');	
	field.textContent = '';
}

/**
 * Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
	new Cart(openCart);
	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

details.ontoggle = function(){
	if (this.open){
		/*if click outside of menu then close it*/
		document.onclick = e => {
			let isClickInside = details.contains(e.target);

			if (!isClickInside){
				details.open = false;
			}
		}
	}
};

openSlider.onclick = () => slider.classList.remove('slider-out');

closeSlider.onclick = () => slider.classList.add('slider-out');

login.oninput = () => {
	ServerInteract.isUniqueUsed({login: login.value})
		.then(data => {
			if (data.isUsed){
				formMessage(dataMessage, true, 'Ooops! Login already used!');
			} else {
				hideMessage(dataMessage);
			}
		});
};

updateDataBtn.onclick = () => {
	if (firstName.value === '' || lastName.value === '' || email.value === ''){
		formMessage(dataMessage, true, 'Required fields shouldn\'t be empty!');
	} else {
		ServerInteract.updateUserData({
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			login: login.value,
			phone: phone.value
		})
			.then(status => {
				if (status){
					formMessage(dataMessage, false, 'Information successfully updated!');
				} else 
					formMessage(dataMessage, true, 'Some error occured. Please, try again later');
			})
	}
}

changePasswordBtn.onclick = () => {
	if (newPassword.value === ''){
		formMessage(passwordFormMessage, true, 'Please, write a password!');
	} else if (newPassword.value != newPasswordRepeat.value){
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
	deleteAccountDialog.classList.remove('hide');

	deleteAccountDialog.getElementsByClassName('back-btn')[0].onclick = () => {
		deleteAccountDialog.classList.add('hide');
	}
	
	confirmDeleteAccountBtn.onclick = () => {
		if (deleteEmail.value === '' || deletePassword.value === ''){
			document.getElementsByClassName('delete-account-form-message')[0].classList.remove('hide');
			formMessage(deleteAccountMessage, true, 'Fields can\'t be empty!');
		} else if (deletePassword.value.length < 6){
			document.getElementsByClassName('delete-account-form-message')[0].classList.remove('hide');
			formMessage(deleteAccountMessage, true, 'Password too short!');
		} else {
			ServerInteract.checkAndDeleteUser(deleteEmail.value, deletePassword.value)
				.then(result => {
					if (result.error){
						formMessage(deleteAccountMessage, true, result.message);
					} else {
						infoDialog.classList.remove('hide');
						infoDialogMessage.textContent = result.message;
						infoDialogBtn.onclick = () => window.location.href = '/login';
					}
				});
		}
	}
}

