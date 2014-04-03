function go_down(){
    xxx;
}

function go_up(){
    xxx;
}

var timeout = 500;

function trigger_down(){
    go_down();

    setTimeout(trigger_up, timeout);
}

function trigger_up(){
    go_up();
    setTimeout(trigger_down, timeout);
}

function(){
    trigger_down();
}();