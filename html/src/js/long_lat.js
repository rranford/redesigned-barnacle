
            var margin = {top: 30, right: 20, bottom: 30, left: 40},
                width = 700 - margin.left - margin.right,
                height = 550 - margin.top - margin.bottom;

            var x = d3.scale.linear().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);

            function make_x_axis() {
                return d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(10)
                        .tickSize(-height, 0, 0);
            }

            function make_y_axis() {
                return d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(10)
                        .tickSize(-width, 0, 0);
            }

            var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            function render() {

                d3.csv("../src/data/IEBQuakesExport.csv", function (error, data) {

                    x.domain(d3.extent(data, function (d) {
                        return +d.Longitude;
                    }));
                    y.domain(d3.extent(data, function (d) {
                        return +d.Latitude;
                    }));
                                                
					svg.selectAll("dot")
							.data(data)
						.enter().append("circle")
							.attr("r", function(d) { return d.Magnitude; })
							.attr("cx", function(d) { return x(+d.Longitude); })
							.attr("cy", function(d) { return y(+d.Latitude); });                                                
                                                
                    svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(make_x_axis());

                    svg.append("g")
                            .attr("class", "y axis")
                            .call(make_y_axis());
                            
                    svg.append("text")
                            .attr("transform",
                                    "translate(" + (width / 2) + " ," +
                                    (height + margin.bottom) + ")")
                            .style("text-anchor", "middle")
                            .text("Latitude");

                    svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 18)
                            .attr("x", margin.top - (height / 2))
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .attr("class", "shadow")
                            .text("Longitude");

                    svg.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 18)
                            .attr("x", margin.top - (height / 2))
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("Longitude");

                    svg.append("text")
                            .attr("x", (width / 2))
                            .attr("y", 0 - (margin.top / 2))
                            .attr("text-anchor", "middle")
                            .style("font-size", "16px")
                            .style("text-decoration", "underline")
                            .text("Earthquake Longitude by Latitude - May-Sept 2015");
                });
            }