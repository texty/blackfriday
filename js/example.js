/**
 * Created by yevheniia on 21.11.18.
 */

var textBlockRect = document.getElementById("scroll-text").getBoundingClientRect();
var scrollChartMargin = {top: 30, right: 0, bottom: 40, left: 40},
    scrollChartWidth = textBlockRect.width - scrollChartMargin.left - scrollChartMargin.right,
    scrollChartHeight = (scrollChartWidth * 0.7) - - scrollChartMargin.top - scrollChartMargin.bottom;

d3.csv("data/bf.csv", function(error, examples) {

    examples.forEach(function (d) {
        d.price = +d.price;
        d.priceOld = +d.priceOld;
        d.date = parseDate(d.date)
    });

    var theCase = examples.filter(function(d){
        return d.id === "c-1353335" ;  });

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
        if(d.priceOld > 0 ) {
            return d.priceOld;
        }
        else {
            return d.price;
        }}
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


    var svg = d3.select("#scroll-chart")
            .append("svg")
            .style("margin-bottom", "10px")
            .attr("width", scrollChartWidth + scrollChartMargin.left + scrollChartMargin.right)
            .attr("height", scrollChartHeight + scrollChartMargin.top + scrollChartMargin.bottom)
            // .attr('class', "small-multiples")
            .append("g")
            .attr("transform", "translate(" + scrollChartMargin.left + "," + scrollChartMargin.top + ")");


    svg.append("g").attr("id", "yAxisG").call(yAxis);
    svg.append("g").attr("id", "xAxisG").attr("class", "axis").attr("transform", "translate(0," + scrollChartHeight + ")")
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
        .attr("id", "scrollChartTitle")
        .attr("x", 0)
        .attr("y", 0 - (scrollChartMargin.top / 2))
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .attr("fill", "white")
        .text(function () {
            return theCase[0].name
        });


    function redraw(id) {
        var newCase = examples.filter(function(d){
            return d.id === id ;  });

        var yAxis = d3.axisLeft().scale(yScale);

        yScale.domain([0, d3.max(newCase, function (d) {
            if(+d.priceOld > 0 ) {
                return +d.priceOld;
            }
            else {
                return +d.price * 2;
            }}
        )]);


        d3.select("#yAxisG")
            .transition()
            .duration(300)
            .call(yAxis);


        // var svg = d3.select('#scroll-chart svg');
        svg.select(".scrollChartLine")
            .transition()
            .duration(300)
            .attr("d", function () {
                return line(newCase);
            });


        svg.select(".scrollChartLineOld")
            .transition()
            .duration(300)
            .attr("d", function () {
                return lineOld(newCase);
            });


        svg.select("#scrollChartTitle")
            .html(function () {
                return newCase[0].name
            });
    };


    // якщо видно показуємо текст, якщо ні, ховаємо.
    $( document ).ready( function() {
        window.addEventListener('scroll', function(e) {
            var elemid =  getElemIsOnView('.block');
            redraw(elemid);

        });
    });

});

function isOnScreen(elem) {
    // if the element doesn't exist, abort
    if (elem.length == 0) {
        return;
    }
    var $window = $(window);
    var viewport_top = $window.scrollTop();
    var viewport_height = $window.height();
    var viewport_bottom = viewport_top + viewport_height;
    var $elem = $(elem);
    var top = $elem.offset().top;
    var height = $elem.height();
    var bottom = top + height;

    return (top >= viewport_top && top < viewport_bottom) ||
        (bottom > viewport_top && bottom <= viewport_bottom) ||
        (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
}


function getElemIsOnView(elemClass) {
    var blocks = $(elemClass);
    var prevId;
    var targetId;
    blocks.each(function() {
        if(isOnScreen(this)) {
            var prevElem = $(this).previousSibling;
            prevId = $(prevElem).attr("id");
            targetId = $(this).attr("id");
            console.log(targetId);
            console.log(prevId);
        }
    });
    if(targetId != prevId) {
        return targetId;
    }

}


