/**
 * Oasis bookstore site
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Imports
*/

import {getScrolledPercentage, Carousel} from './carousel.js';

/**
 * Global variables
*/

var recommendCarouselMain = document.getElementById('recommend_carousel');
var bestsellersCarouselMain = document.getElementById('bestsellers_carousel');
var arrivesCarouselMain = document.getElementById('arrives_carousel');

var leftButtons = document.getElementsByClassName('left-control');
var rightButtons = document.getElementsByClassName('right-control');
var contactModal = document.getElementById('about_section_wrapper');
var contactModalLink = document.getElementById('contact');
var closeContactModal = document.getElementById('close-contact-modal');
var recommendCarousel;
var bestsellersCarousel;
var arrivesCarousel;

/**
 * Functions
*/

function loadGoogleMap(){
	let script = document.createElement('script');
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps';
	script.type = 'text/javascript';
	script.id ='googleMap';
	document.getElementsByTagName('body')[0].append(script);
}

if(document.getElementById('googleMap') === null){
	loadGoogleMap();
}

/**
 * Event Listeners
*/

window.loadMaps = () => {
	var map = new google.maps.Map(document.getElementById('map-container'), {
		center: {lat:50.745151, lng:25.322764},
		zoom: 17,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false
	});

	var marker = new google.maps.Marker({
		position: {lat:50.745151, lng:25.322764},
		map: map,
		title: 'Oasis bookstore'
	});

	google.maps.event.addDomListener(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize');
	});
};

document.addEventListener('DOMContentLoaded', function(){
	recommendCarousel = new Carousel(rightButtons[0], leftButtons[0], recommendCarouselMain);
	bestsellersCarousel = new Carousel(rightButtons[1], leftButtons[1], bestsellersCarouselMain);
	arrivesCarousel = new Carousel(rightButtons[2], leftButtons[2], arrivesCarouselMain);

	//if long name of book than make font-size smaller
	for (let item of document.querySelectorAll('.arrival-item-inf h3')){
		if (item.textContent.length > 12) item.style.fontSize  = '1em';
	}
});

window.onclick = function(e) {
	if (e.target == contactModal) {
		contactModal.style.display = 'none';
	}
}; 

contactModalLink.onclick = function(){
	if(document.getElementById('googleMap') === null){
		loadGoogleMap();
	}
	contactModal.style.display = 'flex';
};

closeContactModal.onclick = function(){
	contactModal.style.display = 'none';
};
