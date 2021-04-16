/**
 * Function which handles the the Line-Dot graph of transfer fees per league and season.
 * Actions involved in drawSesonLine(..)
 * -> Setup axis domains-ranges-labels-fit them
 * -> Loop the draws path and dots for each league in scatter
 * -> Mousover effects for the circles of the plot.
 *
 * @param dataFor_Line -> Aggregated data being used to create the visualisation
 */

function drawSeasonLine(dataFor_Line) {

    // Removing previous data to create new state.
    document.getElementById("line_graph").innerHTML = "";


    /**
     * X-AXIS CONSTRUNCTION
     */

    // Computing the correct domain fo x-axis.
    var Line_xDomain = new Array();
    // Getting the first league. Keeping all seasons data was recorded and kept.
    (dataFor_Line[0].values).forEach(function (d) {
            Line_xDomain.push(d.key);
    });

    // Using scale point so lines are plotted more precisely.
    var Line_xScale = d3.scaleBand()
        .range([0, width]) // Start from 10 because want small separation of axis.
        .domain(Line_xDomain.sort())
        .padding(1); // To have dots in band center


    /**
     * Y-AXIS CONSTRUCTION
     */

        // Computing correct domain for y-axis.
    var trasnfer_fees = new Array();
    dataFor_Line.forEach(function (d) {
        // For each league in data go through each season transfer fee
        (d.values).forEach(function (e) {
            // append all the values of all transfer fees of all seasons for each team.
            trasnfer_fees.push(e.value);
        })
    });

    // Getting the minimum transfer fee and the maximum.
    var min_max_fee = d3.extent(trasnfer_fees, function (d) {
        return parseInt(d);
    });

    // Since the transfer fees is a continuous scale, we will scale linear.
    var Line_yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(min_max_fee);

    /**
     * Creating graph area and axis in position
     */

        // Creation of svg element.
    var Line_SVG = d3.select("#line_graph")
            .append('svg')
            .attr('class', 'plot_element')
            .attr('height', height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .style("margin-right", margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /**
     * Adding the X-AXIS on the plot.
     */

    // Adding the x-axis with labels on element
    Line_SVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(Line_xScale)) // Specifying x-axis to be on bottom.
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "translate(5, 0)rotate(-45)")
        .style("text-anchor", "end");

    // Adding title for the x-axis.
    Line_SVG.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("SEASON");

    /**
     * Adding the Y-AXIS on the plot.
     */

    // Adding the y-axis and its labels on element.
    Line_SVG.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(Line_yScale)); // Specifying y-axis to be on left.

    // Adding a title for the y-axis.
    Line_SVG.append("text")
        .attr("y", -5)
        .attr("x", +5)
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .text("TRANSFER FEE'S (€)");

    /**
     * Adding a plot title for the graph.
     */
    Line_SVG.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("TRANSFER FEES SPEND(€) BY EACH LEAGUE & SEASON");

    /**
     * Create a line object.
     * Function will be in charge of creating the appropriate line for each league.
     */

        // Define the div for the tooltip to show mouse-over
    var div = d3.select("#line_graph").append("div")
            .attr("class", "tooltipLine")
            .style("opacity", 0);

    for (var pointer = 0; pointer < dataFor_Line.length; pointer++) {

        // Add the line
        Line_SVG.append("path")
            .attr("name", dataFor_Line[pointer].key)
            .datum(dataFor_Line[pointer].values)
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return Line_xScale(d.key) })
                .y(function(d) { return Line_yScale(d.value) })
            );

        // Capturing data to append appropriate colour in circles.
        var loop_league = dataFor_Line[pointer].key;
        var data_for_circle = (dataFor_Line[pointer].values).map(result => Object.assign({}, result, {league: loop_league}));

        // Printing data to see if done correctly
        console.log(data_for_circle);


        // Circles
        Line_SVG.selectAll("circle_dot")
            .data(data_for_circle)
            .enter()
            .append("circle")
            .attr("name", function(d) {return d.league})
            .attr("cx", function(d) { return Line_xScale(d.key); })
            .attr("cy", function(d) { return Line_yScale(d.value); })
            .attr("r", "4")
            .on("mouseover", function(d) { // Adding mouseover effect to have details on demand.
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.league + "<br/>" + "Season: " + d.key + "<br/>" + "Total Fees Spend: " + parseInt(d.value/1000000) + "M(€)" )
                    .style("left", (d3.event.pageX ) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

}

