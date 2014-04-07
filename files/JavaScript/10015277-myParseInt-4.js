/**
 *  myParseInt.js
 *  My implementation of the parseInt function. 
 *  The function takes a string and returns an integer. i.e. int myParseInt(string str)
 *
 *  Download this file to run the program and test cases:
 *    % ndoe myParseInt.js
 *
 *  Sample output:
 *    Correct: "999.4" --> 999
 *    Correct: " -56   " --> -56
 *    Correct: "   " --> NaN
 *    Correct: "-0" --> 0
 */

/**
 * Parse and return the integer value of the string
 * @param {String} str - The string to be parsed
 * @returns {int) - Returns the integer value or, NaN if string cannot be converted to integer.
 */
function myParseInt (str) {
    //Helper function to conver the number string to int. Equivalent to Javascript's Number() function
    function toNumber (str) {
        var sign, result, base = 1, strArr = str.split("");
        if (strArr[0] && strArr[0].match(/(\-|\+)/)) sign = strArr.shift();
        result = strArr.reduceRight(function(lastVal, val, idx, arr){
            var ret = (val * base) + lastVal;
            base *= 10;
            return ret;
        }, 0);
        return sign === "-" ? -result : result;
    }
  
    //use regular expression to extract the number portion of str
    var matchArr = /^\s*((\-|\+)?[0-9]+)\s*/.exec(str);
    if (!matchArr) {
        return NaN; //not a number
    }
    return toNumber(matchArr[1]);
}

// --------------- Begin test ---------------
var testData = ["999.4",
                " -56   ",
                "",
                "   ",
                "0",
                "-0",
                "   0.00 ",
                " -9.9 ",
                "abc 95",
                "- 95.1",
                "-95.1x",
                " -45.23"];

// Compare the output of myParseInt() against Javascript's parseInt()
testData.forEach(function(str){
    var myAnswer = myParseInt(str),
        refAnswer = parseInt(str, 10);

    if (myAnswer === refAnswer) {
        console.log('Correct: "%s" --> %s', str, myAnswer);
    } else if (isNaN(myAnswer) && isNaN(refAnswer)) {
        console.log('Correct: "%s" --> %s', str, myAnswer);
    } else {
        console.log('Wrong: "%s" --> %s. Should be %s', str, myAnswer, refAnswer);
    }
});
