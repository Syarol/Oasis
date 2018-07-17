/**
 * Module for connecting and loading map of shop location
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Class
*/

export default class GoogleMap{
	constructor(){
		this.loadGoogleMap(); //load and appends google map script to page

		/*when map loaded, then will setted her properties*/
		window.loadMaps = () => {
			/*map properties*/
			let map = new google.maps.Map(document.getElementById('map-container'), {
				center: {lat:50.745151, lng:25.322764},
				zoom: 15,
				streetViewControl: false,
				mapTypeControl: false,
				fullscreenControl: false
			});

			/*marker properties*/
			new google.maps.Marker({
				position: {lat:50.745151, lng:25.322764},
				map: map,
				title: 'Oasis bookstore'
			});
		};
	}

	loadGoogleMap(){
		let script = document.createElement('script');//creates new DOM element
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps'; //sets script source
		script.type = 'text/javascript'; //sets script type (for old browsers)
		script.id ='googleMap'; //sets element id
		document.getElementsByTagName('body')[0].append(script); //appends to page
	}
}
