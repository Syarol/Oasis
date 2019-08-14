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
				modal.style.display = 'none';
			}
		};

		openLink.onclick = () => modal.style.display = 'flex';

		closeBtn.onclick = () => modal.style.display = 'none';

		formSendBtn.onclick = () => {
			ServerInteract.sendMessage(form, modal);
			return false; //prevents page reload
		};

	}
}