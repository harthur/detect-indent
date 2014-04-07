(function($){
  /*
   * A lightweight window resize listener
   */
  var waitForFinalEvent = function(){var b={};return function(c,d,a){a||(a="I'm a banana!");b[a]&&clearTimeout(b[a]);b[a]=setTimeout(c,d)}}();
  /*
   * @returns
   * true  - if page is currently using the breakpoint specified as argument
   * false - if otherwise
   */
  function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
  }
  
  /*
   * Main window resize listener
   * Executes each time window has been resized
   */
  $(window).resize(function () {
    waitForFinalEvent(function(){

      if (isBreakpoint('xs')) {
        $('.breakpoint-alias').animate({'width': '150px'}, 300);
      } else {
        $('.breakpoint-alias').animate({'width': '50px'}, 300);
      }

    }, 300, new Date().getTime())
  });
  

})(jQuery);
