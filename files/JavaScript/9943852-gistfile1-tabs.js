



(function(){

	function scan(thing){
		var proto = thing.prototype,
			keys = Object.keys(proto),
			keyValuePairs = keys.map(function(key){ 
				return {key: key, value: proto[key]}
			}),
			nonNativeKeyValuePairs = keyValuePairs.filter(function(kvp){
				return !(/\{ \[native code\] \}/.exec(kvp.value.toString()))
			}),
			nonNativeKeys = nonNativeKeyValuePairs.map(function(kvp){ 
				return kvp.key
			})
			
		return nonNativeKeys
	}

	var types = {
			Number: Number,
			Boolean: Boolean,
			Date: Date,
			String: String,
			Array: Array,
			RegExp: RegExp,
			Function: Function,
			Object: Object
		},
		typeNames = Object.keys(types),
		typeScans = typeNames.reduce(function(result,typeName){
			result[typeName] = scan(types[typeName])
			return result
		},{}),
		reportStrings = typeNames.reduce(function(result,typeName){
			result[typeName] = typeScans[typeName].join(', ')
			return result
		},{}),
		report = typeNames.reduce(function(report,typeName){
			report += typeName + ': ' + reportStrings[typeName] + '\n'
			return report
		},'')
		
		console.log(report)
		
}())