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

export default class Carousel{
	constructor (rightButton, leftButton, carousel/*, buttonFunction*/){
		this.rightButton = rightButton;
		this.leftButton = leftButton;
		this.carousel = carousel;

		this.carouselItems = Array.from(carousel.getElementsByClassName('carousel-item')).map(function(i){return i});
		this.carouselLenght = this.carouselItems.length;

		/*deletes unneeded '#text' node from childNodes list*/
 		for (let child of this.carousel.childNodes){
 			if (child.nodeType == 3) {
		        this.carousel.removeChild(child);
		    }
 		}
console.log(this.carouselLenght/3);
	/*	for (let item of this.carouselItems){
			let newCarouselItem = this.carousel.appendChild(item.cloneNode(true));

			newCarouselItem.getElementsByClassName('button')[0].onclick = () => {
				buttonFunction(JSON.parse(newCarouselItem.querySelector('[type=button]').getAttribute('goods')));
			};
		}
		for (let i = this.carouselItems.length - 1; i >= 0; i--){
			let newCarouselItem = this.carousel.insertBefore(this.carouselItems[i].cloneNode(true), this.carousel.firstChild);
			
			newCarouselItem.querySelector('[type=button]').onclick = () => {
				buttonFunction(JSON.parse(newCarouselItem.querySelector('[type=button]').getAttribute('goods')));
			};
		}*/

		this.carousel.scrollLeft = this.carouselLenght/3 * (document.body.clientWidth/4);

		this.rightButton.onclick = () => {
				this.onRightBorderClose();
			this.scrollToRight();
			/*if (getScrolledPercentage(this.carousel) >= 60){
				this.scrollToRight();
			}*/
		};

		this.leftButton.onclick = () => {
				this.onLeftBorderClose();
			this.scrollToLeft();
			/*if (getScrolledPercentage(this.carousel) <= 30){
				this.scrollToLeft();
			}*/
		};
	}

	scrollToRight(){
		this.carousel.scrollBy({ 
			left: document.body.clientWidth/4, 
			behavior: 'smooth' 
		});
	}

	scrollToLeft(){
		this.carousel.scrollBy({ 
			left: -document.body.clientWidth/4, 
			behavior: 'smooth' 
		});
	}

	onLeftBorderClose(){
		//for(let i = 0; i < 2; i++){
			let item = this.carousel.insertBefore(this.carousel.childNodes[this.carousel.childNodes.length - 1], this.carousel.firstChild);
			this.carousel.scrollLeft = this.carousel.scrollLeft + document.body.clientWidth/4;
			/*item.style.width = '0';
			item.style.width = '25%';*/
		//}
		/*for (let i = 0; i < this.carouselLenght; i++){
			this.carousel.insertBefore(this.carouselItems[i].cloneNode(true), this.carousel.firstChild);
		}

		for (let i = 0; i < this.carouselLenght; i++){
			let deletedNode = this.carousel.removeChild(this.carousel.lastChild);
			if (deletedNode.nodeName == '#text') {
				this.carousel.removeChild(this.carousel.lastChild);
			}
		}

		this.carousel.scrollLeft += this.carouselLenght * (document.body.clientWidth/4) - document.body.clientWidth/2 ;*/
	}

	onRightBorderClose(){
		//for(let i = 0; i < 2; i++){
			this.carousel.appendChild(this.carousel.childNodes[0]);
			this.carousel.scrollLeft = this.carousel.scrollLeft - document.body.clientWidth/4;
			/*item.style.width = '0';
			item.style.width = '25%';*/
		//}
		/*for (let i = 0; i < this.carouselLenght; i++){
			this.carousel.appendChild(this.carouselItems[i].cloneNode(true));
		}

		for (let i = 0; i < this.carouselLenght; i++){
			let deletedNode = this.carousel.removeChild(this.carousel.firstChild);
			if (deletedNode.nodeName == '#text') {
				this.carousel.removeChild(this.carousel.firstChild);
			}
		}*/

		//this.carousel.scrollLeft -= this.carouselLenght * (document.body.clientWidth/4) - document.body.clientWidth/2;
	}
}
