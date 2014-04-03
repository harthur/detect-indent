
import { KeyValueStore } from './storage';
import { d } from './dom';

window.addEventListener('load', function () {
  var dom = d(
    d.h1(settings.get('name').then(greet)),
    d.div(
      'This app has been run ',
      d.b(
        {id: 'foo', style: 'color:red'},
        counter.get('timesRun')
      ),
      ' times.'
    )
  );
  document.getElementById('out').appendChild(dom.toDom());
});

function greet(name) {
  return 'Namaste, ' + name + '!';
}

var counter = new KeyValueStore('counter');
var settings = new KeyValueStore('settings');

settings.get('name').then(function(name) {
  if (!name) {
    name = prompt('it seems we haven\'t met! What\'s your name?');
    settings.set('name', name);
  }
});

counter.get('timesRun').then(function (num) {
  if (!Number(num)) {
    num = 1;
  }
  num = num + 1;
  counter.set('timesRun', num);
}).catch(barf);


function barf() {
  console.log('um', Array.prototype.slice.apply(arguments));
}

