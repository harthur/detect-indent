

$( document ).ready(function() {
var tmpNow = Number(moment().valueOf());
var tmpNow2 =   new Date(tmpNow).toString();
var tmpDate = Number(moment(new Date(2014,03,3,45,15,0)).valueOf());
var tmpTime = tmpDate - tmpNow;
  var tmpms = moment.duration(tmpTime).milliseconds();
  var tmpsec = moment.duration(tmpTime).seconds();
  var tmpmin = moment.duration(tmpTime).minutes();
  var tmphours = moment.duration(tmpTime).hours();
  var mom = moment(
  {
    h:tmphours,
    m:tmpmin,
    s:tmpsec,
    ms:tmpms
    
  }
  );
// console.log(tmpNow);
//   console.log(tmpNow2);
  console.log(mom.format("HH:mm:ss"));
});


