
module.exports = function(lines) {
  var spaces = {};  // # spaces -> # lines with that many spaces
  var tabs = 0;
  var total = 0;

  lines = lines.slice(0, 500);

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

  if (total == 0) {
    return null;
  }

  // mark as tabs if they start more than half the lines
  if (tabs >= total / 2) {
    return "tabs";
  }

  // get the most common widths to remove outliers
  var widths = [];
  for (var width in spaces) {
    var count = spaces[width];
    if ((total < 4)
        || (total < 10 && count > 1)
        || (total < 40 && count > 2)
        || (total >= 40 && count > (total / 20))) {
      widths.push(parseInt(width, 10));
    }
  }
  if (!widths.length) {
    return null;
  }

  // now get the largest width that divides all of them
  var indent = widths.reduce(gcd);

  return indent;
}

/* Greatest common denominator of two numbers */
function gcd(n, m) {
  return m > 0 ? gcd(m, n % m) : n;
}