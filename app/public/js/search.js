/**
 * Oasis bookstore site
 *
 * Search page
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
import Pagination from './Pagination.js';

/**
 * Global variables
*/

let sidebar = document.getElementsByClassName('sidebar-container')[0];
var categoriesList = document.getElementsByClassName('sidebar-categories-list')[0];
var priceRangeContainer = document.getElementsByClassName('sidebar-price-range-container')[0];
var authorsList = document.getElementsByClassName('sidebar-authors-list')[0];
var publishersList = document.getElementsByClassName('sidebar-publishers-list')[0];
var contactModal = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactModalLink = document.getElementsByClassName('footer-contact')[0];
var closeContactModal = document.getElementsByClassName('cu-modal-close')[0];
var openCart = document.getElementsByClassName('header-cart-container')[0];
var bookModal = document.getElementsByClassName('bm-wrapper')[0];
var closeBookModal = bookModal.getElementsByClassName('close-modal')[0];
var cart;
var ServerInteraction;

/**
 * Functions
*/

function sidelistOnClick(list, maxHeight){
	if (list.style.maxHeight == maxHeight || list.style.maxHeight == '') {
		list.style.maxHeight = '0';
	} else list.style.maxHeight = maxHeight;

	let angleSvg = list.parentNode.getElementsByClassName('fas')[0];
	if (angleSvg.style.transform == 'rotate(0deg)' || angleSvg.style.transform == ''){
		angleSvg.style.transform = 'rotate(180deg)';
	} else angleSvg.style.transform = 'rotate(0deg)';
}

function showSearchQuery(query, findedLength){
	let searchText = findedLength + ' results ';
	if (query.query && query.query != '') {
		searchText += 'for "' + query.query + '"';	
	}
	for (let property in query){
		if (property != 'searchType' && property != 'query' && query[property] != '') {
			if (searchText.includes('of')) {
				searchText += ' and "' + property + '" : "' + query[property] + '"';
			} else{
				searchText += ' of "' + property + '" : "' + query[property] + '"';
			}
		}
	}
	document.getElementById('search-text').textContent = searchText;
}

/*if the input value is empty then removes it for simplified form submit*/
function clearEmptyInputs(form){
	Array.from(form.getElementsByTagName('input')) //gets array of input elements inside the form
		.map(input => {
			/*clears name if input value empty*/
			if (input.name && !input.value) {
	            input.name = '';
	        }
		})
}

function syncPriceInputs(hiddenInput, priceInput){
	for (let item of hiddenInput){
		item.value = priceInput.value;
	}
}

function getObjectFromUrlQuery(){
	if (window.location.search.length != 0)
		return window.location.search
	  		.slice(1)
			.split('&')
			.map(p => p.split('='))
			.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
	else return null;
}

/**
 * Event Listeners
*/

categoriesList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	sidelistOnClick(categoriesList, '200px');

authorsList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	sidelistOnClick(authorsList, '200px');

publishersList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	sidelistOnClick(publishersList, '200px');

priceRangeContainer.parentNode.getElementsByClassName('btn')[0].onclick = () =>
	sidelistOnClick(priceRangeContainer, '30px');

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, document.getElementsByClassName('header-cart-count')[0]);

	ServerInteraction = new ServerInteract();
	let Render = new RenderElements(); 
	
	let query = getObjectFromUrlQuery();
	if(!query){
		document.getElementById('search-text').textContent = 'You need to search first';
	}

	ServerInteraction.getFinded(query).then(
		function(res){
			new Pagination(res, document.getElementsByClassName('pagination'), cart, document.getElementsByClassName('fi-per-page')[0]);

			showSearchQuery(query, res.length);
		},
		function(err){
			console.log(err);
		}
	);

	ServerInteraction.getList('categories', categoriesList, Render.checkList);
	ServerInteraction.getLowHigh(document.getElementsByClassName('sidebar-low-price')[0], document.getElementsByClassName('sidebar-high-price')[0]);
	ServerInteraction.getList('author', authorsList, Render.checkList);
	ServerInteraction.getList('publisher', publishersList, Render.checkList);

	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

/*hides modal windows*/
document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == bookModal) {
		bookModal.style.display = 'none';
	}
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementsByClassName('cu-form-send-btn')[0].onclick = () => ServerInteraction.sendMessage(document.getElementsByClassName('cu-form')[0]);

closeBookModal.onclick = () => bookModal.style.display = 'none';

bookModal.getElementsByClassName('bm-buy-button')[0].onclick = function() {cart.add(JSON.parse(this.getAttribute('name')));}; 

document.getElementsByClassName('sidebar-open-btn')[0].onclick = () => sidebar.style.transform = 'translateX(100%)';

document.getElementsByClassName('sidebar-hide-btn')[0].onclick = () => sidebar.style.transform = 'translateX(0)';

document.getElementsByClassName('big-search-form')[0].onsubmit = function(){clearEmptyInputs(this)};

document.getElementsByClassName('header-search-form')[0].onsubmit = function(){clearEmptyInputs(this)};

document.getElementsByClassName('sidebar-low-price')[0].onchange = function(){
	syncPriceInputs(document.getElementsByClassName('sf-low-price'), this);
};

document.getElementsByClassName('sidebar-high-price')[0].onchange = function(){
	syncPriceInputs(document.getElementsByClassName('sf-high-price'), this);
};