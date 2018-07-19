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
import {Carousel} from './carousel.js'; //for creating carousel

/**
 * Class
*/

export default class RenderElements{
	/*render bestseller section of main page*/
	bestseller(parent, data, cart){
	   	bestsellerPreview(parent[0], data[0]);
	   	bestsellerModal(parent[1], data[0], cart);

	   	/*render short information in section of main page*/
		function bestsellerPreview(parent, data){
			/*goods image*/
			createNewEl('div', parent, {
				class: 'book-photo-container center-cover-no-repeat',
				style: 'background-image:url(' + data.thumbnailUrl + ')'
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
					call: () => document.getElementById('bestseller_modal_wrapper').style.display = 'flex'
				}}
			});
		}

		/*render all information in modal window*/
		function bestsellerModal(parent, data, cart){
			/*goods title*/
			createNewEl('h3', parent, {
				content: data.title
			});
			/*goods image*/
			createNewEl('img', parent, {
				class: 'modal-photo',
				src:  data.thumbnailUrl
			});
			/*goods author*/
			createNewEl('span', parent, {
				class: 'author',
				content: 'by ' + data.author
			});
			/*goods categories*/
			createNewEl('span', parent, {
				class: 'category',
				content: data.categories
			});
			/*goods description*/
			createNewEl('span', parent, {
				class: 'text-container',
				content: data.description
			});
			/*goods price and button of adding to cart (on click)*/
			createNewEl('span', parent, {
				class: 'price',
				content: data.price,
				nested:[
					createNewEl('input', false, {
						type: 'button',
						name: data.title,
						class: 'button',
						value: 'Add to cart',
						title: 'Add to cart',
						event: {click: {
							call: () => cart.addToCartArray(data)
						}}
					})
				]
			});
		}
	}

	/*render exclusive section of main page*/
	exclusiveBooks(parent, data, cart){
		/*render every element of given array one by one*/
		for (let item of data){
			/*goods image with nested block of goods main information*/
			createNewEl('div', parent, {
				class: 'arrival-item carousel-item',
				style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
				nested: [
					/*block that wrapped main information*/
					createNewEl('div', false, {
						class: 'arrival-item-inf grid-center-items',
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
								content: item.price
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
							}),
							/*special label*/
							createNewEl('span', false, {
								class: 'on-sale',
								content: 'SALE!'
							})
						]
					})
				]
			});
		}
	}

	/*render list of goods categories*/
	categoriesList(list, parent){
		console.log(list);
		/*adds every category as option element*/
		for (let item of list){
		   	createNewEl('option', parent, {
		   		content: item
		   	});
		}
	}

	/*render carousel*/
	carouselItems(parent, data, cart){
		/*for first render elements of carousel one by one without repeating*/
		for (let item of data){
			/*goods image with nested block of goods main information*/
			createNewEl('div', parent.getElementsByClassName('carousel')[0], {
				class: 'arrival-item carousel-item',
				style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
				nested: [
				/*block that wrapped main information*/
					createNewEl('div', false, {
						class: 'arrival-item-inf grid-center-items',
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
								content: item.price
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
					})
				]
			});
		}

		/*creates the carousel of rendered elements*/
		new Carousel(parent.getElementsByClassName('right-control')[0], parent.getElementsByClassName('left-control')[0], parent.getElementsByClassName('carousel')[0]);
	}

	/*render founded goods*/
	founded(data, cart){
		console.log(cart);
		/*render founded goods one by one*/
		for (let item of data){
			/*goods wrapper block*/
			createNewEl('div', document.getElementById('founded_section'), {
		 		class: 'founded-item grid-center-items', 
		 		nested: [
		 			/*goods image*/
		 			createNewEl('img', false, {
		 				class: 'founded-item-photo',
		 				pseudo: item.title,
		 				src: item.thumbnailUrl
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
		 				content: item.price
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
	}

	/*render aside checklist menu on search page*/
	checkList(list, parent, column){
		/*render checklist items one by one*/
		for (let item of list){
			/*render checkbox that contain main information*/
			createNewEl('input', document.getElementById(parent), {
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
			});
			/*render checkbox label*/
			createNewEl('span', document.getElementById(parent), {
				content: item
			});
		}
	}

}