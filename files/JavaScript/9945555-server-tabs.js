var fs = require("fs");
config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var express = require("express");

var mongo = require("mongodb");
var dbHost = "127.0.0.1";
var dbPort = mongo.Connection.DEFAULT_PORT;

var app = express();

app.use(app.router);
app.use(express.static(__dirname + "/public"));
app.get('/',function(request,response){
	response.send("hello!");
});

app.get("/hello/:text", function(request,response){
	response.send("hello " +  request.params.text);
});

app.get("/user/:id", function(request,response){
	//var user = users[request.params.id];

	getUser(request.params.id,function(user){
	if (!user){
		response.send("sorry! we cannot find the user :(",404);
	}else
	{
		response.send('<a href="http://twitter.com/' + user.twitter + '">Follow</a>');
	}
});
});

app.listen(port,host);


function getUser(id,callback){
	var db = new mongo.Db("nodejs-introduction", new mongo.Server(dbHost, dbPort, {}));
	db.open(function(error){
		console.log("we are connected" + dbHost + " : " + dbPort);
		db.collection('user', function(error, collection){
			console.log("we have the collection");
			collection.find({'id' : id.toString() },function(error,cursor){
				cursor.toArray(function(error, user){
					console.log(user);
					if(user.length == 0){
						//console.log("No user found");
						callback(false);
					}
					else
					{
						callback(user[0]);
						//console.log("found a user",user[0]);
					}
				});
			});
		});
	});
}
