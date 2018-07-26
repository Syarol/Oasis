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
		this.paginators = paginators;

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
				let pageNumber = createNewEl('span', false, {content: i, class: 'pagination-page-number'});
				paginator.insertBefore(pageNumber, paginator.lastChild);

				pageNumber.onclick = (target) => {
					//this.highlightOpened(i);
					this.openPage(i);
				}

				paginator.getElementsByClassName('pagination-arrow-left')[0].onclick = () => this.openPage(this.openedPage - 1);
				paginator.getElementsByClassName('pagination-arrow-right')[0].onclick = () => this.openPage(this.openedPage + 1);
			}

			paginator.insertBefore(createNewEl('span', false, {content: '...', class: 'pagination-three-dots three-dots-start'}), paginator.childNodes[2]);
			paginator.insertBefore(createNewEl('span', false, {content: '...', class: 'pagination-three-dots three-dots-end'}), paginator.childNodes[paginator.childNodes.length - 2]);

			for (let child of paginator.childNodes){ //check every child of paginator
	 			if (child.nodeType == 3) { //if needed then delete
			        paginator.removeChild(child);
			    }
	 		}
		}

		this.Render = new RenderElements(); 

		this.openPage(1);
	}

	openPage(page){
		console.log(page);
		if (page > 0 && page <= this.pagesCount && page != this.openedPage){
			let items = document.getElementsByClassName('founded-item');
			while(items[0]){
				items[0].remove();
			}

			for (let i = this.perPage * page - this.perPage; i < this.perPage * page; i++){
				if (this.dataItems[i]){
					this.Render.founded(this.dataItems[i], this.cart);
				}
			}
			this.highlightOpened(page);
			this.openedPage = page;
			this.hidePagesNumber();
		}
	}

	highlightOpened(page){
		for (let paginator of this.paginators){
			for (let child of paginator.childNodes){ //check every child of paginator
	 			if (this.openedPage == child.innerText){
	 				child.style.backgroundColor = '#fff0';
	 			} 
	 			if (page == child.innerText){
	 				child.style.backgroundColor = '#c3c3c3';
	 			}
			}
		}
	}

	hidePagesNumber(){
		for (let paginator of this.paginators){
			let pageNumbers = paginator.getElementsByClassName('pagination-page-number');

	 		/*hide or show three dots after first page sign*/
	 		if (this.openedPage - 3 <= 1) {
	 			paginator.getElementsByClassName('three-dots-start')[0].style.display = 'none';
	 		} else paginator.getElementsByClassName('three-dots-start')[0].style.display = 'block';

	 		/*hide or show three dots before last page sign*/
	 		if (this.openedPage + 3 >= this.pagesCount) {
	 			paginator.getElementsByClassName('three-dots-end')[0].style.display = 'none';
	 		} else paginator.getElementsByClassName('three-dots-end')[0].style.display = 'block';


	 		for (let i = this.openedPage-3; i > 1 ; i--){
	 			if (i <= 0) break;
	 			pageNumbers[i-1].style.display = 'none';
	 		}

	 		for (let i = this.openedPage; i > this.openedPage-3 ; i--){
	 			if (i <= 0) break;
	 			pageNumbers[i-1].style.display = 'block';
	 		}

	 		if (this.openedPage - 3 == 2) {
	 			console.log();
	 			pageNumbers[1].style.display = 'block';
	 			paginator.getElementsByClassName('three-dots-start')[0].style.display = 'none';
	 		}

	 		for (let i = this.openedPage+2; i < this.pagesCount-1; i++){
	 			if (i >= this.pagesCount) break;
	 			pageNumbers[i].style.display = 'none';
	 		}

	 		for (let i = this.openedPage; i < this.openedPage+2 ; i++){
	 			if (i >= this.pagesCount) break;
	 			pageNumbers[i].style.display = 'block';
	 		}

	 		if (this.openedPage + 3 == this.pagesCount - 1) {
	 			pageNumbers[this.pagesCount-2].style.display = 'block';
	 			paginator.getElementsByClassName('three-dots-end')[0].style.display = 'none';
	 		}









			/*if (this.openedPage - 2 <= 2){
				paginator.getElementsByClassName('three-dots-start')[0].style.display = 'none';

				if (this.openedPage + 2 >= this.pagesCount - 1) {
					paginator.getElementsByClassName('three-dots-end')[0].style.display = 'none';
				} else{
					paginator.getElementsByClassName('three-dots-end')[0].style.display = 'block';
				}
*/
			/*	for (let i = 0; i < pageNumbers.length; i++){
					if (pageNumbers[i].innerText == this.openedPage){

						i += 3;
						console.log(i + ' ' + pageNumbers.length);
						for( ; i < pageNumbers.length - 1; i++){
							console.log('f');
							//console.log(pageNumbers[i]);
							if (pageNumbers[i].innerText != this.pagesCount) {
								pageNumbers[i].style.display = 'none';
							}
							console.log(pageNumbers[i+1].innerText + ' ' + this.pagesCount-2 + ' ' + pageNumbers[i+1].innerText == this.pagesCount-2);
							if (pageNumbers[i+1].innerText == this.pagesCount-2) {
								paginator.getElementsByClassName('three-dots-end')[0].style.display = 'none';
							}
						}
						break;
					}
				}*/

			//} else if(this.openedPage + 2 >= this.pagesCount - 1){
				/*paginator.getElementsByClassName('three-dots-end')[0].style.display = 'none';

				if (this.openedPage - 2 <= 2) {
					paginator.getElementsByClassName('three-dots-start')[0].style.display = 'none';
				} else{
					paginator.getElementsByClassName('three-dots-start')[0].style.display = 'block';
				}*/
			/*} else{

			}*/
		}
	}
}
