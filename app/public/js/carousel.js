/**
 * Carousel module
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/**
 * Class
*/

export default class Carousel{
	constructor (rightButton, leftButton, carousel){
		/*deletes unneeded '#text' node from childNodes list*/
 		for (let child of carousel.childNodes){ //check every child of carousel
 			if (child.nodeType == 3) { //if needed then delete
		        carousel.removeChild(child);
		    }
 		}

		var carouselLenght = carousel.childNodes.length; //get cunt of carousel items

		carousel.scrollLeft = carousel.clientWidth; //set initial view position

		/*on right button click move first carousel element to end and simulate swipe*/
		rightButton.onclick = () => {
			carousel.appendChild(carousel.childNodes[0]); //move element from first position to last
			carousel.scrollLeft = carousel.scrollLeft - carousel.clientWidth/this.getPerPageCount(); //create indent for animation 
			this.scrollToRight(carousel); //animation of swipe
		};

		/*on right button click move last carousel element to start and simulate swipe*/
		leftButton.onclick = () => {
			carousel.insertBefore(carousel.childNodes[carouselLenght - 1], carousel.firstChild); // move element from last position to first
			carousel.scrollLeft = carousel.scrollLeft + carousel.clientWidth/this.getPerPageCount(); //create indent for animation 
			this.scrollToLeft(carousel); //animation of swipe
		};
	}

	/*carousel horizontal scroll to right side*/
	scrollToRight(carousel){
		carousel.scrollBy({ 
			left: carousel.clientWidth/this.getPerPageCount(), //scroll pixels count
			behavior: 'smooth' //scroll type
		});
	}

	/*carousel horizontal scroll to left side*/
	scrollToLeft(carousel){
		carousel.scrollBy({ 
			left: -carousel.clientWidth/this.getPerPageCount(), //scroll pixels count
			behavior: 'smooth' //scroll type
		});
	}

	/*gets a count of visible items in the carousel. Based on CSS-properties*/
	getPerPageCount(){
		return window.innnerWidth <= 600 ? 3 : 4;
	}
}
