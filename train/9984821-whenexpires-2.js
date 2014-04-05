// Moment: http://momentjs.com/

function tokHasTimeLeft(tok) {
  if( !tok ) {return false;}
  try {
     var parts = deconstructJWT(tok);
     // default is 24 hrs
     var exp = parts.exp? moment.unix(parts.exp) : moment.unix(parts.iat).add('hours', 24);
     // returns true if token has at least 12 hours left
     return exp.diff(moment(), 'hours') > 12;
  }
  catch(e) {
     console.warn(e);
     return false;
  }
}