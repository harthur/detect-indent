var jwt = require('jwt-simple');
var getpem = require('rsa-pem-from-mod-exp');

// Decode JWT token, verify with the relevant key from the supplied
// array
function decodeIdToken(idtoken, keys, code) {
  var header = JSON.parse(new Buffer(idtoken.split('.')[0], 'base64').toString('utf8'));

  for (var i = 0; i < keys.length; i++) {
    if (keys[i].kid === header.kid) {
        return jwt.decode(idtoken, getpem(keys[i].n, keys[i].e));;       
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  return null;
}