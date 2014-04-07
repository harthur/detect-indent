var app = require('express')();

var page = '<html><head><script src="http://code.jquery.com/jquery-1.11.0.min.js"></script></head><body>foo</body></html>';

app.use(function(req, res, next) {
  res.set('Set-Cookie', 'Flo=' + req.query.Flo + '; Domain = .foo.com');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Expose-Headers', 'Set-Cookie, Cookie, X-Session, X-Powered-By');
  res.set('Access-Control-Allow-Headers', 'Cookie, Set-Cookie');
  res.set('X-Session', 'darnit');
  next();
});

app.get('/', function(req, res) {
  res.send(page);
});

app.get('/data', function(req, res) {
  res.json({foo: req.query.Flo});
});

[7000,7001].forEach(function(port){app.listen(port);});