// Slick little method to create a bitmask from an array of boolean values. (for Javascript)
function bitMask(a, b) {
    var m = 0, i;
    
    if (b !== undefined) { a = Array.prototype.slice.apply(arguments); }
    
    for (i = 0; i < a.length; i += 1) {
	if (a[i] !== false) { m += Math.pow(2, i) };
    }
    return m;
}