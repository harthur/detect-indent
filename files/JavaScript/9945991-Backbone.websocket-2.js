// Inspired by https://github.com/logicalparadox/backbone.iobind/blob/master/lib/sync.js
// Overwrite Backbone.sync method
Backbone.sync = function(method, model, options){

  // create a connection to the server
  var ws = new WebSocket('ws://127.0.0.1:1234');

  // send the command in url only if the connection is opened
  // command attribute is used in server-side.
  ws.onopen = function(){
    // in my convention, every message sent to the server must be:
    // {"command":"action", "data":"data sent to the server"}
    ws.send(JSON.stringify({"command":model.url, data:model.attributes}));
  };

  ws.onmessage = function(message){
    // message.data is a property sent by the server
    // change it to suit your needs
    var return = JSON.parse(message.data);
    // executes the success callback when receive a message from the server
    options.success(return);
  };
};