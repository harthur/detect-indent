
module.exports = function(lines) {
  lines = lines.slice(0, 500);

  var last = 0;
  var tabs = 0;
  var total = 0;
  var spaces = {};  // # spaces indent -> # lines with that indent

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
    if (width <= 1) {
      last = 0;
      return;
    }
    if (width == text.length) {
      return;
    }
    total++;

    var indent = Math.abs(width - last);
    if (indent) {
      spaces[indent] = (spaces[indent] || 0) + 1;
    }
    last = width;
  });

  if (total == 0) {
    return null;
  }

  // mark as tabs if they start more than half the lines
  if (tabs >= total / 2) {
    console.log("tabs");
    return "tabs";
  }

  console.log("spaces", spaces);

  var freqIndent = null, max = 0;
  for (var width in spaces) {
    var tally = spaces[width];
    if (tally > max) {
      max = tally;
      freqIndent = width;
    }
  }
  console.log("max", max, "freqIndent", freqIndent);

  return freqIndent;
}