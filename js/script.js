
var parseDate = d3.timeParse("%Y-%m-%d");

var margin = {top: 8, right: 30, bottom: 20, left: 40},
    width = 250 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(3);

// var area = d3.area()
//     .x(function(d) { return xScale(d.date); })
//     .y0(height)
//     .y1(function(d) { return yScale(d.price); });


var line = d3.line()
    .defined(function(d) { return d; })
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.price); });

var lineOld = d3.line()
    .defined(function(d) {
        return d.priceOld !== 0;
    })
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.priceOld); });



$('#mybut').on('click', function () {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/",
        data: {"text": "hi"}
    }).done(function(data) {
        debugger;
        console.log(data);
        $('#charts').find('svg').remove();

        data.forEach(function (d) {
            d.price = +d.price;
            d.priceOld = +d.priceOld;
            d.date = parseDate(d.date )
        });

        xScale.domain(d3.extent(data, function(d) { return d.date; }));
        yScale.domain([0,d3.max(data, function(d) {  return d.priceOld; })]);


        var products = d3.nest()
            .key(function(d) { return d.id; })
            .entries(data);


        var svg = d3.select("#charts").selectAll("svg")
                .data(products)
                .enter().append("svg")
                .style("margin-bottom", "10px")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;

        svg.append("path")
            .attr("class", "line")
            .attr("d", function(d) {return line(d.values); });

        svg.append("path")
            .attr("class", "lineOld")
            .attr("d", function(d) {return lineOld(d.values); });



        svg.append("g").attr("id", "yAxisG").call(yAxis);
        d3.selectAll("path.domain").remove();
        d3.selectAll("line").style("stroke", "silver");




    });
});


