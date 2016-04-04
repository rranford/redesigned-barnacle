
var margin = {top: 30, right: 70, bottom: 70, left: 40},
width = 750 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.time.scale().range([0, width]);
var yopen = d3.scale.linear().range([height, 0]);
var yclose = d3.scale.linear().range([height, 0]);

function make_x_axis() {
    return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.hours, 24)
            .tickFormat(d3.time.format("%Y %b %d"))
            .tickSize(-height, 0, 0);
}

function make_y_axis_left() {
    return d3.svg.axis()
            .scale(yopen)
            .orient("left")
            .ticks(5)
            .tickSize(-width, 0, 0);
}

function make_y_axis_right() {
    return d3.svg.axis()
            .scale(yclose)
            .orient("right")
            .ticks(5);
}

var valueline_open = d3.svg.line()
        .x(function (d) {
            return x(d.datetime);
        })
        .y(function (d) {
            return yopen(d.open);
        });


var valueline_close = d3.svg.line()
        .x(function (d) {
            return x(d.datetime);
        })
        .y(function (d) {
            return yclose(d.close);
        });

var parseDate = d3.time.format("%d-%b-%y").parse;

var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function render() {

    d3.csv("../src/data/close_open.csv", function (error, data) {
        data.forEach(function (d) {
            d.datetime = parseDate(d.date);
            d.close = +d.close;
            d.open = +d.open;
        });

        x.domain(d3.extent(data, function (d) {
            return d.datetime;
        }));
        yopen.domain([0, d3.max(data, function(d) { 
                return Math.max(d.close, d.open); 
            })]);
        
        yclose.domain([0, d3.max(data, function(d) { 
                return Math.max(d.close, d.open); 
            })]);

        svg.append("path")
                .attr("class", "lineopen")
                .attr("d", valueline_open(data));

        svg.append("path")
                .attr("class", "lineclose")
                .attr("d", valueline_close(data));
        
        svg.append("text")
                .attr("transform", "translate(" + (width + 3) + "," + yopen(data[0].open) + ")")
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", "darkblue")
                .text("Open");
                 
        svg.append("text")
                .attr("transform", "translate(" + (width + 3) + "," + yclose(data[0].close) + ")")
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .style("fill", "darkred")
                .text("Close");
        
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_axis())
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

        svg.append("g")
                .attr("class", "y axis")
                .style("fill", "darkred")
                .call(make_y_axis_left());

        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + " ,0)")
                .style("fill", "darkblue")
                .call(make_y_axis_right());

        svg.append("text")
                .attr("transform",
                        "translate(" + (width / 2) + " ," +
                        (height + margin.bottom) + ")")
                .style("text-anchor", "middle")
                .text("Date");

        svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Close Open Graph");
    });
}