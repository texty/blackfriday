/**
 * Created by yevheniia on 28.11.18.
 */
var parseDate = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%b");

var API_ROOT = 'http://api-x32.texty.org.ua';

$(document).ready(function () {



    // var svg = d3.selectAll("#scatter")
    //     .datum(function() {
    //         debugger;
                var viewBox = $("#scatter")[0].getAttribute("viewBox").split(" "),
                size = viewBox.slice(2),
                ww = size[0],
                hh = size[1],
                aspect = ww / hh;


    // window.addEventListener("resize", function() {
    //     svg.call(resize);
    // });

    // function resize(selection) {
    //     selection.style("height", function(d) {
    //         this.style.height = "auto";
    //         var rect = this.getBoundingClientRect(),
    //             height = rect.width / d.aspect;
    //         return isFinite(height)
    //             ? Math.ceil(height) + "px"
    //             : null;
    //     });
    // }



    var svg = d3.select("svg");
        // ww = +svg.attr("width"),
        // hh = +svg.attr("height"),
        ww = 0.7 * ww;
        hh = 0.7 * hh;

    var margin = {top: 30, right: 30, bottom: 50, left:30};




    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // var svg = d3.select("#scatterplot").append("svg")
    //     .attr("width", ww)
    //     .attr("height", hh);


// create a clipping region
    var div = d3.select(".tooltip")
        .style("opacity", 1);

    


// create scale objects
    var xScale = d3.scaleLinear()
        .domain([-100, 100])
        .range([0, ww]);

    var yScale = d3.scaleLinear()
        .domain([-100, 100])
        .range([hh, 0]);


// create axis objects
    var xAxis = d3.axisTop(xScale)
        .ticks(10, "s")
        .tickSize(hh);

    var yAxis = d3.axisRight(yScale)
        .ticks(10, "s")
        .tickSize(ww);

// Draw Axis
    var gX = svg.append('g')
        .attr("class", "scatterX")
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + hh) + ')')
        .attr("transform", "translate(242, 945)rotate(-45)")
        // .attr("transform", "rotate(-45)")
        .call(xAxis);

    var gY = svg.append('g')
        .attr("class", "scatterY")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("transform", "translate(-200, 500)rotate(-45)")
        .attr("fill", "grey")
        .call(yAxis);



