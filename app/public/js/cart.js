/**
 * Cart module
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Import
*/

import createNewEl from './createNewElement.js'; //for creating new DOM elements
import ServerInteract from './ServerInteraction.js'; //for swap data between server and client

/**
 * Functions
*/

function checkRequiredInputsValidity(button, form){
	let inputs = [...form.querySelectorAll('input[required=""]')];
	button.disabled = inputs.every(el => el.checkValidity()) ? false : true;
}

function createInputField(parent, attr){
	let inputContainer = createNewEl('div', {class : 'input'}, parent);

	let inputTag = createNewEl('input', {
		class: 'cm-confirmation-form-input',
		type : attr.input.type, 
		required: attr.input.required
	}, inputContainer);

	if (attr.input.pattern) {
		inputTag.setAttribute('pattern', attr.input.pattern);
	}

	createNewEl('label', {
		content: attr.label.text,
		class: 'input-label-no-focus'
	}, inputContainer);
	createNewEl('span', {class : 'focus-border'}, inputContainer);
}

function swapLastTwo(el){
	let elChild = el.children;//return collection of childs
	elChild[elChild.length-1].after(elChild[elChild.length-2]);//swap the last two 
}

/**
 * Class
*/

export default class Cart{
	constructor(openButton, goodsInside = []){
		console.log(openButton);
		this.openButton = openButton;
		this.goodsInside = goodsInside;

		ServerInteract.getCart(inCart => {
			this.goodsInside = inCart;
			this.setModal(openButton)
				.updateAllGoodsTotal();
		});

		return this;
	}

	setModal(openButton){
		let modalWrapper = createNewEl('section', {class: 'cm-wrapper modal-wrapper'}, document.body);
		this.cartModalContainer = createNewEl('div', {
			class: 'cm-container modal-container',
			nested: [
				createNewEl('span', {
					content:'×', 
					class: 'cm-close close-modal',
					title: 'Close',
					event: {
						click: () => this.close(modalWrapper)
		 			}
				})
			]
		}, modalWrapper);

		this.cartHeader = createNewEl('h2', {
			class : 'cm-title',
			content: 'Cart'
		}, this.cartModalContainer);
		this.cartModalTable = createNewEl('div', {
			class : 'cm-table',
			nested : [
				createNewEl('span', {
					class: 'cm-table-row cm-table-first-row grid-center-items',
					nested: [
						createNewEl('span', {content : 'Name'}),
						createNewEl('span', {content : 'Quantity'}),
						createNewEl('span', {content : 'Price'}),
						createNewEl('span', {content : 'Total'})]
				})
			]
		}, this.cartModalContainer);

		let tableLastRow = createNewEl('span', {
			class: 'cm-table-row cm-table-last-row grid-center-items',
			nested: [
				createNewEl('span', {content: 'Total'})
			]
		}, this.cartModalTable);

		this.allTotalPrice = createNewEl('span', {class: 'cm-all-items-total', title: 'Your total'}, tableLastRow);

		this.checkOutContainer = createNewEl('div', {class : 'cm-checkout-container'}, this.cartModalContainer);
		this.confirmationFormContainer = createNewEl('form', {class : 'cm-confirmation-form-container'}, this.cartModalContainer);

		this.buttonsContainer = createNewEl('div', {class : 'cm-btns-container'}, this.cartModalContainer); 

		window.onclick = e => {
			if (e.target == modalWrapper) {
    			this.close(modalWrapper);
			}
		}; 

		openButton.onclick = () => this.openModal(modalWrapper);

		return this;
	}

	add(product){
		var newItemInCart = (item) => {
			item.count = 1;
			item.total = item.price;
			this.goodsInside.push(item);
		};

		if (this.goodsInside.length != 0) {
			let found = false;
			for (let item of this.goodsInside) {
			    if (item.title == product.title) {
		    		item.count++; 
		    		item.total = item.price * item.count;
			    	found = true;
					break;
				}
			}
			if (!found) {
				newItemInCart(product);
			}
		} else {
			newItemInCart(product);
		}

		ServerInteract.syncCart(this.goodsInside);	

		return this;
	}

	clearInside(){
		this.goodsInside = [];
		return this;
	}

	openModal(modalWrapper){
		modalWrapper.style.display = 'flex';
		console.log(this.goodsInside);
		if (this.goodsInside.length == 0) {
			this.openSentenceBanner('Oops! Your cart is empty(');
		} else {
			this.cartHeader.style.display = 'flex';
			this.openGoodsTable();
		}

		return this;
	}

	newItemQuantityContainer(item){
		var itemCount = createNewEl('span', {
			class : 'cm-item-count',
			'data-book-id' : item.id,
			content: item.count
		});
		return createNewEl('span', {
			class : 'cm-item-quantity',
			nested: [
				this.addPlusButton(itemCount, this.goodsInside),
				itemCount,
				this.addMinusButton(itemCount, this.goodsInside)
			]
		});
	}

