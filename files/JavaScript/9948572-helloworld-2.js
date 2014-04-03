var serialport = require('node-serialport')

var sp = new serialport.SerialPort("/dev/ttyO3", { 
  parser: serialport.parsers.raw,
  baud: 9600
})

sp.on('data', function(chunk) {
  console.log(chunk.toString('hex'), chunk.toString(), chunk)
})
