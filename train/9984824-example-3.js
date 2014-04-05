var fb = new Firebase('https://INSTANCE.firebaseio.com');
var monit = new FirebaseMonitor(fb);

// no need to wait for auth to complete
var off = monit.on(fb, 'value', function(snap) {
   console.log(snap.val());
});

auth();

function auth() {
   fb.auth(TOKEN); // will start logging values when this authenticates successfully   
}

setTimeout(function() {
    fb.unauth(); // will pause updates
    setTimeout(auth, 2000); // will restart updates
    setTimeout(off, 10000); // cancels updates forever
}, 2000)