	newItemRemoveButton(itemId){
		return createNewEl('span', {
			class : 'cm-item-remove',
			title : 'Click for remove',
			'data-book-id' : itemId,
			content : '×',
			event: { 
				click: (button) => {
				   	this.remove(button.target, button.target.parentNode)
				   		.updateAllGoodsTotal();
				}
			}
		});
	}

	remove(item, itemTableRow){
		let cartItem = this.goodsInside.find(cartItem => cartItem.id == item.getAttribute('data-book-id'));
		if (cartItem) {
			let cartItemIndex = this.goodsInside.map(el => el.id).indexOf(cartItem.id);
			this.goodsInside.splice(cartItemIndex, 1);
			itemTableRow.remove();
			if (this.goodsInside.length === 0) {
		      	this.openSentenceBanner('Oops! Your cart is empty(');
		    }
		} else console.log('Item didn\'t in the cart');
		ServerInteract.syncCart(this.goodsInside);	

		return this;
	}

	addPlusButton(itemCountContainer){
		var incrementItemCount = (itemCountContainer) => {
	    	let cartItem = this.goodsInside.find(cartItem => cartItem.id == itemCountContainer.getAttribute('data-book-id'));
	    	cartItem.count++;
       		itemCountContainer.textContent = cartItem.count;

       		let cartItemIndex = this.goodsInside.map(el => el.id).indexOf(cartItem.id);
       		this.updateProductTotal(cartItemIndex, itemCountContainer.parentNode.parentNode);

		    ServerInteract.syncCart(this.goodsInside);
	    };

	    return createNewEl('span', {
	    	class : 'cm-plus-btn',
	    	title : 'Add one',
	    	nested: [createNewEl('i', {class : 'far fa-plus-square'})],
	    	event: {
	    		click: () => incrementItemCount(itemCountContainer)
	    	}
	    });
	}

	addMinusButton(itemCountContainer){
		var decrementCartItem = (itemCountContainer) => {
    	    let cartItem = this.goodsInside.find(cartItem => cartItem.id == itemCountContainer.getAttribute('data-book-id'));
	    	cartItem.count--;
        	itemCountContainer.textContent = cartItem.count;

		    let cartItemIndex = this.goodsInside.map(el => el.id).indexOf(cartItem.id);
       		this.updateProductTotal(cartItemIndex, itemCountContainer.parentNode.parentNode);

		    if (itemCountContainer.textContent == '0') { //if zero number,  then delete
		       	this.remove(itemCountContainer, itemCountContainer.parentNode.parentNode);
		    }

		    ServerInteract.syncCart(this.goodsInside);
	    };

	    return createNewEl('span', {
	    	class : 'cm-minus-btn',
	    	title : 'Remove one',
	    	nested: [createNewEl('i', {class : 'far fa-minus-square'})],
	    	event: {
	    		click: () => decrementCartItem(itemCountContainer)
	    	}
	    });
  	}

	openGoodsTable(){
		this.cartHeader.textContent = 'Cart';
		this.cartModalTable.style.display = 'grid';

		/*if table contains only header and footer rows then creates rows for items inside cart*/
		if (this.cartModalTable.children.length === 2){
			this.createGoodsTableItems(this.cartModalTable);
		}

		this.createButtons(this.buttonsContainer, 'list');

		return this;
	}

	createGoodsTableItems(table){
		console.log(this.goodsInside);
		for (let book of this.goodsInside){
			createNewEl('span', {
			  	class : 'cm-table-row grid-center-items',
			   	nested: [
			   		this.newItemRemoveButton(book.id),
			   		createNewEl('span', {
			   			content: book.title,
			   			class: 'cm-item-name'
			   		}),
			   		this.newItemQuantityContainer(book),
			   		createNewEl('span', {
			   			content: book.price
			   		}),
			   		createNewEl('span', {
			   			content: book.total.toFixed(2),
			   			class: 'cm-item-total'
			   		})
			   	]
			}, table);
			swapLastTwo(this.cartModalTable);
		}

		return this;
	}

	createButtons(parent, page){
	    this.buttonsContainer.style.display = 'flex';

	    /*clears old buttons*/
	    while (this.buttonsContainer.firstChild) {
		    this.buttonsContainer.firstChild.remove();
		}
	        
	    if (page == 'list'){
	    	createNewEl('button', {
	    		class: 'cm-btn btn',
	    		content: 'Check out',
	    		event: {
	    			click: () => {
	    				this.cartModalTable.style.display = 'none';
	    				this.openCheckoutPage();
	    			}
	    		}
	      	}, parent);
	    } else if (page == 'checkout'){
	    	createNewEl('button', {
	    		class: 'cm-btn btn',
	    		content: 'Back',
	    		event: {
	    			click: () => {
	    				this.checkOutContainer.style.display = 'none';
	    				this.openGoodsTable();
	    			}
	    		}
	      	}, parent);
	    	createNewEl('button', {
	    		class: 'cm-btn btn',
	    		content: 'Confirm',
	    		event: {
	    			click: () => {
	    				this.checkOutContainer.style.display = 'none';
	    				this.openContactPage();
	    			}
	    		}
	      	}, parent);
	    } else if (page == 'contact'){
	    	createNewEl('button', {
	    		class: 'cm-btn btn',
	    		content: 'Back',
	    		event: {
	    			click: () => {
	    				this.confirmationFormContainer.style.display = 'none';
	    				this.openCheckoutPage();
	    			}
	    		}
	      	}, parent);
	      	this.confirmButton = createNewEl('button', {
	    		class: 'cm-btn btn',
	    		content: 'Confirm',
	    		disabled: '',
	    		event: {
	    			click: () => {
	    				this.confirmationFormContainer.style.display = 'none';
	    				this.openThanksPage();
	    			}
	    		}
	      	}, parent);
	    } 

	    return this;
	}

