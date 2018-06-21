/**
 * Carousel
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Functions
*/

function getScrolledPercentage(item){
	return 100 * item.scrollLeft / (item.scrollWidth - item.clientWidth);
}

/**
 * Class
*/

class Carousel{
	constructor (rightButton, leftButton, carousel){
		this.rightButton = rightButton;
		this.leftButton = leftButton;
		this.carousel = carousel;
		this.carouselClone = carousel.getElementsByClassName('carousel-item');
		this.carouselLenght = this.carouselClone.length;

		for (let i = this.carouselLenght - 1 ; i != -1; i--){
			this.carousel.insertBefore(this.carouselClone[i].cloneNode(true), this.carousel.firstChild);
			this.carousel.appendChild(this.carouselClone[i].cloneNode(true));
		}
 
		this.carousel.scrollLeft = this.carouselClone.length/3 * (document.body.clientWidth/4);

		this.rightButton.addEventListener('click', () => {
			this.scrollToRight();
			if (getScrolledPercentage(this.carousel) >= 60){
				this.onRightBorderClose();
				this.scrollToRight();
			}
		});

		this.leftButton.addEventListener('click', () => {
			this.scrollToLeft();
			if (getScrolledPercentage(this.carousel) <= 30){
				this.onLeftBorderClose();
				this.scrollToLeft();
			}
		});
	}

	scrollToRight(){
		this.carousel.scrollBy({ 
			left: document.body.clientWidth/2, 
			behavior: 'smooth' 
		});
	}

	scrollToLeft(){
		this.carousel.scrollBy({ 
			left: -document.body.clientWidth/2, 
			behavior: 'smooth' 
		});
	}

	onLeftBorderClose(){
		for (let i = 0; i < this.carouselLenght; i++){
			this.carousel.insertBefore(this.carouselClone[i].cloneNode(true), this.carousel.firstChild);
		}

		for (let i = 0; i < this.carouselLenght; i++){
			let deletedNode = this.carousel.removeChild(this.carousel.lastChild);
			if (deletedNode.nodeName == '#text') {
				this.carousel.removeChild(this.carousel.lastChild);
			}
		}

		this.carousel.scrollLeft += this.carouselLenght * (document.body.clientWidth/4) - document.body.clientWidth/2 ;
	}

	onRightBorderClose(){
		for (let i = 0; i < this.carouselLenght; i++){
			this.carousel.appendChild(this.carouselClone[i].cloneNode(true));
		}

		for (let i = 0; i < this.carouselLenght; i++){
			let deletedNode = this.carousel.removeChild(this.carousel.firstChild);
			if (deletedNode.nodeName == '#text') {
				this.carousel.removeChild(this.carousel.firstChild);
			}
		}

		this.carousel.scrollLeft -= this.carouselLenght * (document.body.clientWidth/4) - document.body.clientWidth/2;
	}
}

/**
 * Export
*/

export {Carousel};