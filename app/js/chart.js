var svg = d3.select("svg");
var margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
};
var width = svg.attr("width") - margin.left - margin.right;
var height = svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleTime().range([margin.left, width-margin.right]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) {return x(d.date)})
            .y(function(d) {return y(d.temperature)});


var g = svg.append("g");

d3.tsv("data.tsv", function(data) {
    var cleanData = [];
    var parseTime = d3.timeParse("%Y%m%d");
    for(var i=0; i<data.length; i++) {
        var point = {
            date: parseTime(data[i].date),
            temperature: parseFloat(data[i]["Austin"])
        }
        cleanData.push(point);
    }
    var maxMinDate = d3.extent(cleanData, function(d) {return d.date});
    var maxMinTemperature = d3.extent(cleanData, function(d) {return d.temperature});
    
    x.domain(maxMinDate);
    y.domain(maxMinTemperature);

    g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate("+ 0 +","+ height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + margin.left + "," + 0 +")")
        .call(d3.axisLeft(y));

    g.append("path")
        .attr("class", "line")
        .attr("d", function(d) {return line(cleanData)});

    g.selectAll(".line")
        .on("mouseenter", function(d) {showCircle(event)})


    function showCircle(event) {
        g.selectAll(".circle")
            .remove();

        g.selectAll(".point-info")
            .remove();

        g.append("circle")
            .attr("class", "circle")
            .attr("cx", event.offsetX)
            .attr("cy", event.offsetY)
            .attr("r", 5)
            .style("fill", "tomato")

        var point = d3.scalePoint()
                        .domain(maxMinDate)
                        .range([margin.left, width-margin.right]);
        g.append("text")
            .attr("class", "point-info")
            .attr("x", event.offsetX+10)
            .attr("y", event.offsetY-10)
            .text(x.invert(event.offsetX)+" "+y.invert(event.offsetY));

    }
});

