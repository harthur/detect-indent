
module.exports = function(lines) {
  lines = lines.slice(0, 500);

  var spaces = {};  // # spaces indent -> # lines with that indent
  var last = 0;     // indentation width of the last line we saw
  var tabs = 0;     // # of lines that start with a tab
  var total = 0;    // # of indented lines (non-zero indent)

  lines.forEach(function (text) {
    if (text[0] === ("\t")) {
      tabs++;
      total++;
      return;
    }
    var width = 0;
    while (text[width] === " ") {
      width++;
    }
    // don't count lines that are all spaces
    if (width == text.length) {
      return;
    }
    if (width > 0) {
      total++;
    }

    var indent = Math.abs(width - last);
    if (indent > 1) {
      spaces[indent] = (spaces[indent] || 0) + 1;
    }
    last = width;
  });

  // this file is not indented at all
  if (total == 0) {
    return null;
  }

  // mark as tabs if they start more than half the lines
  if (tabs >= total / 2) {
    return "tabs";
  }

  // find most frequent none-zero width difference between adjacent lines
  var freqIndent = null, max = 0;
  for (var width in spaces) {
    width = parseInt(width, 10);
    var tally = spaces[width];
    if (tally > max) {
      max = tally;
      freqIndent = width;
    }
  }

  return freqIndent;
}