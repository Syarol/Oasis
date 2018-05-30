/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/


/**
 * Global variables
*/

var categoriesList = document.getElementById('categories_list');
var authorsList = document.getElementById('authors_list');
var publishersList = document.getElementById('publishers_list');
var categoriesListTitle = document.getElementById('categories_list_title');
var authorsListTitle = document.getElementById('authors_list_title');
var publishersListTitle = document.getElementById('publishers_list_title');

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

/**
 * Event Listeners
*/

categoriesListTitle.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#categories_list h3 i.far')){
		changePlusMinus(item);
	}
	if (categoriesList.style.maxHeight == '500px') {
		categoriesList.style.maxHeight = '30px';
	} else categoriesList.style.maxHeight = '500px';
});

authorsListTitle.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#authors_list h3 i.far')){
		changePlusMinus(item);
	}
	if (authorsList.style.maxHeight == '500px') {
		authorsList.style.maxHeight = '30px';
	} else authorsList.style.maxHeight = '500px';
});

publishersListTitle.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#publishers_list h3 i.far')){
		changePlusMinus(item);
	}
	if (publishersList.style.maxHeight == '500px') {
		publishersList.style.maxHeight = '30px';
	} else publishersList.style.maxHeight = '500px';
});

document.addEventListener('DOMContentLoaded',function() {
	let categories = document.querySelectorAll('input[name="category"]');
	for (let category of categories){
	    category.addEventListener('click', function(){
	    	let hiddenInput = document.querySelector('input[name="checkbox-category"]');
	    	if (category.checked) {
	    		hiddenInput.value += category.value + ', ';
	    	} else hiddenInput.value = hiddenInput.value.replace(category.value + ', ', '');
	    	console.log(hiddenInput.value);
	    });    	
	}

	let authors = document.querySelectorAll('input[name="author"]');
	for (let author of authors){
	    author.addEventListener('click', function(){
	    	let hiddenInput = document.querySelector('input[name="checkbox-author"]');
	    	if (author.checked) {
	    		hiddenInput.value += author.value + ', ';
	    	} else hiddenInput.value = hiddenInput.value.replace(author.value + ', ', '');
	    	console.log(hiddenInput.value);
	    });    	
	}

	let publishers = document.querySelectorAll('input[name="publisher"]');
	for (let publisher of publishers){
	    publisher.addEventListener('click', function(){
	    	let hiddenInput = document.querySelector('input[name="checkbox-publisher"]');
	    	if (publisher.checked) {
	    		hiddenInput.value += publisher.value + ', ';
	    	} else hiddenInput.value = hiddenInput.value.replace(publisher.value + ', ', '');
	    	console.log(hiddenInput.value);
	    });
	}
});