  	openCheckoutPage(){
	    this.cartHeader.textContent = 'Confirm order list';
	    this.checkOutContainer.style.display = 'grid';

	    if (this.checkOutContainer.children.length === 0){
	    	this.createCheckOutTable(this.checkOutContainer);
	    }
	    this.createButtons(this.buttonsContainer, 'checkout');

	    return this;
	}

	createCheckOutTable(table){
		createNewEl('span', {content: 'Product'}, table);
	    createNewEl('span', {content: 'Total'}, table);
	    for (let book of this.goodsInside) {
	      createNewEl('span', {content: book.count + ' × ' + book.title}, table);
	      createNewEl('span', {content: '$' + book.total.toFixed(2)}, table);
	    }
	    createNewEl('span', {content: 'Total'}, table);
	    createNewEl('span', {content: this.allTotalPrice.textContent}, table);  

	    return this;
	}

	openContactPage(){
		this.cartHeader.textContent = 'Leave your contacts';
		this.confirmationFormContainer.style.display = 'grid';

		this.checkOutContainer.style.display = 'none';

		if (this.confirmationFormContainer.children.length === 0){
	    	this.createConfirmationForm(this.confirmationFormContainer);
	    }
		this.createButtons(this.buttonsContainer, 'contact');

		return this;
	}

	createConfirmationForm(parent){
		createInputField(parent, {
			input: {
				type: 'text', 
				required: ''},
			label: {
				text: 'First name'}});
		createInputField(parent, {
			input: {
				type: 'text', 
				required: ''},
			label: {
				text: 'Last name'}});
		createInputField(parent, {
			input: {
				type: 'text', 
				required: ''},
			label: {
				text: 'Address'}});
		createInputField(parent, {
			input: {
				type: 'tel', 
				pattern: '[0-9]{6,12}', 
				required: ''},
			label: {
				text: 'Phone number'}});
		createInputField(parent, {
			input: {
				type: 'email', 
				required: ''},
			label: {
				text: 'E-mail'}});
		createInputField(parent, {
			input: {
				type: 'text',
				required: false},
			label: {
				text: 'Discount (optional)'}});

		let inputs = parent.querySelectorAll('input[required=""]');
		for (let item of inputs){
			item.oninput = () => checkRequiredInputsValidity(this.confirmButton, parent);
		}

		return this;
	}

	openThanksPage(){
		this.clearInside()
			.updateAllGoodsTotal()
			.openSentenceBanner('Thanks for Your order!');

		return this;
	}

	openSentenceBanner(sentence){
		createNewEl('div', {
		    class: 'cm-phrase-container grid-center-items',
		    nested: [
		    	createNewEl('h2', {content: sentence})
		    ]
		}, this.cartModalContainer);
		
		this.cartHeader.style.display = 'none';
		this.cartModalTable.style.display = 'none';
	    this.buttonsContainer.style.display = 'none';

	    return this;
	}

	updateProductTotal(itemIndex, itemRow){
		let productTotal = itemRow.getElementsByClassName('cm-item-total')[0];

		this.goodsInside[itemIndex].total = this.goodsInside[itemIndex].count * this.goodsInside[itemIndex].price;
		productTotal.textContent = this.goodsInside[itemIndex].total.toFixed(2);

		this.updateAllGoodsTotal();

		return this;
	}

	updateAllGoodsTotal(){
		var allGoodsCount = () => {
			let countTotal = this.goodsInside.reduce((acc, item) => acc + item.count, 0);
			this.openButton.style.color = countTotal === 0 ? 'black' : '#128937';
		}; 

		let priceTotal = this.goodsInside.reduce((acc, item) => acc + item.total, 0);
		this.allTotalPrice.textContent = '$' + priceTotal.toFixed(2);

		allGoodsCount();  

		return this; 
	}

	close(modalWrapper){
		modalWrapper.style.display = 'none';

		let cartModalTableRow = this.cartModalTable.getElementsByClassName('cm-table-row');
		while(cartModalTableRow.length > 2) {
			cartModalTableRow[1].remove();
		}

		this.cartModalTable.style.display = 'none';
	    this.buttonsContainer.style.display = 'none';
		if (document.getElementsByClassName('cm-phrase-container').length > 0) {
			document.getElementsByClassName('cm-phrase-container')[0].remove();
		}
		this.checkOutContainer.style.display = 'none';
		this.confirmationFormContainer.style.display = 'none';

		return this;
	}
}

