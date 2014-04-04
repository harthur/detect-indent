//parameters

var marginTop = 10;
var marginLeft = 10;
var height = 200
var width = 400
var barSpacing = 0.1

//implementation

var svg = d3.select("svg")

var data = tributary.data

var maxAssignments = d3.max(data, function(d){ return d.assignments })

var xScale = d3.scale.ordinal()
.domain(d3.range(data.length))
.rangeBands([0, width], barSpacing)

var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom")
.ticks(1)

var yScale = d3.scale.linear()
.domain([0, maxAssignments])
.range([0, height])

var g = svg.append("g")
.attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")

var g2 = svg.append("g2")
.attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")

xAxis(g2)
g2.selectAll("path").style({ fill: "none", stroke: "#000" })
g2.selectAll("line").style({ stroke: "#000" })

var bars = g.selectAll("rect")
.data(data);

bars.enter()
.append("rect")

bars.attr({
  x: function(d, i) { return xScale(i) },
  y: function(d, i) { return height - yScale(d.assignments) },
  height: function(d, i) { return yScale(d.assignments) },
  width: xScale.rangeBand()
})