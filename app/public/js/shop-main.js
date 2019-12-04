/**
 * Oasis bookstore site
 *
 * Shop page
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import Cart from './cart.js';
import GoogleMap from './googleMap.js'; //for connecting and loading map of shop location
import ServerInteract from './ServerInteraction.js'; //for swap data between server and client
import RenderElements from './RenderElements.js'; //for render DOM elements

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

const recommendsSection = document.getElementsByClassName('cr-recommends-section')[0];
const bestsellerSection = document.getElementsByClassName('cr-bestsellers-section')[0];
const arrivalsSection = document.getElementsByClassName('cr-arrivals-section')[0];

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
			};
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

	ServerInteract.getFromCatalog({column:'specialMark', value:'RECOMMEND'})
		.then(res => Render.carouselItems(recommendsSection, res, cart));
	ServerInteract.getFromCatalog({column:'specialMark', value:'BESTSELLERS'})
		.then(res => Render.carouselItems(bestsellerSection, res, cart));
	ServerInteract.getFromCatalog({column:'specialMark', value:'ARRIVALS'})
		.then(res => Render.carouselItems(arrivalsSection, res, cart));

	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
});

document.getElementsByClassName('sb-all-link')[0].onclick = () => {
	window.location.href = '/search?query=&searchType=full-search';
};