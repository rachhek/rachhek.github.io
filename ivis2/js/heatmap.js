
var margin = { top: 10, right: 0, bottom: 10, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 40),
    gridHeight = Math.floor(height / 35),
    legendElementWidth = gridSize * 2,
    buckets = 9,
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
    //   days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    // days = [ 1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 ,  8 ],
    days = ["Afghanistan", "Argentina", "Australia", "Bangladesh", "Brazil", "Canada", "China", "Finland", "France",
        "Germany", "Hungary", "India", "Indonesia", "Japan", "North Korea", "South Korea",
        "Malaysia", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Pakistan",
        "Philippines", "Poland", "Portugal", "Russia", "Singapore", "South Africa",
        "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "United Kingdom", "United States"],
    //            times = ["1981", "1982", "1984", "1990", "1991", "1995", "1996", "1998", "1999", "2000", "2001", "2005", "2006", "2007", "2009", "2010", "2011", "2012", "2013"],
    times = [1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993,
        1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
        2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],

    //   times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
    datasets = ["gap_fertility_rate.csv", "heatmapdata_argentina.csv"
        , "heatmapdata_aus.csv",
        "heatmapdata_fin.csv",
        "heatmapdata_hun.csv", "heatmapdata_ind.csv"];

var svg = d3v3.select("#heatmapchart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("id", "heatmapsvg")
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-top", "-100px")
    .style("padding-top", "10px")
    .style("padding-left", "20px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridHeight; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); })
    .attr("font-size", 10);

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", function (d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function (d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var legendsvg = d3v3.select("#heatmaplegend").append("svg");

var heatmapChart = function (tsvFile, containerId) {

    var tooltipdiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



    d3v3.csv(tsvFile,
        function (d) {
            return {
                day: +d.day,
                hour: d.hour,
                value: +d.value
            };
        },
        function (error, data) {
            var colorScale = d3v3.scale.quantile()
                .domain([0, buckets - 1, d3v3.max(data, function (d) { return d.value; })])
                .range(colors);

            var cards = svg.selectAll(".hour")
                .data(data, function (d) { return d.day + ':' + d.hour; });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function (d) {
                    return (times.indexOf(d.day)) * gridSize;
                })
                .attr("y", function (d) {
                    return (days.indexOf(d.hour.toString())) * gridHeight;
                })
                .attr("rx", 2)
                .attr("ry", 2)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridHeight)
                .style("fill", colors[0])
                .on("mouseover", function (d) {
                    tooltipdiv.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltipdiv.html(d.value)
                        .style("left", (d3v3.event.pageX) + "px")
                        .style("top", (d3v3.event.pageY - 28) + "px");
                })
                ;

            cards.transition().duration(1000)
                .style("fill", function (d) { return colorScale(d.value); });

            cards.select("title").text(function (d) { return d.value; });

            cards.exit().remove();

            var legend = legendsvg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function (d) { return d; });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) { return legendElementWidth/2 * i; })
                .attr("y", 50)
                .attr("width", legendElementWidth/2)
                .attr("height", gridSize / 2)
                .style("fill", function (d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function (d) { return "≥ " + Math.round(d); })
                .attr("x", function (d, i) { return legendElementWidth/2     * i; })
                .attr("y", 50 + gridSize)
                .style("font-size", "9px");

            legend.exit().remove();

        });
};

heatmapChart(datasets[0]);

var datasetpicker = d3v3.select("#dataset-picker").selectAll(".dataset-button")
    .data(datasets);

datasetpicker.enter()
    .append("input")
    .attr("value", function (d) { return "Dataset " + d })
    .attr("type", "button")
    .attr("class", "dataset-button")
    .on("click", function (d) {
        heatmapChart(d);
    });