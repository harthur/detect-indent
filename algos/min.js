
module.exports = function(lines) {
  lines = lines.slice(0, 500);

  var spaces = {};  // # spaces -> # lines with that many spaces
  var tabs = 0;     // # lines that start with a tab
  var total = 0;    // # of indented lines (non-zero indent)

  // count up number of lines using each type of indentation
  lines.forEach(function (text) {
    if (text[0] === ("\t")) {
      tabs++;
      total++;
    }
    else {
      var i = 0;
      while (text[i] === " ") {
        i++;
      }
      // don't count un-indented lines or all-spaces lines in our total.
      // we also have to discriminate against odd-number indenters, comment
      // blocks can be one space offset, and we can't let those throw us
      if (i == 0 || i == text.length || i % 2 == 1) {
        return;
      }
      total++;

      spaces[i] = (spaces[i] || 0) + 1;
    }
  });

  // this file is not indented at all
  if (total == 0) {
    return null;
  }

  // mark as tabs if they start more than half the lines
  if (tabs >= total / 2) {
    return "tabs";
  }

  // remove outliers and get the minimum width
  var minWidth = Infinity;
  for (var width in spaces) {
    var count = spaces[width];
    if (notOutlier(total, count) && width < minWidth) {
      minWidth = width;
    }
  }
  if (minWidth == Infinity) {
    return null;
  }
  return minWidth;
}

function notOutlier(total, count) {
  return (total < 4)
      || (total < 10 && count > 1)
      || (total < 40 && count > 2)
      || (total >= 40 && count > (total / 20));
}
