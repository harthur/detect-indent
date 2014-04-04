var node = require('when/node');
var net = require('net');
var RedisClient = require('redis').RedisClient;
var host = '127.0.0.1';
var port = 6379;
var commands = require('redis/lib/commands');

function PromisedRedisClient() {
	RedisClient.apply(this, arguments);
}

PromisedRedisClient.prototype = node.liftAll(RedisClient.prototype, function(proto, f, n) {
	if(commands.indexOf(n) >= 0) {
		proto[n] = f;
	}
	return proto;
});

var client = new PromisedRedisClient(net.connect(host, port));
client.port = port;
client.host = host;

client.get('foo').done(console.log);