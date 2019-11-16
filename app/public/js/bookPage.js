/**
 * Oasis bookstore site
 *
 * Book page
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import Cart from './cart.js';
import GoogleMap from './googleMap.js';
import ServerInteract from './ServerInteraction.js';
import contactModal from './contactModal.js'; 

/**
 * Global variables
*/

/*header*/
const details = document.getElementsByClassName('user-details')[0];
const openCartBtn = document.getElementsByClassName('cart-open-btn');
const openSlider = document.getElementsByClassName('slide-open-menu')[0];
const slider = document.getElementsByClassName('header-wide')[0];
const closeSlider = document.getElementsByClassName('slide-close-menu')[0];

var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];

/**
 * Functions
*/



/**
 * Event Listeners
*/

for (let element of document.getElementsByClassName('input-number')){
	element.oninput = function(){
		if (this.type == 'number')
			this.value = this.value.replace(/\D/g, '');
	};
}

if (details){ //will work only for authorized users
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
}

openSlider.onclick = () => slider.classList.remove('slider-out');

closeSlider.onclick = () => slider.classList.add('slider-out');

document.addEventListener('DOMContentLoaded', () => {
	//cart will work only if user is authorized
	if (openCartBtn.length > 0) {
		let cart = new Cart(openCartBtn); 
	
		let addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];
		ServerInteract.getFromCatalog({
			column: 'id',
			value: addToCartButton.getAttribute('data-book-id')
		})
			.then(res => {
				console.log(res);
				addToCartButton.onclick = () => cart.add(res);
			});
	}
	
	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

