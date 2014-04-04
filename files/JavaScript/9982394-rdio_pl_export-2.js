javascript:(function() {
  var bookmarklet = {
    init: function() {
      this.parse();
    },
    parse: function() {
      page = "";
      $(".PlaylistPage:visible")
        .find(".Track")
        .children(".info")
        .each(function() {
          line = [];
          function buildLine() {
            line.push($(this).text());
          }

          $(this).children(".metadata").children("a:first").each(buildLine);
          $(this).children(".name").children("a").each(buildLine);
          page += line.join(" - ") + "\r\n";
      });
      window.open("data:text/plain;charset=utf-8," + encodeURIComponent(page), "");
    }
  };

  if (!window.jQuery) {
    load();
  } else {
    bookmarklet.init();
  }

  function load() {
    var script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
    script.async = true;
    script.type = "text/javascript";
    script.onload = function() { bookmarklet.init(); };
    document.body.appendChild(script);
  }
})();
