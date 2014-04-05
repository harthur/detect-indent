var openpgp = require('openpgp')
var xhr = require('xhr')

xhr('https://keybase.io/maxogden/key.asc', function(err, resp, key) {
	sign(key)
})

function sign(key) {
  var publicKey = openpgp.key.readArmored(key)
  var pgpMessage = openpgp.encryptMessage(publicKey.keys, 'Hello, World!')
  console.log([key, publicKey, pgpMessage])
}
