// wait後に関数実行（引数不要）
wait(3000).done(showMessage);

// wait後に関数実行（引数付き）
wait(3000).done(function() { showMessage('fuga') });

// 直列につないで3+4+5秒後に関数実行
wait(3000)
    .then(function() { return wait(4000); })
    .then(function() { return wait(5000); })
    .then(showMessage);

// 並列に並べて同時実行し全て終了後に関数実行
$.when(wait(3000), wait(10000), wait(5000))
    .then(showMessage);

// 直列と並列を混合
wait(100)
    .then(function() { return wait(4000); })
    .then(function() { return $.when(wait(1000), wait(2000), wait(3000)); })
    .then(function() { return wait(5000); })
    .then(showMessage);

// 途中でrejectがあればそこで失敗
wait(100)
    .then(function() { return wait(1000); })
    .then(alwaysError)
    .then(function() { return wait(3000); })
    .then(function() { showMessage('all success!') })
    .fail(function() { showMessage('fail!') })


function wait(ms) {
    var dfd = $.Deferred();
    setTimeout(function() {
        $('body').append(ms + '<br>');
        dfd.resolve();
    }, ms);
    return dfd.promise();
}

function showMessage(message) {
    if (!message) {
        alert('hoge');
    } else {
        alert(message);
    }
}

function alwaysError() {
    var dfd = $.Deferred();
    setTimeout(function() {
        $('body').append('fail' + '<br>');
        dfd.reject();
    }, 1000);
    return dfd.promise();
}

});