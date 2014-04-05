CrystalCore.libs.backstage = {

	name: 'backstage',
	
	version: '2.0.1',
	
	init: function(scope, method, settings) {
	
		var self = this;
		
		$('.backstage-button').on('click', self.events.open);
		
		$('.backstage-surface').on('click', self.events.close);	
	
	},
	
	events: {
	
		open: function() {
		
			// Get reference to "this" instance of CrystalCore.libs.backstage
			var instance = /* this instance here */;
		
		},
		
		close: function() {
		
			// Get reference to "this" instance of CrystalCore.libs.backstage
			var instance = /* this instance here */;    
		
		}
	
	}

}