// Draw Datapoints
    var points_g = svg.append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("clip-path", "url(#clip)")
        .classed("points_g", true);

    points_g.attr("transform", "translate(-200, 500) rotate(-45)");
    // points_g.attr("transform", "rotate(-45)");

    var poly = [{"x":5, "y":5},
        {"x":5,"y":100},
        {"x":100,"y":100},
        {"x":100,"y":97},
        {"x":5,"y":2 }
    ];

    points_g.selectAll("polygon")
        .data([poly])
        .enter().append("polygon")
        .attr("points",function(d) {
            return d.map(function(d) {
                return [xScale(d.x),yScale(d.y)].join(",");
            }).join(" ");
        })
        .attr("stroke","black")
        .attr("opacity", 1)
        .attr("stroke-width",2);

    var swoopy = d3.swoopyDrag()
            .x(function(d){ return  xScale(d.sepalWidth)})
            .y(function(d){ return  yScale(d.sepalLength)})
            .draggable(false)
                .annotations(annotations);

    var swoopySel = svg.append('g')
        .attr("fill", "none")
        .call(swoopy);

    swoopySel.selectAll("path")
        .each(function(d) {
                d3.select(this)
                    .attr("stroke", function(d) {
                        return d.fill;
                    })//clear existing text

            });


    // swoopySel.selectAll('text')
    //     .each(function(d){
    //         d3.select(this)
    //             .text('')
    //             .attr("stroke", "none")
    //             .attr("fill", function (d) {
    //                 return d.fill;
    //             })
    //             .attr("font-size", function (d) {
    //                 return d.bigScreenSize;
    //             })//clear existing text
    //             .tspans(d3.wordwrap(d.text, d.wrap)); //wrap after 20 char
    //     });



    swoopySel.selectAll('text')
        .each(function(d){
            if(screen.width > 1500) {
                d3.select(this)
                    .text('')
                    .attr("stroke", "none")
                    .attr("fill", function (d) {
                        return d.fill;
                    })
                    .attr("font-size", function (d) {
                        return d.bigScreenSize;
                    })//clear existing text
                    .tspans(d3.wordwrap(d.text, d.wrap, d.betweenBig)); //wrap after 20 char
            }
            else  {
                d3.select(this)
                    .text('')
                    .attr("stroke", "none")
                    .attr("fill", function(d) {
                        return d.fill;
                    })
                    .attr("font-size", function(d) {
                        return d.size;
                    })//clear existing text
                    .tspans(d3.wordwrap(d.text, d.wrap, d.between)); //wrap after 20 char
            }
        });


    svg.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '-10 -10 20 20')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('path')
        // .attr("fill", function(d){ return d.fill})
        .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75');

    swoopySel.selectAll('path').attr('marker-end', function(d){
        if(d.marker === "yes"){
           return 'url(#arrow)'
        }

    });


    
    /*------------------------*/
    //точки і графіки до точок
    /*-------------------------*/

    d3.csv("data/scatterplot.csv", function (data) {
        data.forEach(function (d) {
            d.shop_discount = +d.shop_discount;
            d.real_discount = +d.real_discount;
        });



        var points = points_g.selectAll("circle").data(data);


        points = points.enter().append("circle")
                .attr("class", "circle_s")
                .attr('cx', function (d) {
                    return xScale(d.shop_discount)
                })
                .attr('cy', function (d) {
                    return yScale(d.real_discount)
                })
                // .attr("fill", function (d) {
                //     return color(d.bigGat)
                // })
                .attr("fill", function (d) {
                    if(d.bigGat === "Ноутбуки, планшети"|| d.bigGat === "Телефони, аксесуари"||
                        d.bigGat === "Побутова техніка"||d.bigGat === "Телвізори"){
                        return "#88d78e"
                    } else{
                        return "#FF80B3"
                    }

                })
                // .attr('stroke', "black")
                .attr('opacity', 0.9)
                .attr('r', 2)
                .on('click', function(d) {
                    //не малюємо точки, якщо маленький екран
                    if(screen.width < 850) {
                        return false
                    }
                    else {


                        var item = d.id;
                        var limit = 1;

                        div.style("display", "block")
                        // .html("<div id='tipDiv'><p>Ціна продажу - <span class='ct-chart-pink line'></span>Стара ціна - <span class='ct-chart-black line'></span></p></div>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px");

                        var spark = {series: [[8, 8, 8, 8, 8, 8, 8, 8, 5]]};

                        var sparkOptions = {
                            height: '1em',
                            width: '4ex',
                            showPoint: false,
                            fullWidth: true,
                            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
                            axisX: {showGrid: false, showLabel: false, offset: 0},
                            axisY: {showGrid: false, showLabel: false, offset: 0}
                        };
                        new Chartist.Line('.ct-chart-pink.line', spark, sparkOptions);
                        new Chartist.Line('.ct-chart-black.line', spark, sparkOptions);


                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            dataType: "json",
                            url: API_ROOT + "/blackfriday/api/object/" + item
                            // data: JSON.stringify({"categ": item, "limit": limit})
                        }).done(function (data) {
                            $('#tipDiv').find('svg#tip-svg').remove();

                            var theCase = data;

                            theCase.forEach(function (d) {
                                d.price = +d.price;
                                d.priceOld = +d.priceOld;
                                d.date = parseDate(d.date)
                            });


                            // var textBlockRect = document.getElementById("scroll-text").getBoundingClientRect();
                            var scrollChartMargin = {top: 30, right: 0, bottom: 40, left: 40},
                                scrollChartWidth = 250 - scrollChartMargin.left - scrollChartMargin.right,
                                scrollChartHeight = 200 - scrollChartMargin.top - scrollChartMargin.bottom;

                            var xScale = d3.scaleTime().range([0, scrollChartWidth]);
                            var yScale = d3.scaleLinear().range([scrollChartHeight, 0]);

                            var yAxis = d3.axisLeft().scale(yScale).ticks(5);

                            var xAxis = d3.axisBottom()
                                .scale(xScale)
                                .tickSize(-scrollChartHeight)
                                .ticks(9)
                                .tickFormat(formatTime);

                            xScale.domain([parseDate('2018-04-15'), parseDate('2018-12-30')]);
                            yScale.domain([0, d3.max(theCase, function (d) {
                                    if (d.priceOld > 0) {
                                        return d.priceOld;
                                    }
                                    else {
                                        return d.price;
                                    }
                                }
                            )]);

                            var line = d3.line()
                                .defined(function (d) {
                                    return d.price !== 0;
                                })
                                .x(function (d) {
                                    return xScale(d.date);
                                })
                                .y(function (d) {
                                    return yScale(d.price);
                                });

                            var lineOld = d3.line()
                                .defined(function (d) {
                                    return d.priceOld !== 0;
                                })
                                .x(function (d) {
                                    return xScale(d.date);
                                })
                                .y(function (d) {
                                    return yScale(d.priceOld);
                                });

                            d3.select("#closeX")
                                .attr("aria-label", "Закрити графік")
                                .on("click", function () {
                                    $('#tipDiv').find('svg#tip-svg').remove();
                                    div.style("display", "none")
                                });

                            var svg = d3.select("#tipDiv")
                                    .append("svg")
                                    .attr("id", "tip-svg")
                                    .style("margin-bottom", "10px")
                                    .attr("width", scrollChartWidth + scrollChartMargin.left + scrollChartMargin.right)
                                    .attr("height", scrollChartHeight + scrollChartMargin.top + scrollChartMargin.bottom)
                                    // .attr('class', "small-multiples")
                                    .append("g")
                                    .attr("transform", "translate(" + scrollChartMargin.left + "," + scrollChartMargin.top + ")")
                                ;

                            svg.append("g").attr("class", "axis-s").call(yAxis);
                            svg.append("g").attr("class", "axis-s").attr("transform", "translate(0," + scrollChartHeight + ")")
                                .call(xAxis);
                            d3.selectAll("path.domain").remove();


                            svg.append("path")
                                .attr("class", "scrollChartLine")
                                .attr("d", function () {
                                    return line(theCase);
                                });

                            svg.append("path")
                                .attr("class", "scrollChartLineOld")
                                .attr("d", function () {
                                    return lineOld(theCase);
                                });


                            var left = xScale(new Date("2018-11-18"));
                            var right = xScale(new Date("2018-11-25")); //one more day
                            var wid = right - left;
                            svg.append("rect")
                                .attr("x", left)
                                .attr("width", wid)
                                .attr("height", scrollChartHeight)
                                .attr("fill", "yellow")
                                .attr("opacity", "0.05");

                            svg.append("text")
                            // .attr("id", "scrollChartTitle")
                                .attr("x", -20)
                                .attr("y", -10)
                                .attr("text-anchor", "left")
                                .style("font-size", "9px")
                                .attr("fill", "black")
                                .text(function () {
                                    return theCase[0].name
                                });

                        });
                    }
    });

        // const template = $('#tipDiv')[0];
        //
        // // tippy('.circle_s',{
        // //     html: '.tooltip'
        // // });
        //
        // tippy('.circle_s', {
        //     allowHTML: true,
        //     content: template,
        //     delay: 100,
        //     // arrow: true,
        //     // arrowType: 'round',
        //     size: 'large',
        //     duration: 500,
        //     animation: 'scale'
        // });

        /*------------------------*/
        //навігація
        /*-------------------------*/

        points_g.append("line")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", ww + 50)
            .attr("y2", yScale(0))
            .attr("stroke","black")
            .attr("stroke-width",1);



        svg.append("text")
            .attr("pointer-events", "none")
            .attr("x",xScale(40))
            .attr("y", yScale(-18))
            .attr("transform", "translate(380,-375)rotate(45)")
            .attr("font-size", "10px")
            .text("Знижка,%");


        svg.append("text")
            .attr("pointer-events", "none")
            .attr("x",xScale(215))
            .attr("y", yScale(-18))
            .attr("transform", "translate(75,-680)rotate(45)")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text("Націнка,%");


        //розмальовуємо негативну шкалу в червоний
       d3.selectAll("g.tick > text")
            .each(function() {
              var tickValue =  d3.select(this).html();
                  if(Number(tickValue) < 0){
                      d3.select(this).html(Math.abs(tickValue))
                  }
            });




        /*------------------------*/
        //zoom
        /*-------------------------*/

