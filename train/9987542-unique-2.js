//
// unique.js
// create unique id.
// Copyright (c) 2014 Tosainu <tosainu.maple@gmail.com>
//

var crypto = require('crypto');
var key = 'qawsedrftgyhujikolp';

function set(text) {
  key = text;
}

function gen() {
  var sha1 = crypto.createHmac('sha1', key);
  sha1.update(Date() + process.platform + Math.random());
  return sha1.digest('hex');
}

module.exports = {
  set: set,
  gen: gen
}
