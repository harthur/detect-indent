/* ========================================================================
 * ratchetSliderSetPage
 * ========================================================================
 * Compatible with gh:twbs/ratchet      v2.0.2
 * https://github.com/twbs/ratchet/blob/v2.0.2/js/sliders.js
 * http://goratchet.com/components/#sliders

 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

//// Usage
// var sliderEl = document.querySelector('#mySlider .slide-group');
// ratchetSliderSetPage(sliderEl, 1);

(function(){
var ratchetSliderSetPage = function (sliderEl, page) {
  var sliderWidth = sliderEl.offsetWidth;
  var offsetX = -1 * page * sliderWidth;
  sliderEl.style['-webkit-transition-duration'] = '.2s';
  sliderEl.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
};
})();



// jQuery / Zepto plugin
//// Usage
// $('#mySlider .slide-group').ratchetSliderSetPage(1);

(function(){
  var $ = window.jQuery || window.Zepto || window.$;
  if ($ && $.fn) {
    $.fn.ratchetSliderSetPage = function (page) {
      ratchetSliderSetPage(this[0], page);
      return this;
    };
  }
})();