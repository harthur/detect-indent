function(animals){
	
	// group animals by their species property
	var groups = _.groupBy(animals, function(animal){
		return animal.species;	
	});
	
	// sort each group by number of legs
	var sortedGroups = _.each(groups, 
		function(group){
			_.sortBy(group,
			function(animal){
				return animal.legsCount;
			});
	
	});
}