/**
 * Oasis bookstore site
 *
 * Main page
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
import RenderElements from './RenderElements.js';

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

const arrivalCarouselSection = document.getElementsByClassName('cr-arrivals-section')[0];
const bestsellerContainer = document.getElementsByClassName('bae-bestseller-container')[0];
const exclusivesContainer = document.getElementsByClassName('bae-exclusives-container')[0];

var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];

/**
 * Functions
**/

function clearEmptyInputs(form){
	let allInputs = form.getElementsByTagName('input');

	for (var i = 0; i < allInputs.length; i++) {
		var input = allInputs[i];

		if (input.name && !input.value) {
			input.name = '';
		}
	}
}

/**
 * Event Listeners
*/

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
	let cart;

	//cart will work only if user is authorized
	if (openCartBtn.length > 0) {
		cart = new Cart(openCartBtn); 
	
		let addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];
		if (addToCartButton){
			ServerInteract.getFromCatalog({
				column: 'id',
				value: addToCartButton.getAttribute('data-book-id')
			})
				.then(res => {
					console.log(res);
					addToCartButton.onclick = () => cart.add(res);
				});
		}
	} else{
		cart = new Cart(null);	
	}
	
	let Render = new RenderElements(); 

	ServerInteract.getFromCatalog('specialMark', 'ARRIVALS')
		.then(res => Render.carouselItems(arrivalCarouselSection, res, cart));
	ServerInteract.getFromCatalog('specialMark', 'BESTSELLER')
		.then(res => Render.bestseller(bestsellerContainer, res));
	ServerInteract.getFromCatalog('specialMark', 'EXCLUSIVE')
		.then(res => Render.exclusiveBooks(exclusivesContainer, res, cart));

	ServerInteract.getCategories(Render.categoriesList, document.getElementsByClassName('sf-select')[0]);

	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
});

document.getElementsByClassName('sf')[0].onsubmit = function(){clearEmptyInputs(this);};
