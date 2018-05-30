/**
 * Carousel
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Functions
*/

/*Swap the last two children of the node*/
function swapLastTwo(el){
	let elChild = el.children;//return collection of rows
	elChild[elChild.length-1].after(elChild[elChild.length-2]);//swap the last two 
}

function addTextElAndAppend(parent, el, text){
	let newEl = document.createElement(el);
	newEl.textContent = text;
	parent.appendChild(newEl);
}

function addSentenceContainer(parent, newClass, text){
	let div = createElWithAttr('div', {class : newClass});
	addTextElAndAppend(div, 'h2', text);
	parent.appendChild(div);
}

/*Write attr in object view, like: {attribute : 'text'} */
function createElWithAttr(tagNme, ...attr){
	let el = document.createElement(tagNme);
	for (let temp of attr) {
		for (var key in temp) {
			el.setAttribute(key, temp[key]);
		}
	}
	return el;
}

function newButton(parent, text, clickCallback){
	let button = createElWithAttr('button', {class : 'cart-button'});
	button.addEventListener('click', clickCallback);
	addTextElAndAppend(button, 'span', text);
	parent.appendChild(button);
}

function createInputField(parent, attr){
	let inputContainer;
	if (attr.container && attr.container.id) {
		inputContainer = createElWithAttr('div', {class : 'input', id: attr.container.id});
	} else{
		inputContainer = createElWithAttr('div', {class : 'input'});
	}

	let inputTag;
	if (attr.input && attr.input.pattern) {
		inputTag = createElWithAttr('input', {type : attr.type, pattern: attr.input.pattern});
	}else{
		inputTag = createElWithAttr('input', {type : attr.type});
	}
  
	if (attr.input && attr.input.required){
		inputTag.setAttribute('required', attr.input.required);
	}
  
	inputContainer.appendChild(inputTag);

	if (attr.label && attr.label.text){
		addTextElAndAppend(inputContainer, 'label', attr.label.text);
	}

	let focusBorder = createElWithAttr('span', {class : 'focus-border'});
	inputContainer.appendChild(focusBorder);
	parent.appendChild(inputContainer);

	inputTag.addEventListener('input', function(){
		if (this.type == 'text'){
			this.value = this.value.replace(/[0-9]/g, '');
		} else if(this.type == 'tel' || this.type == 'number'){
			this.value = this.value.replace(/\D/g, '');
		}
		deleteByLetter(inputContainer.getElementsByTagName('label')[0], cart.inputLabels);
		disableButtonIfEmptyInput();
	});
}

function deleteByLetter(word, wordsArr){
	clearInterval(intervalId);//clear previous interval
	let index = getElementIndex(word.parentNode);//get parent index
	if (word.parentNode.getElementsByTagName('input')[0].value.length != 0){ //if input not empty then:
		if (word.textContent.length != 0){ //if label not empty, then delete her
			intervalId = deleteWord();
		}
	} else{
		if (word.textContent.length != 0){ //if label not empty, then write her from same index
			intervalId = writeWord(word.textContent.length);
		} else { //write label from begin
			intervalId = writeWord(0);
		}   
	}  

	function writeWord(i){
		return setInterval(function(){
			word.textContent += wordsArr[index].charAt(i); 
			i++;
			if (i >= wordsArr[index].length) clearInterval(intervalId);
		}, 150);
	}

	function deleteWord(){
		return setInterval(function(){
			word.textContent = word.textContent.slice(0, -1); 
			if (word.textContent.length == 0) clearInterval(intervalId);
		}, 150);
	}
}

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

/**
 * Class
*/

class Cart{
	constructor(dataset){
		this.menu = dataset;
		this.inCart = [];//array of dishes in cart
		this.inputLabels = ['First name', 'Last name', 'Address', 'Phone number', 'E-mail', 'Discount code (optional)'];
	}

	open(){
		modal.style.display = 'flex';
		if (this.inCart.length == 0) {
			addSentenceContainer(modalContent, 'cart-one-text-container', 'Oops! Your cart is empty(');
		} else {
			if (cartHeader.textContent != 'Cart'){
				cartHeader.textContent = 'Cart';
			}
			cartTable.style.display = 'grid';
			this.createButtons('list');
		}
	}

