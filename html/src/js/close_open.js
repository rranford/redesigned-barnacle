
            var margin = {top: 30, right: 20, bottom: 30, left: 20},
                width = 600 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            var x = d3.time.scale().range([0, width]);
            var y0 = d3.scale.linear().range([height, 0]);
            var y1 = d3.scale.linear().range([height, 0]);

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
                        .scale(y0)
                        .orient("left")
                        .ticks(5);
            }

            function make_y_axis_right() {
                return d3.svg.axis()
                        .scale(y1)
                        .orient("right")
                        .ticks(5);
            }

            var valueline1 = d3.svg.line()
                    .x(function (d) {
                        return x(d.datetime);
                    })
                    .y(function (d) {
                        return y0(d.open);
                    });
                    
                    
            var valueline2 = d3.svg.line()
                    .x(function (d) {
                        return x(d.datetime);
                    })
                    .y(function (d) {
                        return y1(d.close);
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
                        d.date = parseDate(d.date);
                        d.close = +d.close;
                        d.open = +d.open;
                    });

                    x.domain(d3.extent(data, function (d) {
                        return d.datetime;
                    }));
                    y0.domain([0, d3.max(data, function (d) {
                            return d.close;
                        })]);
                    y1.domain([0, d3.max(data, function (d) {
                            return d.open;
                        })]);

                    svg.append("path")
                            .attr("class", "line1")
                            .attr("d", valueline1(data));
                                                
                    svg.append("path")
                            .attr("class", "line1")
                            .attr("d", valueline2(data));
                                                
                                                
                                                
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
                            .call(make_y_axis_left());
                            
                    svg.append("g")
                            .attr("class", "y axis")	
					        .attr("transform", "translate(" + width + " ,0)")	
					        .style("fill", "red")
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