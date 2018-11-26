/**
 * Created by yevheniia on 24.11.18.
 */

d3.csv("data/range.csv", function(error, myRange) {

    var width = 900,
        height = 400;

    const margin = {top: 40, right: 10, bottom: 10, left: 10};

    // var format = d3.format(",d");

    var colors = ["#D7D7D7", '#ff36ad'];

    var color = d3.scaleOrdinal()
        .range(colors);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true);

     var root = stratify(myRange)
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    const tree = treemap(root);

    const div = d3.select("#area-chart").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px")
        ;

        var node = div.datum(root).selectAll(".node")
            .data(tree.leaves())
            .enter().append("div")
            .attr("class", "node")
            .attr("title", function(d) { return d.id + "\n" + d.value; })
            .style("left", function(d) { return d.x0 + "px"; })
            .style("top", function(d) { return d.y0 + "px"; })
            .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            .style("height", function(d) { return d.y1 - d.y0 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    var nodeLabel = node.append("div")
            .attr("class", "node-label")
            .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n"); })


    var nodeValue = node.append("div")
            .attr("class", "node-value")
            .text(function(d) { return d.value; });




    function redrawToReal() {
        var newRoot = stratify(myRange)
            .sum(function(d) { return d.valueReal; })
            .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

        var node = div.datum(newRoot).selectAll(".node")
            .data(tree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { return d.id + "\n" + d.value; })
            .style("left", function(d) { return d.x0 + "px"; })
            .style("top", function(d) { return d.y0 + "px"; })
            .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            .style("height", function(d) { return d.y1 - d.y0 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })


        var nodeValue = div.datum(newRoot).selectAll(".node-value")
            .data(tree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) { return d.value; });


        var nodeLabel = div.datum(newRoot).selectAll(".node-label")
            .data(tree.leaves());

        nodeLabel.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            });
    }


    function redrawToMin() {
        var newRoot = stratify(myRange)
            .sum(function(d) { return d.valueMin; })
            .sort(function(a, b) { return b.height - a.height || b.valueMin - a.valueMin; });

        var node = div.datum(newRoot).selectAll(".node")
            .data(tree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { return d.id + "\n" + d.value; })
            .style("left", function(d) { return d.x0 + "px"; })
            .style("top", function(d) { return d.y0 + "px"; })
            .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            .style("height", function(d) { return d.y1 - d.y0 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })


        var nodeValue = div.datum(newRoot).selectAll(".node-value")
            .data(tree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) { return d.value; });


        var nodeLabel = div.datum(newRoot).selectAll(".node-label")
            .data(tree.leaves());

        nodeLabel.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            });
    }

    function redrawToShop() {

        var newRoot = stratify(myRange)
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        var node = div.datum(newRoot).selectAll(".node")
            .data(tree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { return d.id + "\n" + d.value; })
            .style("left", function(d) { return d.x0 + "px"; })
            .style("top", function(d) { return d.y0 + "px"; })
            .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            .style("height", function(d) { return d.y1 - d.y0 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })


        var nodeValue = div.datum(newRoot).selectAll(".node-value")
            .data(tree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) { return d.value; });


        var nodeLabel = div.datum(newRoot).selectAll(".node-label")
            .data(tree.leaves());

        nodeLabel.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            });
    }




    $("#redraw").on("click", function() {
        redrawToReal() ; });

    $("#redrawToMin").on("click", function() {
        redrawToMin() ; });

    $("#redrawToShop").on("click", function() {
        redrawToShop() ; });

    });




    function type(d) {
        d.value = +d.value;
        return d;
    }





    // var yScale = d3.scaleLinear()
    //     .domain([0, d3.max(myRange)])
    //     .range([0, scrollChartHeight]);
    //
    // var yAxisScale = d3.scaleLinear()
    //     .domain([d3.min(myRange), d3.max(myRange)])
    //     .range([scrollChartHeight - yScale(d3.min(myRange)), 0 ]);
    // var yAxis = d3.axisLeft(yScale)
    //     // .scale()
    //     .tickSize(6)
    //     .tickFormat(function (d) {
    //          var mapper = {
    //             "-102,-90":"90-100%",
    //             "-90,-80": "80-90%",
    //             "-80,-70": "70-80%",
    //             "-70,-60": "60-70%",
    //             "-60,-50": "50-60%",
    //             "-50,-40": "40-50%",
    //             "-40,-30": "30-40%",
    //             "-30,-20": "20-30%",
    //             "-20,-10": "10-20%",
    //             "Націнка 0-10%" : "Націнка 0-10%",
    //             "0,10": "0-10%",
    //             "10,20": "11-20%",
    //             "20,30": "21-30%",
    //             "30,40": "31-40%",
    //             "40,50": "41-50%",
    //             "50,60": "51-60%",
    //             "60,70": "61-70%",
    //             "70,80": "71-80%",
    //             "80,90": "81-90%",
    //             "Знижка 90% -100%": "Знижка 91-100%"
    //         };
    //         return mapper[d]
    //     });


    // var svg = d3.select('#area-chart')
    //     .append('svg')
    //     .attr('width', scrollChartWidth + scrollChartMargin.left + scrollChartMargin.right)
    //     .attr('height', scrollChartHeight + scrollChartMargin.top + scrollChartMargin.bottom)
    //     .append('g')
    //     .attr('transform', 'translate(' + scrollChartMargin.left + ',' + scrollChartMargin.top + ')');
    //
    //
    // svg.selectAll('.bar')
    //     .data(myRange)
    //     .enter()
    //     .append('rect')
    //     .attr("x", function(d) { return xScale(d.range); })
    //     .attr("width", 15)
    //     .attr("y", function(d) { return yScale(d.real); })
    //     .attr("height", function(d) { return Math.abs(yScale(d.real)); })
    //     .attr("fill", "pink");

    // svg.selectAll('.labels').
    // data(myRange)
    //     .enter()
    //     .append('text')
    //     .attr("class", function (d) {
    //         if (d.real >= 0) { return "labels label-pos"  }
    //         else { return "labels label-neg"  }
    //         })
    //     .attr('y', function (d) {return yScale(d.range) + 15;})
    //     .attr('x', function (d) {
    //         if (d.shop >= 0) { return xScale(d.shop) + 5;
    //         } else { return xScale(d.shop) - 5; }
    //     })
    //     .html(function(d) { return Math.abs(d.shop) });

    // svg.append('g').
    // attr('class', 'x axis').
    // attr('transform', 'translate(0,' + scrollChartHeight + ')').
    // call(xAxis);



    // var tickNegative = svg.append("g")
    //     .attr("class", "y axis")
    //     .attr("transform", "translate(" + xScale(0) + ",0)")
    //     .call(yAxis)
    //     .selectAll(".tick")
    //     .filter(function(d, i) { return myRange[i].real < 0; });
    // //
    // tickNegative.select('text')
    //     .attr('x', 9)
    //     .attr("y", 0)
    //     .attr("class", "tick-negative")
    //     .style('text-anchor', 'start');
    //
    // svg.selectAll(".tick-negative").style("display", "none");
    // svg.selectAll(".label-neg").style("display", "none");
    //
    //
    // svg.append("text")
    //     .attr("x", (scrollChartWidth / 2))
    //     .attr("y", 0 - (scrollChartMargin.top / 2))
    //     .attr("class", "svg-title")
    //     .style("font-family", "'Montserrat Alternates', sans-serif")
    //     .attr("text-anchor", "center")
    //     .style("font-size", "12px")
    //     .attr("fill", "white")
    //     .text("Знижки, які заявили магазини");


