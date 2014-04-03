function checkOnline() {
  // `navigator.onLine` is always accurate in Chrome,
  // but of course it's *never* accurate in Firefox
  // (bug 654579, bug 756364). Yeah, I know - sad times.
  return new Promise(function (resolve, reject) {
    var i = new Image();
    i.src = '/dummy.gif';
    i.onload = function () {
      resolve();
    };
    i.onerror = function () {
      reject();
    };
  });
}
 
checkOnline().then(function () {
  console.log('online');
}, function () {
  console.log('offline');
});