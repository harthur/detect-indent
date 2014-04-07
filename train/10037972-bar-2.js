console.log('init');
var bar = new Foo();

console.log('bind');
bar.on('initialize', function() {
  console.log('init received');
});