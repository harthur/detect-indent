d3.select("svg").style("background","#232F40")

g.append('text')
.text("Click anywhere on the canvas")
.attr({
  fill: "#ffffff",
  x : 14,
  y: 33,
  "font-size": 18,
  "font-family": "Arial",
  "text-anchor": "start"
});

  
var easing = "circle-out";
var duration = 350;
var mainX = 200;
var mainY = 200;
var strokeWidth = 1;
var nrOfElements = 20;


d3.select("svg").on("click", function(){
  console.log(d3.event)
    lineExp(d3.event.x,d3.event.y);
	
});

 
function lineExp(mainX,mainY){
 
  
  var n = nrOfElements;
  var colors = d3.scale.ordinal()
    .domain([0,n])
    .range(["#1abc9c","#3498db","#9b59b6", "#f1c40f","#e67e22","#e74c3c","#2c3e50","#c0392b"]);
  

  

  var outer =  80;
  var inner = 20;
  var idStart = Math.floor(Math.random()*1000);
  var inner2 = outer+50;
  
  
  console.log("sdfsdfsdfsd")
  
  
      
    var group = g.append("g")
    .data(d3.range(n))
    .enter()
      .attr({
        transform: "translate("+[mainX,mainY]+")",
        "class": "group"
      });
    
    
    group.append('line')
      .attr({
         stroke:color,
         "stroke-width":strokeWidth,
         fill: "none",
        "stroke-linecap": "round",
         x1: 0,
         x2: c1,
         y1: 0,
         y2: c2,
        "class" : className,
        "transform" : "translate("+x+","+y+")",
        "opacity": 1
    });

}

 