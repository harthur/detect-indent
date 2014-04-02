var WebCommon = (function (func) {
  return func(WebCommon || {}, $);
}).call(this, function (wc, $, undefined) {
  var

  // 获取指定param的查询字符串值
  query = function (param) {
    var match = RegExp('[?&]' + param + '=([^&]*)').exec(location.href.split('#')[0]);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  },

  // 简单模板方法
  vsub = function (tmpl, vector) {
    return ('' + tmpl).replace(/\$\{([^\{\}]+)\}/g, function (_, p) {
      return (vector || {})[p] || '';
    });
  },

  // 结构化执行匿名函数
  exec = function () {
    var args = [];
    args = args.concat.apply(args, args.slice.call(arguments));
    return args.pop().apply(null, args);
  },

  // 加载指定url的脚本文件
  getScript = function (url) {
    var dfd    = $.Deferred(),
        cache  = +new Date / 600000 >>> 0,
        script = document.createElement('script');

    url += (url.indexOf('?') > 0 ? '&' : '?') + 'cache=' + cache;
    script.async = true;
    script.src = url;

    $('head').eq(0).append(script);

    var $script = $(script).on('load', dfd.resolve)
                           .on('error', dfd.reject);

    return dfd.always(function () {
      $script.remove();
      $script = null;
    }).promise();
  },

  // uncommit next line if worked with jquery(>=1.8)
  // getScript = $.getScript,

  memorizeProm = function (func) {
    var promCache = {};

    return function (arg) {
      if (!promCache.hasOwnProperty(arg)) {
        promCache[arg] = $.when(func(arg)).promise();
      }

      return promCache[arg];
    };
  },

  // memoized `getScript`
  memoget = memorizeProm(getScript),

  result = function(func, args) {
    return function() {
      return func.apply(null, args);
    };
  },

  // realize promises one by one
  sync = function (tasks) {
    var
      i, l, task, func,
      prom = $.Deferred().resolve().promise();

    for (i = 0, l = tasks.length; i < l; i += 1) {
      task = tasks[i];
      func = task.shift();
      prom = prom.then(result(func, task));
    }

    return prom;
  },

  // sequence load scripts
  succ = function (/*scripts*/) {
    var scripts = [], scriptProms = [];

    scripts = scripts.concat.apply(scripts, scripts.slice.call(arguments));

    $.each(scripts, function (index, script) {
      scriptProms[index] = [memoget, script];
    });

    return sync(scriptProms);
  };

  return $.extend(wc, {
    query: query,
    vsub : vsub,
    exec : exec,
    succ : succ,
    when : $.when
  });
});
