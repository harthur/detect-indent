/**
 * If you need the string representation, there is a handy
 * 'unicode' property you can query on the returned object.
 * 
 * @param {string} from   is a HEX code you want to start from.
 * @param {string} to   is a HEX code you want to end with.
 * @return {array} the unicode range from - to.
 **/
function unicodeSequence(from, to) {
    'use strict';
    var code,
        index = parseInt(String(from), 16),
        end = parseInt(String(to), 16),
        result = [],
        unicode = '';
    if (isNaN(index) || isNaN(end)) {
      throw new TypeError('Invalid input');
    }
    for (; index <= end; index++) {
      code = index.toString(16).toUpperCase();
      //makes unicode code  like '00AB'
      while (code.length < 4) {
        code = '0' + code;
      }
      //concatenate so we get a unicode string
      result.push('\\u' + code);
      unicode += String.fromCharCode(index);
    }
    Object.defineProperty(result, 'unicode', {
      get: function() {
        return unicode;
      }
    });
    return result;
}

//Example
var r = unicodeSequence('40', '7E');
console.log(String(r.join(', ')));
console.log(r.unicode);
