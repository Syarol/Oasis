/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {getScrolledPercentage, Carousel} from './carousel.js';
//import {Cart} from './cart.js';

/**
 * Global variables
*/

var closeBestsellerModal = document.getElementById('close-bestseller-modal');
var arrivalCarouselMain = document.getElementById('new_arrival_list');
var arrivalsLeft = document.getElementById('arrivals_left');
var arrivalsRight = document.getElementById('arrivals_right');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var arrivalCarousel;
var overIndex;
var booksInCart = [];

var cartTable = document.getElementById('cart_table');
var modal = document.getElementById('modal');
var closeModal = document.getElementById('close_modal');
var allCartDishTotal = document.getElementById('cart_total');
var countInsideCart = document.getElementById('count_inside_cart');
var modalContent = document.getElementById('modal_content');
var cartHeader;
var openCart = document.getElementById('cart_open');

var plus = encodeURIComponent('+');
var hashtag = encodeURIComponent('#');


/**
 * Class
*/

class Cart{
	constructor(dataset){
		this.menu = dataset;
		//this.inCart = [];//array of dishes in cart
		this.inputLabels = ['First name', 'Last name', 'Address', 'Phone number', 'E-mail', 'Discount code (optional)'];
	}

	open(){
		modal.style.display = 'flex';
		if (booksInCart.length == 0) {
			addSentenceContainer(modalContent, 'cart-one-text-container', 'Oops! Your cart is empty(');
		} else {
			if (cartHeader.textContent != 'Cart'){
				cartHeader.textContent = 'Cart';
			}
			cartTable.style.display = 'grid';
			this.createButtons('list');
			this.openTable();
		}
	}

	newItemQuantityPart(parent, book){
      let newItemQuantity = createElWithAttr('span', {class : 'cart-quantity'});
      let newItemNumber = createElWithAttr('span', {class : 'cart-item-number'});

      cart.addPlus(newItemQuantity);
      newItemNumber.textContent = book.count;
      newItemQuantity.appendChild(newItemNumber);
      cart.addMinus(newItemQuantity);

      parent.appendChild(newItemQuantity);
    }

    getOverIndex(e){
	    let target = e.target;
	    while (target != this){
	       	if (target){
	       		if (target.className == 'cart-table-row') {
	           		overIndex = getElementIndex(target);//index of mouseover 
	           		console.log(overIndex);
	           		return;
		       	} else target = target.parentNode;
	        } else break;
	    }
	}

    newItemRemoveButton(parent){
      let newItemRemove = createElWithAttr('span', {class : 'cart-remove-item'}, {title : 'Click for remove'});
      newItemRemove.textContent = closeModal.textContent;
      newItemRemove.addEventListener('click', () => {
      	this.removeC();
      	updateAllDishTotal();
  	});

      parent.appendChild(newItemRemove);
    }

    removeC(){
	    let cartTableRow = document.getElementsByClassName('cart-table-row');
	    cartTableRow[overIndex].remove();
	    booksInCart.splice(overIndex - 1, 1);
	    if (cartTableRow.length == 2) {
	      cartHeader.parentNode.remove();
	      addSentenceContainer(modalContent, 'cart-one-text-container', 'Oops! Your cart is empty(');
	      cartTable.style.display = 'none';
	      document.getElementById('cart_buttons_container').remove();
	    updateAllDishTotal();
	    }
	    console.log(booksInCart);
	}

