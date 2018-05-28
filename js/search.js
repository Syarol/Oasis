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

categoriesList.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#categories_list h3 i.far')){
		changePlusMinus(item);
	}
	if (this.style.maxHeight == '500px') {
		this.style.maxHeight = '30px'
	} else this.style.maxHeight = '500px';
});

authorsList.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#authors_list h3 i.far')){
		changePlusMinus(item);
	}
	if (this.style.maxHeight == '500px') {
		this.style.maxHeight = '30px'
	} else this.style.maxHeight = '500px';
});

publishersList.addEventListener('click', function(){
	for (let item of document.querySelectorAll('#publishers_list h3 i.far')){
		changePlusMinus(item);
	}
	if (this.style.maxHeight == '500px') {
		this.style.maxHeight = '30px'
	} else this.style.maxHeight = '500px';
});
