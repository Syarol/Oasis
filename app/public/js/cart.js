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
 * Variables
*/

var overIndex;
var goodsInCart;
var serverInteraction;

/**
 * Functions
*/

function disableButtonIfEmptyInput(){
	let requiredInputs = [...document.querySelectorAll('form input[required = true]')];
	let button = document.getElementById('cart-buttons-container').children[1];

	if (requiredInputs.some(el => el.value.length == 0)){
		if (button.style.pointerEvents != 'none'){
			button.style.pointerEvents = 'none';
		}
	} else if (requiredInputs.every(el => el.checkValidity())){
		if (button.style.pointerEvents == 'none'){
			button.style.pointerEvents = '';
		}
	}  
}

function createInputField(parent, attr){
	let inputContainer;
	if (attr.container && attr.container.id) {
		inputContainer = createNewEl('div', parent, {class : 'input', id: attr.container.id});
	} else{
		inputContainer = createNewEl('div', parent, {class : 'input'});
	}

	let inputTag;
	if (attr.input && attr.input.pattern) {
		inputTag = createNewEl('input', inputContainer, {type : attr.input.type, required: attr.input.required, pattern: attr.input.pattern});
	}else{
		inputTag = createNewEl('input', inputContainer, {type : attr.input.type, required: attr.input.required});
	}
  
	let inputLabel = createNewEl('label', inputContainer, {content: attr.label.text, class: 'input-label-no-focus'});
	createNewEl('span', inputContainer, {class : 'focus-border'});

	inputTag.oninput = function(){
		if (this.type == 'text'){
			this.value = this.value.replace(/[0-9]/g, '');
		} else if(this.type == 'tel' || this.type == 'number'){
			this.value = this.value.replace(/\D/g, '');
		}
		disableButtonIfEmptyInput();
	};

	inputTag.onfocus = () => {
		inputLabel.className ='input-label-get-focus color-green';
	};

	inputTag.onblur = function(){
		if (this.value === ''){
			inputLabel.className = 'input-label-no-focus';
		} else {
			inputLabel.classList.remove('color-green');
		}
	};
}

function getElementIndex(node) {
	let index = 0;
	while ( (node = node.previousElementSibling) ){
		index++;
	}
	return index;
}

function updateGoodsTotal(i){
	let dishTotal = document.getElementsByClassName('cart-item-total');

	goodsInCart[i].total = goodsInCart[i].count * goodsInCart[i].price;
	dishTotal[i].textContent = goodsInCart[i].total.toFixed(2);

	updateAllGoodsTotal(goodsInCart);
}

function updateAllGoodsTotal(goodsInCart){
	let temp = 0;
	for (let item of goodsInCart){
		temp += item.total;
	}

	cartAllGoodsTotal.textContent = '$' + temp.toFixed(2);

	allGoodsCount();   

	function allGoodsCount(){
		let allTotal = 0;
		for (let item of goodsInCart){
			allTotal += item.count;
		}

		let countInsideCart = document.getElementById('count_inside_cart');

		if (allTotal == 0) countInsideCart.textContent = '';
		else countInsideCart.textContent = ' (' + allTotal + ')';    
	} 
}

function swapLastTwo(el){
	let elChild = el.children;//return collection of rows
	elChild[elChild.length-1].after(elChild[elChild.length-2]);//swap the last two 
}

function getOverIndex(e, neededClassTarget){
	let target = e.target;
	while (target != this){
       	if (target){
       		if (target.className == neededClassTarget) {
           		overIndex = getElementIndex(target);//index of mouseover 
           		console.log(overIndex);
           		return;
	       	} else target = target.parentNode;
		} else break;
	}
}

/**
 * Class
*/

