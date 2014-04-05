Promise.all([System.import('jquery'), System.import('underscore')].then(function(imports) {
  var $ = imports[0];
  var _ = imports[1];
  
  function start() {}
  System.define('app', { start: start });
})