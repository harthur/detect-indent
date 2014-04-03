var isjquery = function(data) {
			
	// If data is already a jQuery object
	if(data instanceof jQuery) {
				
	    // Do nothing different
	    data = data;
	
	// Otherwise			
	} else {
				
		// Convert to jQuery object
		data = $(data);
				
	}
	
	// Return jQuery object		
	return data;
			
}