export default class Cart{
	constructor(entryPoint, inCart){
		serverInteraction = new ServerInteract();

		serverInteraction.getCart(inCart).then(
			function(res){
				console.log(res);
				goodsInCart = res;
			},
			function(err){
				console.log(err);
			}
		);

		this.inputLabels = ['First name', 'Last name', 'Address', 'Phone number', 'E-mail', 'Discount code (optional)'];

		this.cartModalWrapper = createNewEl('section', document.body, {id : 'cart-modal', class: 'modal-wrapper'});
		this.cartModalContent = createNewEl('div', this.cartModalWrapper, {id : 'modal-content', class: 'modal-container'});
		this.closeCartModal = createNewEl('span', this.cartModalContent, {
			content:'×', 
			id: 'close-cart-modal', 
			class: 'close-modal',
			title: 'Close'
		});
		this.cartHeader = createNewEl('h2', this.cartModalContent, {
			id : 'cart-header',
			content: 'Cart'
		});
		this.cartModalTable = createNewEl('div', this.cartModalContent, {id : 'cart-table'});

		createNewEl('span', this.cartModalTable, {
			class: 'cart-table-row cart-first-row grid-center-items',
			nested: [
				createNewEl('span', false, {content : 'Name'}),
				createNewEl('span', false, {content : 'Quantity'}),
				createNewEl('span', false, {content : 'Price'}),
				createNewEl('span', false, {content : 'Total'})]
		});
		let lastRow = createNewEl('span', this.cartModalTable, {
			class: 'cart-table-row cart-last-row grid-center-items',
			nested: [
				createNewEl('span', false, {class: 'cart-item-total', content: 'Total'})]
		});

		window.cartAllGoodsTotal = createNewEl('span', lastRow, {id: 'cart-total', title: 'Your total'});

		window.onclick = e => {
			if (e.target == this.cartModalWrapper) {
    			this.close();
			}
		}; 

		this.cartModalTable.onmouseover = function(e) {getOverIndex(e, 'cart-table-row grid-center-items');};

		this.closeCartModal.onclick = () => this.close();

		entryPoint.onclick = () => {
			this.open();
		};
	}

	addToCartArray(goods){
		serverInteraction.getCart(goodsInCart);

		if (goodsInCart.length != 0) {
			let found = false;
			for (let item of goodsInCart) {
			    if (item.title == goods.title) {
		    		item.count++; 
		    		item.total = item.price * item.count;
			    	found = true;
					break;
				}
			}
			if (!found) {
				newItemInCart(goods);
			}
		} else {
			newItemInCart(goods);
		}
		serverInteraction.syncCart(goodsInCart);

		function newItemInCart(item){
			item.count = 1;
			item.total = item.price;
			goodsInCart.push(item);
		}	
	}

	open(){
		this.cartModalWrapper.style.display = 'flex';
		console.log(goodsInCart);
		if (goodsInCart.length == 0) {
			this.cartHeader.style.display = 'none';
			createNewEl('div', this.cartModalContent, {
				class: 'cart-one-text-container grid-center-items',
				nested: [createNewEl('h2', false, {content: 'Oops! Your cart is empty('})]
			});
		} else {
			this.cartHeader.style.display = 'flex';
			if (this.cartHeader.textContent != 'Cart'){
				this.cartHeader.textContent = 'Cart';
			}
			this.cartModalTable.style.display = 'grid';
			this.createButtons('list');
			this.openTable();
		}
	}

	newItemQuantityPart(goods){
		return createNewEl('span', false, {
			class : 'cart-quantity',
			nested: [
				this.addPlus(),
				createNewEl('span', false, {
					class : 'cart-item-number',
					content: goods.count
				}),
				this.addMinus()
			]
		});
	}

	newItemRemoveButton(){
		return createNewEl('span', false, {
			class : 'cart-remove-item',
			title : 'Click for remove',
			content: '×',
			event:{
				click: {
					call: () => {
				      	this.removeFromCart();
				      	updateAllGoodsTotal(goodsInCart);
				  	}
				}
			}
		});
	}

	removeFromCart(){
	    let cartModalTableRow = document.getElementsByClassName('cart-table-row');
	    cartModalTableRow[overIndex].remove();
	    goodsInCart.splice(overIndex - 1, 1);
	    if (goodsInCart.length === 0) {
	      	createNewEl('div', this.cartModalContent, {
	      		class: 'cart-one-text-container grid-center-items',
	      		nested: [createNewEl('h2', false, {content:'Oops! Your cart is empty('})]
	     	});
	      	this.cartHeader.style.display = 'none';
	      	this.cartModalTable.style.display = 'none';
	      	document.getElementById('cart-buttons-container').style.display = 'none';
	    	
	    }
	    console.log(goodsInCart);
	    serverInteraction.syncCart(goodsInCart);	
	}

