
/* ---------------------------------------------------------
 ---- Create Select MENU for category and charts amount ----
 ----------------------------------------------------------- */

var API_ROOT = 'http://localhost:5000';

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



$('#mybut').on('click', function () {
    $('html, body').animate({
        scrollTop: $("#selectButtons").offset().top
    }, 'slow');
    $('#mybut').html('<b>Ще графічків</b>');
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        url: API_ROOT + "/blackfriday/api/random10/" + categ + "/" + limit
        // data: JSON.stringify({ "categ": categ, "limit": limit })
    }).done(function(data) {
        console.log(data);
        $('#charts').find('svg').remove();

        

        var margin = {top: 30, right: 0, bottom: 40, left: 40},
            width = 250 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

        var xScale = d3.scaleTime()
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .range([height, 0]);

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickSize(-height)
                .ticks(9)
                .tickFormat(formatTime)
            ;

        var line = d3.line()
            .defined(function(d) {
                return d.price !== 0;
            })
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.price); });

        var lineOld = d3.line()
            .defined(function(d) {
                return d.priceOld !== 0;
            })
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.priceOld); });

        var bisectDate = d3.bisector(function(d) { return d.date; }).left;


        data.forEach(function (d) {
            d.price = +d.price;
            d.priceOld = +d.priceOld;
            d.date = parseDate(d.date)
        });
        xScale.domain([parseDate('2018-04-15'), parseDate('2018-12-30')]);
        // xScale.domain(d3.extent(data, function(d) { return d.date; }));

            yScale.domain([0, d3.max(data, function (d) {
                if(d.site === "leboutique") {
                    return d.priceOld;
                }
                else {
                    return d.price;
                }
            })]);




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
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;


        svg.append("g").attr("id", "yAxisG").call(yAxis);
        svg.append("g").attr("id", "xAxisG").attr("class", "axis").attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        d3.selectAll("path.domain").remove();

        svg.append("path")
            .attr("class", "line")
            .attr("d", function(d) {return line(d.values); });

        svg.append("path")
            .attr("class", "lineOld")
            .attr("d", function(d) {return lineOld(d.values); });




        // d3.selectAll("line").style("stroke", "silver");


        svg.each(function() {
            var svg = d3.select(this),
                category = svg.datum().key;
            var filtered_data = svg.datum().values;

            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            // var focus2 = svg.append("g")
            //     .attr("class", "focus2")
            //     .style("display", "none");

            focus.append("circle")
                .attr("r", 3);


            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");

            // focus2.append("circle")
            //     .attr("r", 3);
            //
            //
            // focus2.append("text")
            //     .attr("x", 9)
            //     .attr("dy", ".35em");

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width + margin.right)
                .attr("height", height)
                .on("mouseover", function () {
                    focus.style("display", null);
                    // focus2.style("display", null);
                })
                .on("mouseout", function () {
                    focus.style("display", "none");
                    // focus2.style("display", "none");
                })
                .on("mousemove", mousemove);


            svg.append("text")
                .attr("x", 0)
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "left")
                .style("font-size", "9px")
                .attr("fill", "white")
                .text(function (d) {
                    return d.values[0].name
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



            function mousemove() {
                var x0 = xScale.invert(d3.mouse(this)[0]),
                    i = bisectDate(filtered_data, x0, 1),
                    d0 = filtered_data[i - 1],
                    d1 = filtered_data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d1;


                focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.price) + ")");
                focus
                    .select("text")
                    .text(function() {
                        if(d.price > 0) {
                            return d.price
                        }
                    })
                    .attr("y", -15)
                    .attr("fill", "#ff36ad")
                    .attr("class", "tooltip")
                    .attr("x", function () {
                        if (x0 > parseDate ('2018-09-01')) {
                            // you are on A zone
                            return -20;
                        }
                    })
                ;

                // focus2.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.priceOld) + ")");
                // focus2
                //     .select("text")
                //     .text(function() {
                //         if(d.priceOld > 0) {
                //             // var thisCircle = $(this)
                //             //     .closest('g')[0].find('circle');
                //             // thisCircle.css("opacity", 0);
                //             return d.priceOld
                //         }
                //     })
                //     .attr("y", -15)
                //     .attr("fill", "white")
                //
                //     .attr("class", "tooltip")
                //     .attr("x", function () {
                //        if (x0 > parseDate ('2018-10-01')) {
                //             // you are on A zone
                //             return -30;
                //         }
                //     });
            }


        })

        });
    });
// });


