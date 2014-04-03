var req = $.ajax({
        url: 'http://api.wunderground.com/api/419ec08f527a6f9b/hourly/q/pws:KCASANFR58.json',
        dataType: 'jsonp',
        type: "GET"
}).done(function(r1) {
  // stage variable
  var $locationContainer = $('<div />', {id: 'locations'});
  // location name
  $('#content').append("<h2>SOMA - Near Van Ness</h2>");
  var times = r1.hourly_forecast;
  for (var i=0; i < times.length; i++) {
    var temp = times[i].temp.english;
    var time = times[i].FCTTIME.civil;
    var humidity = times[i].humidity;
    // combine values
    var tth = '<h4>time ' + time + ' | temp ' + temp + ' | humidity ' + humidity + '</h4>';
    $locationContainer.append(tth);
  }
    
  $('#content').append($locationContainer);
});



var req = $.ajax({
        url: 'http://api.wunderground.com/api/419ec08f527a6f9b/hourly/q/pws:KCASANFR259.json',
        dataType: 'jsonp',
        type: "GET"
}).done(function(r2) {
  // stage variable
  var $locationContainer = $('<div />', {id: 'locations'});
  // location name
  $('#content').append("<h2>The Mission, 19th and Folsom</h2>");
  var times = r2.hourly_forecast;
  for (var i=0; i < times.length; i++) {
    var temp = times[i].temp.english;
    var time = times[i].FCTTIME.civil;
    var humidity = times[i].humidity;
    // combine values
    var tth = '<h4>time ' + time + ' | temp ' + temp + ' | humidity ' + humidity + '</h4>';
    $locationContainer.append(tth);
  }
    
  $('#content').append($locationContainer);
});



var req = $.ajax({
        url: 'http://api.wunderground.com/api/419ec08f527a6f9b/hourly/q/pws:KCASANFR53.json',
        dataType: 'jsonp',
        type: "GET"
}).done(function(r3) {
  // stage variable
  var $locationContainer = $('<div />', {id: 'locations'});
  // location name
  $('#content').append("<h2>Mission Bay - My weather is better than yours.</h2>");
  var times = r3.hourly_forecast;
  for (var i=0; i < times.length; i++) {
    var temp = times[i].temp.english;
    var time = times[i].FCTTIME.civil;
    var humidity = times[i].humidity;
    // combine values
    var tth = '<h4>time ' + time + ' | temp ' + temp + ' | humidity ' + humidity + '</h4>';
    $locationContainer.append(tth);
  }
    
  $('#content').append($locationContainer);
});




var req = $.ajax({
        url: 'http://api.wunderground.com/api/419ec08f527a6f9b/hourly/q/pws:KPCASANF2.json',
        dataType: 'jsonp',
        type: "GET"
}).done(function(r4) {
  // stage variable
  var $locationContainer = $('<div />', {id: 'locations'});
  // location name
  $('#content').append("<h2>Castro/San Francisco</h2>");
  var times = r4.hourly_forecast;
  for (var i=0; i < times.length; i++) {
    var temp = times[i].temp.english;
    var time = times[i].FCTTIME.civil;
    var humidity = times[i].humidity;
    // combine values
    var tth = '<h4>time ' + time + ' | temp ' + temp + ' | humidity ' + humidity + '</h4>';
    $locationContainer.append(tth);
  }
    
  $('#content').append($locationContainer);
});







