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
 * Functions
*/

function itemHoverBlock(item, cart){
	return createNewEl('div', {
		class: 'cr-el-slider',
		nested: [
			/*goods title*/
			createNewEl('h3', {
				content: item.title
			}),
			/*goods author*/
			createNewEl('span', {
				content: 'by ' + item.author
			}),
			/*goods price*/
			createNewEl('span', {
				content: '$' + item.price
			}),
			/*button of adding to cart (on click)*/
			addToCartButton(item, cart),
			createNewEl('a', {
				href: '/book/' + item.id,
				content: 'Read more'
			})
		]
	});
}

function addToCartButton(item, cart){
	let button = createNewEl('input', {
		type: 'button',
		title: item.title,
		class: 'btn',
		value: 'Add to cart',
		event: {
			click: () => cart.add(item)
		}
	});

	if (item.status != 'In Stock'){
		button.title = item.title + ' not available';
		button.disabled = true;
	}

	return button;
}

/*allows to sync data between hidden inputs of forms*/
function syncHiddenIputs(className, checkbox){
	let hiddenInput = document.getElementsByClassName(className); //inputs that stores data of checked element

	let da = [];//array of checked elements

	/*if element checked then add his data to search list element*/
	if (hiddenInput[0].value) {
		da = JSON.parse(hiddenInput[0].value);

		if (checkbox.checked) {
			if (!da.includes(checkbox.value))	da.push(checkbox.value);
		} else {
			da.splice(da.indexOf(checkbox.value), 1);

			if (da.length == 0) da = '';
		}
	} else {
		if (checkbox.checked) {
			da.push(checkbox.value);
		}
	}

	/*sync hidden inputs with data in forms*/
	for (let hidden of hiddenInput){
		if (da.length > 0) {
			hidden.value = JSON.stringify(da);
		} else hidden.value = '';

		console.log(hidden.value);
	}
}

/**
 * Class
*/

export default class RenderElements{
	/*render bestseller section of main page*/
	bestseller(parent, data){
	   	bestsellerPreview(parent, data);

	   	/*render short information in section of main page*/
		function bestsellerPreview(parent, data){
			/*goods image*/
			createNewEl('img', {
				class: 'bae-book-photo',
				src: data.thumbnailUrl
			}, parent);
			/*short description of the goods*/
			createNewEl('span', {
				class: 'text-container',
				content: data.shortDescription
			}, parent);
			/*button that opens modal window on click */
			createNewEl('a', {
				class: 'btn',
				content: 'Read more',
				href: `/book/${data.id}`
			}, parent);
		}
	}

	/*render exclusive section of main page*/
	exclusiveBooks(parent, data, cart){
		/*render every element of given array one by one*/
		for (let item of data){
			/*goods image with nested block of goods main information*/
			createNewEl('div', {
				class: 'cr-el',
				style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
				nested: [
					/*block that wrapped main information*/
					itemHoverBlock(item, cart),
				]
			}, parent);
		}
	}

	/*render list of goods categories*/
	categoriesList(list, parent){
		/*adds every category as option element*/
		for (let item of list){
		   	createNewEl('option', {
		   		content: item.category,
		   		value: item.id
		   	}, parent);
		}
	}

	/*render carousel*/
	carouselItems(parent, data, cart){
		/*for render elements of carousel one by one three times*/
		for (let i = 0; i < 3; i++){
			for (let item of data){
				/*goods image with nested block of goods main information*/
				createNewEl('div', {
					class: 'cr-el',
					style: 'background-image:url(' + item.thumbnailUrl + ')', //goods image
					nested: [
						/*block that wrapped main information*/
						itemHoverBlock(item, cart)
					]
				}, parent.getElementsByClassName('cr-container')[0]);
			}
		}

		/*creates the carousel of rendered elements*/
		new Carousel(parent.getElementsByClassName('cr-right-control')[0], parent.getElementsByClassName('cr-left-control')[0], parent.getElementsByClassName('cr-container')[0]);
	}

	/*render finded goods*/
	finded(item, cart){
		/*goods wrapper block*/
		createNewEl('div', {
	 		class: 'fi', 
	 		event: {
	 			click: (e) => {
	 				if (!e.target.classList.contains('btn')) 
	 					window.location.href = `/book/${item.id}`;
	 			}
	 		},
	 		title: 'Click to open page of goods',
	 		nested: [
	 			/*goods image*/
	 			createNewEl('img', {
	 				class: 'fi-photo',
	 				pseudo: item.title,
	 				src: item.thumbnailUrl
	 			}),
	 			/*goods title*/
	 			createNewEl('h3', {
	 				content: item.title
	 			}),
	 			/*goods author*/
	 			createNewEl('span', {
	 				content: 'by ' + item.authors
	 			}),
	 			/*goods price*/
	 			createNewEl('span', {
	 				content: '$' + item.price,
	 				class: 'fi-price'
	 			}),
	 			/*button of adding to cart (on click)*/
	 			addToCartButton(item, cart)
	 		]
	 	}, document.getElementsByClassName('fi-items-container')[0]);
	}

	/*render aside checklist menu on search page*/
	checkList(list, data){
		let previousSearchList = [];

		if (data.list){
			try {
				previousSearchList = JSON.parse(data.list);
			} catch(ex) {
				previousSearchList = data.list;
			}
		}
		/*render checklist items one by one*/
		for (let item of list){
			let checkItem = '';

			let itemName = item.category || item.author || item.publisher || item;
			let itemValue = String(item.id) || item.publisher || item;

			/*if in previos search filters were used - then shows it*/
			if (previousSearchList.includes(itemValue)) {
				checkItem = 'checked';

				syncHiddenIputs(data.class, {checked: checkItem, value: itemValue});
			}
			/*render checkbox that contain main information*/
			createNewEl('label', {
				nested: [
					createNewEl('input', {
						type: 'checkbox',
						name: itemName,
						value: itemValue,
						checked: checkItem,
						event: {
							click: function (e){
								syncHiddenIputs(data.class, e.target);
							}
						}
					}),
					/*render checkbox label text*/
					createNewEl('span', {
						content: itemName
					}, data.parent)
				]
			}, data.parent);
		}
	}
}