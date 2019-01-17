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
import RenderElements from './RenderElements.js'; //for render finded items

/**
 * Class
*/

export default class Pagination{
	constructor(data, paginationWrapper, cart, perPageContainer){
		this.dataItems = data; //saves getted data inside instance of the object
		this.paginationWrapper = paginationWrapper; //parent block
		this.cart = cart; //cart instance for adding event listener for finded items in opened pages
		this.Render = new RenderElements(); //for rendering finded items
		this.perPage = perPageContainer.value; //count of items per page

		this.pagesCount = this.countPages(this.dataItems, this.perPage);

		this.renderPagesNumbers(this.pagesCount);
		for (let pagination of this.paginationWrapper){
			/*three dots block that means that more than one page between visible page numbers and first/last*/
			pagination.insertBefore(createNewEl('span', {content: '...', class: 'pagination-three-dots three-dots-start'}), pagination.childNodes[2]);
			pagination.insertBefore(createNewEl('span', {content: '...', class: 'pagination-three-dots three-dots-end'}), pagination.childNodes[pagination.childNodes.length - 2]);

			this.removeTextNode(pagination); //deletes unnecessary '#text' nodes
		}
		this.openPage(1); //open first page of pagination

		perPageContainer.onchange = () => {
			this.perPage = perPageContainer.value; //count of items per page
			this.pagesCount = this.countPages(this.dataItems, this.perPage);
			this.removePagesNumbers(this.pagesCount);
			this.renderPagesNumbers(this.pagesCount);
			this.openPage(1); //open first page of pagination
		};
	}

	/*count number of pages*/
	countPages(data, perPage){
		let pagesCount = Math.floor(data.length / perPage); //get fully loaded pages
		if (data.length % perPage){ //if have unfully loaded page add to page count too
			pagesCount++;
		}
		return pagesCount;
	}

	/*remove pages numbers in pagination if needed*/
	removePagesNumbers(pagesCount){
		for (let pagination of this.paginationWrapper){
			let items = Array.from(pagination.getElementsByClassName('pagination-page-number'));
			if (items.length > pagesCount) {
				for (let i = items.length; i > pagesCount; i--){
					pagination.removeChild(items[i-1]);
				}
			}
		}
	}

	/*render pages numbers in the pagination containers*/
	renderPagesNumbers(pagesCount){
		for (let pagination of this.paginationWrapper){
			this.removeTextNode(pagination); //deletes unnecessary '#text' nodes
			let items = Array.from(pagination.getElementsByClassName('pagination-page-number'));
			if (items.length < pagesCount) {
				/*creates button for every page number*/
				for (let i = items.length + 1; i <= this.pagesCount; i++){
					/*create and insert page number to pagination*/
					let pageNumber = createNewEl('span', {content: i, class: 'pagination-page-number'});
					pagination.insertBefore(pageNumber, pagination.lastChild);

					pageNumber.onclick = () => this.openPage(i); //open another page of pagination on click

					pagination.getElementsByClassName('pagination-arrow-left')[0].onclick = () => this.openPage(this.openedPage - 1); //open previous page of pagination on click
					pagination.getElementsByClassName('pagination-arrow-right')[0].onclick = () => this.openPage(this.openedPage + 1); //open next page of pagination on click
				}
			}		
		}	
	}

	/*opens various page of pagination*/
	openPage(page){
		if (page > 0 && page <= this.pagesCount){ //opens existing page

			/*finds and render finded items of opened page*/
			const renderItems = (page, startPointParam) => {
				for (let i = this.perPage * page - startPointParam; i < this.perPage * page; i++){
					if (this.dataItems[i]){
						this.Render.finded(this.dataItems[i], this.cart);
					}
				}
			};
			
			let findedItems = document.getElementsByClassName('fi'); //get items that exist on page
			
			if (page == this.openedPage) {
				if (findedItems.length < this.perPage){
					/*add new items up to the range*/
					renderItems(page, this.perPage - findedItems.length);
				} else {
					/*remove items that out of the range*/
					for (var i = findedItems.length - 1; i >= this.perPage; i--) {
						findedItems[i-1].remove();
					}
				}			
			} else {
				/*removes old items*/
				while(findedItems[0]){
					findedItems[0].remove();
				}

				renderItems(page, this.perPage);			
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
	 		pagination.getElementsByClassName('three-dots-start')[0].style.display = this.openedPage - 3 <= 1 ? 'none' : 'block';

	 		/*hide or show three dots before last page sign*/
	 		pagination.getElementsByClassName('three-dots-end')[0].style.display = this.openedPage + 3 >= this.pagesCount ? 'none' : 'block';

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

	/*removes unnecessary '#text' nodes */
	removeTextNode(parent){
		for (let child of parent.childNodes){ //check every child of parent
	 		if (child.nodeType == 3) { //if needed then delete
		        parent.removeChild(child);
		    }
	 	}
	}
}
