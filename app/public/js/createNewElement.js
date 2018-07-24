/**
 * Function for creating new DOM Elemnts
 *
 * @Author Oleh Yaroshchuk 
 * GitHub : https://github.com/Syarol
 */

/** 
 * function 'createNewEl' creates and return new element with all-needed properties, include nested elements and callbacks
 * attr need to write in object view
 * appendTo need to write parent element of created element or 'false' if
 * for adding text inside need to set 'content' property inside attr variable
 * nested elements allowed with setted 'nested' property
 * callback events allowed with setted 'callback' property and written in object view, like: callback:{eventName: {call: function(){}} //'call' property is required
 * Example : 
 *	createNewEl('span', false, {
 *		content:'hello',
 *		class: 'your-class', 
 *		nested: [createNewEl("span", false, {content: "World!"})],
 *		event: {click: {
 *			call : function(){console.log('Hello world!');}
 *		}}
 *	});
 * In example was created span element that have 'your-class' class, 'hello' text inside tags, nested span element with 'World!' text and callback for 'click' event. Also, created element not appended to anyone
*/

export default function createNewEl(tagNme, appendTo, ...attr){
	let el = document.createElement(tagNme); //creates element
	if (attr.length !=0){ //if attr not empty
		attr = attr[0]; //move attr outside array

		/*sets element properties for every key. Also appends child nodes and eventlisteners */
		for (let key in attr) {
			switch (key){
			case 'nested':
				for (let nested of attr.nested){
					el.appendChild(nested);
				}
				break;
			case 'content':
				el.textContent = attr.content;
				break;
			case 'event':
				for (let callbackKey in attr.event) {
					el.addEventListener(callbackKey, attr.event[callbackKey].call);
				}
				break;
			default:
				el.setAttribute(key, attr[key]);
				break;
			}
		}
	}

	/*if parent setted then append*/
	if (appendTo != false){ 
		appendTo.appendChild(el);
	}
	
	return el;
}
