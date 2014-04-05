
/**
 * [Simple user agent check]
 */
var userAgent = navigator.userAgent;
var checker = {
  iphone: userAgent.match(/(iPhone|iPod|iPad)/),
  blackberry: userAgent.match(/BlackBerry/),
  android: userAgent.match(/Android/)
};

if(checker.iphone || checker.blackberry || checker.android) {
  // do some things if needed.... 
};

