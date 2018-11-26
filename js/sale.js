/**
 * Created by yevheniia on 21.11.18.
 */
var rect1 = document.getElementById("phantom").getBoundingClientRect();

var chartWidth = rect1.width,
    chartHeight = 150,
    chartMargin = { top: 30, right: 0, bottom: 40, left: 40};



var parseDate = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%b");


var x = d3.scaleTime()
    .range([0, chartWidth]);

var y = d3.scaleLinear()
    .range([chartHeight, 0]);

var yAx = d3.axisLeft()
    .scale(y)
    .ticks(5);

var xAx = d3.axisBottom()
    .scale(x)
    .tickSize(-chartHeight)
    .ticks(9)
    .tickFormat(formatTime);

var valueline = d3.line()
    .defined(function(d) {
        return d.pinkLine !== 0;
    })
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) { return y(d.pinkLine);  });


var valuelineOld = d3.line()
    .defined(function(d) {
        return d.whiteDashed === d.whiteDashed;
    })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.whiteDashed); });

d3.csv("data/bf.csv", function(error, dataset){
//   d3.csv("data/bf_comfy.csv", function(error, dataset){


        dataset.forEach(function (d) {
        d.pinkLine = +d.pinkLine;
        d.whiteDashed = +d.whiteDashed;
        d.date = parseDate(d.date)
    });


    dataset = dataset.sort(function(a, b) {
        return a.date - b.date;

    });


    var dataset1 = d3.nest()
        .key(function(d) { return d.bigGat; })
        .entries(dataset);

    x.domain([parseDate('2018-04-15'), parseDate('2018-12-30')]);
    y.domain([0, 6]);

    var buyMeChart = d3.select("#sale")
        .selectAll("svg")
        .data(dataset1)
        .enter()
        .append("svg")
        .attr("class", function (d, i) {
            return "svg-" + i;
        })
        .attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", chartHeight + chartMargin.bottom + chartMargin.top)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

    buyMeChart.append("g").attr("id", "yAxisG").attr("class", "axis").call(yAx);
    buyMeChart.append("g").attr("id", "xAxisG").attr("class", "axis").attr("transform", "translate(0," + chartHeight + ")")
        .call(xAx);
    d3.selectAll("path.domain").remove();

    buyMeChart.append('path')
        .attr("class", "line")
        .attr("d", function(d) {
            return valueline(d.values);
        });

    buyMeChart.append('path')
        .attr("class", "lineOld")
        .attr("d", function(d) {
            return valuelineOld(d.values);
        });


        var left = x(new Date("2018-11-18"));
        var right = x(new Date("2018-11-25")); //one more day
        var wid = right - left;

    buyMeChart.append("rect")
            .attr("x", left)
            .attr("width", wid)
            .attr("height", chartHeight)
            .attr("fill", "yellow")
            .attr("opacity", "0.05");

        buyMeChart.append("text")
            .attr("x", 0)
            .attr("y", 0 - (chartMargin.top / 2))
            .attr("text-anchor", "left")
            .style("font-size", "12px")
            .attr("fill", "white")
            .text(function (d) {
            return d.key
        });

});