var dataset = {
 nodes: [
  { name: "Home" },
  { name: "About" },
  { name: "Contact" },
  { name: "More Info" },
  { name: "Donate" }
 ],
 edges: [
  { source: 0, target: 1, linkName: "About" },
  { source: 0, target: 2, linkName: "Contact" },
  { source: 0, target: 3, linkName: "More Info" },
  { source: 0, target: 4, linkName: "Donate" }
 ]
};

var colors = d3.scale.category10();

var svg = d3.select("body")
 .append("svg")
 .attr("width", "100%")
 .attr("height", "100%");

var force = d3.layout.force()
 .nodes(dataset.nodes)
 .links(dataset.edges)
 .size([500, 500])
 .linkDistance([200])
 .charge([-1000])
 .start();

var edges = svg.selectAll("line")
 .data(dataset.edges)
 .enter()
 .append("line")
 .attr("id", function(d) { return "#" + d.linkName; })
 .style("stroke", "#ccc")
 .style("stroke-width", 3);

var names = svg.selectAll("text")
 .data(dataset.edges)
 .enter()
 .append("text")
 .attr("x", 50)
 .style("text-anchor", "middle");

names.append("textPath")
 .attr("xlink:href", function(d) { return "#" + d.linkName; })
 .attr("startoffset", "50%")
 .text(function(d) { return d.linkName; });
 
var nodes = svg.selectAll("circle")
 .data(dataset.nodes)
 .enter()
 .append("circle")
 .attr("r", 30)
 .style("fill", function(d,i) {
  return colors(i);
 });
// .call(force.drag);

force.on("tick", function() {

 edges.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

 nodes.attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; });

});
