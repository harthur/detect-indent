#!/usr/bin/env node

var q = require('q');
var exec = require('child_process').exec;
var exit = process.exit;
var fs = require('fs');
var readline = require('readline');

var grep = function(pattern) {
  var dfd = q.defer();
  var cmd = "git diff --staged --name-only | xargs egrep '#{pattern}' -n".replace(/#{pattern}/, pattern);

  exec(cmd, function(err, stdout) {
    /**
    * It loos like this command will exit with code 1 if no results are
    * found. Not a reason to reject.
    */
    var lines = [];
    if ( !err ) {
      lines = stdout.split(/\n/).filter(function(l) {
        return l.length;
      });
    }
    dfd.resolve(lines);
  });

  return dfd.promise;
};

var flatten = function(arr) {
  return [].concat.apply([], arr);
};

var only = function() {
  return grep('(it|describe)\.only');
};

var debug = function() {
  return grep('console\.(log|error)|debugger;');
};


q.all([only(), debug()])
  .then(flatten)
  .then(function(lines) {
    /**
    * Let's only handle one line for the time being.
    */
    var dfd = q.defer();
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(lines[0] + ' -- is this cool? (n)o , (y)es >', function(answer) {
      if ( answer.toLower() === 'n' ) {
        dfd.reject('line has been rejected');
      } else {
        dfd.resolve('line has been accepted');
      }
      rl.close();
    });

    return dfd.promise;
  })
  .fail(function(err) {
    console.log(err, '--- might not want these in yr commit ---\n');
    exit(1);
  })
  .finally(exit);