	addPlus(){
	    return createNewEl('span', false, {
	    	class : 'cart-plus',
	    	title : 'Add one',
	    	nested: [createNewEl('i', false, {class : 'far fa-plus-square'})],
	    	event: {
	    		click: {
	    			call: function(){
				      incrementCartItem(this);
				    }
	    		}
	    	}
	    });

	    function incrementCartItem(item){
	    	console.log(goodsInCart);
	    	console.log(overIndex);
	      	let list = item.parentNode.childNodes;
	      	for (let listItem of list){
	        	if (listItem.className === 'cart-item-number') {
	          		goodsInCart[overIndex - 1].count++;
	          		listItem.textContent = goodsInCart[overIndex - 1].count;
	          		updateGoodsTotal(overIndex - 1);
	          		break;
	        	}
		    }
		    serverInteraction.syncCart(goodsInCart);
	    }
	}

	addMinus(){
		var decrementCartItem = (item) => {
		    let list = item.parentNode.childNodes;
		    for (let listItem of list){
		        if (listItem.className === 'cart-item-number') {
		    	    goodsInCart[overIndex - 1].count--;
		        	listItem.textContent = goodsInCart[overIndex - 1].count;
		          	updateGoodsTotal(overIndex - 1);
		          	if (listItem.textContent == '0') { //if zero number,  then delete
		            	this.removeFromCart();
		          	}
		          	break;
		        }
	      	}
	      	serverInteraction.syncCart(goodsInCart);
	    };

	    return createNewEl('span', false, {
	    	class : 'cart-minus',
	    	title : 'Remove one',
	    	nested: [createNewEl('i', false, {class : 'far fa-minus-square'})],
	    	event: {
	    		click: {
	    			call:  function(){
				      decrementCartItem(this);
				    }
	    		}
	    	}
	    });

	    
  	}

	openTable(){
		console.log(goodsInCart);
		for (let book of goodsInCart){
		    createNewEl('span', this.cartModalTable, {
		    	class : 'cart-table-row grid-center-items',
		    	nested: [
		    		this.newItemRemoveButton(),
		    		createNewEl('span', false, {
		    			content: book.title,
		    			class: 'cart-item-name'
		    		}),
		    		this.newItemQuantityPart(book),
		    		createNewEl('span', false, {
		    			content: book.price
		    		}),
		    		createNewEl('span', false, {
		    			content: book.total.toFixed(2),
		    			class: 'cart-item-total'
		    		})
		    	]
		    });
		    swapLastTwo(this.cartModalTable);
		}
	}

