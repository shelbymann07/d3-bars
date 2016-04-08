
/* ---------------------- */
/* GLOBAL VARIABLES */
/* ---------------------- */



// We use the margins to offset the chartable space inside of the <svg> space.
// A great visual explanation of how this works is here: https://bl.ocks.org/mbostock/3019563
var margin = {
        top: 20,
        right: 20,
        bottom: 120,
        left: 50
    };

// Here, we define the width and height as that of the .chart div minus the margins.
// We do this to make sure our chart is responsive to the browser width/height
var width = $(".chart").width() - margin.left - margin.right;
var height = $(".chart").height() - margin.top - margin.bottom;

// `x` and `y` are scale function. We'll use this to translate values from the data into pixels.
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// `xAxis` and `yAxis` are functions as well.
// We'll call them later in the code, but for now, we just want to assign them some properties:
// Axis have to abide by their scales: `x` and `y`. So we pass those to the axis functions.
// And we use the orient property to determine where the hashes and number labels show up.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");



// We define svg as a variable here. It's a variable, so we could call it anything. So don't be confused by it being named the same as the tag.
var svg = d3.select(".chart").append("svg") // Appends the <svg> tag to the .chart div
	.attr("class", "parent-svg") // gives it class
    .attr("width", width + margin.left + margin.right) //gives the <svg> tag a width
    .attr("height", height + margin.top + margin.bottom) //gives the <svg> tag a height
    .append("g") // Appends a <g> (Group) tag to the <svg> tag. This will hold the actual chartspace.
    .attr("class", "chart-g") //assigns the <g> tag a class
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Offsets the .chart-g <g> element by the values left and top margins. Basically the same as a left/right position.

/* END GLOBAL VARIABLES ---------------------- */







/* ---------------------- */
/* LOAD THE DATA */
/* ---------------------- */

// This is an ajax call. Same as when we load a json file.
d3.tsv("data/sat.tsv", function(error, data) {

    data.sort(function(a, b) {
       return +b.Score - +a.Score; 
    });
    
    // Get the highest and lowest `Score` values from the data.
    var minMaxScores = d3.extent(data, function(d) {
        return +d.Score; // We use the `+` sign to parse the value as a number (rather than a string)
    });

    // Get the highest and lowest `Tested` values from the data.
	var minMaxParticipation = d3.extent(data, function(d) {
        return +d.Tested;
    });

    var statesDomain = data.map(function(d) {
            return d.State;
    })
    
    console.log(statesDomain);
    // `minMaxParticipation` is an ARRAY OF TWO VALUES.
    // We'll assign it to the "domain" of the `x` scale. 
    //x.domain(minMaxParticipation).nice();
    x.domain(statesDomain);

    // Same for the `x` scale.
    y.domain(minMaxScores).nice();


 	// This is where we call the axis functions.
    // We do so by first giving it someplace to live. In this case, a new <g> tag with the class names `x` and `axis.`
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") //Assigns a left/right position.
    .call(xAxis) // This calls the axis function, which builds the axis inside the <g> tag.
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");


    // Same as above, but for the y axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(0)")
        .attr("y", 6)
        .attr("x", 4)
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("SAT Scores")

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
            return x(d.State); 
            })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { 
            return y(d.Score); 
            })
        .attr("height", function(d) { 
            return height - y(d.Score); 
        });

});
