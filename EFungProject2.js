
var policyview;
var forestview;

window.onload = function() {
    setup3();
    var reloading = sessionStorage.getItem("reloading");
    var reloading2 = sessionStorage.getItem("reloading2");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        setup();
        policyview = false;
        forestview = true;
    }
    if (reloading2) {
        sessionStorage.removeItem("reloading2");
        setup2();
        forestview = false;
        policyview = true;
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
    var Tooltip = d3.select("#vis")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    d3.select("#vis").append("h1")
        .attr("text-anchor", "middle")
        .attr("id", "h1start")
        .style("font-size", "24px")
        .text("Click a button to start the visualization");


    var dataset = [];
    var datasetraw = [];

    d3.csv('ForestAreaEdited.csv',function (d) {

        d.forEach(function(d) {
            d.EPS = +d.EPS;
            d.ForestArea= +d.ForestArea;
            d.Year = +d.Year;
            //d.Country = +d["Country"];
            d.EPIR = +d.EPIR;
            d.EH = +d.EH;
            d.EV = +d.EV;
        });

        datasetraw = d.map(function(d) {
            if (d.Year > 2017) {
                return [ d["Country"], d.EPIR];
            }
        });

        dataset = datasetraw.filter(function( element ) {
            return element !== undefined;
        });

        var table = d3.select("#vis2").append("table");
        var header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(["Country", "EPI Ranking*"])
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
            d3.selectAll("td").on("mouseover", function(d) {
                //highlight table
                console.log(this.parentNode);
                d3.select(this.parentNode)
                    .style("background-color", "darkturquoise");
                var legendCount = this;
                if (forestview) {
                    d3.selectAll("circle")
                        .filter(function (d) {
                            return legendCount.innerText != d.Country && !isNaN(d.ForestArea) && d.Year != 2018; //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                        })
                    .style("opacity", 0.2);
                }
                else if (policyview) {
                    d3.selectAll("circle")
                        .filter(function (d) {
                            return legendCount.innerText != d.Country && !isNaN(d.EPS) && d.Year != 2018; //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                        })
                    .style("opacity", 0.2);
                }
                d3.selectAll("circle")
                    .filter(function (d) {
                        return legendCount.innerText == d.Country && d.Year != 2018;
                    })
                    .attr("r", 8)
                    .style("opacity", 1);
                if (policyview) {
                    d3.selectAll("circle")
                        .filter(function (d) {
                            return isNaN(d.EPS); //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                        })
                        .style("opacity", 0);
                }
            // Tooltip.style("opacity", 1)
            //         .style("stroke", "black")
            //         .style("opacity", 1)
            //         .html("Additional information: <br> Country: " + this.innerText + "<br>Environmental Health: ")
            //         .style("left", (d3.mouse(this)[0]+70) + "px")
            //         .style("top", (d3.mouse(this)[1]) + "px");
            })
        d3.selectAll("td").on("mouseout", function(d){
            d3.select(this.parentNode)
                .style("background-color", "white");
            var legendCount = this;
            if (forestview) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return legendCount.innerText != d.Country && !isNaN(d.ForestArea) && d.Year != 2018; //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                    })
                    .style("opacity", 1);
            }
            else if (policyview) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return legendCount.innerText != d.Country && !isNaN(d.EPS) && d.Year != 2018; //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                    })
                    .style("opacity", 1);
            }
            d3.selectAll("circle")
                .filter(function (d) {
                    return legendCount.innerText == d.Country && d.Year != 2018;
                })
                .attr("r", 4.5)
                .style("opacity", 1);
            if (policyview) {
                d3.selectAll("circle")
                    .filter(function (d) {
                        return isNaN(d.EPS); //&& !isNaN(d.ForestArea) && !isNaN(d.EPS) && d.Year != 2018;
                    })
                    .style("opacity", 0);
            }
            // Tooltip
            //     .style("opacity", 0)
            // d3.select(this)
            //     .style("stroke", "none")
            //     .style("opacity", 0.8);
            // if (d3.select(this).attr("class") === "isBrushed"){
            //     type = "isBrushed";
            // }
            //d.style("background", "darkturquoise");
        })
        d3.select("#vis2").append("p")
            .attr("text-anchor", "middle")
            .attr("id", "pSide")
            .style("font-size", "12px")
            .text("*EPI is the Environmental Performance Index");
    });

}
//Policy
function setup2() {
    d3.select("#h1start").remove();
    d3.select("h2FTitle").remove();
    d3.select("h2PTitle").remove();
    d3.select("#vis").append("h2")
        .attr("text-anchor", "middle")
        .attr("id", "h2PTitle")
        .style("font-size", "24px")
        .text("Environmental Policy Stringency Index of Countries Over Time");


    var enterGroup;

    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 610 - margin.top - margin.bottom;

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
        //var parseTime = d3.time.format("%Y");

        data.forEach(function(d) {
            d.EPS = +d.EPS;
            d.ForestArea= +d.ForestArea;
            d.Year = d.Year;
            d.Country = d["Country"];
        });
        // Compute the scales’ domains.
        x.domain([1989,2017]).clamp(true);
        //x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.EPS; })).nice();
        // y.domain(d3.extent(d3.merge(data), function(d) { return d.ForestArea; })).nice();

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Year");

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Policy Stringency Index");

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

        enterGroup.highlight = function(data, type) {
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
            // select table element
            var tdElem = d3.selectAll("td");
            for (var i = 0; i < 60; i++) {
                    tdElem.filter(function (d) {
                        if (tdElem[0][i].innerText == data.Country) {
                            d3.select(tdElem[0][i])
                                .style("background-color","darkturquoise");
                            d3.select(tdElem[0][i+1])
                                .style("background-color","darkturquoise");
                        }
                        return;
                    })
            }

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
            var tdElem = d3.selectAll("td");
            for (var i = 0; i < 60; i++) {
                tdElem.filter(function (d) {
                    if (tdElem[0][i].innerText == data.Country) {
                        d3.select(tdElem[0][i])
                            .style("background-color","white");
                        d3.select(tdElem[0][i+1])
                            .style("background-color","white");
                    }
                    return;
                })
            }

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
//Forest
function setup() {
    d3.select("#h1start").remove();
    d3.select("h2FTitle").remove();
    d3.select("h2PTitle").remove();
    d3.select("#vis").append("h2")
        .attr("text-anchor", "middle")
        .attr("id", "h2FTitle")
        .style("font-size", "24px")
        .text("Forest Area (%) of Land Area of Countries Over Time");
    var enterGroup;


    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 610 - margin.top - margin.bottom;

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
        //var parseTime = d3.time.format("%Y");

        data.forEach(function(d) {
           d.EPS = +d.EPS;
           d.ForestArea= +d.ForestArea;
           d.Year = d.Year;
           d.Country = d["Country"];
        });


        // Compute the scales’ domains.
        x.domain([1989,2017]).clamp(true);
        //x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.ForestArea; })).nice();
        // y.domain(d3.extent(d3.merge(data), function(d) { return d.ForestArea; })).nice();

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")));

        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Year");

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Forest Area (%)");

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
            var tdElem = d3.selectAll("td");
            for (var i = 0; i < 60; i++) {
                tdElem.filter(function (d) {
                    if (tdElem[0][i].innerText == data.Country) {
                        d3.select(tdElem[0][i])
                            .style("background-color","darkturquoise");
                        d3.select(tdElem[0][i+1])
                            .style("background-color","darkturquoise");
                    }
                    return;
                })
            }
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
            var tdElem = d3.selectAll("td");
            for (var i = 0; i < 60; i++) {
                tdElem.filter(function (d) {
                    if (tdElem[0][i].innerText == data.Country) {
                        d3.select(tdElem[0][i])
                            .style("background-color","white");
                        d3.select(tdElem[0][i+1])
                            .style("background-color","white");
                    }
                    return;
                })
            }

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
