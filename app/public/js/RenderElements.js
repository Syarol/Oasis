/**
 * Module with functions that render some interface parts of goods
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Imports
*/

import createNewEl from './createNewElement.js'; //for creating new DOM elements
import Carousel from './carousel.js'; //for creating carousel

/**
 * Class
*/

export default class RenderElements{
	/*render bestseller section of main page*/
	bestseller(parent, data, cart){
	   	bestsellerPreview(parent[0], data[0]);
	   	document.getElementById('input_book_title').onclick = () => cart.addToCartArray(data[0]);

	   	/*render short information in section of main page*/
		function bestsellerPreview(parent, data){
			/*goods image*/
			createNewEl('img', parent, {
				class: 'book-photo-container',
				src: data.thumbnailUrl
			});
			/*short description of the goods*/
			createNewEl('span', parent, {
				class: 'text-container',
				content: data.shortDescription
			});
			/*button that opens modal window on click */
			createNewEl('span', parent, {
				id: 'open_bestseller_modal',
				class: 'button grid-center-items',
				content: 'Quick view',
				event: {click: {
					call: () => {						
						document.getElementById('bestseller-modal-wrapper').style.display = 'flex'; //open modal window
						document.getElementById('book_title').textContent = data.title; //show goods title
						document.getElementById('book_photo').setAttribute('src', data.thumbnailUrl); //show goods image
						document.getElementById('book_author').textContent = 'Author: ' + data.author; //show goods author
						document.getElementById('book-modal-isbn').textContent = 'ISBN: ' + data.isbn; //show goods isbn
						document.getElementById('book-modal-publisher').textContent  = 'Publisher: ' + data.publisher; //show goods prise
						document.getElementById('book_categories').textContent = 'Categories: ' + data.categories; //show goods categories
						document.getElementById('book_description').textContent = data.shortDescription; //show goods description
						document.getElementById('book_price').textContent  = 'Price: $' + data.price; //show goods prise
						document.getElementById('input_book_title').setAttribute('name', JSON.stringify(data)); //set goods data in 'add to cart' button (needs to addding to cart operation)
					}
				}}
			});
		}
	}

	/*render exclusive section of main page*/
	exclusiveBooks(parent, data, cart){
		/*render every element of given array one by one*/
		for (let item of data){
			/*goods image with nested block of goods main information*/
			createNewEl('div', parent, {
				class: 'carousel-item',
				style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
				nested: [
					/*block that wrapped main information*/
					createNewEl('div', false, {
						class: 'carousel-item-inf grid-center-items',
						nested: [
							/*goods title*/
							createNewEl('h3', false, {
								content: item.title
							}),
							/*goods author*/
							createNewEl('span', false, {
								content: 'by ' + item.author
							}),
							/*goods price*/
							createNewEl('span', false, {
								content: '$' + item.price
							}),
							/*goods categories*/
							createNewEl('span', false, {
								content: item.categories
							}),
							/*button of adding to cart (on click)*/
							createNewEl('input', false, {
								type: 'button',
								title: item.title,
								class: 'button',
								value: 'Add to cart',
								event: {click: {
									call: () => cart.addToCartArray(item)
								}}
							})
						]
					}),
					/*special label*/
					createNewEl('span', false, {
						class: 'on-sale',
						content: 'SALE!'
					})
				]
			});
		}
	}

	/*render list of goods categories*/
	categoriesList(list, parent){
		/*adds every category as option element*/
		for (let item of list){
		   	createNewEl('option', parent, {
		   		content: item
		   	});
		}
	}

