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
	constructor(data, paginators, perPage, cart){
		this.dataItems = data;
		this.perPage = perPage;
		this.pagesRange = 2;
		this.cart = cart;
		

		this.pagesCount = Math.floor(data.length / this.perPage); //get fully loaded pages
		if (data.length % this.perPage){ //if have unfully loaded page add to page count too
			this.pagesCount++;
		}

		for (let paginator of paginators){
			for (let child of paginator.childNodes){ //check every child of paginator
	 			if (child.nodeType == 3) { //if needed then delete
			        paginator.removeChild(child);
			    }
	 		}

			for (let i = 1; i <= this.pagesCount; i++){
				let pageNumber = createNewEl('span', false, {content: i});
				paginator.insertBefore(pageNumber, paginator.lastChild);

				pageNumber.onclick = () => this.openPage(i);

				paginator.getElementsByClassName('pagination-arrow-left')[0].onclick = () => this.openPage(this.openedPage - 1);
				paginator.getElementsByClassName('pagination-arrow-right')[0].onclick = () => this.openPage(this.openedPage + 1);
			}
		}

		this.Render = new RenderElements(); 

		this.openPage(1);
	}

	openPage(page){
		console.log(page);
		if (page > 0 && page <= this.pagesCount && page != this.openedPage){
			console.log(page + '  ' + this.openedPage);
			let items = document.getElementsByClassName('founded-item');
			while(items[0]){
				items[0].remove();
			}

			for (let i = this.perPage * page - this.perPage; i < this.perPage * page; i++){
				if (this.dataItems[i]){
					this.Render.founded(this.dataItems[i], this.cart);
				}
			}
			this.openedPage = page;
		}
	}
}