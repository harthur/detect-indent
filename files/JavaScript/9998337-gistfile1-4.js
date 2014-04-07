/**********************************************************************************************
Exception handling:

try {

    Normally this code runs from the top of the block to the bottom without problems.
    But it can sometimes throw an exception, either directly with a throw statement or indirectly
    by calling a method that throws an exception.
} 
catch (e) {
     The statements in this block are executed if and only if the try block throws an exception. These
     statements can use the local variable e to refer to the Error object or other value that was thrown.
     This block may handle the exception somehow, may ignore the exception by doing nothing or may
     rethrow the exception with throw
}
finally {
      This block contains statements that are always executed, regardless of what happens in the try block. 
      They are executed whether the try block terminates:
         1) normally, after reaching the bottom of the block
         2) because of a break, continue or return statement
         3) with an exception that is handled by a catch clause above
         4) with an uncaught exception that is still propagating
}
/**********************************************************************************************/

function determineYearOfBirth(age) {
    if (isNaN(age) || age < 0) {
        throw new Error("Invalid age specified");
    }
    var now = new Date();
    var currYear = now.getFullYear();
    return currYear - age;
}    


try {
    var age = Number(prompt("Please enter your age", ""));
    var yearOfBirth = determineYearOfBirth(age);
    console.log("You were born in " + yearOfBirth);
} catch (e) {
    console.log(e.toString());
} finally {
    console.log("Thx for your cooperation.");
}