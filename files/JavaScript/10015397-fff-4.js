/**
 * fff.js:
 * fff, Fast File Find, efficiently find a huge number of files (of specific file types, 
 * html, xml and json) which contain phone numbers in the format (xxx)-xxx-xxxx or xxx-xxx-xxxx
 *
 * The implementation takes advantage of the asynchronous processing of Node.js. 
 *
 * To run: (expects test files stored under the "data" folder)
 *   % node fff.js
 *
 * Sample output:
 *   data/phone1.html: ajfakj kajka (415)-123-1234 aja
 *   data/phone2.json: here is the phone number:123-897-1234:xx
 *   data/phone4.xml: ajfakj kajka "(415)-123-1234" jkjfa
 */
var fs         = require('fs'),
    readline   = require('readline'),
    phoneRegex = /.*\b\(*\d{3}\)*\-\d{3}\-\d{4}\b.*/,
    dataDir    = __dirname + "/data";

fs.readdir(dataDir, function(err, fileArr) {
    fileArr.filter(function(filename) {
        //allows filenames with the .html, .json or .xml extensions
        return filename.match(/(\.html$)|(\.json$)|(\.xml$)/);
    })
    .forEach(function(filename) { 
        var pathname = dataDir + "/" + filename,
            readStream = fs.createReadStream(pathname);
		readline.createInterface({
		    input     : readStream,
		    terminal  : false
		}).on('line', function(line) {
            //output filename that contains a pattern match
            if (line.match(phoneRegex)) {
		        console.log(pathname + ": " + line);
		    }
        });
    });
});
