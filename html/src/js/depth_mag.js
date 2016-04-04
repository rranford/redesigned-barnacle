
            var margin = {top: 20, right: 30, bottom: 100, left: 50},
                width = 6000 - margin.left - margin.right,
                height = 550 - margin.top - margin.bottom;

            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([0, height]);

            function make_x_axis() {
                return d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(d3.time.hours, 24)
                        .tickFormat(d3.time.format("%Y %b %d"))
                        .tickSize(-height, 0, 0);
            }

            function make_y_axis() {
                return d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(35)
                        .tickSize(-width, 0, 0);
            }

            var area = d3.svg.area()
                    .x(function (d) {
                        return x(d.datetime);
                    })
                    .y0(height)
                    .y1(function (d) {
                        return y(d.Depth);
                    });

            var valueline = d3.svg.line()
                    .x(function (d) {
                        return x(d.datetime);
                    })
                    .y(function (d) {
                        return y(d.Depth);
                    });
                    
            var selectiondropdown = d3.select("#interpolate")
                    .on("change", function () {
                        valueline.interpolate(this.value);
                        area.interpolate(this.value);
                        render();
                    });
            
            var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
					
            var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            function render() {

                valueline.interpolate(selectiondropdown.property("value"));
                area.interpolate(selectiondropdown.property("value"));

                svg.selectAll("path").remove();

                d3.csv("../src/data/IEBQuakesExport.csv", function (error, data) {
                    data.forEach(function (d) {
                        d.datetime = parseDate(d.Day + " " + d.Time);
                        d.Depth = +d.Depth;
                    });

                    x.domain(d3.extent(data, function (d) {
                        return d.datetime;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                            return d.Depth;
                        })]);

                    svg.append("path")
                            .datum(data)
                            .attr("class", "area")
                            .attr("d", area);

                    svg.append("path")
                            .attr("class", "line")
                            .attr("d", valueline(data));
                                                
                                                
					svg.selectAll("dot")
							.data(data)
						.enter().append("circle")
							.attr("r", function(d) { return d.Magnitude; })
							.attr("cx", function(d) { return x(d.datetime); })
							.attr("cy", function(d) { return y(d.Depth); });
                                                
                                                
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
                            .call(make_y_axis());
                            
                    svg.append("text")
                            .attr("transform",
                                    "translate(" + (width / 2) + " ," +
                                    (height + margin.bottom) + ")")
                            .style("text-anchor", "middle")
                            .text("Date");

                    svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 18)
                            .attr("x", margin.top - (height / 2))
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .attr("class", "shadow")
                            .text("Depth");

                    svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 18)
                            .attr("x", margin.top - (height / 2))
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("Depth");

                    svg.append("text")
                            .attr("x", (width / 2))
                            .attr("y", 0 - (margin.top / 2))
                            .attr("text-anchor", "middle")
                            .style("font-size", "16px")
                            .style("text-decoration", "underline")
                            .text("Earthquake Magnitude and Depth by Date 2015");
                });
            }