	/*add(){
		let dish = this.menu[containerIndex][overIndex]; 
		dish.total = Number(dish.price.replace(/\$/, ''));
		this.inCart.push({name : dish.name, price: dish.price, number: 1, total: dish.total});
		this.createCartHeader();

		let newItemWrapper = createElWithAttr('span', {class : 'cart-table-row'});
		cartTable.appendChild(newItemWrapper);

		let lastCartItem = this.inCart[this.inCart.length - 1];
		this.newItemRemoveButton(newItemWrapper);
		newItem(newItemWrapper, lastCartItem.name, 'cart-item-name');
		this.newItemQuantityPart(newItemWrapper, lastCartItem);
		newItem(newItemWrapper, lastCartItem.price);
		newItem(newItemWrapper, lastCartItem.price, 'cart-item-total');

		swapLastTwo(cartTable);

		this.updateAllDishTotal();

		function newItem(parent, text, ...className){
			let item;

			if (className.length == 1){
				item = createElWithAttr('span', {class : className});
			} else if (className.length == 0){
				item = document.createElement('span');
			} else return;
			item.textContent = text;

			parent.appendChild(item);
		}
	}
    
	newItemQuantityPart(parent, dish){
		let newItemQuantity = createElWithAttr('span', {class : 'cart-quantity'});
		let newItemNumber = createElWithAttr('span', {class : 'cart-item-number'});

		cart.addPlus(newItemQuantity);
		newItemNumber.textContent = dish.number;
		newItemQuantity.appendChild(newItemNumber);
		cart.addMinus(newItemQuantity);

		parent.appendChild(newItemQuantity);
	}

	newItemRemoveButton(parent){
		let newItemRemove = createElWithAttr('span', {class : 'cart-remove-item'}, {title : 'Click for remove'});
		newItemRemove.textContent = closeModal.textContent;
		newItemRemove.addEventListener('click', () => this.removeC());

		parent.appendChild(newItemRemove);
	}

	removeC(){
		let cartTableRow = document.getElementsByClassName('cart-table-row');
		cartTableRow[overIndex].remove();
		this.inCart.splice(overIndex - 1, 1);
		if (cartTableRow.length == 2) {
			this.inCart = [];
			cartHeader.parentNode.remove();
			addSentenceContainer(modalContent, 'cart-one-text-container', 'Oops! Your cart is empty(');
			cartTable.style.display = 'none';
			document.getElementById('cart-buttons-container').remove();
		}
		this.updateAllDishTotal();
	}

	getOverIndex(e){
		let target = e.target;
		while (target != this){
			if (target){
				if (target.className == 'cart-table-row') {
					overIndex = getElementIndex(target);//index of mouseover 
					return;
				} else target = target.parentNode;
			} else break;
		}
	}

	/*Checks whether the dish is already in the cart. If not, then add*/
	/*didAlreadyIn(){
		let tempCout = 0;
		for (let i = 0; i < this.inCart.length; i++){
			if (this.inCart[i] != undefined && this.inCart[i].name == menuList.menu[containerIndex][overIndex].name){
				let dishNumbers = document.getElementsByClassName('cart-item-number');
				this.inCart[i].number++;
				dishNumbers[i].textContent = this.inCart[i].number;
				this.updateTotalOfDish(i);
				break;    
			} else {
				tempCout++;
			}
		}
		if (tempCout == this.inCart.length) {
			this.add();
		}
	}

	addPlus(parentNode){
		let spanItem = createElWithAttr('span', {class : 'cart-plus'}, {title : 'Add one'});
		let plus = createElWithAttr('i', {class : 'far fa-plus-square'});

		spanItem.appendChild(plus);
		parentNode.appendChild(spanItem);

		spanItem.addEventListener('click', () => {
			incrementCartItem(spanItem, this);
		});

		function incrementCartItem(item, parentObj){
			let list = item.parentNode.childNodes;
			for (let listItem of list){
				if (listItem.className === 'cart-item-number') {
					parentObj.inCart[overIndex - 1].number++;
					listItem.textContent = parentObj.inCart[overIndex - 1].number;
					parentObj.updateTotalOfDish(overIndex - 1);
					break;
				}
			}
		}
	}

	addMinus(parentNode){
		let spanItem = createElWithAttr('span', {class : 'cart-minus'}, {title : 'Remove one'});
		let minus = createElWithAttr('i', {class : 'far fa-minus-square'});

		spanItem.appendChild(minus);
		parentNode.appendChild(spanItem);

		spanItem.addEventListener('click', () => {
			decrementCartItem(spanItem, this);
		});

		function decrementCartItem(item, parentObj){
			let list = item.parentNode.childNodes;
			for (let listItem of list){
				if (listItem.className === 'cart-item-number') {
					parentObj.inCart[overIndex - 1].number--;
					listItem.textContent = parentObj.inCart[overIndex - 1].number;
					parentObj.updateTotalOfDish(overIndex - 1);
					if (listItem.textContent == '0') { //if zero number,  then delete
						parentObj.removeC();
					}
					break;
				}
			}
		}
	}

	updateTotalOfDish(i){
		let dishTotal = document.getElementsByClassName('cart-item-total');
		let priceRegEx = this.inCart[i].price.replace(/\$/, '');

		this.inCart[i].total = this.inCart[i].number * priceRegEx;
		dishTotal[i].textContent = '$' + this.inCart[i].total.toFixed(2);

		this.updateAllDishTotal();
	}

	updateAllDishTotal(){
		let temp = 0;
		for (let dish of this.inCart){
			if(temp != 0){
				temp += dish.total;
			} else temp = dish.total;
		}

		allCartDishTotal.textContent = '$' + temp.toFixed(2);

		this.allDishesCount();    
	}

	allDishesCount(){
		let allTotal = 0;
		for (let dish of this.inCart){
			allTotal += dish.number;
		}

		if (allTotal == 0){
			countInsideCart[0].textContent = '';
		} else countInsideCart[0].textContent = ' (' + allTotal + ')';    
	}

	createCartHeader(){
		if (!document.getElementById('cart-header')) {
			let cartHeader = createElWithAttr('div', {id : 'cart-header'});
			addTextElAndAppend(cartHeader, 'h2', 'Cart');
			modalContent.insertBefore(cartHeader, cartTable);
			window.cartHeader = document.querySelector('#cart-header h2');//declare at global scope
		}
	}

	createButtons(part){
		if ((part == 'list' || part == 'checkout' || part == 'contact') && document.getElementById('cart-buttons-container')){
			document.getElementById('cart-buttons-container').remove();
		}
		let buttonsContainer = createElWithAttr('div', {id : 'cart-buttons-container'}); 
		modalContent.appendChild(buttonsContainer);
		if (part == 'list'){
			newButton(buttonsContainer, 'Check out', () => this.openCheckout());
		} else if (part == 'checkout'){
			newButton(buttonsContainer, 'Back', () => this.checkoutBack());
			newButton(buttonsContainer, 'Confirm', () => this.openContactForm());
		} else if (part == 'contact'){
			newButton(buttonsContainer, 'Back', () => this.toCheckout());
			newButton(buttonsContainer, 'Confirm', () => this.thanksForOrder());
			disableButtonIfEmptyInput();
		} 
	}

	checkoutBack(){
		cartHeader.textContent = 'Cart';
		document.getElementById('checkout-container').remove();
		cartTable.style.display = 'grid';
		this.createButtons('list');
	}

	openContactForm(){
		document.getElementById('checkout-container').style.display = 'none';
		cartHeader.textContent = 'Leave your contacts';

		let inputsContainer = createElWithAttr('form', {id : 'confirmation-form-container'});
		modalContent.appendChild(inputsContainer);

		createInputField(inputsContainer, {
			type: 'text', 
			container: {
				id: 'first-name-input'}, 
			input: {
				required: true},
			label: {
				text: 'First name'}});
		createInputField(inputsContainer, {
			type: 'text', 
			container: {
				id: 'last-name-input'}, 
			input: {
				required: true},
			label: {
				text: 'Last name'}});
		createInputField(inputsContainer, {
			type: 'text', 
			input: {
				required: true},
			label: {
				text: 'Address'}});
		createInputField(inputsContainer, {
			type: 'tel', 
			input: {
				pattern: '[0-9]{6,12}', 
				required: true},
			label: {
				text: 'Phone number'}});
		createInputField(inputsContainer, {
			type: 'email', 
			input: {
				required: true},
			label: {
				text: 'E-mail'}});
		createInputField(inputsContainer, {
			type: 'text',
			label: {
				text: 'Discount code (optional)'}});

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
		let cartTableRow = document.getElementsByClassName('cart-table-row');
		while(cartTableRow.length > 2) {
			cartTableRow[1].remove();
		}
		this.updateAllDishTotal();
		document.getElementById('confirmation-form-container').remove();
		document.getElementById('cart-buttons-container').remove();

		addSentenceContainer(modalContent, 'cart-one-text-container', 'Thanks for Your order!');
	}

	openCheckout(){
		cartTable.style.display = 'none';
		document.getElementById('cart-buttons-container').remove();
		cartHeader.textContent = 'Confirm order list';

		let checkOutContainer = createElWithAttr('div', {id : 'checkout-container'});
		let orderList = createElWithAttr('div', {class : 'order-list'});

		addTextElAndAppend(orderList, 'span', 'Product');
		addTextElAndAppend(orderList, 'span', 'Total');

		for (let dish of cart.inCart) {
			addTextElAndAppend(orderList, 'span', dish.number + ' ' + closeModal.textContent + ' ' + dish.name);
			addTextElAndAppend(orderList, 'span', '$' + dish.total.toFixed(2));
		}
     
		addTextElAndAppend(orderList, 'span', 'Total');
		addTextElAndAppend(orderList, 'span', allCartDishTotal.textContent);  

		checkOutContainer.appendChild(orderList);
		modalContent.appendChild(checkOutContainer);

		this.createButtons('checkout');
	}

	close(){
		modal.style.display = 'none';
		cartTable.style.display = 'none';
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
	}*/
}

/**
 * Export
*/

export {Cart};