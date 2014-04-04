//trying to recreate the effect from here:
//www.themaninblue.com/experiment/Blobular/

var a = {
  x: tributary.sw/2,
  y: 319,
  r: 150
};

var b = {
  x: tributary.sw/2 - 2,
  y: 555,
  r: 158
};

var join = {
  r: 207
};

var color = "#83ff00"

var originDistance = a.r - b.r;
    
a.area = Math.PI * Math.pow(a.r, 2);
b.area = Math.PI * Math.pow(b.r, 2);
var afterCircleArea = a.area - b.area;
		
    
    
var distance = calculateDistance(a,b);
var distanceDiff = distance - originDistance;
if(distanceDiff < 1) { distanceDiff = 1 }

var dontdraw = false;
if(distance > 2*join.r + a.r + b.r) {
  console.log("MAY DAY")
  dontdraw = true;
}

var angle = calculateAngle(a,b);

b.h = 0;
b.k = 0 - a.r + b.r - distanceDiff;

//console.log(b.k, join.r)
var triangleA = a.r + join.r; // Side a
var triangleB = b.r + join.r; // Side b
var triangleC = Math.abs(b.k - 0); // Side c
var triangleP = (triangleA + triangleB + triangleC) / 2; // Triangle half perimeter
var triangleArea = Math.sqrt(triangleP * (triangleP - triangleA) * (triangleP - triangleB) * (triangleP - triangleC)); // Triangle area
if (triangleC >= triangleA)
{
  var triangleH = 2 * triangleArea / triangleC; // Triangle height
  var triangleD = Math.sqrt(Math.pow(triangleA, 2) - Math.pow(triangleH, 2)); // Big circle bisection of triangleC
}
else
{
  var triangleH = 2 * triangleArea / triangleA; // Triangle height
  var triangleD = Math.sqrt(Math.pow(triangleC, 2) - Math.pow(triangleH, 2)); // Small circle bisection of triangleA
}

a.tan = triangleH / triangleD;
a.angle = Math.atan(a.tan);
a.sin = Math.sin(a.angle);
a.intersectX = a.sin * a.r;
a.cos = Math.cos(a.angle);
a.intersectY = a.cos * a.r;

join.x = 0 + a.sin * (a.r + join.r);
join.y = 0 - a.cos * (a.r + join.r);

var coord1 = {
  x: -a.intersectX,
  y: -a.intersectY
};
var coord2 = {
  x: a.intersectX,
  y: -a.intersectY
}
b.tan = (b.k - join.y) / (b.h - join.x);
b.angle = Math.atan(b.tan);
b.intersectX = join.x - Math.cos(b.angle) * (join.r);
b.intersectY = join.y - Math.sin(b.angle) * (join.r);    
    
var lavaPathD = "M " + coord1.x + " " + coord1.y + " A " + a.r + " " + a.r + " 0 1 0 " + coord2.x + " " + coord2.y;
if (join.x - join.r <= 0 && b.k < join.y)
{
  var crossOverY = circleYFromX(join, 0);
	
  lavaPathD += "A " + join.r + " " + join.r + " 0 0 1 0 " + (join.y + crossOverY);
  lavaPathD += "m 0 -" + (crossOverY * 2);
}

lavaPathD += "A " + join.r + " " + join.r + " 0 0 1 " + b.intersectX + " " + b.intersectY;

var largeArcFlag = 1;
	
if (join.y < b.k)
{
  largeArcFlag = 0;
}

lavaPathD += "a " + b.r + " " + b.r + " 0 " + largeArcFlag + " 0 " + (b.intersectX * -2) + " 0";
		
if (join.x - join.r <= 0 && b.k < join.y)
{
  lavaPathD += "A " + join.r + " " + join.r + " 0 0 1 0 " + (join.y - crossOverY);
  lavaPathD += "m 0 " + (crossOverY * 2);
}

lavaPathD += "A " + join.r + " " + join.r + " 0 0 1 " + coord1.x + " " + coord1.y;

lavaPathD += "A " + join.r + " " + join.r + " 0 0 1 " + coord1.x + " " + coord1.y;



var data = [a,b];
var cs = d3.scale.category10();

var svg = d3.select("svg");
svg.selectAll("circle.blob")
  .data(data)
  .enter()
  .append("circle")
  .classed("blob", true)
  .attr("cx", function(d) { return d.x })
  .attr("cy", function(d) {return d.y })
  .attr("r", function(d) { return d.r })
  .style("fill", function(d,i) { return cs(i); }) 
  .style("fill-opacity", 0.5)
  .style("stroke", function(d,i) { return cs(i); }) 
  
  
  
  
if(!dontdraw) {
 
  var lavaPath = svg.append("path")
      .classed("lava", true)
      .attr("transform", function() {
        var translate = "translate(" + [a.x, a.y] + ")";
        var rotate = "rotate(" + [angle, 0, 0] + ")";
        return translate + rotate;
      })
      .style("fill", "none")
      .style("stroke", color)
      .style("fill", color)
      .style("stroke-width", 2)
  
  lavaPath.attr("d", lavaPathD)

}


function calculateDistance(origin, point) {
  var xx = point.x - origin.x;
  var yy = point.y - origin.y;
  return Math.sqrt(xx*xx + yy*yy)
}

function calculateAngle(origin, point)
{
	var tan = (point.y - origin.y) / (point.x - origin.x);
	var angle = Math.atan(tan) / Math.PI * 180 + 90;

	if (point.x < origin.x)
	{
		angle += 180;
	}
	
	return angle;
}

function circleYFromX (circle, x)
{
	return Math.sqrt(Math.pow(circle.r, 2) - Math.pow(x - circle.x, 2));
};




