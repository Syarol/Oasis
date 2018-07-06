/**
 * Cart
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Import
*/

import {createNewEl} from './createNewElement.js';

/**
 * Variables
*/

var overIndex;
var countInsideCart = document.getElementById('count_inside_cart');
var goodsInCart;

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
	let priceRegEx = Number(goodsInCart[i].price.replace(/\$/, ''));

	goodsInCart[i].total = goodsInCart[i].count * priceRegEx;
	dishTotal[i].textContent = '$' + goodsInCart[i].total.toFixed(2);

	updateAllGoodsTotal();
}

function updateAllGoodsTotal(){
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

function syncCartwithServer(){
	var oRq = new XMLHttpRequest(); //Create the object
	let goods = JSON.stringify(goodsInCart);

	oRq.open('post', '/sameCart');
	oRq.setRequestHeader('Content-Type', 'application/json');
	oRq.send(goods);

	oRq.onreadystatechange  = function () {
	  	//console.log(this.responseText);
	   	console.log(JSON.parse(this.responseText));
	};
}

/**
 * Class
*/

class Cart{
	constructor(entryPoint, InCart){
		goodsInCart = InCart;
		this.inputLabels = ['First name', 'Last name', 'Address', 'Phone number', 'E-mail', 'Discount code (optional)'];

		window.cartModalWrapper = createNewEl('section', document.body, {id : 'cart-modal'});
		window.cartModalContent = createNewEl('div', cartModalWrapper, {id : 'modal-content'});
		window.closeCartModal = createNewEl('span', cartModalContent, {
			content:'×', 
			id : 'close-modal', 
			title: 'Close'
		});
		window.cartHeader = createNewEl('div', cartModalContent, {
			id : 'cart-header',
			nested: [createNewEl('h2', false, {content: 'Cart'})]
		});
		window.cartModalTable = createNewEl('div', cartModalContent, {id : 'cart-table'});

		createNewEl('span', cartModalTable, {
			class: 'cart-table-row cart-first-row',
			nested: [
				createNewEl('span', false, {content : 'Name'}),
				createNewEl('span', false, {content : 'Quantity'}),
				createNewEl('span', false, {content : 'Price'}),
				createNewEl('span', false, {content : 'Total'})]
		});
		let lastRow = createNewEl('span', cartModalTable, {
			class: 'cart-table-row cart-last-row',
			nested: [
				createNewEl('span', false, {class: 'cart-item-total', content: 'Total'})]
		});

		window.cartAllGoodsTotal = createNewEl('span', lastRow, {id: 'cart-total', title: 'Your total'});

		window.onclick = e => {
			if (e.target == cartModalWrapper) {
    			this.close();
			}
		}; 

		cartModalTable.onmouseover = e => getOverIndex(e, 'cart-table-row');

		closeCartModal.onclick = () => this.close();

		entryPoint.onclick = () => {
			this.open();
		};
	}

	updateInCart(data){
		goodsInCart = data;
	}

	open(){
		cartModalWrapper.style.display = 'flex';
		console.log(goodsInCart);
		if (goodsInCart.length == 0) {
			cartHeader.style.display = 'none';
			createNewEl('div', cartModalContent, {
				class: 'cart-one-text-container',
				nested: [createNewEl('h2', false, {content: 'Oops! Your cart is empty('})]
			});
		} else {
			cartHeader.style.display = 'block';
			if (cartHeader.textContent != 'Cart'){
				cartHeader.textContent = 'Cart';
			}
			cartModalTable.style.display = 'grid';
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
			callback:{
				click: {
					call: () => {
				      	this.removeFromCart();
				      	updateAllGoodsTotal();
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
	      	createNewEl('div', cartModalContent, {
	      		class: 'cart-one-text-container',
	      		nested: [createNewEl('h2', false, {content:'Oops! Your cart is empty('})]
	     	});
	      	cartHeader.style.display = 'none';
	      	cartModalTable.style.display = 'none';
	      	document.getElementById('cart-buttons-container').style.display = 'none';
	    	
	    }
	    console.log(goodsInCart);
	    updateAllGoodsTotal();
	    syncCartwithServer();	
	}

	addPlus(){
	    return createNewEl('span', false, {
	    	class : 'cart-plus',
	    	title : 'Add one',
	    	nested: [createNewEl('i', false, {class : 'far fa-plus-square'})],
	    	callback: {
	    		click: {
	    			call: function(){
				      incrementCartItem(this);
				    }
	    		}
	    	}
	    });

	    function incrementCartItem(item){
	    	console.log(goodsInCart);
	      	let list = item.parentNode.childNodes;
	      	for (let listItem of list){
	        	if (listItem.className === 'cart-item-number') {
	          		goodsInCart[overIndex - 1].count++;
	          		listItem.textContent = goodsInCart[overIndex - 1].count;
	          		updateGoodsTotal(overIndex - 1);
	          		break;
	        	}
		    }
		    syncCartwithServer();
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
	      	syncCartwithServer();
	    };

	    return createNewEl('span', false, {
	    	class : 'cart-minus',
	    	title : 'Remove one',
	    	nested: [createNewEl('i', false, {class : 'far fa-minus-square'})],
	    	callback: {
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
		    createNewEl('span', cartModalTable, {
		    	class : 'cart-table-row',
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
		    swapLastTwo(cartModalTable);
		}

	   //updateAllGoodsTotal();
	}

	createButtons(part){
	    if ((part == 'list' || part == 'checkout' || part == 'contact') && document.getElementById('cart-buttons-container')){
	      document.getElementById('cart-buttons-container').remove();
	    }

	    let buttonsContainer = createNewEl('div', cartModalContent, {id : 'cart-buttons-container'}); 
	    
	    if (part == 'list'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button',
	    		nested: [createNewEl('span', false, {content: 'Check out'})],
	    		callback: {
	    			click: {call: () => this.openCheckout()}
	    		}
	      	});
	    } else if (part == 'checkout'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button',
	    		nested: [createNewEl('span', false, {content: 'Back'})],
	    		callback: {
	    			click: {call: () => this.checkoutBack()}
	    		}
	      	});
	      	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button',
	    		nested: [createNewEl('span', false, {content: 'Confirm'})],
	    		callback: {
	    			click: {call: () => this.openContactForm()}
	    		}
	      	});
	    } else if (part == 'contact'){
	    	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button',
	    		nested: [createNewEl('span', false, {content: 'Back'})],
	    		callback: {
	    			click: {call: () => this.toCheckout()}
	    		}
	      	});
	      	createNewEl('button', buttonsContainer, {
	    		class: 'cart-button',
	    		nested: [createNewEl('span', false, {content: 'Confirm'})],
	    		callback: {
	    			click: {call: () => this.thanksForOrder()}
	    		}
	      	});
	      	disableButtonIfEmptyInput();
	    } 
	}

  	openCheckout(){
	    cartModalTable.style.display = 'none';
	    document.getElementById('cart-buttons-container').remove();
	    cartHeader.textContent = 'Confirm order list';

	    let checkOutContainer = createNewEl('div', cartModalContent, {id : 'checkout-container'});
	    let orderList = createNewEl('div', checkOutContainer, {class : 'order-list'});

	    createNewEl('span', orderList, {content: 'Product'});
	    createNewEl('span', orderList, {content: 'Total'});
	    for (let book of goodsInCart) {
	      createNewEl('span', orderList, {content: book.count + ' × ' + book.title});
	      createNewEl('span', orderList, {content: '$' + book.total.toFixed(2)});
	    }
	    createNewEl('span', orderList, {content: 'Total'});
	    createNewEl('span', orderList, {content: cartAllGoodsTotal.textContent});  

	    this.createButtons('checkout');
	}

	checkoutBack(){
		cartHeader.textContent = 'Cart';
		document.getElementById('checkout-container').remove();
		cartModalTable.style.display = 'grid';
		this.createButtons('list');
	}

	openContactForm(){
		document.getElementById('checkout-container').style.display = 'none';
		cartHeader.textContent = 'Leave your contacts';

		let inputsContainer = createNewEl('form', cartModalContent, {id : 'confirmation-form-container'});

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
		cartHeader.textContent = 'Confirm order list';
		document.getElementById('checkout-container').style.display = 'block';
		this.createButtons('checkout');
	}

	thanksForOrder(){
		document.getElementById('checkout-container').remove();
		cartHeader.parentNode.remove();
		this.inCart = [];
		let cartModalTableRow = document.getElementsByClassName('cart-table-row');
		while(cartModalTableRow.length > 2) {
			cartModalTableRow[1].remove();
		}
		updateAllGoodsTotal();
		document.getElementById('confirmation-form-container').remove();
		document.getElementById('cart-buttons-container').remove();

		createNewEl('div', cartModalContent, {class: 'cart-one-text-container', 
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
		cartModalWrapper.style.display = 'none';
		cartModalTable.style.display = 'none';
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

/**
 * Export
*/

export {Cart};
