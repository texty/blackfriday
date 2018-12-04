
/* ---------------------------------------------------------
 ---- Create Select MENU for category and charts amount ----
 ----------------------------------------------------------- */

var API_ROOT = 'https://api-x32.texty.org.ua';

//категорії
var dataCat = [
    { value: "", text: '--- Оберіть категорію товару ---'},
    { value: "Ноутбуки, планшети", text: 'Ноутбуки, планшети'},
    { value: "Побутова техніка", text: 'Побутова техніка'},
    { value: "Телевізори", text: 'Телевізори'},
    { value: "Телефони, аксесуари", text: 'Телефони, аксесуари'},
    { value: "Одяг", text: 'Одяг'},
    { value: "Сумки", text: 'Сумки'}


];

//limit sqlite
var dataLim = [
    { value: "10", text: '10 графіків' },
    { value: "25", text: '25'},
    { value: "50", text: '50'},
    { value: "100", text: '100'}
];

var select = d3.select('#MyDropDownList')
    .append('select')
    .attr('class','select')
    .on('change',onchange);

select
    .selectAll('option')
    .data(dataCat).enter()
    .append('option')
    .attr("value", function (d) {return d.value })
    .text(function (d) { return d.text; });

var select2 = d3.select('#MyDropDownList2')
    .append('select')
    .attr('class','select')
    .on('change', onchangeLim);

select2
    .selectAll('option')
    .data(dataLim).enter()
    .append('option')
    .attr("value", function (d) {return d.value })
    .text(function (d) { return d.text; });

var categ;
var limit = 10;

function onchange() {
    $('#mybut').html('Показати');
    selectValue = $('option:selected', this).attr('value');
    categ = selectValue;

};

function onchangeLim() {
    $('#mybut').html('Показати');
    selectValue = $('option:selected', this).attr('value');
    limit = selectValue;
};



/* -------------------------
   ---- SMALL MULTIPLES ----
   ------------------------- */

var parseDate = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%b");

var smTooltip = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

$('#mybut').on('click', function () {
    $('#mybut').html('<b>Ще графічків</b>');
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        url: API_ROOT + "/blackfriday/api/random10/" + categ + "/" + limit
        // data: JSON.stringify({ "categ": categ, "limit": limit })
    }).done(function(data) {
        // $('html, body').animate({
        //     scrollTop: $("#selectButtons").offset().top
        // }, 'slow');
        $('#charts').find('svg').remove();

        var margin = {top: 30, right: 0, bottom: 40, left: 50},
            width = 220 - margin.left - margin.right,
            height = 220 - margin.top - margin.bottom;

        var xScale = d3.scaleTime()
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .range([height, 0]);

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat( function(d) { return "₴ " + d  } );

        var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickSize(-height)
                .ticks(9)
                .tickFormat(formatTime);


        var line = d3.line()
            .defined(function(d) {
                return d.price !== 0;
            })
            .x(function(d) { return xScale(d.date); })
            // .y(function(d) { return yScale(d.price); })
            ;

        var lineOld = d3.line()
            .defined(function(d) {
                return d.priceOld !== 0;
            })
            .x(function(d) { return xScale(d.date); })
            // .y(function(d) { return yScale(d.priceOld); })
        ;

        var bisectDate = d3.bisector(function(d) { return d.date; }).left;


        data.forEach(function (d) {
            d.price = +d.price;
            d.priceOld = +d.priceOld;
            d.date = parseDate(d.date)
        });
        xScale.domain([parseDate('2018-04-15'), parseDate('2018-12-30')]);
        
        
       // yScale.domain([0, d3.max(data, function (d) {
       //          if(d.site === "site3") {
       //              return d.priceOld;
       //          }
       //          else {
       //              return d.price;
       //          }
       //      })]);





        var products = d3.nest()
            .key(function(d) { return d.id; })
            .entries(data);


        var svg = d3.select("#charts").selectAll("svg")
                .data(products)
                .enter().append("svg")
                .style("margin-bottom", "10px")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', "small-multiples")
                .attr("title", function (d) {
                return d.values[0].name
                })
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("id", "yAxisG")
            .each( function (s) {
                var svg1 = d3.select(this);
                var d = svg1.datum();
                yScale.domain([0,d3.max(d.values, function(k) {
                    if(k.priceOld > 0) {
                        return k.priceOld * 1.5
                    } else {
                        return k.price * 1.5
                    }
                })]);
                svg1.call(yAxis);
            });


        svg.append("g")
            .attr("id", "xAxisG")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        d3.selectAll("path.domain").remove();

        // svg.append("path")
        //     .attr("class", "line")
        //     .attr("d", function(d) {return line(d.values); });

        svg.append("path")
            .attr("class", "line")
            .each( function (s) {
                var svg1 = d3.select(this);
                var d = svg1.datum();
                yScale.domain([0,d3.max(d.values, function(k) {
                    if(k.priceOld > 0) {
                        return k.priceOld * 1.5
                    } else {
                        return k.price * 1.5
                    }
                })]);
                line.y(function(d) { return yScale(d.price); });

                svg1.attr("d", function(d) {return line(d.values); });
            });

        svg.append("path")
            .attr("class", "lineOld")
            .each( function (s) {
                var svg1 = d3.select(this);
                var d = svg1.datum();
                yScale.domain([0,d3.max(d.values, function(k) {
                    if(k.priceOld > 0) {
                        return k.priceOld * 1.5
                    } else {
                        return k.price * 1.5
                    }
                })]);
                lineOld.y(function(d) { return yScale(d.priceOld); });

                svg1.attr("d", function(d) {return lineOld(d.values); });
            });




        // d3.selectAll("line").style("stroke", "silver");


        svg.each(function() {
            var svg = d3.select(this),
                category = svg.datum().key;
            var filtered_data = svg.datum().values;



            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width + margin.right)
                .attr("height", height);


                        
            svg.append("text")
                .attr("class", "myTippy")
                .attr("x", -20)
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "center")
                .style("font-size", "10px")
                .style("cursor", "pointer")
                .attr("fill", "black")
                .text(function (d) {
                    return d.values[0].name
                })
                .attr("data-tippy-content", function(d) {
                    return d.values[0].name
                });

            // tippy('.myTippy');

            tippy('.myTippy', {
                delay: 100,
                arrow: true,
                arrowType: 'round',
                size: 'small',
                duration: 500,
                animation: 'scale'
            });

            var left = xScale(new Date("2018-11-18"));
            var right = xScale(new Date("2018-11-25")); //one more day
            var wid = right - left;
            svg.append("rect")
                .attr("x", left)
                .attr("width", wid)
                .attr("height", height)
                .attr("fill", "yellow")
                .attr("opacity", "0.2");





        })

        });
    });
// });


