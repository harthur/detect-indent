/**********************************************************************************************
Statements are Javascript sentencens or commands, separated from each other with semicolons. 
They can be categorized in following 3 categories:
- expression statements (assignments or function invocations that have a side effect)
- declaration statements (declare new variables or functions) 
- constrol structures  (conditionals, loops and jumps)
/**********************************************************************************************/

/**********************************************************************************************
Expression statements
/**********************************************************************************************/
fullname = firstname + " " + lastname;  
size = [1,2].length;
indexOfA = "brand".indexOf("a");


/**********************************************************************************************
Compound and Empty statements:
Whenever a statement is expected, you can also use a compound statement. Simply wrap multiple
statements in {} to create a compound statement (aka a statement block). 
Remark: A compound statement does not need to be ended with a semicolon.

An empty statement is a statement that is ommitted.
/**********************************************************************************************/
var point = {x: 10, y:20}

//using single statement
for (key in point) console.log(key);

//using compound statement
for (key in point) {
    console.log(key);
    console.log(point[key]);
}

//using empty statement for initializing values of array with a value
var array = [];
for (var i=0; i < 4; array[i++] = 0);
console.log(array); //[0,0,0,0]

/**********************************************************************************************
Declaration statements:
The var and function are declaration statements

var name_1 [= value_1];

function funcname([arg_1, ..., arg_n) {
    statements
}
/**********************************************************************************************/
var i,j = 0;
var k;
function greet(who) {
  console.log("Hello " + who);
}

/**********************************************************************************************
Control structures: if
Syntax: if (expression) statement1  [else statement2]
/**********************************************************************************************/
function guessName(name) {
    if (name.match(/J..n/)) {  
        console.log("Is your name John?");
    }  else if (name.match(/N..k/)) {
        console.log("Is your name Nick?") ;       
    } else {
        console.log("I have no clue :(");
    }
}

guessName("Joan");  //Is your name John?
guessName("Nick");  //Is your name Nick?
guessName("Steve"); //I have no clue :(


/**********************************************************************************************
Control structures: switch
Syntax: switch (expression) { case statements }
/**********************************************************************************************/
var daysOfWeek = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
  SUNDAY: "sunday"
};

function dailyProgram(dayOfWeek) {
    switch(dayOfWeek) {
        case "saturday": 
            console.log("playing trumpet");
            break;
        case "sunday": 
            console.log("visiting family");
            break;            
        default: 
            console.log("working as usual");
            break;
    }
}

dailyProgram(daysOfWeek.MONDAY);   //working as usual
dailyProgram(daysOfWeek.SATURDAY); //playing trumpet
dailyProgram(daysOfWeek.SUNDAY);   //visiting family

/**********************************************************************************************
Control structures: while
Syntax: while (expression) statement
/**********************************************************************************************/
function increaseAndLog(number) {
    console.log(number);
    return number +1;
}    

var x = 1;
while(x < 4) x = increaseAndLog(x);

console.log("x=" + x);

/** output
1
2
3
x=4
**/

/**********************************************************************************************
Control structures: do while
Syntax: do statement while (expression);
/**********************************************************************************************/
var head = "Head";
var tail = "Tail";

function flipCoin() {
    var rand = Math.random();
    return rand > 0.3 ? head : tail;
}   

var coin ;
do {
    coin = flipCoin();    
    console.log(coin);    
} while (coin === head);

/**********************************************************************************************
Control structures: for
Syntax: for (initialize; test; increment) statement
/**********************************************************************************************/
for (var i=0; i< 4; i++) {
    console.log(i);   //prints 0,1,2,3
}   

/**********************************************************************************************
Control structures: for/in
Syntax: for (variable in object) statement
/**********************************************************************************************/
var person = {firstname:"John", lastname:"Grisham"};
for (prop in person) {
    console.log(prop + "=" + person[prop]);
}

/** output:
firstname=John
lastname=Grisham 
**/

/**********************************************************************************************
Control structures: Jump using return
/**********************************************************************************************/

var names = ["John", "Kim", "Brandon", "Eva"];

//return true if element exists in array and return early
function exists(array, element) {
    for (var i=0; i < array.length; i++) {
        if (array[i]=== element) return true;
    }
    return false;
}    

console.log(exists(names, "Eva"));   //true 
console.log(exists(names, "Brad"));  //false

/**********************************************************************************************
Control structures: Jump using break. Break causes a loop or switch to exit.
/**********************************************************************************************/
var numbers = [4,2,6,3,5,1];

//we only want to log all numbers smaller than 4
//for demo purpose we will not filtering but sorting in combination with break

numbers.sort();
for (var i=0; i< numbers.length; i++) {
    if (numbers[i] >3) break;
    console.log(numbers[i]);
}    

/**********************************************************************************************
Control structures: Jump using continue. Continue starts the loop at the next iteration.
/**********************************************************************************************/
var numbers = [4,2,6,3,5,1];

//we only want to log all numbers smaller than 4
//for demo purpose we will not filter and process but use continue

for (var i=0; i< numbers.length; i++) {
    if (numbers[i] >3) continue;
    console.log(numbers[i]);
}   

/**********************************************************************************************
Control structures: Jump using throw. Execution jumps to the nearest exception handler
/**********************************************************************************************/
function drinkAlcohol(person) {
   if (person.age < 18) throw new Error("Not allowed to consume alcohol");
   console.log(person.name + " is drinking alcohol");
}    

var persons = [{name: "John", age: 17},{name: "Brad", age: 18}];

for (var i=0; i<persons.length; i++) {
    var person = persons[i];     
    try {
        drinkAlcohol(person);
    } catch(e) {
        console.log("Seems like you are too young " + person.name);
    }   
}

/** output:
Seems like you are too young John
Brad is drinking alcohol
**/


