/**
 * Module with functions that render some interface parts of goods
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import createNewEl from './createNewElement.js';

/**
 * Class
*/

export default class RenderElements{
	bestseller(parent, data, addToCart){
	   	bestsellerPreview(parent[0], data[0]);
	   	bestsellerModal(parent[1], data[0]);

		function bestsellerPreview(parent, data){
			createNewEl('div', parent, {
				class: 'book-photo-container center-cover-no-repeat',
				style: 'background-image:url(' + data.thumbnailUrl + ')'
			});
			createNewEl('span', parent, {
				class: 'text-container',
				content: data.shortDescription
			});
			createNewEl('span', parent, {
				id: 'open_bestseller_modal',
				class: 'button grid-center-items',
				content: 'Quick view',
				event: {click: {
					call: () => bestsellerModalWrapper.style.display = 'flex'
				}}
			});
		}

		function bestsellerModal(parent, data){
			createNewEl('h3', parent, {
				content: data.title
			});
			createNewEl('img', parent, {
				class: 'modal-photo',
				src:  data.thumbnailUrl
			});
			createNewEl('span', parent, {
				class: 'author',
				content: 'by ' + data.author
			});
			createNewEl('span', parent, {
				class: 'category',
				content: data.categories
			});
			createNewEl('span', parent, {
				class: 'text-container',
				content: data.description
			});
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
							call: () => addToCart(data)
						}}
					})
				]
			});
		}
	}

	exclusiveBooks(parent, data, addToCart){
		for (let item of data){
			createNewEl('div', parent, {
				class: 'arrival-item carousel-item',
				style: 'background-image:url(' + item.thumbnailUrl + ')',
				nested: [
					createNewEl('div', false, {
						class: 'arrival-item-inf grid-center-items',
						nested: [
							createNewEl('h3', false, {
								content: item.title
							}),
							createNewEl('span', false, {
								content: 'by ' + item.author
							}),
							createNewEl('span', false, {
								content: item.price
							}),
							createNewEl('span', false, {
								content: item.categories
							}),
							createNewEl('input', false, {
								type: 'button',
								title: item.title,
								class: 'button',
								value: 'Add to cart',
								event: {click: {
									call: () => addToCart(data)
								}}
							}),
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

	categoriesList(list, parent){
		console.log(list);
		for (let item of list){
		   	createNewEl('option', parent, {
		   		content: item
		   	});
		}
	}

	carouselItems(parent, data, addToCart){
		for (let item of data){
			createNewEl('div', parent, {
				class: 'arrival-item carousel-item',
				style: 'background-image:url(' + item.thumbnailUrl + ')',
				nested: [
					createNewEl('div', false, {
						class: 'arrival-item-inf grid-center-items',
						nested: [
							createNewEl('h3', false, {
								content: item.title
							}),
							createNewEl('span', false, {
								content: 'by ' + item.author
							}),
							createNewEl('span', false, {
								content: item.price
							}),
							createNewEl('span', false, {
								content: item.categories
							}),
							createNewEl('input', false, {
								type: 'button',
								title: item.title,
								class: 'button',
								value: 'Add to cart',
								event: {click: {
									call: () => addToCart(item)
								}}
							})
						]
					})
				]
			});
		}
	}

	founded(data, addToCart){
		for (let item of data){
			createNewEl('div', document.getElementById('founded_section'), {
		 		class: 'founded-item grid-center-items', 
		 		nested: [
		 			createNewEl('img', false, {
		 				class: 'founded-item-photo',
		 				pseudo: item.title,
		 				src: item.thumbnailUrl
		 			}),
		 			createNewEl('h3', false, {
		 				content: item.title
		 			}),
		 			createNewEl('span', false, {
		 				content: 'by ' + item.author
		 			}),
		 			createNewEl('span', false, {
		 				content: item.price
		 			}),
		 			createNewEl('input', false, {
		 				type: 'button',
		 				name: item.title,
		 				class: 'button',
		 				value: 'Add to cart',
		 				event: {click:{
		 					call: () => addToCart(item)
		 				}}
		 			})
		 		]
		 	});
		}
	}

	checkList(list, parent, column){
		for (let item of list){
			createNewEl('input', document.getElementById(parent), {
				type: 'checkbox',
				name: item,
				value: item,
				event: {click:{
					call: function (){
						let hiddenInput = document.querySelector('input[name=' + column + ']');
						if (this.checked) {
							if (hiddenInput.value == '') hiddenInput.value += this.value;
							else hiddenInput.value += ', ' + this.value ;
						} else hiddenInput.value = hiddenInput.value.replace(this.value + ', ', '');
				   	}
			   	}}
			});
			createNewEl('span', document.getElementById(parent), {
				content: item
			});
		}
	}

}