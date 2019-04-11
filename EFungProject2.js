
window.onload = function() {
    setup3();
    var reloading = sessionStorage.getItem("reloading");
    var reloading2 = sessionStorage.getItem("reloading2");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        setup();
    }
    if (reloading2) {
        sessionStorage.removeItem("reloading2");
        setup2();
    }
}

function reloadP() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}
function reloadP2() {
    sessionStorage.setItem("reloading2", "true");
    document.location.reload();
}
function setup3() {


    d3.select("#vis").append("h1")
        .attr("text-anchor", "middle")
        .attr("id", "h1start")
        .style("font-size", "24px")
        .text("Click a button to start the visualization");

    var dataset = [];

    d3.csv('ForestAreaEdited.csv',function (d) {

        d.forEach(function(d) {
            d.EPS = +d.EPS;
            d.ForestArea= +d.ForestArea;
            d.Year = +d.Year;
            //d.Country = +d["Country"];
            d.EPIR = +d.EPIR;
        });

        dataset = d.map(function(d) {
            if (d.Year > 2017) {
                return [ d["Country"], d.EPIR ];
            }
        });

        dataset = dataset.filter(function( element ) {
            return element !== undefined;
        });

        var table = d3.select("#vis2").append("table");
        var header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(["Country", "EPI Ranking"])
            .enter()
            .append("th")
            .text(function(d) { return d; });
        var tablebody = table.append("tbody");
        rows = tablebody
            .selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr");
        // We built the rows using the nested array - now each row has its own array.
        cells = rows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
            .data(function(d) {
                return d;
            })
            .enter()
            .append("td")
            .text(function(d) {
                return d;
            })
    })

    console.log();



}
function setup2() {
    d3.select("#h1start").remove();
    var enterGroup;

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1100 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 100]);

    var z = d3.scale.category10();



    var countries = ["Australia", "Austria", "Brazil", "Canada", "China", "Czech Republic", "Denmark", "Finland",
        "France", "Germany", "Greece", 'Hungary', "India", "Indonesia", "Italy", "Japan", "Korea", "Netherlands", "Norway"
        , "Poland", "Portugal", "Russia", "Slovak Republic", "South Africa", "Spain", "Sweden", "Switzerland", "Turkey",
        "United Kingdom", "United States"];

    var colours = ["#736F6E", "#737CA1", "#000080", "#EDDA74", "#FFCBA4", "#F9966B", "#FF0000", "#FDD7E4",
        "#F660AB", "#4B0082", "#8D38C9", "#FFFF00", "#307D7E", "#7FFFD4", "#C2DFFF", "#000000", "#52D017", "#FFDB58", "#0020C2"
        , "#95B9C7", "#57FEFF", "#46C7C7", "#78866B", "#254117", "#FFF8DC", "#C68E17", "#493D26", "#C47451",
        "#7D0541", "#C48189"];

    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "bonSelectedSVG")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("ForestAreaEdited.csv", function(error, data) {
        if (error) throw error;
        // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
        // var seriesNames = ["ForestArea"]

        // Map the data to an array of arrays of {x, y} tuples.
        // var series = seriesNames.map(function(series) {
        //     return data.map(function(d) {
        //         return {x: +d.Year, y: +d[series]};
        //     });
        // });
        //var format = d3.time.format("%Y");
        // format.parse("2011-01-01"); // returns a Date
        // format(new Date(2011, 0, 1));
        var parseTime = d3.time.format("%Y");

        data.forEach(function(d) {
            d.EPS = +d.EPS;
            d.ForestArea= +d.ForestArea;
            d.Year = parseTime(new Date(d.Year));//+d.Year;
            d.Country = d["Country"];
        });

        // Compute the scales’ domains.
        x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.EPS; })).nice();
        // y.domain(d3.extent(d3.merge(data), function(d) { return d.ForestArea; })).nice();

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        // Add the points!
        // svg.selectAll(data)
        enterGroup = svg.selectAll("g.series")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function(d) {
                return "series";
            } );

        enterGroup
            .append("circle")
            .attr("class", "point")
            .attr("r", 4.5)
            .attr("stroke", "black")
            .attr("fill", function(d, i) { return z(i); })
            .attr("cx", function(d) {
                return x(d.Year);
            })
            .attr("cy", function(d) { return y(d.EPS); })
            .on('mouseover', onMouseOver)
            .on("mouseout", onMouseOut);


        var j = 0;
        for (var i = 0; i < countries.length; i++) {
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country == countries[i];
                })
                .style('fill', function (d, i) {
                    return colours[j];
                })
            j++;
        }

        enterGroup.selectAll("circle")
            .filter(function (d){
                return isNaN(d.EPS);
            })
            .style("opacity", "0");

        enterGroup.selectAll("circle")
            .filter(function (d){
                return d.Year == 2018;
            })
            .style("opacity", "0");

        enterGroup
            .append("title")
            .text(function(d) {return d.Country + ": " + d.EPS;});

        enterGroup.highlight = function(data, type){
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country == data.Country;
                })
                .attr("r", 8);
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country != data.Country && !isNaN(d.EPS) && d.Year != 2018;
                })
                .style("opacity", 0.2);
        };

        enterGroup.removeHighlight = function(data, type){
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country == data.Country;
                })
                .attr("r", 4.5);
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country != data.Country && !isNaN(d.EPS) && d.Year != 2018;
                })
                .style("opacity", 1);

        };

        enterGroup.resetHighlights = function(){
            enterGroup.selectAll("circle")
                .attr("class", "default")
                .attr("r", 4.5)
                .style("opacity", 1);
        }

    });

    function onMouseOver(data, type){
        if (!type){
            type = "default";
        }
        // don't change its class if the object is currently selected by a Brush
        if (d3.select(this).attr("class") === "isBrushed"){
            type = "isBrushed";
        }

        enterGroup.highlight(data, type);
    }

    function onMouseOut(data, type){
        if (!type){
            type = "default";
        }
        // don't change its class if the object is currently selected by a Brush
        if (d3.select(this).attr("class") === "isBrushed"){
            type = "isBrushed";
        }

        enterGroup.removeHighlight(data, type);
    }
}
function setup() {
    d3.select("#h1start").remove();
    var enterGroup;


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1100 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 100]);

    var z = d3.scale.category10();



    var countries = ["Australia", "Austria", "Brazil", "Canada", "China", "Czech Republic", "Denmark", "Finland",
        "France", "Germany", "Greece", 'Hungary', "India", "Indonesia", "Italy", "Japan", "Korea", "Netherlands", "Norway"
        , "Poland", "Portugal", "Russia", "Slovak Republic", "South Africa", "Spain", "Sweden", "Switzerland", "Turkey",
        "United Kingdom", "United States"];

    var colours = ["#736F6E", "#737CA1", "#000080", "#EDDA74", "#FFCBA4", "#F9966B", "#FF0000", "#FDD7E4",
        "#F660AB", "#4B0082", "#8D38C9", "#FFFF00", "#307D7E", "#7FFFD4", "#C2DFFF", "#000000", "#52D017", "#FFDB58", "#0020C2"
        , "#95B9C7", "#57FEFF", "#46C7C7", "#78866B", "#254117", "#FFF8DC", "#C68E17", "#493D26", "#C47451",
        "#7D0541", "#C48189"];

    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "bonSelectedSVG")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("ForestAreaEdited.csv", function(error, data) {
        if (error) throw error;
        // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
        // var seriesNames = ["ForestArea"]

        // Map the data to an array of arrays of {x, y} tuples.
        // var series = seriesNames.map(function(series) {
        //     return data.map(function(d) {
        //         return {x: +d.Year, y: +d[series]};
        //     });
        // });
        //var parseTime = d3.timeParse("%Y");
        var parseTime = d3.time.format("%Y");

        data.forEach(function(d) {
           d.EPS = +d.EPS;
           d.ForestArea= +d.ForestArea;
           d.Year = parseTime(new Date(d.Year));
           d.Country = d["Country"];
        });


        // Compute the scales’ domains.
        x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.ForestArea; })).nice();
        // y.domain(d3.extent(d3.merge(data), function(d) { return d.ForestArea; })).nice();

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        // Add the points!
        // svg.selectAll(data)
        enterGroup = svg.selectAll("g.series")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function(d) {
                return "series";
            } );

        enterGroup
            .append("circle")
            .attr("class", "point")
            .attr("r", 4.5)
            .attr("stroke", "black")
            .attr("fill", function(d, i) { return z(i); })
            .attr("cx", function(d) {
                return x(d.Year);
            })
            .attr("cy", function(d) { return y(d.ForestArea); })
            .on('mouseover', onMouseOver)
            .on("mouseout", onMouseOut);


            var j = 0;
            for (var i = 0; i < countries.length; i++) {
                enterGroup.selectAll("circle")
                    .filter(function (d) {
                        return d.Country == countries[i];
                    })
                    .style('fill', function (d, i) {
                        return colours[j];
                    })
                j++;
            }

            enterGroup.selectAll("circle")
                .filter(function (d){
                    return d.Year == "2018";
                })
                .style("opacity", "0");

            enterGroup.selectAll("circle")
            .filter(function (d){
                return d.Year == 2018;
            })
            .style("opacity", "0");

        enterGroup
            .append("title")
            .text(function(d) {return d.Country + ": " + d.ForestArea;});

        enterGroup.highlight = function(data, type){
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country == data.Country;
                })
                .attr("r", 8);
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country != data.Country && !isNaN(d.ForestArea) && d.Year != 2018;
                })
                .style("opacity", 0.2);
        };

        enterGroup.removeHighlight = function(data, type){
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country == data.Country;
                })
                .attr("r", 4.5);
            enterGroup.selectAll("circle")
                .filter(function (d) {
                    return d.Country != data.Country && !isNaN(d.ForestArea) && d.Year != 2018;
                })
                .style("opacity", 1);

        };

        enterGroup.resetHighlights = function(){
            enterGroup.selectAll("circle")
                .attr("class", "default")
                .attr("r", 4.5)
                .style("opacity", 1);
        }

    });

    function onMouseOver(data, type){
        if (!type){
            type = "default";
        }
        // don't change its class if the object is currently selected by a Brush
        if (d3.select(this).attr("class") === "isBrushed"){
            type = "isBrushed";
        }

        enterGroup.highlight(data, type);
    }

    function onMouseOut(data, type){
        if (!type){
            type = "default";
        }
        // don't change its class if the object is currently selected by a Brush
        if (d3.select(this).attr("class") === "isBrushed"){
            type = "isBrushed";
        }

        enterGroup.removeHighlight(data, type);
    }
}
