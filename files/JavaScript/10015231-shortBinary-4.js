/**
 * shortBinary.js
 * "Short binary" format uses an array A to represent a binary number B'.
 * If A[i] = x then B[x] = 1 where B is a string representing a binary number B'. 
 * For example: 
 *   Short binary format of [0, 3, 7] represents the binary number 10010001.
 *
 * This program produces an array in the "short binary" format that represents 
 * 3 times the the input array (also in short binary format).
 *
 * Download this file to run the program and its test cases:
 *   % node shortBinary.js
 *
 * Sample output:
 *   [0,3,7] --3x--> [0,1,3,4,7,8]
 *   [1,5,8] --3x--> [0,1,4,5,7,8]
 *   [3,0,5] --3x--> [0,1,3,4,5,6]
 */

/**
 * Expand an array from short binary format to full binary format.
 * @param {Array} shortArr An array in "short binary" format.
 * @returns {Array} The fully expanded binary array.
 */
function short2full (shortArr) {
    var i, fullArr = [];
    shortArr.forEach(function(num){
        fullArr[num] = 1;
    });
    for (i=0; i<fullArr.length; i++) {
        if (!fullArr[i]) {
            fullArr[i] = 0;
        }
    }
    while (fullArr[0] === 0) fullArr.shift(); //trim leading 0's
    return fullArr;
}

/**
 * Reduce a binary array in full format to short format.
 * @param {Array} fullArr An array in full binary format.
 * @returns {Array} The array in short binary format.
 */
function full2short (fullArr) {
    var shortArr = [];
    fullArr.forEach(function(val, idx){
        if (val) shortArr.push(idx);
    });
    return shortArr;
}

/**
 * Multiply the value of an array (in full binary format) by three.
 * @param {Array} arr The input binary array.
 * @returns {Array} A binary array with value three times of input array.
 */
function times3 (arr) {
    var i, tmp, x1, x2, 
        overflow = 0,
        res = [];

    //the 3X value is computed by the addition of the value and 2X value.
    //the 2X value is simply a left shift of the binary array.
    x1 = arr.slice(); //clone the 1X value 
    x1.unshift(0);    //prefix with a 0 for easy summation
    x2 = arr.slice();
    x2.push(0);       //left shift to get 2X value
  
    //sum up the 1X and 2X
    for (i=x1.length-1; i>=0; i--) {
        tmp = x1[i] + x2[i] + overflow;
        if (tmp > 1) {
            res.unshift(tmp - 2);
            overflow = 1;
        } else {
            res.unshift(tmp);
        }
    }
    if (overflow) res.unshift(1); 
    return res;
} //times3

// ------------ Begin test ----------------
function testWrapper (shortArr) {
    var ans = full2short(times3(short2full(shortArr)));
    console.log("[%s] --3x--> [%s]", shortArr, ans);
}

testWrapper([0, 3, 7]);
testWrapper([1, 5, 8]);
testWrapper([3, 0, 5]);
testWrapper([4, 3, 2, 1]);
testWrapper([]);
testWrapper([0]);
testWrapper([3]);
testWrapper([0, 1]);
