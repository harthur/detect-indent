(function($) {
  $.fn.drags = function(opt) {

    opt = $.extend({handle:"",cursor:"move"}, opt);

    if(opt.handle === "") {
      var $el = this;
    } else {
      var $parent = this;
      var $el = this.find(opt.handle);
    }

    return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
      if(opt.handle === "") {
        var $drag = $(this).addClass('draggable');
      } else {
        $(this).addClass('active-handle')
        var $drag = $parent.addClass('draggable');
      }

      var
        drg_h = $drag.outerHeight(),
        drg_w = $drag.outerWidth(),
        pos_y = $drag.offset().top + drg_h - e.pageY,
        pos_x = $drag.offset().left + drg_w - e.pageX;

      follow = function(e) {
        $drag.offset({
          top:e.pageY + pos_y - drg_h,
          left:e.pageX + pos_x - drg_w
        })
      };

      $(window).on("mousemove", follow).on("mouseup", function() {
        $drag.removeClass('draggable');
        $(window).off("mousemove", follow);
      });

      e.preventDefault(); // disable selection

    }).on("mouseup", function() {
        if(opt.handle === "") {
          $(this).removeClass('draggable');
        } else {
          $(this).removeClass('active-handle');
          $parent.removeClass('draggable');
        }
      });

  }
})(jQuery);