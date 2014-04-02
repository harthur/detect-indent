var https = require("https"),
    fs = require("fs");
    path = require("path");

var dir = "files";
var langs = ['JavaScript', 'CSS', 'HTML'];

getPublic(function(gists) {
  for (var i in gists) {
    var gist = gists[i];
    for (var name in gist.files) {
      var lang = gist.files[name].language;
      if (langs.indexOf(lang) == -1) {
        continue;
      }
      (function(name) { // omg
        getGist(gist.id, function(details) {
          saveGist(details, name)
        });
      })(name);
    }
  }
});

function saveGist(gist, file) {
  var file = gist.files[file];
  if (!file) {
    console.error("couldn't find", file);
    return;
  }
  var filename = path.join(dir, file.language, gist.id + "-" + file.filename);

  console.log("saving ", filename);
  saveFile(filename, file.content);
}

/* Helpers */

function saveFile(file, content) {
  fs.writeFileSync(file, content);
}

// per_page=100

function getPublic(callback) {
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

    data = "";
    res.on('data', function(chunk) {
      data += chunk;
    })
    res.on('end', function() {
      callback(JSON.parse(data));
    })
  });
}