//     function redrawtoShop() {
//
//         var svg = d3.select('#scroll-chart svg');
//         svg.selectAll(".bar").transition()
//             .attr('x', function (d) { return xScale(Math.min(0, d.shop));})
//             .attr('width', function (d) { return Math.abs(xScale(d.shop) - xScale(0));});
//
//         svg.selectAll(".tick-negative").style("display", "none");
//         svg.selectAll(".label-neg").style("display", "none");
//
//         svg.selectAll(".labels")
//             .transition()
//             .attr('x', function (d) { return xScale(d.shop) + 5;  })
//             .text(function(d) { return Math.abs(d.shop) });
//
//         svg.select(".svg-title")
//             .text("Знижки, які заявили магазини")
//
//     }
//
//
//     function redrawtoReal() {
//         var svg = d3.select('#scroll-chart svg');
//         svg.selectAll(".bar").transition()
//             .attr('x', function (d) { return xScale(Math.min(0, d.real));})
//             .attr('width', function (d) { return Math.abs(xScale(d.real) - xScale(0));});
//
//         svg.selectAll(".tick-negative").style("display", "block");
//         svg.selectAll(".label-neg").style("display", "block");
//
//         svg.selectAll(".labels")
//             .transition()
//             .attr('x', function (d) {
//                 if (d.real >= 0) { return xScale(d.real) + 5;
//                 } else { return xScale(d.real) - 5; }
//             })
//             .text(function(d) { return Math.abs(d.real) });
//
//         svg.select(".svg-title")
//             .text("Реальні знижки і не тільки")
//     }
//
//
//     // якщо видно показуємо текст, якщо ні, ховаємо.
//     $( document ).ready( function() {
//         window.addEventListener('scroll', function(e) {
//             if( isOnScreen( $('#real'))) {
//                 redrawtoReal()
//             }
//         });
//     });
//
//
//     $( document ).ready( function() {
//         window.addEventListener('scroll', function(e) {
//             if( isOnScreen( $('#shop'))) {
//                 redrawtoShop()
//             }
//         });
//     });
//
// });
//
// function isOnScreen(elem) {
//     // if the element doesn't exist, abort
//     if (elem.length == 0) {
//         return;
//     }
//     var $window = $(window);
//     var viewport_top = $window.scrollTop();
//     var viewport_height = $window.height();
//     var viewport_bottom = viewport_top + (viewport_height/2);
//     var $elem = $(elem);
//     var top = $elem.offset().top;
//     var height = $elem.height();
//     var bottom = top + height;
//
//     return (top >= viewport_top && top < viewport_bottom) ||
//         (bottom > viewport_top && bottom <= viewport_bottom) ||
//         (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
// }

