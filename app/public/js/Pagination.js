/**
 * Pagination module
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Import
*/

import createNewEl from './createNewElement.js'; //for creating new DOM elements
import RenderElements from './RenderElements.js'; //for render founded items

/**
 * Class
*/

export default class Pagination{
	constructor(data, paginationWrapper, cart){
		this.dataItems = data; //saves getted data inside instance of the object
		this.paginationWrapper = paginationWrapper; //parent block
		this.cart = cart; //cart instance for adding event listener for founded items in opened pages
		this.Render = new RenderElements(); //for rendering founded items
		this.perPage = 9; //count of items per page

		this.pagesCount = Math.floor(data.length / this.perPage); //get fully loaded pages
		if (data.length % this.perPage){ //if have unfully loaded page add to page count too
			this.pagesCount++;
		}

		/*creating pagination*/
		for (let pagination of paginationWrapper){
			this.deleteTextNode(pagination); //deletes unnecessary '#text' nodes

			/*creates button for every page number*/
			for (let i = 1; i <= this.pagesCount; i++){
				/*create and insert page number to pagination*/
				let pageNumber = createNewEl('span', false, {content: i, class: 'pagination-page-number'});
				pagination.insertBefore(pageNumber, pagination.lastChild);

				pageNumber.onclick = () => this.openPage(i); //open another page of pagination on click

				pagination.getElementsByClassName('pagination-arrow-left')[0].onclick = () => this.openPage(this.openedPage - 1); //open previous page of pagination on click
				pagination.getElementsByClassName('pagination-arrow-right')[0].onclick = () => this.openPage(this.openedPage + 1); //open next page of pagination on click
			}

			/*three dots block that means that more than one page between visible page numbers and first/last*/
			pagination.insertBefore(createNewEl('span', false, {content: '...', class: 'pagination-three-dots three-dots-start'}), pagination.childNodes[2]);
			pagination.insertBefore(createNewEl('span', false, {content: '...', class: 'pagination-three-dots three-dots-end'}), pagination.childNodes[pagination.childNodes.length - 2]);

			this.deleteTextNode(pagination); //deletes unnecessary '#text' nodes
		}

		this.openPage(1); //open first page of pagination
	}

	/*opens various page of pagination*/
	openPage(page){
		if (page > 0 && page <= this.pagesCount && page != this.openedPage){ //opens existing page and don't not reopen already opened page
			/*removes old items*/
			let items = document.getElementsByClassName('founded-item');
			while(items[0]){
				items[0].remove();
			}

			/*finds and render founded items of opened page*/
			for (let i = this.perPage * page - this.perPage; i < this.perPage * page; i++){
				if (this.dataItems[i]){
					this.Render.founded(this.dataItems[i], this.cart);
				}
			}

			this.highlightOpened(page); //highlight open page in pagination
			this.openedPage = page; //save opened page number
			this.hidePagesNumber(); //arranges page numbers in pagination
		}
	}

	/*highlight opened page number of pagination*/
	highlightOpened(page){
		for (let pagination of this.paginationWrapper){
			for (let child of pagination.childNodes){ //check every child of pagination
	 			if (this.openedPage == child.innerText){
	 				child.style.backgroundColor = '#fff0';
	 			} 
	 			if (page == child.innerText){
	 				child.style.backgroundColor = '#c3c3c3';
	 			}
			}
		}
	}

	/*hides pages numbers that don't in range of two to opened page*/
	hidePagesNumber(){
		for (let pagination of this.paginationWrapper){
			let pageNumbers = pagination.getElementsByClassName('pagination-page-number');

	 		/*hide or show three dots after first page sign*/
	 		if (this.openedPage - 3 <= 1) {
	 			pagination.getElementsByClassName('three-dots-start')[0].style.display = 'none';
	 		} else pagination.getElementsByClassName('three-dots-start')[0].style.display = 'block';

	 		/*hide or show three dots before last page sign*/
	 		if (this.openedPage + 3 >= this.pagesCount) {
	 			pagination.getElementsByClassName('three-dots-end')[0].style.display = 'none';
	 		} else pagination.getElementsByClassName('three-dots-end')[0].style.display = 'block';

	 		/*checks every page block for show only in a range of 2 opened page*/
	 		for (let i = 1; i < this.pagesCount - 1; i++){
	 			switch (true){
	 				case (1 <= i && i < this.openedPage - 3):
					pageNumbers[i].style.display = 'none';
	 					break;
	 				case (this.openedPage + 2 <= i && i < this.pagesCount - 1):
	 					if (i >= this.pagesCount) break;
	 					pageNumbers[i].style.display = 'none';
	 					break;
	 				case (this.openedPage - 3 <= i && i <= this.openedPage + 1):
	 					if (i <= 0) continue;
			 			pageNumbers[i].style.display = 'block';
	 					break;
	 				default:
	 					console.log(i);
	 					break;
	 			}
	 		}

	 		/*if opened 5th page then don't hiding 2th page and don't shows three dots */
	 		if (this.openedPage == 5) {
	 			pageNumbers[1].style.display = 'block';
	 			pagination.getElementsByClassName('three-dots-start')[0].style.display = 'none';
	 		}

	 		/*if opened 5th page before end then don't hiding 2th page from end and don't shows three dots */
	 		if (this.openedPage + 3 == this.pagesCount - 1) {
	 			pageNumbers[this.pagesCount-2].style.display = 'block';
	 			pagination.getElementsByClassName('three-dots-end')[0].style.display = 'none';
	 		}
		}
	}

	/*deletes unnecessary '#text' nodes */
	deleteTextNode(parent){
		for (let child of parent.childNodes){ //check every child of parent
	 		if (child.nodeType == 3) { //if needed then delete
		        parent.removeChild(child);
		    }
	 	}
	}
}
