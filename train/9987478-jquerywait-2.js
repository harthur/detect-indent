/*
 * jquery.wait.js
 * - 遅延を挟むユーティリティメソッド
 * - jQuery 1.5 以上が必要
 */
;(function(window, $, undefined) {

  $(function() {
    // $.waitメソッドに遅延時間（ミリ秒）を設定する
    $.wait(3000).done(function() {
      // ここに遅らせて実行したい処理を記述
      window.alert('遅延を挟みました');
    });
  });

  $.extend({
    wait: function(delay) {
      var deferred = $.Deferred();
      var _delay = +delay;
      window.setTimeout(function() {
        deferred.resolve();
      }, $.isNumeric(_delay) ? _delay : 0);
      return deferred.promise();
    }
  });

})(this, jQuery);