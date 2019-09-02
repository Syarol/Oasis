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

import contactModal from './contactModal.js'; 

/**
 * Global variables
*/

var sidebar = document.getElementsByClassName('sidebar-container')[0];
var categoriesList = document.getElementsByClassName('sidebar-categories-list')[0];
var priceRangeContainer = document.getElementsByClassName('sidebar-price-range-container')[0];
var authorsList = document.getElementsByClassName('sidebar-authors-list')[0];
var publishersList = document.getElementsByClassName('sidebar-publishers-list')[0];
var contact = document.getElementsByClassName('cu-modal-wrapper')[0];
var contactLink = document.getElementsByClassName('footer-contact')[0];
var openCart = document.getElementsByClassName('header-cart-wrapper')[0];
var cart;

/**
 * Functions
*/

function operateSidebarFilter(list, maxHeight){
	list.style.maxHeight = list.style.maxHeight == maxHeight || list.style.maxHeight == '' ? '0' : maxHeight;

	let angleSvg = list.parentNode.getElementsByClassName('fa-angle-down')[0];
	angleSvg.style.transform = angleSvg.style.transform == 'rotate(0deg)' || angleSvg.style.transform == '' ? 'rotate(180deg)' : 'rotate(0deg)';
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

function getObjectFromUrlQuery(query){
	if (query.length != 0)
		return query.slice(1)
			.split('&')
			.map(p => p.split('='))
			.reduce((obj, [key, value]) => ({...obj, [key]: decodeURIComponent(value.replace(/\+/g, ' '))}), {});
	else return null;
}

/**
 * Event Listeners
*/

categoriesList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	operateSidebarFilter(categoriesList, '200px');

authorsList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	operateSidebarFilter(authorsList, '200px');

publishersList.parentNode.getElementsByClassName('btn')[0].onclick = () => 
	operateSidebarFilter(publishersList, '200px');

priceRangeContainer.parentNode.getElementsByClassName('btn')[0].onclick = () =>
	operateSidebarFilter(priceRangeContainer, '30px');

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, document.getElementsByClassName('header-cart-count')[0]);
	let Render = new RenderElements(); 
	
	let query = getObjectFromUrlQuery(window.location.search);
	if(!query){
		document.getElementById('search-text').textContent = 'You need to search first';
	}

	ServerInteract.getFinded(query)
		.then(res => {
			new Pagination(res, document.getElementsByClassName('pagination'), cart, document.getElementsByClassName('fi-per-page')[0]);

			showSearchQuery(query, res.length);
		});

	for (let i in query){
		if (query[i].includes(','))	query[i] = query[i].split(', ');
	}

	ServerInteract
		.getCategories(Render.checkList, {list: query.categories, parent: categoriesList, class: 'sf-categories'})
		.getLowHigh((prices) => {
			let lowInput = document.getElementsByClassName('sidebar-low-price')[0];
			let highInput = document.getElementsByClassName('sidebar-high-price')[0];
			let pageUrlObj = getObjectFromUrlQuery(window.location.search);
			prices = prices[0];
			
			if (pageUrlObj.lowPrice){
				lowInput.value = pageUrlObj.lowPrice;
				syncPriceInputs(document.getElementsByClassName('sf-low-price'), lowInput);
			} else 
				lowInput.value = prices.low.toFixed(2);

			if (pageUrlObj.highPrice){
				highInput.value = pageUrlObj.highPrice;
				syncPriceInputs(document.getElementsByClassName('sf-high-price'), highInput);
			} else 	
				highInput.value = prices.high.toFixed(2);
		})
		.getAuthors(Render.checkList, {list: query.author, parent: authorsList, class: 'sf-author'})
		.getPublishers(Render.checkList, {list: query.publisher, parent: publishersList, class: 'sf-publisher'});

	new contactModal(contact, contactLink); //logic of contact modal
	new GoogleMap(document.getElementsByClassName('cu-map-container')[0]);//connect and load map of shop location
}); 

document.getElementsByClassName('sidebar-open-btn')[0].onclick = () => {
	document.body.classList.add('scroll-disabled');
	sidebar.classList.add('sidebar-open');
	sidebar.classList.remove('sidebar-hide');
};

sidebar.getElementsByClassName('sidebar-hide-btn')[0].onclick = () => {
	document.body.classList.remove('scroll-disabled');
	sidebar.classList.remove('sidebar-open');
	sidebar.classList.add('sidebar-hide');
};

document.getElementsByClassName('big-search-form')[0].onsubmit = function(){clearEmptyInputs(this)};

document.getElementsByClassName('header-search-form')[0].onsubmit = function(){clearEmptyInputs(this)};

sidebar.getElementsByClassName('sidebar-low-price')[0].onchange = function(){
	syncPriceInputs(document.getElementsByClassName('sf-low-price'), this);
};

sidebar.getElementsByClassName('sidebar-high-price')[0].onchange = function(){
	syncPriceInputs(document.getElementsByClassName('sf-high-price'), this);
};