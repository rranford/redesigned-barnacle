//Simple d3.js barchart example to illustrate d3 selections

//other good related tutorials
//http://www.recursion.org/d3-for-mere-mortals/
//http://mbostock.github.com/d3/tutorial/bar-1.html


var w = 300
var h = 300


function bars(data)
{

    max = d3.max(data)

    //nice breakdown of d3 scales
    //http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
    x = d3.scale.linear()
        .domain([0, max])
        .range([0, w])

    y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, h], .2)


    var vis = d3.select("#barchart")
    
    //a good written tutorial of d3 selections coming from protovis
    //http://www.jeromecukier.net/blog/2011/08/09/d3-adding-stuff-and-oh-understanding-selections/
    var bars = vis.selectAll("rect.bar")
        .data(data)

    //update updates existing keys
    bars
        .attr("fill", "lightgreen")
        .attr("stroke", "darkgreen")

    //enter - if keys dont exist then more are added, see red ones added
    bars.enter()
        .append("svg:rect")
        .attr("class", "bar")
        .attr("fill", "red")
        .attr("stroke", "darkred")


    //exit - removes at the end
    bars.exit()
        .remove()


    //apply to everything (enter and update)
    bars
        .attr("stroke-width", 4)
        .attr("width", x)
        .attr("height", y.rangeBand())
        .attr("transform", function(d,i) {
            return "translate(" + [0, y(i)] + ")"
        })

}


function init()
{

    //setup the svg
    var svg = d3.select("#svg")
        .attr("width", w+100)
        .attr("height", h+100)
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none")

    svg.append("svg:g")
        .attr("id", "barchart")
        .attr("transform", "translate(50,50)")
    

    //setup our ui
    d3.select("#data1")
        .on("click", function(d,i) {
            bars(data1)
        })   
    d3.select("#data2")
        .on("click", function(d,i) {
            bars(data2)
        })   
    d3.select("#random")
        .on("click", function(d,i) {
            num = document.getElementById("num").value
            bars(random(num))
        })   


    //make the bars
    bars(data1)
}