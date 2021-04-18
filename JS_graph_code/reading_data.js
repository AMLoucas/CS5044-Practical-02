//style="width: 100%; height: 200%"
// Reading in the data.
var dataPath = "data/top250-00-19.csv";

// Margin variable to use to position visualisation more precise
var margin = { top: 50, bottom: 70, left: 75, right: 50};
// Getting height and width of the div elements the graphs will be inputted in.
var width = document.getElementById('Bar_graph').getBoundingClientRect().width - margin.left -  margin.right;	//width of the svg element (in pixels)
var height = document.getElementById('Bar_graph').getBoundingClientRect().height - margin.bottom - margin.top; //height of the svg element

// Calling function to draw the graphs needed.
cleanDataToDraw();

function cleanDataToDraw() {

    /**
     * FILTERING DATA ACCORDING TO CHECKBOXES CHECKED FROM USER.
     **/

        // Getting the data according to seasons interested in.
    var season_Selected = new Array();
    // Loop through all the seasons to check if checkboxes are checked (user wants)
    for (var i = 1; i <= 19; i++) {
        // Creating the string to check for a specific season if box checkes
        var season = "season" + i;
        // if box is checked then get the seasons value and input in array.
        if (document.getElementById(season).checked) {
            season_Selected.push(document.getElementById(season).value);
        }
    }

    // Getting the data according to the leagues interested in.
    var league_Selected = new Array();
    // Loop through all top 5 leagues to check if checkboxes are checked (user wants)
    for (var i = 1; i <= 5; i++) {
        // Creating the string to check for a specific league if box checked
        var league = "league" + i;
        // If the specific checkbox is checkes then we add the value in array.
        if (document.getElementById(league).checked) {
            league_Selected.push(document.getElementById(league).value);
        }
    }

    /**
     * Reading the data and wrangling/aggregating it in appropriate format for each graph that will be implemented.
     * In total we nesting 5 subsets of the whole data
     * BAR GRAPH => 1 dataset
     * LOLLIPOP GRAPH => 1 dataset
     * LINE GRAPH => 1 dataset
     * SCATTER PLOT => 2 dataset
     */
    d3.csv(dataPath)
        .then(function (data) {
            /**
             * Filtering the data and keeping observations only with seasons and leagues interested in
             **/

            data = data.filter(season => season_Selected.includes(season.Season));
            data = data.filter(league => league_Selected.includes(league.League_to));


            /**
             * Data that will be used to create the bar graph
             **/

            var dataBy_Season = d3.nest()
                .key(function (d) {
                    return d.Season;
                })
                .rollup(function (leaves) {
                    //  Specifying what attribute to sum for the bar chart (Transfer_fee)
                    return d3.sum(leaves, function (d) {
                        //  Need to transform numbers to int because they are strings now.
                        return parseInt(d.Transfer_fee)

                    })
                })
                .entries(data); // Specifying on what data to do the grouping
            // Function to draw a bar graph.
            drawBarGraph(dataBy_Season);

            /**
             * Data being used to create the lollipop
             */
            var dataFor_Lollipop = d3.nest()
                .key(function (d) {
                    return d.Position;
                })
                .rollup(function (leaves) {
                    return d3.sum(leaves, function (d) {
                        return parseInt(d.Transfer_fee);
                    })
                })
                .entries(data);

            // Function to draw the lollipop
            drawLollipop(dataFor_Lollipop);

            /**
             * Data being used to create the line plot.
             */
            var dataFor_Line = d3.nest()
                .key(function (d) {
                    return d.League_to;
                })
                .key(function (d) {
                    return d.Season;
                })
                .rollup(function (leaves) {
                    //  Specifying what attribute to sum for the bar chart (Transfer_fee)
                    return d3.sum(leaves, function (d) {
                        //  Need to tranform numbers to int because they are strings now.
                        return parseInt(d.Transfer_fee)

                    })
                })
                .entries(data); // Specifying on what data to do the grouping

            // Function to draw a line graph
            drawSeasonLine(dataFor_Line);

            /**
             * Dataset that is being used to create the scatter plot
             * Main dataset that will be used
             **/

            var data_for_scatter = d3.nest()
                .key(function (d) {
                    //  Specifying how we want to do the grouping
                    return d.League_to;
                })
                .key(function (e) {
                    // Specifying the second grouping looking for.
                    return e.Position;
                })
                .rollup(function (leaves) {
                    //  Specifying what attribute to sum for the bar chart (Transfer_fee)
                    return d3.sum(leaves, function (d) {
                        //  Need to tranform numbers to int because they are strings now.
                        return parseInt(d.Transfer_fee)

                    })
                })
                .entries(data); // Specifying on what data to do the grouping

            /**
             * Extra dataset for the scatter so we can have all positions available for each group of points (leagues)
             * Bundesliga has extra position 'sweeper'
             * Ligue1 has extra position 'forward'
             **/

            var all_positions = d3.nest()
                .key(function (e) {
                    // Specifying the second grouping looking for.
                    return e.Position;
                })
                .rollup(function (leaves) {
                    //  Specifying what attribute to sum for the bar chart (Transfer_fee)
                    return d3.sum(leaves, function (d) {
                        //  Need to tranform numbers to int because they are strings now.
                        return parseInt(d.Transfer_fee)

                    })
                })
                .entries(data); // Specifying on what data to do the grouping

            // Function to draw a bar graph.
            drawScatterGraph(data_for_scatter, all_positions, league_Selected);


        });
};