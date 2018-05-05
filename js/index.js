/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Global variables
*/

var closeModal = document.getElementById('close-modal');
var arrivalCarouselMain = document.getElementById('new_arrival_list');
var arrivalsLeft = document.getElementById('arrivals_left');
var arrivalsRight = document.getElementById('arrivals_right');
var arrivalCarousel;

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

        for (let i = this.carouselClone.length - 1 ; i != -1; i--){
            this.carousel.insertBefore(this.carouselClone[i].cloneNode(true), this.carousel.firstChild);
            this.carousel.appendChild(this.carouselClone[i].cloneNode(true));
        }

        this.carousel.scrollLeft = this.carousel.length/3 * (document.body.clientWidth/4);

        this.rightButton.addEventListener('click', () => {
            this.scrollRight();
            if (getScrolledPercentage(this.carousel) >= 70){
                this.onRightBorderClose();
                this.scrollRight();
            }
        });

        this.leftButton.addEventListener('click', () => {
            this.scrollLeft();
            if (getScrolledPercentage(this.carousel) <= 30){
                this.onLeftBorderClose();
                this.scrollLeft();
            }
        });
    }

    scrollRight(){
        this.carousel.scrollBy({ 
          left: document.body.clientWidth/2, 
          behavior: 'smooth' 
        });
    }

    scrollLeft(){
        this.carousel.scrollBy({ 
          left: -document.body.clientWidth/2, 
          behavior: 'smooth' 
        });
    }

    onLeftBorderClose(){
        for (let i = 0; i < this.carouselClone.lenght; i++){
            let deletedNode = this.carousel.removeChild(this.carousel.lastChild);
            if (deletedNode.nodeName == '#text') {
                this.carousel.removeChild(this.carousel.lastChild);
            }
        }
        for (let i = 0; i < this.carouselClone.lenght; i++){
            this.carousel.insertBefore(this.carouselClone[i].cloneNode(true), this.carousel.firstChild);
        }
        this.carousel.scrollLeft += this.carouselClone.lenght * (document.body.clientWidth/4) + document.body.clientWidth/2;
    }

    onRightBorderClose(){
        for (let i = 0; i < this.carouselClone.lenght; i++){
            this.carousel.appendChild(this.carouselClone[i].cloneNode(true));
        }
        for (let i = 0; i < this.carouselClone.lenght; i++){
            this.carousel.removeChild(this.carousel.lastChild);
        }
        this.carousel.scrollLeft -= this.carouselClone.lenght * (document.body.clientWidth/4) - document.body.clientWidth/2;
    }
}

/**
 * Event Listeners
*/

//if long name of book than make font-size smaller
for (item of document.querySelectorAll('.arrival-item-inf h3')){
    if (item.textContent.length > 12) item.style.fontSize  = '1em'
}

closeModal.addEventListener('click', function(){
    document.getElementById('bestseller_modal_wrapper').style.display = 'none';
})

document.getElementById('open_bestseller_modal').addEventListener('click', function(){
    document.getElementById('bestseller_modal_wrapper').style.display = 'flex';
})

window.onclick = function(e) {
  if (e.target == document.getElementById('bestseller_modal_wrapper')) {
    document.getElementById('bestseller_modal_wrapper').style.display = 'none';
  }
}; 


document.addEventListener('DOMContentLoaded', function(){
    arrivalCarousel = new Carousel(arrivalsRight, arrivalsLeft, arrivalCarouselMain);
})







/*carousel.onscroll = () => {
    var scrollPercentage = 100 * this.scrollLeft / (this.scrollWidth - this.clientWidth);
    //console.log(scrollPercentage);
};*/