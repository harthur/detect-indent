function ArrayAppender() {
 this.logArray = [];
};


Appender.prototype.log = function(name, level, message) {
  this.logArray.push({
    name: name,
    level: level,
    message: message
  });
};

var logManager = new LogManager();
var appender = new ArrayAppender();

logManager.addDefaultAppender(appender);

window.onerror = function() {
  $.ajax({
    type: 'post',
    url: '/error-logs'
    data: appender.logArray
  });
};

