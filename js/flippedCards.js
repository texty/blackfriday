/**
 * Created by yevheniia on 12.11.18.
 */

$('.buy-button').on("click", function(){
    var targetSvg = $(this)
        .closest(".prod")
        .find('.buyMeChartSvg');

    var targetImg = $(this)
        .closest(".prod")
        .find('img');

    targetSvg.css("display", "block");
    targetImg.css("display", "none");
});

var el = $(".prod img")[0].getBoundingClientRect();
console.log();
console.log();

var chartWidth =  el.width,
    chartHeight = el.height,
    chartMargin = { top: 30, right: 0, bottom: 40, left: 40};


//
// var parseDate = d3.timeParse("%Y-%m-%d");
// var formatTime = d3.timeFormat("%B");
//
//
// var xScale = d3.scaleTime()
//     .range([0, width]);
//
// var yScale = d3.scaleLinear()
//     .range([height, 0]);
//
// var yAxis = d3.axisLeft()
//     .scale(yScale)
//     .ticks(5);
//
// var xAxis = d3.axisBottom()
//         .scale(xScale)
//         .tickSize(-height)
//         .ticks(9)
//         .tickFormat("")
//     ;
//
// var line = d3.line()
//     .defined(function(d) {
//         return d.price !== 0;
//     })
//     .x(function(d) { return xScale(d.date); })
//     .y(function(d) { return yScale(d.price); });
//
// var lineOld = d3.line()
//     .defined(function(d) {
//         return d.priceOld !== 0;
//     })
//     .x(function(d) { return xScale(d.date); })
//     .y(function(d) { return yScale(d.priceOld); });
//
// var bisectDate = d3.bisector(function(d) { return d.date; }).left;
//
// var categ = "bags";
//
var buyMeChart = d3.selectAll(".buyMeChart")
    // .data(products)
    // .enter()
    .append("svg")
    .attr("class", "hidden buyMeChartSvg")
    .attr("width", el.width - chartMargin.left)
    .attr("height", el.height)
    .append("g")
    .attr("transform", "translate(" + chartMargin.left + ", 0)");

buyMeChart.append("rect")
    .attr("width", el.width)
    .attr("height", el.height)
    .attr('fill', "red");

// buyMeChart.append("path")
//     .attr("class", "line")
//     .attr("d", function(d) {return line(d.values); });
//
// buyMeChart.append("path")
//     .attr("class", "lineOld")
//     .attr("d", function(d) {return lineOld(d.values); });