// Pan and zoom
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", ww)
            .attr("height", hh);

        var zoom = d3.zoom()
            .filter(function () {
                return d3.event.ctrlKey;
            })
            .scaleExtent([.5, 20])
            .extent([[0, 0], [ww, hh]])
            .on("zoom", zoomed);


        svg.append("rect")
            .attr("width", ww)
            .attr("height", hh)
            .style("fill", "none")
            .style("pointer-events", "none")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom)
            .on("wheel", function () {
                d3.event.preventDefault();
            });

        var dataL = 0;
        var offset = 100;


        function zoomed() {
// create new scale ojects based on event
                var new_xScale = d3.event.transform.rescaleX(xScale);
                var new_yScale = d3.event.transform.rescaleY(yScale);
// update axes
                gX.call(xAxis.scale(new_xScale));
                gY.call(yAxis.scale(new_yScale));
                points.data(data)
                    .attr('cx', function (d) {
                        return new_xScale(d.shop_discount)
                    })
                    .attr('cy', function (d) {
                        return new_yScale(d.real_discount)
                    });



            points_g.select(".bf_line")
                .attr("x1", new_xScale(0))
                .attr("y1", new_yScale(0))
                .attr("x2", new_xScale(100))
                .attr("y2", new_yScale(100))
        }

    });
});




    // function redrawTipChart(id) {
    //     var newCase = examples.filter(function(d){
    //         return d.id === id ;  });
    //
    //     yScale.domain([0, d3.max(newCase, function (d) {
    //         if(d.priceOld > 0 ) { return d.priceOld; }
    //         else { return d.price * 1.3; }})]);
    //
    //
    //     svg.select("#yAxisG")
    //         .transition()
    //         .duration(300)
    //         .call(yAxis);
    //
    //
    //     // var svg = d3.select('#scroll-chart svg');
    //     svg.select(".scrollChartLine")
    //         .transition()
    //         .duration(300)
    //         .attr("d", function () {
    //             return line(newCase);
    //         });
    //
    //
    //     svg.select(".scrollChartLineOld")
    //         .transition()
    //         .duration(300)
    //         .attr("d", function () {
    //             return lineOld(newCase);
    //         });
    //
    //
    //     svg.select("#scrollChartTitle")
    //         .html(function () {
    //             return newCase[0].name
    //         });
    // };



