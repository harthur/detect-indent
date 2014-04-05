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
    var dfd = q.defer();

    if ( !lines.length ) {
      /**
      * No results have been found, proceed with commit.
      */
      dfd.resolve(':)');
    }

    /**
    * Build promise chain and return promise.
    */
    console.log(lines.join('\n'));
    lines.forEach(function(line) {
      /**
      * TODO: abstract out `promptLine`.
      */
      dfd = dfd.then(function promptLine(line) {
        return function() {

          var linePromise = q.defer();
          var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl.question(line + ' -- is this cool? (n)o , (y)es >', function(answer) {
            if ( answer.toLower() === 'n' ) {
              /**
              * This should stop the promise chain and trigger the `fail`.
              */
              linePromise.reject('line has been rejected');
            } else {
              /**
              * This should continue the promise chain;
              */
              linePromise.resolve('line has been accepted');
            }
            rl.close();
          });

          return linePromise.promise;
        };
      });
    });

    return dfd.promise;

  })
  .fail(function(err) {
    console.log('--- might not want these in yr commit ---\n');
    exit(1);
  })
  .finally(exit);

