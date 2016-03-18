var m = [50, 50, 50, 50];
var w = 400 - m[1] - m[3];
var h = 350 - m[0] - m[2];


var x = d3.scale.linear().domain([0, 20]).range([0, w]);


var graph = d3.select("#graph").append("svg:svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .append("svg:g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);

graph.append("svg:g")
  .attr('class', 'x_axis')
  .attr('transform', "translate(0," + h + ")")
  .call(xAxis);



var dataObj = {};
var chartVariable;
var graphCounter;

socket.on('chartData', data => {
  if ($('.graphButtons').length === 0) {
    // $('#graphOptions').empty();
    var keys = Object.keys(data);
    keys.forEach(key => {
      var button = "<button class='graphButtons' id=\"" + key + "\" onclick='changeData(\"" + key + "\")'>" + key + "</button>"
      $("#graphOptions").append(button);
      dataObj[key] = [];
    })

    chartVariable = keys[0];
    graph.append('text')
      .attr('id', 'chartTitle')
      .attr('x', (w/2))
      .attr('y', 0 -(m[0]/2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text(chartVariable)

  }
  setData(data);
  // console.log('variable is: ', chartVariable);
  // console.log('dataObj is: ', dataObj);
  // console.log('distance is: ', data);
  renderChart(chartVariable);
})

function changeData(key) {
  chartVariable = key;
  // console.log(graph.select('text'));
  $('#chartTitle').text(chartVariable);
}

function setData(data) {
  var vars = Object.keys(data);
  console.log('dataObj:',dataObj);
  vars.forEach(key => {
    if (dataObj[key].length >= 21) {
      dataObj[key].shift()
    }

    dataObj[key].push(data[key]);

  })
}

function renderChart(key) {
  console.log(key);
  var dataArr = dataObj[key];
  var yMax = Math.max(...dataArr) * 1.25 || 1;
  var yAxis = d3.scale.linear().domain([0, yMax ]).range([h, 0]);

  var line = d3.svg.line()
    .x(function(d, i) {
      // verbose logging to show what's actually being done
      // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      // return the X coordinate where we want to plot this datapoint
      return x(i);
    })
    .y(function(d) {
      // verbose logging to show what's actually being done
      // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + yAxis(d) + " using our yScale.");
      // return the Y coordinate where we want to plot this datapoint
      return yAxis(d);
    })


  var yAxisLeft = d3.svg.axis().scale(yAxis).ticks(Math.min(Math.floor(yMax),5)).orient('left');

  graph.selectAll(".y_axis").remove();
  // console.log('data: ', dataArr);
  graph.append("svg:g")
    .attr("class", "y_axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxisLeft);

  graph.selectAll(".plot").remove();
  graph.append("svg:path").attr("class", "plot").attr("d", line(dataArr));

}