	/*render carousel*/
	carouselItems(parent, data, cart){
		/*for render elements of carousel one by one three times*/
		for (let i = 0; i < 3; i++){
			for (let item of data){
				/*goods image with nested block of goods main information*/
				createNewEl('div', parent.getElementsByClassName('carousel')[0], {
					class: 'carousel-item',
					style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
					nested: [
					/*block that wrapped main information*/
						createNewEl('div', false, {
							class: 'carousel-item-inf grid-center-items',
							nested: [
								/*goods image*/
								createNewEl('h3', false, {
									content: item.title
								}),
								/*goods author*/
								createNewEl('span', false, {
									content: 'by ' + item.author
								}),
								/*goods price*/
								createNewEl('span', false, {
									content: '$' + item.price
								}),
								/*goods categories*/
								createNewEl('span', false, {
									content: item.categories
								}),
								/*button of adding to cart (on click)*/
								createNewEl('input', false, {
									type: 'button',
									goods: JSON.stringify({title:item.title, price: item.price}),
									class: 'button',
									value: 'Add to cart',
									event: {click: {
										call: () => cart.addToCartArray(item)
									}}
								})
							]
						})
					]
				});
			}
		}

		/*creates the carousel of rendered elements*/
		new Carousel(parent.getElementsByClassName('right-control')[0], parent.getElementsByClassName('left-control')[0], parent.getElementsByClassName('carousel')[0]/*, cart.addToCartArray*/);
	}

	/*render finded goods*/
	finded(item, cart){
		/*goods wrapper block*/
		createNewEl('div', document.getElementById('finded-items-container'), {
	 		class: 'finded-item grid-center-items', 
	 		nested: [
	 			/*goods image*/
	 			createNewEl('img', false, {
	 				class: 'finded-item-photo',
	 				pseudo: item.title,
	 				src: item.thumbnailUrl,
	 				/*on photo click open modal window with information about goods*/
	 				event: {click: {
	 					call: () => {
							document.getElementById('book_modal_wrapper').style.display = 'flex'; //open modal window
							document.getElementById('book_title').textContent = item.title; //show goods title
							document.getElementById('book_photo').setAttribute('src', item.thumbnailUrl); //show goods image
							document.getElementById('book_author').textContent = 'Author: ' + item.author; //show goods author
							document.getElementById('book-modal-isbn').textContent = 'ISBN: ' + item.isbn; //show goods isbn
							document.getElementById('book-modal-publisher').textContent  = 'Publisher: ' + item.publisher; //show goods prise
							document.getElementById('book_categories').textContent = 'Categories: ' + item.categories; //show goods categories
							document.getElementById('book_description').textContent = item.shortDescription; //show goods description
							document.getElementById('book_price').textContent  = 'Price: ' + item.price; //show goods prise
							document.getElementById('input_book_title').setAttribute('name', JSON.stringify(item)); //set goods data in 'add to cart' button (needs to addding to cart operation)
						}
	 				}}
	 			}),
	 			/*goods title*/
	 			createNewEl('h3', false, {
	 				content: item.title
	 			}),
	 			/*goods author*/
	 			createNewEl('span', false, {
	 				content: 'by ' + item.author
	 			}),
	 			/*goods price*/
	 			createNewEl('span', false, {
	 				content: '$' + item.price
	 			}),
	 			/*button of adding to cart (on click)*/
	 			createNewEl('input', false, {
	 				type: 'button',
	 				name: item.title,
	 				class: 'button',
	 				value: 'Add to cart',
	 				event: {click:{
	 					call: () => cart.addToCartArray(item)
	 				}}
	 			})
	 		]
	 	});
	}

	/*render aside checklist menu on search page*/
	checkList(list, parent, column){
		/*render checklist items one by one*/
		for (let item of list){
			/*render checkbox that contain main information*/
			createNewEl('label', document.getElementById(parent), {
				nested: [
					createNewEl('input', false, {
						type: 'checkbox',
						name: item,
						value: item,
						event: {click:{
							call: function (){
								let hiddenInput = document.querySelector('input[name=' + column + ']'); //get data of checked element
								/*if element checked then add his data to search list element*/
								if (this.checked) {
									if (hiddenInput.value == '') hiddenInput.value += this.value;
									else hiddenInput.value += ', ' + this.value ;
								} else hiddenInput.value = hiddenInput.value.replace(this.value + ', ', ''); //if false then remove from search list 
						   	}
					   	}}
					}),
					/*render checkbox label text*/
					createNewEl('span', document.getElementById(parent), {
						content: item
					})
				]
			});
			
		}
	}

}