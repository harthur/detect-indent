// www.GeeksBR.com

// JavaScript - Criando e manipulando objetos

// cria uma instância de um objeto Boolean
var flagFalse = new Boolean(); // o default é false
console.log(flagFalse.valueOf()); // exibe false
console.log(flagFalse.toString()); // exibe uma string contendo "false"

// cria outra instância de um objeto Boolean
var flagTrue = new Boolean(1);
console.log(flagTrue.valueOf()); // exibe true

// outras formas de criar um objeto Boolean
var flagBoolTrue = new Boolean(true);
console.log(flagBoolTrue.valueOf()); // exibe true
var flagBoolFalse = new Boolean(false);
console.log(flagBoolFalse.valueOf()); // exibe false

// cria uma instância de um objeto Number
var num = new Number(10);
console.log(num.valueOf()); // exibe o número 10
console.log(num.toString(2)); // exibe 1010 (10 em binário)
console.log(num.toString(10)); // exibe 10 (10 em decimal)

// cria uma instância de um objeto String
var nome = new String("www.geeksbr.com");
console.log(nome.valueOf()); // exibe a string
console.log(nome.length); // exibe o tamanho da string
var novoNome = nome.slice(4,11); // obtém uma substring de nome
console.log(novoNome); // exibe a string "geeksbr"

// obs.: Strings em JavaScript são imutáveis

var my_str = new String("hello world")
// o método charAt() permite obter um caractere dada uma posição
console.log(my_str.charAt(0)); // retorna o caractere 'h'
// o método substr() permite obter uma substring
console.log(my_str.substr(0,5)); // retorna a string "hello"
// o método indexOf permite saber a posição de início de uma string
console.log(my_str.indexOf("hello")); // exibe 0

// dividindo uma string... (método split)
var texto = new String("Aprendendo, JavaScript, no www.GeeksBR.com");
// a string texto será dividida com base na vírgula ','
var vetTokens = texto.split(',');

// exibindo os valores
for(var i = 0; i < vetTokens.length; i++) {
	console.log(vetTokens[i]);
	/*
		Saída:
		Aprendendo
		  JavaScript
		  no www.GeeksBR.com
	*/
}

var meuNome = new String("Marcos Castro");
// convertendo todas as letras para maiúsculos
console.log(meuNome.toUpperCase());
// convertendo todas as letras pra minúsculos
console.log(meuNome.toLowerCase());

// trabalhando com expressões regulares (método match)
var myStr = new String("ID: 85492423451");
var exp = /[0-9]+/; // quero procurar números
console.log(myStr.match(exp)[0]); // exibe: 85492423451
var newExp = /[A-Za-z]+/; // quero procurar letras
console.log(myStr.match(newExp)[0]); // exibe: ID

// criando um objeto Date
var data = new Date();
console.log(data.getFullYear()); // exibe o ano
console.log(data.getMonth()); // exibe os o mês
console.log(data.getDay()); // exibe o dia
console.log(data.getDate()); // exibe o dia do mês
console.log(data.getHours()); // exibe as horas
console.log(data.getMinutes()); // exibe os minutos

// objeto Math
var myNumber = 25;
console.log(Math.sqrt(myNumber)); // exibe o valor 5

myNumber = -5;
console.log(Math.abs(myNumber)); // exibe o valor 5

myNumber = 5;
console.log(Math.pow(myNumber, 2)); // exibe o valor 25 (5 elevado a 2)

console.log(Math.PI) // exibe a constante PI

myNumber = 4.643;
// o método round arredonda o número para o inteiro mais próximo
console.log(Math.round(myNumber)); // exibe o valor 5

// arrays
var myArray = new Array(5, 3, 6, 1, 43, 2);
// exibindo os valores
for(var i=0; i < myArray.length; i++) {
	console.log(myArray[i]);
}
console.log("Array invertido:");
// invertendo a ordem dos elementos de um array (método reverse)
var newArray = myArray.reverse();
for(var i=0; i < newArray.length; i++) {
	console.log(newArray[i]);
}