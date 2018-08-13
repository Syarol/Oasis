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

var categoriesList = document.getElementById('categories-list');
var priceRangeContainer = document.getElementsByClassName('aside-nav-price-range-container')[0];
var authosList = document.getElementById('authors-list');
var publishersList = document.getElementById('publishers-list');
var closeBookModal = document.getElementById('close_book_modal');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var contactModal = document.getElementById('contact-us-wrapper');
var openCart = document.getElementById('cart_open');
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

function getSearchQueryFromURL(url){
	let query = {};

	var queryString = url.split('?')[1];
	if (!queryString) {
		document.getElementById('search-text').textContent = 'You need to search first';
	} else {
		var keyValuePairs = queryString.split('&');
		for (let i of keyValuePairs) {
			var keyValuePair = i.split('=');
			var paramName = keyValuePair[0];
			var paramValue = keyValuePair[1] || '';
			query[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
		}
	}

	return query;
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

/**
 * Event Listeners
*/

categoriesList.parentNode.getElementsByClassName('button')[0].onclick = () => 
	sidelistOnClick(categoriesList, '200px');

authosList.parentNode.getElementsByClassName('button')[0].onclick = () => 
	sidelistOnClick(authosList, '200px');

publishersList.parentNode.getElementsByClassName('button')[0].onclick = () => 
	sidelistOnClick(publishersList, '200px');

priceRangeContainer.parentNode.getElementsByClassName('button')[0].onclick = () =>
	sidelistOnClick(priceRangeContainer, '30px');

for (let element of document.getElementsByClassName('input-number')){
	element.oninput = function(){
		if (this.type == 'number')
			this.value = this.value.replace(/\D/g, '');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();
	let Render = new RenderElements(); 
	
	let query = getSearchQueryFromURL(window.location.search);
	ServerInteraction.getFinded(query).then(
		function(res){
			new Pagination(res, document.getElementsByClassName('pagination'), cart, document.getElementsByClassName('choose-per-page-select')[0]);

			showSearchQuery(query, res.length);

		},
		function(err){
			console.log(err);
		}
	);

	ServerInteraction.getList('categories', 'categories-list', Render.checkList);
	ServerInteraction.getList('author', 'authors-list', Render.checkList);
	ServerInteraction.getList('publisher', 'publishers-list', Render.checkList);

	new GoogleMap();//connect and load map of shop location
}); 

document.onclick = function(e) {
	if (e.target == contactModal) {
		//contactModal.style.display = 'none';
		//contactModal.style.transform = 'scale(0)';
	}

	if (e.target == document.getElementById('book_modal_wrapper')) {
		document.getElementById('book_modal_wrapper').style.display = 'none';
	}
};

contactModalLink.onclick = () => contactModal.style.display = 'flex'; /*{
	contactModal.style.transform = 'scale(1)';
	contactModal.getElementsByClassName('modal-container')[0].style.transform = 'scale(1)';
}*/

closeContactModal.onclick = () => contactModal.style.display = 'none'; /*{
	contactModal.style.transform = 'scale(0)';
	contactModal.getElementsByClassName('modal-container')[0].style.transform = 'scale(0)';
}*/

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));

closeBookModal.onclick = () => document.getElementById('book_modal_wrapper').style.display = 'none';

document.getElementById('input_book_title').onclick = function() {cart.addToCartArray(JSON.parse(this.getAttribute('name')));}; 
