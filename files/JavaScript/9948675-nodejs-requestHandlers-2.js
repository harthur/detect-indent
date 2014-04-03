var fs = require('fs')

var thirtySecondsInMillis = 30*1000;

function postAuthenticate(request, response, postData) {	
	var postDataDict = JSON.parse(postData);
	console.log("* postAuthenticate: " + postData);
	// console.log("* [RECVD KEY/VALUE] " + querystring.parse(postData).text);
	console.log("* [RECVD JSON] " + postDataDict['username'] + " " + postDataDict['password']);
	if (postDataDict['username'] == 'luther' && postDataDict['password'] == 'baker') {
		console.log("* [AUTHENTICATION SUCCEEDED]");
		var timestamp = new Date().getTime();
		var expiration = timestamp + 30*1000;
		var randomUUID = uuid();
		var jsonResponseDict = { };
		jsonResponseDict['token'] = "SecureCookie=" + randomUUID + ";SessionCookie=" + expiration;
		var body = JSON.stringify(jsonResponseDict);
		console.log("* [RESPONSE BODY] " + body + "")
    	response.writeHead(200, {"Content-Type": "application/json"});
    	response.write(body);
    	response.end();
	} else {
		console.log("* [AUTHENTICATION FAILED]");
		four0Three(response);
	}
}

function getSomething(request, response, postData) {
	console.log("* getSomething");
	var cookies = parseCookies(request);
	for (var key in cookies) {
		console.log("* [cookie] key(" + key + ") value(" + cookies[key] + ")");
	}
	var cookieExpiration = cookies['SessionCookie'];
	var now = new Date().getTime();
	var late =  now - cookieExpiration;
	console.log("* [NOW] " + now + " - " + cookieExpiration + " = " + late/1000 + "s");
	if (late > 0) {
		console.log("* [ERROR] session expired!");
		four0One(response);
	} else {
		console.log("* [SUCCESS] trying to pull fields");
		fs.readFile('./data/Something.json', 'utf8', function (err,data) {
		  if (err) {
			  console.log(err);
			  four0Four(response);
		  } else {
			  console.log("* [SUCCESS] 'something' successfully retrieved");
			  response.writeHead(200, {"Content-Type": "application/json"});
			  response.write(data);			  
			  response.end();
		  }
		});		
	}
}

function four0One(response) {
	var body = "401 Unauthorized";
	response.writeHead(401, { 'Content-Length' : body.length, 'Content-Type' : 'text/plain' });
	response.write(body, 'utf8');
	response.end();
}

function four0Three(response) {
	var body = "403 Forbidden";
	response.writeHead(403, { 'Content-Length' : body.length, 'Content-Type' : 'text/plain' });
	response.write(body, 'utf8');
	response.end();
}

function four0Four(response) {
	var body = "404 Not Found";
	response.writeHead(404, { 'Content-Length' : body.length, 'Content-Type' : 'text/plain' });
	response.write(body, 'utf8');
	response.end();
}

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}


function parseCookies (request) {
	var list = {},
	    rc = request.headers.cookie;
		
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = unescape(parts.join('='));
	});

    return list;
}

exports.postAuthenticate = postAuthenticate;
exports.getSomething = getSomething;
exports.four0Four = four0Four;
