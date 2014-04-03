function array_to_real_text (arr) {
    txt = arr.join(", " );
    return txt = str_replace_last(', ', ' and ', txt);
}

function str_replace_last(needle, replacement, str) {
    var needle_index = str.lastIndexOf(needle);
    if (needle_index < 0) {
        return str;
    } else {
        return str.substr(0, needle_index) + replacement + str.substr(needle_index + needle.length);
    }
}