    addPlus(parentNode){
	    let spanItem = createElWithAttr('span', {class : 'cart-plus'}, {title : 'Add one'});
	    let plus = createElWithAttr('i', {class : 'far fa-plus-square'});

	    spanItem.appendChild(plus);
	    parentNode.appendChild(spanItem);

	    spanItem.addEventListener('click', () => {
	      incrementCartItem(spanItem);
	    });

	    function incrementCartItem(item){
	      	let list = item.parentNode.childNodes;
	      	for (let listItem of list){
	        	if (listItem.className === 'cart-item-number') {
	          		booksInCart[overIndex - 1].count++;
	          		console.log(booksInCart[overIndex - 1].count);
	          		listItem.textContent = booksInCart[overIndex - 1].count;
	          		updateTotalOfDish(overIndex - 1);
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
	      decrementCartItem(spanItem);
	    });

	    function decrementCartItem(item){
	      let list = item.parentNode.childNodes;
	      for (let listItem of list){
	        if (listItem.className === 'cart-item-number') {
	          booksInCart[overIndex - 1].count--;
	          listItem.textContent = booksInCart[overIndex - 1].count;
	          updateTotalOfDish(overIndex - 1);
	          if (listItem.textContent == '0') { //if zero number,  then delete
	            cart.removeC();
	          }
	          break;
	        }
	      }
	    }
  	}

	openTable(){
		for (let book of booksInCart){
		    let newItemWrapper = createElWithAttr('span', {class : 'cart-table-row'});
		    cartTable.appendChild(newItemWrapper);
		    this.newItemRemoveButton(newItemWrapper);
		    newItem(newItemWrapper, book.name, 'cart-item-name');
		    this.newItemQuantityPart(newItemWrapper, book);
		    newItem(newItemWrapper, book.price);
		    newItem(newItemWrapper, book.price, 'cart-item-total');

		    swapLastTwo(cartTable);
		}
	    updateAllDishTotal();

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

	createButtons(part){
	    if ((part == 'list' || part == 'checkout' || part == 'contact') && document.getElementById('cart_buttons_container')){
	      document.getElementById('cart_buttons_container').remove();
	    }
	    let buttonsContainer = createElWithAttr('div', {id : 'cart_buttons_container'}); 
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

  	openCheckout(){
	    cartTable.style.display = 'none';
	    document.getElementById('cart_buttons_container').remove();
	    cartHeader.textContent = 'Confirm order list';

	    let checkOutContainer = createElWithAttr('div', {id : 'checkout_container'});
	    let orderList = createElWithAttr('div', {class : 'order-list'});

	    addTextElAndAppend(orderList, 'span', 'Product');
	    addTextElAndAppend(orderList, 'span', 'Total');

	    for (let book of booksInCart) {
	      addTextElAndAppend(orderList, 'span', book.count + ' ' + closeModal.textContent + ' ' + book.name);
	      addTextElAndAppend(orderList, 'span', '$' + book.total.toFixed(2));
	    }
	     
	    addTextElAndAppend(orderList, 'span', 'Total');
	    addTextElAndAppend(orderList, 'span', allCartDishTotal.textContent);  

	    checkOutContainer.appendChild(orderList);
	    modalContent.appendChild(checkOutContainer);

	    this.createButtons('checkout');
	  }

	checkoutBack(){
      cartHeader.textContent = 'Cart';
      document.getElementById('checkout_container').remove();
      cartTable.style.display = 'grid';
      this.createButtons('list');
    }

    openContactForm(){
      document.getElementById('checkout_container').style.display = 'none';
      cartHeader.textContent = 'Leave your contacts';

      let inputsContainer = createElWithAttr('form', {id : 'confirmation_form_container'});
      modalContent.appendChild(inputsContainer);

        createInputField(inputsContainer, {
          type: 'text', 
          container: {
            id: 'first_name_input'}, 
          input: {
            required: true},
          label: {
            text: 'First name'}});
        createInputField(inputsContainer, {
          type: 'text', 
          container: {
            id: 'last_name_input'}, 
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
      document.getElementById('confirmation_form_container').remove();
      cartHeader.textContent = 'Confirm order list';
      document.getElementById('checkout_container').style.display = 'block';
      this.createButtons('checkout');
    }

    thanksForOrder(){
      document.getElementById('checkout_container').remove();
      cartHeader.parentNode.remove();
      this.inCart = [];
      let cartTableRow = document.getElementsByClassName('cart-table-row');
      while(cartTableRow.length > 2) {
        cartTableRow[1].remove();
      }
      this.updateAllDishTotal();
      document.getElementById('confirmation_form_container').remove();
      document.getElementById('cart_buttons_container').remove();

      addSentenceContainer(modalContent, 'cart-one-text-container', 'Thanks for Your order!');
    }

	close(){
		let rows = document.getElementsByClassName('cart-table-row');
		for(let row of rows){
			if (row.className == 'cart-table-row') row.remove();
		}
		modal.style.display = 'none';
		cartTable.style.display = 'none';
		if (document.getElementById('cart_buttons_container')){
			document.getElementById('cart_buttons_container').remove();
		}
		if (document.getElementsByClassName('cart-one-text-container').length != 0) {
			document.getElementsByClassName('cart-one-text-container')[0].remove();
		}
		if (document.getElementById('checkout_container')) {
			document.getElementById('checkout_container').remove();
		}
		if (document.getElementById('confirmation_form_container')){
			document.getElementById('confirmation_form_container').remove();
		}  
	}
}

var cart;

/**
 * Functions
*/

function disableButtonIfEmptyInput(){
  let requiredInputs = [...document.querySelectorAll('form input[required = true]')];
  let button = document.getElementById('cart_buttons_container').children[1];

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

function getElementIndex(node) {
  let index = 0;
  while ( (node = node.previousElementSibling) ){
    index++;
  }
  return index;
}

function updateTotalOfDish(i){
    let dishTotal = document.getElementsByClassName('cart-item-total');
    let priceRegEx = Number(booksInCart[i].price.replace(/\$/, ''));

    booksInCart[i].total = booksInCart[i].count * priceRegEx;
    dishTotal[i].textContent = '$' + booksInCart[i].total.toFixed(2);

    updateAllDishTotal();
  }

function updateAllDishTotal(){
    let temp = 0;
    for (let book of booksInCart){
      if(temp != 0){
        temp += book.total;
      } else temp = book.total;
    }

    allCartDishTotal.textContent = '$' + temp.toFixed(2);

    allDishesCount();    
  }

function allDishesCount(){
    let allTotal = 0;
    for (let book of booksInCart){
      allTotal += book.count;
    }

    if (allTotal == 0){
      countInsideCart.textContent = '';
    } else countInsideCart.textContent = ' (' + allTotal + ')';    
  }

function addSentenceContainer(parent, newClass, text){
	let div = createElWithAttr('div', {class : newClass});
	addTextElAndAppend(div, 'h2', text);
	parent.appendChild(div);
}

function createElWithAttr(tagNme, ...attr){
	let el = document.createElement(tagNme);
	for (let temp of attr) {
		for (var key in temp) {
			el.setAttribute(key, temp[key]);
		}
	}
	return el;
}

function addTextElAndAppend(parent, el, text){
	let newEl = document.createElement(el);
	newEl.textContent = text;
	parent.appendChild(newEl);
}

function createCartHeader(){
    if (!document.getElementById('cart_header')) {
      let cartHeaders = createElWithAttr('div', {id : 'cart_header'});
      addTextElAndAppend(cartHeaders, 'h2', 'Cart');
      modalContent.insertBefore(cartHeaders, cartTable);
      cartHeader = document.querySelector('#cart_header h2');//declare at global scope
    }
}

function newButton(parent, text, clickCallback){
  let button = createElWithAttr('button', {class : 'cart-button'});
  button.addEventListener('click', clickCallback);
  addTextElAndAppend(button, 'span', text);
  parent.appendChild(button);
}

function loadGoogleMap(){
	let script = document.createElement('script');
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps';
	script.type = 'text/javascript';
	script.id ='googleMap';
	document.getElementsByTagName('body')[0].append(script);
}

function swapLastTwo(el){
  let elChild = el.children;//return collection of rows
  elChild[elChild.length-1].after(elChild[elChild.length-2]);//swap the last two 
}

function addToCartArray(book){
	console.log(book.name);
	if (booksInCart.length != 0) {
		let found = false;
		for(var i = 0; i < booksInCart.length; i++) {
		    if (booksInCart[i].name == book.name) {
	    		booksInCart[i].count++; 
		    	found = true;
				break;
			}
		}
		if (!found) {
			booksInCart.push({name: book.name, count: 1});
		}
	} else booksInCart.push({name: book.name, count: 1});
	console.log(booksInCart);

	var current = 0;

	function AJAXget(title) {
		let replaced = title.name.replace(/\+/g, plus);
	   	replaced = replaced.replace(/\#/g, hashtag);

	    var oReq = new XMLHttpRequest(); //Create the object
	    oReq.open("GET", "get-data.php?title="+replaced, false);

	    oReq.onreadystatechange = function () {
	        if (oReq.readyState == 4 && oReq.status == 200) {
	            let res = JSON.parse(this.responseText);
	            booksInCart[current].author = res.author;
	            booksInCart[current].price = res.price;
	            booksInCart[current].total = Number(res.price.replace(/\$/, ''));;
		        console.log(booksInCart);
	            ++current; 
	            if (current < booksInCart.length) AJAXget(booksInCart[current]); 
	        }
	    };

	    oReq.send();
	}

	AJAXget(booksInCart[current]);
	console.log(booksInCart);

	allDishesCount();


	var oRq = new XMLHttpRequest(); //Create the object
	let books = JSON.stringify(booksInCart);
	let replaced = books.replace(/\+/g, plus);
	   	replaced = replaced.replace(/\#/g, hashtag);
		console.log(JSON.parse(books));
		oRq.open("get", "variableBeetwenPages.php?books="+replaced, true);
		oRq.send();
		oRq.onreadystatechange = function () {
		    if (oRq.readyState == 4 && oRq.status == 200) {
		    	console.log(this.responseText);
		      	console.log(JSON.parse(this.responseText));
		    }
		};

}


/**
 * Event Listeners
*/

if(document.getElementById('googleMap') === null){
	loadGoogleMap();
}

window.loadMaps = () => {
	var map = new google.maps.Map(document.getElementById('map-container'), {
		center: {lat:50.745151, lng:25.322764},
		zoom: 17,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false
	});

	var marker = new google.maps.Marker({
		position: {lat:50.745151, lng:25.322764},
		map: map,
		title: 'Oasis bookstore'
	});

	google.maps.event.addDomListener(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize');
	});
};

document.addEventListener('DOMContentLoaded', function(){
	arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);

	//if long name of book than make font-size smaller
	for (let item of document.querySelectorAll('.arrival-item-inf h3')){
		if (item.textContent.length > 12) item.style.fontSize  = '1em';
	}

	for (let item of document.querySelectorAll('input[type=button]')){
		item.addEventListener('click', function(){
			createCartHeader();
			addToCartArray(this);
		});
	}	
});

closeBestsellerModal.addEventListener('click', function(){
	document.getElementById('bestseller_modal_wrapper').style.display = 'none';
});

document.getElementById('open_bestseller_modal').addEventListener('click', function(){
	document.getElementById('bestseller_modal_wrapper').style.display = 'flex';
});

window.onclick = function(e) {
	if (e.target == document.getElementById('bestseller_modal_wrapper')) {
		document.getElementById('bestseller_modal_wrapper').style.display = 'none';
	}

	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}

	if (e.target == modal) {
    	cart.close();
    }
}; 

contactModalLink.onclick = function(){
	contactModal.style.display = 'flex';
};

closeContactModal.onclick = function(){
	contactModal.style.display = 'none';
};

cartTable.onmouseover = e => cart.getOverIndex(e);

openCart.onclick = function() {
  if (!cart){
    cart = new Cart();
  }
  cart.open();
};

//close the modal
closeModal.onclick = () => cart.close();




/*carousel.onscroll = () => {
    var scrollPercentage = 100 * this.scrollLeft / (this.scrollWidth - this.clientWidth);
    //console.log(scrollPercentage);
};*/