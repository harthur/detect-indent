//return serialized list of checked checkboxes
function cb2str() {
    return JSON.stringify($.map($("[id]:checkbox:checked").get(), function(el){return el.id}))
}

//check the boxes from a serialized list of checkboxes
function str2cb(str) {
    $.each(JSON.parse(str), function(i, cbid){
        $("#" + cbid).prop('checked', true)
    });
}

//Example 1: serialize to a popup (alternately you could save to a global or to localstorage)
alert(cb2str());

//Example 2: load serialized data from a popup 
str2cb(prompt("enter serialized string"));
