//issue a token, with an expiration date
 
var jwt = require('jsonwebtoken')
 
 
 
//issue token that expires after 10 mins AND has an issuer 
  var token = jwt.sign('helloworld','secret',{ expiresInMinutes : 10, issuer : 'hipster.io'});
 
//verify token, but don't check assertions. 
  jwt.verify(token,'secret',function(err,payload){
    
    console.log(err) //-> undefined
    console.log(payload) //-> 'helloworld'
  
  })
  
  //verify token is unexpired AND issued by hipster.io
  jwt.verify(token,'secret',{ issuer : 'hipster.io'},function(err,payload){
    
    console.log(err) //-> 'undefined'
    console.log(payload) //-> 'helloworld';
    
  })
  
  //bad issuer fails...
  jwt.verify(token,'secret',{ issuer : 'omfgdogs.io'},function(err,payload){
    
    console.log(err) //-> 'bad issuer'
    console.log(payload) //-> 'undefined';
    
  })