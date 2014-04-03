function checkString(str) {
    if (typeof(str) !== 'string') {
        alert("Hey! That's not a string!");
    };
}

function capitalize(str) {
    //checkString(str);
    return str.toUpperCase();
};

function lowercase(str) {
    //checkString(str);
    return str.toLowerCase();
};

function jumble(str) {
    //checkString(str);
    return str.split("").reverse().join("");
    /*var start = 0,
        end = str.length -1,
        reversed = "";
    for (var i = end; i >= start; i--) {
        reversed = reversed + str[i];
    };
    return reversed;*/
};

function lowercaseDash(str) {
    //checkString(str);
    return lowercase(str.split(" ").join("-"));
};

var input = document.getElementById('input'),
    btn = document.getElementById('manipulate');

btn.addEventListener('click', function() {
    input.value = lowercaseDash(input.value);
});