function handleRequest(route, routeHandlerMap, request, response, postData) {
	var requestHandler = routeHandlerMap[route];
	if (typeof requestHandler !== 'function') {
		requestHandler = routeHandlerMap["404"];
	}
	requestHandler(request, response, postData);
}

exports.handleRequest = handleRequest;
