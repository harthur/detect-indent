/**
* Returns the docked position of the given
* stage element by reading the "dock-xxxx" class.
* Possible matches: left, right, top bottom.
* @param jQuery Object
* @returns {String}
* @public
*/
var getDirection = function(element) {

	var direction;
	
	var classes = element.attr('class').split(/\s+/);
	var count 	= classes.length;
	var i 		= 0;
	
	for(i; i < count; i++) {
		
		var className = classes[i];
		
		if(className.indexOf('dock-') === 0) {
			
			direction = className.match(/[^-]+$/gm).toString();
			
		}
		
	}
	
	// @return string
	return direction;
	
}