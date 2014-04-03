var HTTP = require("http");
var URL = require("url");

var port = 4567;

function start(router, routeHandlerMap) {
	
	function onRequest(request, response) {
		
		var url = request.url;
		var route = URL.parse(url).pathname; 
		console.log("\n========\n* " + route);
		
		// setup
		request.setEncoding("utf8");
		
		// "data" listener
		var postData = "";
		request.addListener("data", function(postDataChunk) { 
			console.log("* received POST data chunk '"+ postDataChunk + "'.");
			postData += postDataChunk;
		});
		
		// "end" listener
		request.addListener("end", function() {
			router.handleRequest(route, routeHandlerMap, request, response, postData);
		});
	 }
	 
	 HTTP.createServer(onRequest).listen(port);
	 console.log("Node.js is running on port " + port);
}

exports.start = start;
