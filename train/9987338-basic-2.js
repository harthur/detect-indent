var jwt = require('jsonwebtoken')

//simplest use case.

//issue token.
  var token = jwt.sign('helloworld','secret')

//verify token
  jwt.verify(token,'secret',function(err,payload){
    
    console.log(err) //-> undefined
    console.log(payload) //-> 'helloworld'
  
  })
  
  //bad secret
  jwt.verify(token,'wrongsecret',function(err,payload){
    
    console.log(err) //-> 'wrong secret' (or something...)
    console.log(payload) //-> undefined;
    
  })