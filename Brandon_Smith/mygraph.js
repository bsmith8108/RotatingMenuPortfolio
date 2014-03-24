function tanh(x){
 if( x < -3 )
  return -1;
 else if( x > 3 )
  return 1;
 else
  return x * ( 27 + x * x ) / ( 27 + 9 * x * x );
}

var svg = document.getElementById('mySVG');
var width = svg.offsetWidth;
var height = svg.offsetHeight;

var midpoint = [width/2, height/2];

// Modify the below for how many points you want around the center
// The below two variables should eventually be able to be passed into
// a function, so that this is extremely easy to implement in the future
var numPoints = 4;
var labels = ["About", "Contact", "Projects", "Reviews"];
var colors = ["#3DA0F1", "#FFFA5F", "#435E53", "#FF8040"];
var nodeRadius= 30;
var circleRadius = 150;

// Now I must actually generate the center points for each of the nodes
// that will be used.
var points = [];
// The below is assuming there are only 4 points, this should be changed
// later on to accomodate for any number of points
// 150 is an arbitrary number that can also be manipulated
var xmin = midpoint[0]-circleRadius;
var xmax = midpoint[0]+circleRadius;
var ymin = midpoint[1]-circleRadius;
var ymax = midpoint[1]+circleRadius;

points.push([xmin,ymin]);
points.push([xmin,ymax]);
points.push([xmax,ymin]);
points.push([xmax,ymax]);

function get_page(id_number) {
 var fin;
 if (id_number == 0) {
  return "index.html";
 }
 else if (id_number == 1) {
  return "about.html";
 }
 else if (id_number == 2) {
  return "contact.html";
 }
 else if (id_number == 3) {
  return "projects.html";
 }
 else if (id_number == 4) {
  return "reviews.html";
 }
 return "what";
}

function changePage(link, id) {
 window.location.replace(link);
}

// The function below takes a point, size and color and uses those to create
// a point on the svg.
// sets the id for each circle
var circleCounter = 0;
function drawPoint(size, point, color) {
 var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
 newElement.setAttributeNS(null, "r", size);
 newElement.setAttributeNS(null, "cx", point[0]);
 newElement.setAttributeNS(null, "cy", point[1]);
 newElement.setAttributeNS(null, "id", circleCounter);
 newElement.setAttributeNS(null, "cursor", "pointer");
 newElement.style.stroke = "grey";
 newElement.style.strokeWidth = "1";
 newElement.style.fill = color;
 var link = get_page(circleCounter);
 var func = "changePage('"+link+"', " + circleCounter + ")";
 newElement.setAttributeNS(null, "onclick", func);
 svg.appendChild(newElement);
 circleCounter += 1;
}

// The below function takes a start point, an end point and a label and draws
// the line that is connecting the two points, and adds the label
function drawLine(startPoint, endPoint, label) {
 // first I am going to create the links
 var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
 var pathString = "M " + startPoint[0].toString() + ", " + startPoint[1].toString() + " L " + endPoint[0].toString() + ", " + endPoint[1].toString();

 newElement.setAttribute("d", pathString);
 newElement.style.stroke = "black";
 newElement.style.strokeWidth = "2";
 newElement.setAttribute("id", label);
 svg.appendChild(newElement);
 // Now to add the text labels
 var textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
 textElement.setAttribute("dy", "-12");
 textElement.setAttribute("style", "text-anchor:middle; font-size:23px;");
 var textPath = document.createElementNS("http://www.w3.org/2000/svg", 'textPath');
 textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#"+label);
 textPath.setAttribute("startOffset", "50%");
 textPath.textContent = label;
 textElement.appendChild(textPath);
 svg.appendChild(textElement);
}

// Draw the midpoint to start
drawPoint(nodeRadius, midpoint, "lightgrey");

for (var i=0;i<points.length;i++) {
 drawPoint(nodeRadius, points[i], colors[i]);
 var line = calculate_line(midpoint, points[i]);
 drawLine(line[0],line[1], labels[i]);
}
console.log("done")
// This is the function where the paths to the points is calculated
// Will need to decide elsewhere, the direction of the path
// Returns in the form [start, end], where start and end are both arrays

function calculate_line(mp, point) {
 var a = mp[0] - point[0];
 var b = mp[1] - point[1];
 var omegaFirst = tanh(a/b);
 
 var aPrime1 = 30*Math.sin(omegaFirst);
 var bPrime1 = 30*Math.cos(omegaFirst);
 
 var omegaSecond = tanh(a/b);
 
 var aPrime2 = 30*Math.sin(omegaSecond);
 var bPrime2 = 30*Math.cos(omegaSecond);
 
 var start=[];
 var end = [];
 
 if (a>0 && b>0){
  start = [mp[0]-aPrime1, mp[1]-bPrime1];
  end = [point[0]+aPrime2, point[1]+bPrime2];
 }
 else if(a<0 && b>0) {
  start = [mp[0]-aPrime1, mp[1]-bPrime1];
  end = [point[0]+aPrime2, point[1]+bPrime2];
 }
 else if(a>0 && b<0) {
  start = [mp[0]+aPrime1, mp[1]+bPrime1];
  end = [point[0]-aPrime2, point[1]-bPrime2];
 }
 else {
  // a<0 && b<0
  start = [mp[0]+aPrime1, mp[1]+bPrime1];
  end = [point[0]-aPrime2, point[1]-bPrime2];
 }
 
 return [start,end];
} 

var t = 0;
var t1 = 3.93;
var t3 = -95.052;
var t4 = .785;
var t2 = 2.355;
var speed = 0.0175;

function get_new_coords(i) {
 var xcenter; //midpoint[0];
 var ycenter; //midpoint[1];
 if (i == 1) {
  t = t1;
  xcenter = midpoint[0] - xmin;
  ycenter = midpoint[1] - ymin;
  t1 += speed;
 }
 else if (i == 2) {
  t = t2;
  xcenter = midpoint[0] - xmin;
  ycenter = midpoint[1] - ymax;
  t2 += speed;
 }
 else if (i == 3) {
  t = t3;
  xcenter = midpoint[0] - xmax;
  ycenter = midpoint[1] - ymin;
  t3 += speed;
 }
 else { // i == 4
  t = t4;
  xcenter = midpoint[0] - xmax;
  ycenter = midpoint[1] - ymax;
  t4 += speed;
 }
 t += speed;
 
 var r = circleRadius+60;

 var newLeft = Math.floor(xcenter + (r * Math.cos(t)));
 var newTop = Math.floor(ycenter + (r * Math.sin(t)));

 return [newLeft,newTop];

}

var stopped=false;

var c=100;
var d=-1;

var turn = false;

circles = document.getElementsByTagName("circle");
paths = document.getElementsByTagName("path");

counterr = 0;

function animate() {
 for (var i=1; i<circles.length;i++){
  var coords = get_new_coords(i);
  var x = coords[0];
  var y = coords[1];
  circles[i].setAttribute("transform", "translate("+x+","+y+")");
 }
 //Creates the rotation
 counterr += 1;
 for (var k=0; k<paths.length; k++) {
  paths[k].setAttribute("transform", "rotate("+counterr+","+midpoint[0]+","+midpoint[1]+")");
 }
 if (!stopped) {
  window.setTimeout("animate()",90);
 }
}

animate();
