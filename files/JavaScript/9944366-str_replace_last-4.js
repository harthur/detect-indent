/**
 * Replace the last occurence of a string, useful if you want to replace the last comma with " and"...
 * 
 * @param str needle The string to search
 * @param str replacement The replacement string
 * @param str str The subject
 * @return str The new string
 */
function str_replace_last(needle, replacement, str) {
    var needle_index = str.lastIndexOf(needle);
    if (needle_index < 0) {
        return str;
    } else {
        return str.substr(0, needle_index) + replacement + str.substr(needle_index + needle.length);
    }
}
