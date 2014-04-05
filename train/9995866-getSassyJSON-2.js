function getSassyJSON() {
  var style = null;
  var json  = null;

  // Get the json string from CSS
  if ( window.getComputedStyle && window.getComputedStyle(document.body, '::before') ) {
    style = window.getComputedStyle(document.body, '::before');
    style = style.content;
  }

  // Get rid of quotes
  if (typeof style === 'string' || style instanceof String) {
    style = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
  }

  if ( JSON.parse(style) ) {
    return JSON.parse(style);
  }

  return false;
}