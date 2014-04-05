var Buffer = require('buffer').Buffer;
var execFile = require('child_process').execFile;
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var tempWrite = require('temp-write');
var through = require('through');

const PLUGIN_NAME = 'gulp-closure-library';

module.exports = function(opt) {
  opt = opt || {};
  if (!opt.compilerPath)
    throw new gutil.PluginError(PLUGIN_NAME, 'Missing compilerPath option.');
  if (!opt.fileName)
    throw new gutil.PluginError(PLUGIN_NAME, 'Missing fileName option.');

  var files = [];

  function bufferContents(file) {
    if (file.isNull()) return;
    if (file.isStream()) {
      return this.emit('error',
        new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    files.push(file);
  }

  function endStream() {
    if (!files.length) return this.emit('end');
    var firstFile = files[0];
    var outputFilePath = tempWrite.sync('');
    var args = [
      '-jar',
      // For faster compilation. It's supported everywhere from Java 1.7+.
      '-XX:+TieredCompilation',
      opt.compilerPath,
      // To prevent maximum length of command line string exceeded error.
      '--flagfile=' + getFlagFilePath(files)
    ].concat(flagsToArgs(opt.compilerFlags));

    // Force --js_output_file to prevent [Error: stdout maxBuffer exceeded.]
    args.push('--js_output_file=' + outputFilePath);

    // TODO: Java 1.7+ required.
    var jar = execFile('java', args, function(error, stdout, stderr) {
      if (error || std)
      
      console.log('error');
      console.log(error);
      console.log('stdout');
      console.log(stdout);
      console.log('stderr');
      console.log(stderr);

      var outputFileSrc = fs.readFileSync(outputFilePath, {encoding:'utf8'});
      var outputFile = new gutil.File({
        base: firstFile.base,
        contents: new Buffer(outputFileSrc),
        cwd: firstFile.cwd,
        path: path.join(firstFile.base, opt.fileName)
      });

      this.emit('data', outputFile);
      this.emit('end');
    }.bind(this));
  }

  return through(bufferContents, endStream);
};

function getFlagFilePath(files) {
  var src = files.map(function(file) {
    var relativePath = path.relative(file.cwd, file.path);
    var tempPath = tempWrite.sync(file.contents.toString(), relativePath);
    return '--js=' + tempPath;
  }).join(gutil.linefeed);
  return tempWrite.sync(src);
};

function flagsToArgs(flags) {
  if (!flags) return [];
  var args = [];
  for (var flag in flags) {
    var values = flags[flag];
    if (!Array.isArray(values)) values = [values];
    values.forEach(function(value) {
      args.push('--' + flag + '=' + value);
    });
  }
  return args;
};