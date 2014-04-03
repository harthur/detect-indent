function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Raio da terra
  var dLat = deg2rad(lat2-lat1); 
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distancia em kilometros
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

var la1 = -5.7999189;
var lo1 = -35.2223682;
var la2 = 34.0204989;
var lo2 = -118.4117325;
//Natal - Los Angeles
console.log(getDistanceFromLatLonInKm(la1,lo1,la2,lo2))
//Google: 9742 
//Algoritmo: 9744

//o problema maior é que ele calcula sempre em linha reta, não conta com as curvas das ruas