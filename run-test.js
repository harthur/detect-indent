var fs = require("fs"),
    path = require("path");

var gcd = require("./algos/gcd");

var dir = "files";
var langs = ["HTML", "CSS", "JavaScript"];


printStats();

function printStats() {
  var stats = getStats();
  for (var lang in stats) {
    console.log(lang);
    var count = stats[lang];
    for (var width in count) {
      console.log(" " + width + ": " + count[width]);
    }
  }
}

function getStats() {
  var counts = {};
  for (var i in langs) {
    var lang = langs[i];
    counts[lang] = {};

    var files = fs.readdirSync(path.join(dir, lang));
    for (var j in files) {
      var indent = getIndent(files[j]);
      counts[lang][indent] = (counts[lang][indent] || 0) + 1;
    }
  }
  return counts;
}

function getIndent(filename) {
  if (/-tabs\./.test(filename)) {
    return "tabs";
  }

  var matches = filename.match(/-(\d)\./);
  if (!matches) {
    return 0;
  }
  var spaces = parseInt(matches[1] || "0");
  return spaces;
}