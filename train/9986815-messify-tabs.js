String.prototype.messify=function(sx){
	return this.split("")//make into array
		.sort(
			function(){
				//use sort to mess
				return Math.random()-sx;
			}
		)
		.join("");//make a string
}
function mess(s){
	return s.messify(0.5);
}