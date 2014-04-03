document.onkeydown = function(e) {
    // 兼容FF和IE和Opera
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    var activeElementId = document.activeElement.id;//当前处于焦点的元素的id
    if (code == 13 && activeElementId == "search_text") {
        search();//要触发的方法
        return false;
    }
    return true;
}