var annotations = [
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "M24,203C3,181,-1,154,13,111",
        "wrap": 5,
        "text": "Дорожче, ніж зазвичай",
        "fill":"black",
        "size":"16px",
        "between": 18,
        "betweenBig": 13,
        "bigScreenSize":"10px",
        "marker":"yes",
        "textOffset": [
            36,
            172
        ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        // "path": "M116,-186C112,-144,90,-115,58,-106",
        "path": "M25,-209C-9,-188,-26,-163,-26,-113",
        "wrap": 20,
        "text": "Нечесні знижки",
        "fill":"black",
        "size":"16px",
        "bigScreenSize":"10px",
        "marker":"yes",
        "textOffset": [
            36,-242
        ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "",
        "wrap": 20,
        "text": "Чесні знижки",
        "fill":"white",
        "size":"16px",
        "bigScreenSize":"10px",
        "marker":"yes",
        "textOffset": [
            -243,
            -72
        ]
    },

    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "0",
        "wrap": 30,
        "text": "Точки під цією лінією - товари з націнкою",
        "fill":"black",
        "size":"12px",
        "between": 15,
        "betweenBig": 11,
        "bigScreenSize":"8px",
        "marker":"no",
        "textOffset": [
            36,
            201
        ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "0",
        "wrap": 30,
        "text": "Фактична знижка менше за оголошену магазином",
        "fill":"black",
        "size":"12px",
        "between": 15,
        "betweenBig": 11,
        "bigScreenSize":"8px",
        "marker":"no",
        "textOffset": [
            36,
            -214
            ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "0",
        "wrap": 25,
        "text": "Заявлена знижка була суттєвою (від 5%) і не менше реальної",
        "fill":"white",
        "size":"12px",
        "between": 15,
        "betweenBig": 11,
        "bigScreenSize":"8px",
        "marker":"no",
        "textOffset": [
            -242,-42
        ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "",
        "wrap": 10,
        "text": "Вісь Y - фактична знижка, %",
        "fill":"grey",
        "size":"9px",
        "between": 11,
        "betweenBig": 8,
        "bigScreenSize":"6px",
        "marker":"no",
        "textOffset": [
            361,115
        ]
    },
    {
        "sepalWidth": 2.3,
        "sepalLength": 2,
        "path": "",
        "wrap": 5,
        "text": "Вісь X - заявлена магазином знижка, %",
        "fill":"grey",
        "size":"9px",
        "between": 11,
        "betweenBig": 8,
        "bigScreenSize":"6px",
        "marker":"no",
        "textOffset": [
            -312,-153
        ]
    },
    {
        "sepalWidth": 4.4,
        "sepalLength": 5.7,
        "marker":"yes",
        "fill":"black",
        "path": "M125,-61L81,-107",
        "text": "",
        "textOffset": [
            -83,
            -65
        ]
    },
    {
        "sepalWidth": 4.4,
        "sepalLength": 5.7,
        "path": "M180,-7L228,41",
        "fill":"black",
        "marker":"yes",
        "text": "",
        "textOffset": [
            -83,
            -65
        ]
    }

];


// var sm_annotations = [
//     {
//         "sepalWidth": 2.3,
//         "sepalLength": 2,
//         "path": "M136,2L176,41",
//         "wrap": 10,
//         "text": "Стара ціна",
//         "fill":"black",
//         "size":"10px",
//         "marker":"yes",
//         "textOffset": [
//             36,
//             156
//         ]
//     },
//     {
//         "sepalWidth": 2.3,
//         "sepalLength": 2,
//         "path": "M104,-28L63,-68",
//         "wrap": 20,
//         "text": "Ціна продажу",
//         "fill":"black",
//         "size":"10px",
//         "marker":"yes",
//         "textOffset": [
//             36,-242
//         ]
//     }
// ]


