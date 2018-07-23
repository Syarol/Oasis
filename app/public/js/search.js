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

/**
 * Global variables
*/

var closeBookModal = document.getElementById('close_book_modal');
var categoriesList = document.getElementById('categories_list');
var authorsList = document.getElementById('authors_list');
var publishersList = document.getElementById('publishers_list');
var categoriesListTitle = document.getElementById('categories_list_title');
var authorsListTitle = document.getElementById('authors_list_title');
var publishersListTitle = document.getElementById('publishers_list_title');
var contactModalLink = document.getElementById('contact');
var foundedShowMore =  document.getElementById('founded_show_more');
var closeContactModal = document.getElementById('close-contact-modal');
var goodsInCart = [];
var contactModal = document.getElementById('about_section_wrapper');
var openCart = document.getElementById('cart_open');
var cart;
var ServerInteraction;

/**
 * Functions
*/

function changePlusMinus(item){
	if (item.className == 'far fa-minus-square') {
		item.className = 'far fa-plus-square';
	} else if(item.className == 'far fa-plus-square'){
		item.className = 'far fa-minus-square';
	}	
}

function sidelistOnClick(list, listId){
	for (let item of document.querySelectorAll(listId + ' h3 i.far')){
		changePlusMinus(item);
	}
	if (list.style.maxHeight == '500px') {
		list.style.maxHeight = '30px';
	} else list.style.maxHeight = '500px';
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

function showSearchQuery(query, foundedLength){
	let searchText = foundedLength + ' results ';
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

categoriesListTitle.onclick = () => sidelistOnClick(categoriesList, '#categories_list');

authorsListTitle.onclick = () => sidelistOnClick(authorsList, '#authors_list');

publishersListTitle.onclick = () => sidelistOnClick(publishersList, '#publishers_list');

document.addEventListener('DOMContentLoaded', () => {
	cart = new Cart(openCart, goodsInCart);
	
	ServerInteraction = new ServerInteract();
	let Render = new RenderElements(); 
	
	let query = getSearchQueryFromURL(window.location.search);
	ServerInteraction.getFoundedAndRender(query, Render.founded, cart).then(
		function(res){
			let founded = document.getElementsByClassName('founded-item');

			if (founded.length > 12){
				for (let i = 12; i < founded.length; i++) {
					founded[i].style.display = 'none';
					foundedShowMore.style.display = 'block';
				}
			}

			showSearchQuery(query, founded.length);
		},
		function(err){
			console.log(err);
		}
	);

	ServerInteraction.getList('categories', 'categories_list', Render.checkList);
	ServerInteraction.getList('author', 'authors_list', Render.checkList);
	ServerInteraction.getList('publisher', 'publishers_list', Render.checkList);

	

	new GoogleMap();//connect and load map of shop location

}); 

foundedShowMore.onclick = () => {
	let founded = document.getElementsByClassName('founded-item');
	if (founded.length > 12){
		for (let i = 0; i < 12; i++) {
			founded[i].style.display = 'none';
		}
		for (let i = 12; i < founded.length; i++) {
			founded[i].style.display = 'grid';
		}

	}
	foundedShowMore.style.display = 'none';
	document.getElementById('founded_hide_more').style.display = 'block';
};

document.getElementById('founded_hide_more').onclick = () => {
	let founded = document.getElementsByClassName('founded-item');
	if (founded.length > 12){
		for (let i = 0; i < 12; i++) {
			founded[i].style.display = 'grid';
		}

		for (let i = 12; i < founded.length; i++) {
			founded[i].style.display = 'none';
		}
	}
	foundedShowMore.style.display = 'block';
	document.getElementById('founded_hide_more').style.display = 'none';
};

document.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == document.getElementById('book_modal_wrapper')) {
		document.getElementById('book_modal_wrapper').style.display = 'none';
	}
};

contactModalLink.onclick = () => contactModal.style.display = 'flex';

closeContactModal.onclick = () => contactModal.style.display = 'none';

document.getElementById('send_message').onclick = () => ServerInteraction.sendMessage(document.getElementById('contact-form'));

closeBookModal.onclick = () => document.getElementById('book_modal_wrapper').style.display = 'none';

document.getElementById('input_book_title').onclick = function() {cart.addToCartArray(JSON.parse(this.getAttribute('name')));}; 
