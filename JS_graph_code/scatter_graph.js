/**
 * Function that draws the scatter graph of transfer fees on each position by each league.
 * @param data_for_scatter
 * @param all_positions
 * @param league_Selected
 */
function drawScatterGraph(data_for_scatter, all_positions, league_Selected) {
    // Removing all previous data to create new state of data.
    document.getElementById("Scatter").innerHTML = "";

    /**
     * Creating the X-AXIS
     * Capturing the domain
     * Constructing it
     */

    // Getting domain of the X-AXIS which is the different positions
    var positions = new Array()
    all_positions.forEach(function (d) {
        positions.push(d.key);
    });

    // Constructing the X-AXIS
    var Scatter_xScale = d3.scaleBand()
        .range([0, width]) // Start from 10 because dont want both axis to be stuck.
        .domain(positions.sort()) // Have the axis sorted by alphabetical order.
        .padding(1); // Have the dots on exact scale on the x as label

    /**
     * Creating the Y-AXIS
     * Capturing the domain
     * Constructing it
     */

    // Cpaturing all values that will be used on Y-AXIS
    var transfer_per = new Array();
    data_for_scatter.forEach(function (d) {
        (d.values).forEach(function (e) {
            transfer_per.push(e.value);
        })
    });

    // Finding the min/max of Y-AXIS to to obtain the domain
    var y_ax = d3.extent(transfer_per, function (d) {
        return parseInt(d);
    });

    // Constructing the Y-AXIS
    var Scatter_yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(y_ax);

    /**
     * Creation of the SVG element where the scatter will be fitted inside.
     */

    // Parent SVG element
    var Scatter_graph = d3.select("#Scatter")
        .append('svg')
        .attr('class', 'Scatter_SVG')
        .attr('height', height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .style("margin-left", margin.left)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /**
     * Fitting the AXI'S on the SVG ELEMENT which will hold our graph
     */

    // Fitting the x-axis
    Scatter_graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(Scatter_xScale)) // Specifying x-axis to be on bottom.
        .selectAll("text")
        .attr("transform", "translate(5, 0)rotate(-45)")
        .style("text-anchor", "end");

    // Fitting the y-axis
    Scatter_graph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(Scatter_yScale)); // Specifying y-axis to be on left.

    /**
     * Adding labels on axis and tittles on graphs.
     */

    // ADDING TITLE ON X-AXIS.
    Scatter_graph.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("PLAYERS POSITION");

    //ADDING TITLE ON Y-AXIS
    Scatter_graph.append("text")
        .attr("y", -5)
        .attr("x", +5)
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .text("TRANSFER FEE'S (€)");

    // Adding graph title.
    Scatter_graph.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("TRANSFER FEES SPEND(€) BY LEAGUE & POSITION");

    // Sort the array of objects to user for loop for each group of scatter
    // Must be same as league_Selected so it works good.
    league_Selected.sort();


    /**
     * Getting values to use when building the legend box of the scatter plot
     * colour_Points are the colours the points can have -> So the legend box will use.
     */
    // Setting the colours of the circles for each scatter
    var colour_Points = {
        "LaLiga": 'red',
        "Premier League": 'blue',
        "1.Bundesliga": 'black',
        "Serie A": 'green',
        "Ligue 1": 'orange'
    };

    // Array which will hold the objects K-V pair to create legend box
    var legendBox = new Array;

    /**
     * Fitting a tooltip div to allow mouse over effect.
     */
    var div = d3.select("#Scatter").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    /**
     * Fitting the actual scatter plot
     * Initializing the mouse over
     * Obtaining the values needed for legend box.
     */
    for (var scatterGroup = 0; scatterGroup < league_Selected.length; scatterGroup++) {

        // Assign team in object for mouseover.
        // Making sure the correct league will mouse over the data and have the legend box build
        var loop_league = data_for_scatter[scatterGroup].key;
        // Code for this line was found: https://stackoverflow.com/questions/53098658/modify-object-values-in-an-array-of-objects
        var data_for_points = (data_for_scatter[scatterGroup].values).map(result => Object.assign({}, result, {league: loop_league}));

        // Values used to create the legend box
        // KEY = <LEAGUE NAME>
        // VALUE = <COLOUR IN SCATTER>
        legendBox.push({key: loop_league, value: colour_Points[loop_league]});

        Scatter_graph.selectAll("circle-dots")
            .data(data_for_points) // Use data with the new assigned league.
            .enter()
            .append("circle")
            .attr("name", function(d) {return d.league}) // To inedx circles for each league to modify.
            .attr("cx", function (d) {return Scatter_xScale(d.key);}) // Circle on y scale start
            .attr("cy", function (d) {return Scatter_yScale(parseInt(d.value))}) // Circle on x scale start
            .attr("r", 6)
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.league + "<br/>" + "Transer Fees spend(€) : " + parseInt(d.value / 1000000) + "M <br/>" + "On position: " + d.key)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    }

    /**
     Code of adding a hand made legend box
     Code was inspired from de-graph-gallery : https://www.d3-graph-gallery.com/graph/custom_legend.html
     In combination with stack-overflow answer : https://stackoverflow.com/questions/13573771/adding-a-chart-legend-in-d3
     **/
    var i = 1;
    legendBox.forEach(function(d){
        Scatter_graph.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", width - 80)
            .attr("y", i * 25) // Changing height of rect so they dont overlap
            .style("fill", d.value);
        Scatter_graph.append("text")
            .attr("x", width - 60)
            .attr("y", i * 25 + 8) // Chaning height for text so they dont overlap. +8 is needed to is in line with the rect.
            .text(d.key)
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");
        i += 1;
    });

}
