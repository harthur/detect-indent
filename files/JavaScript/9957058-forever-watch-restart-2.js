var fs = require('fs'),
  exec = require('child_process').exec,
  child,
  restarting = false

function watch() {
  restarting = false
  fs.watch('./server.js', function(e, file) {
    console.log(e + ' : ' + file)
    restart()
  })
}

function restart() {
  if(restarting === false) {
    restarting = true
    child = exec('forever restart server.js', function(err, stdout, stderr) {
      setTimeout(function() {
        watch()
      },1000)
    })
  }
}

watch()