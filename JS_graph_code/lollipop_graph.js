/**
 * Function which handles the the Lollipop graph of transfer fees per player's position.
 * Actions involved in drawLollipop(..)
 * -> Setup axis domains-ranges-labels-fit them
 * -> Loop the draws each position lollipo according to total transfer fee spend.
 * -> Mouseover effects for the circles of the plot.
 *
 * @param dataFor_Lollipop -> Aggregated data being used to create the visualisation
 */

function drawLollipop(dataFor_Lollipop) {

    // Removing previous data to create new state.
    document.getElementById("lollipop_graph").innerHTML = "";


    /**
     * X-AXIS CONSTRUNCTION
     */

        // Computing the correct domain fo x-axis
    var transfer = new Array();
    dataFor_Lollipop.forEach(function (d) {
        transfer.push(d.value);
    });

    // Getting the minimum transfer fee and the maximum.
    var min_max_fee = d3.extent(transfer, function (d) {
        return parseInt(d/1000000);
    });

    // Since transfer fee is linear, we are scaling linearly.
    var Lollipop_xScale = d3.scaleLinear()
        .range([0, width])
        .domain(min_max_fee);


    /**
     * Y-AXIS CONSTRUCTION
     */

        // Calculating the corect scale for y axis
        // Doing it this way manually so it can be sorted.
    var positions = new Array();
    dataFor_Lollipop.forEach(function (d) {
        positions.push(d.key);
    });

    // To divide y-axis in bands of equal spaces and distances.
    var Lollipop_yScale = d3.scaleBand()
        .range([0, height])
        .domain(positions.sort())
        .padding(1);

    /**
     * Creating graph area and axis in position
     */

        // Creation of svg element.
    var lollipop_Graph = d3.select("#lollipop_graph")
            .append('svg')
            .attr('class', 'plot_element')
            .attr('height', height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .style("margin-left", margin.left)
            .append("g")
            .attr("transform", "translate(" + (margin.left + 15) + "," + margin.top + ")");

    /**
     * Adding the X-AXIS on the plot.
     */

    // Adding the x-axis with labels on element
    lollipop_Graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(Lollipop_xScale)) // Specifying x-axis to be on bottom.
        .selectAll("text")
        .attr("transform", "translate(5, 0)rotate(-45)")
        .style("text-anchor", "end");


    // Adding title for the x-axis.
    lollipop_Graph.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("TRANSFER FEE'S IN MILLIONS(€)");

    /**
     * Adding the Y-AXIS on the plot.
     */

    // Adding the y-axis and its labels on element.
    lollipop_Graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(Lollipop_yScale)) // Specifying y-axis to be on left.
        .style("text-anchor", "end");


    // Adding a title for the y-axis.
    lollipop_Graph.append("text")
        .attr("y", -5)
        .attr("x", +5)
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .text("PLAYER'S POSITION");

    /**
     * Adding a plot title for the graph.
     */
    lollipop_Graph.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("TRANSFER FEES SPEND(€) BY EACH POSITION");

    /**
     * Function that will fit a lollipo
     * Lollipop is constructed by a line and a circle.
     */

    // Lines
    lollipop_Graph.selectAll("myline")
        .data(dataFor_Lollipop)
        .enter()
        .append("line")
        .attr("x1", function(d) { return Lollipop_xScale(parseInt(d.value/1000000)); })
        .attr("x2", Lollipop_xScale(0))
        .attr("y1", function(d) { return Lollipop_yScale(d.key); })
        .attr("y2", function(d) { return Lollipop_yScale(d.key); })
        .attr("stroke", "grey");


    // Define the div for the tooltip to show mouse-over
    var div = d3.select("#lollipop_graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Circles
    lollipop_Graph.selectAll("mycircle")
        .data(dataFor_Lollipop)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return Lollipop_xScale(parseInt(d.value/1000000)); })
        .attr("cy", function(d) { return Lollipop_yScale(d.key); })
        .attr("r", "7")
        .style("fill", "steelblue")
        .attr("stroke", "black")
        .on("mouseover", function(d) { // Adding mouseover effect to have details on demand.
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.key + "<br/>" +"Total Fees Spend: " + parseInt(d.value / 1000000) + "M(€)")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });




}
