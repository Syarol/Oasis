/**
 * Oasis bookstore site
 *
 * Open/Close contact modal, sending messages from form
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import ServerInteract from './ServerInteraction.js'; //for swap data between server and client

/**
 * Class
*/

export default class ContactModal{
	constructor(modal, openLink){
		let closeBtn = modal.getElementsByClassName('close-modal')[0];
		let form = modal.getElementsByClassName('cu-form')[0];
		let formSendBtn = modal.getElementsByClassName('cu-form-send-btn')[0];
				
		document.onclick = function(e) {
			if (e.target == modal) {
				modal.classList.add('hide');
			}
		};

		openLink.onclick = () => modal.classList.remove('hide');

		closeBtn.onclick = () => modal.classList.add('hide');

		formSendBtn.onclick = () => {
			ServerInteract.sendMessage(form, modal);
			return false; //prevents page reload
		};

	}
}