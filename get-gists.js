var https = require("https"),
    fs = require("fs");
    path = require("path");

var dir = "files";
var langs = ['JavaScript', 'CSS', 'HTML'];


getRecentGists(function(gists) {
  for (var i in gists) {
    var gist = gists[i];
    var hasLang = false;
    for (var name in gist.files) {
      var lang = gist.files[name].language;
      if (langs.indexOf(lang) == -1) {
        hasLang = true;
        break;
      }
    }
    if (hasLang) {
      getGist(gist.id, saveGistFiles);
    }
  }
});

function saveGistFiles(gist) {
  for (var name in gist.files) {
    var file = gist.files[name];
    if (langs.indexOf(file.language) == -1 || name == "0_reuse_code.js") {
      continue;
    }
    var filename = path.join(dir, file.language, gist.id + "-" + file.filename);
    console.log("saving ", filename);
    saveFile(filename, file.content);
  }
}

/* Helpers */

function saveFile(file, content) {
  fs.writeFileSync(file, content);
}

function getRecentGists(callback) {
  var options = {
    host: 'api.github.com',
    path: '/gists/public',
    headers: {
      'User-Agent': 'harthur'
    }
  };

  getJSON(options, callback);
}

function getGist(id, callback) {
  var options = {
    host: 'api.github.com',
    path: '/gists/' + id,
    headers: {
      'User-Agent': 'harthur'
    }
  };

  getJSON(options, callback);
}

function getJSON(options, callback) {
  https.get(options, function(res) {
    res.setEncoding('utf8');

    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    })
    res.on('end', function() {
      callback(JSON.parse(data));
    })
  });
}
