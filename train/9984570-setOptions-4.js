
function setOption(selectId, value){
    var selectElement = document.getElementById(selectId);
    var options = selectElement.options;

    var flag = false;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == value) {
            options[i].selected = true;
            flag = true;
        }
    }
    return flag;
}

// usage:
setOption('select_element_id', 'house');

// or 
var selections = data['elements_in_array'];
for (var i=0; i <= selections.length; i++ ) 
{
    setOption('select_element_id', selections[i]);
}  
 