/**
 * Function that will constructs and draws the horizontal bar graph
 * Shows Transfer spend for all leagues for every season.
 * @param data_for_bar
 */
function drawBarGraph(data_for_bar) {
    // Removing any previous data state
    document.getElementById("Bar_graph").innerHTML = "";


    /**
     * Construcncting the two axis  and defining the ranges and domains
     */
    // Construction of y-axis
    var Bar_yScale = d3.scaleBand()
            .range([0, height])
            .padding(0.2) // GAP between the bars
            .domain(data_for_bar.map(function (d) { return d.key; })); // Finding the domain.

    //X-AXIS creation and domain
    var Bar_xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data_for_bar, function (d) { return parseInt(d.value/1000000); })]);

    /**
     * Creation of the parent SVG element which will hold the bar graph inside.
     */
    // Creation of Bar_SVG element.
    var Bar_SVG = d3.select("#Bar_graph")
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /**
     * Fitting the AXIS on the graph inside the parent SVG element.
     */
    // Fitting the x-axis
    Bar_SVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(Bar_xScale)) // Specifying x-axis to be on bottom.
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Fitting the y-axis
    Bar_SVG.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(Bar_yScale)); // Specifying y-axis to be on left.

    /**
     * Adding labels on the axis and title on the fraph
     */
    // ADDING TITLE ON X-AXIS.
    Bar_SVG.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top ) + ")")
        .style("text-anchor", "middle")
        .text("TRANSFER FEE'S IN MILLIONS(€)");

    //ADDING TITLE ON Y-AXIS
    Bar_SVG.append("text")
        .attr("y", -5)
        .style("text-anchor", "END")
        .style("font-size", "1em")
        .text("SEASON");

    // Adding title on the graph
    Bar_SVG.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("TRANSFER FEES SPEND(€) BY SEASON");


    /**
     * Adding a div tooltip to allow the mouseover effect.
     */
    // Define the div for the tooltip
    var div = d3.select("#Bar_graph").append("div")
        .attr("class", "tooltipBar")
        .style("opacity", 0);

    /**
     * Fitting all the bars in the graph.
     */
    // Selecting or bars created from scaleBand. One bar for each value in domain.
    Bar_SVG.selectAll("bar")
        .data(data_for_bar) // Data being used.
        .enter().append("rect") // Each bar create rectangle
        .style("fill", "steelblue")
        .attr("class", "bar")
        .attr("x", Bar_xScale(0)) // Placing bar at value Bar_xScale on x axis
        .attr("y", function (d) { return Bar_yScale(d.key); }) // Ending height at value Bar_yScale on y axis
        .attr("width", function (d) {return Bar_xScale(d.value/1000000)}) // Width in horizontal of each bar, is on x-scale
        .attr("height", Bar_yScale.bandwidth()) // Height of vertical of each bar is on y-scale
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Season: " + d.key + "<br/>" + "Total Transfer Fees(€): "  + parseInt(d.value / 1000000) + "M")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


}