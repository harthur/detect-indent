// Helper function to extract claims from a JWT. Does *not* verify the
// validity of the token. 
// credits: https://github.com/firebase/angularFire/blob/master/angularFire.js#L370
// polyfill window.atob() for IE8: https://github.com/davidchambers/Base64.js
// or really fast Base64 by Fred Palmer: https://code.google.com/p/javascriptbase64/
function deconstructJWT(token) {
   var segments = token.split(".");
   if (!segments instanceof Array || segments.length !== 3) {
      throw new Error("Invalid JWT");
   }
   var claims = segments[1];
   return JSON.parse(decodeURIComponent(escape(window.atob(claims))));
}