	createButtons(part){
	    if ((part == 'list' || part == 'checkout' || part == 'contact') && document.getElementById('cart-buttons-container')){
	      document.getElementById('cart-buttons-container').remove();
	    }

	    let buttonsContainer = createNewEl('div', this.cartModalContent, {id : 'cart-buttons-container'}); 
	    
	    if (part == 'list'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button button',
	    		content: 'Check out',
	    		event: {
	    			click: {call: () => this.openCheckout()}
	    		}
	      	});
	    } else if (part == 'checkout'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button button',
	    		content: 'Back',
	    		event: {
	    			click: {call: () => this.checkoutBack()}
	    		}
	      	});
	      	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button button',
	    		content: 'Confirm',
	    		event: {
	    			click: {call: () => this.openContactForm()}
	    		}
	      	});
	    } else if (part == 'contact'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button button',
	    		content: 'Back',
	    		event: {
	    			click: {call: () => this.toCheckout()}
	    		}
	      	});
	      	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button button',
	    		content: 'Confirm',
	    		event: {
	    			click: {call: () => this.thanksForOrder()}
	    		}
	      	});
	      	disableButtonIfEmptyInput();
	    } 
	}

  	openCheckout(){
	    this.cartModalTable.style.display = 'none';
	    document.getElementById('cart-buttons-container').remove();
	    this.cartHeader.textContent = 'Confirm order list';

	    let checkOutContainer = createNewEl('div', this.cartModalContent, {id : 'checkout-container'});

	    createNewEl('span', checkOutContainer, {content: 'Product'});
	    createNewEl('span', checkOutContainer, {content: 'Total'});
	    for (let book of goodsInCart) {
	      createNewEl('span', checkOutContainer, {content: book.count + ' × ' + book.title});
	      createNewEl('span', checkOutContainer, {content: '$' + book.total.toFixed(2)});
	    }
	    createNewEl('span', checkOutContainer, {content: 'Total'});
	    createNewEl('span', checkOutContainer, {content: cartAllGoodsTotal.textContent});  

	    this.createButtons('checkout');
	}

	checkoutBack(){
		this.cartHeader.textContent = 'Cart';
		document.getElementById('checkout-container').remove();
		this.cartModalTable.style.display = 'grid';
		this.createButtons('list');
	}

	openContactForm(){
		document.getElementById('checkout-container').style.display = 'none';
		this.cartHeader.textContent = 'Leave your contacts';

		let inputsContainer = createNewEl('form', this.cartModalContent, {id : 'confirmation-form-container'});

		createInputField(inputsContainer, {
			container: {
				id: 'first-name-input'}, 
			input: {
				type: 'text', 
				required: true},
			label: {
				text: 'First name'}});
		createInputField(inputsContainer, {
			container: {
				id: 'last-name-input'}, 
			input: {
				type: 'text', 
				required: true},
			label: {
				text: 'Last name'}});
		createInputField(inputsContainer, {
			input: {
				type: 'text', 
				required: true},
			label: {
				text: 'Address'}});
		createInputField(inputsContainer, {
			input: {
				type: 'tel', 
				pattern: '[0-9]{6,12}', 
				required: true},
			label: {
				text: 'Phone number'}});
		createInputField(inputsContainer, {
			input: {
				type: 'email', 
				required: true},
			label: {
				text: 'E-mail'}});
		createInputField(inputsContainer, {
			input: {
				type: 'text',
				required: false},
			label: {
				text: 'Discount (optional)'}});

		this.createButtons('contact');
	}

	toCheckout(){
		document.getElementById('confirmation-form-container').remove();
		this.cartHeader.textContent = 'Confirm order list';
		document.getElementById('checkout-container').style.display = 'grid';
		this.createButtons('checkout');
	}

	thanksForOrder(){
		document.getElementById('checkout-container').remove();
		this.cartHeader.style.display = 'none';
		goodsInCart = [];
		let cartModalTableRow = document.getElementsByClassName('cart-table-row');
		while(cartModalTableRow.length > 2) {
			cartModalTableRow[1].remove();
		}
		updateAllGoodsTotal(goodsInCart);
		document.getElementById('confirmation-form-container').remove();
		document.getElementById('cart-buttons-container').remove();

		createNewEl('div', this.cartModalContent, {class: 'cart-one-text-container grid-center-items', 
			nested: [createNewEl('h2', false, {content: 'Thanks for Your order!'})]
		});
	}

	close(){
		let rows = document.getElementsByClassName('cart-table-row');
		for(let i = 0; i < rows.length - 1; i++){
			if (rows[i].className == 'cart-table-row') {
				rows[i].remove();
				i--;
			}
		}
		this.cartModalWrapper.style.display = 'none';
		this.cartModalTable.style.display = 'none';
		if (document.getElementById('cart-buttons-container')){
			document.getElementById('cart-buttons-container').remove();
		}
		if (document.getElementsByClassName('cart-one-text-container').length != 0) {
			document.getElementsByClassName('cart-one-text-container')[0].remove();
		}
		if (document.getElementById('checkout-container')) {
			document.getElementById('checkout-container').remove();
		}
		if (document.getElementById('confirmation-form-container')){
			document.getElementById('confirmation-form-container').remove();
		}  
	}
}

