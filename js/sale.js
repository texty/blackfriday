/**
 * Created by yevheniia on 21.11.18.
 */


    d3.csv("data/bf_filtered.csv", function(error, dataset) {

        dataset.forEach(function (d) {
            d.pinkLine = +d.pinkLine;
            d.whiteDashed = +d.whiteDashed;
            d.date = parseDate(d.date)
        });

        dataset = dataset.sort(function (a, b) {
            return a.date - b.date;

        });

        var smartsOnly = dataset.filter(function (d) {
            return d.bigGat === "Телефони, аксесуари" || d.bigGat === "Ноутбуки, планшети";
        });

        var applienceOnly = dataset.filter(function (d) {
            return d.bigGat === "Побутова техніка" || d.bigGat === "Телевізори";
        });

        var clothesOnly = dataset.filter(function (d) {
            return d.bigGat === "Одяг" || d.bigGat === "Сумки";
        });



        //Якщо iPadPro або мобілка, то малюємо в три контейнери
        if (screen.width === 1024 && screen.height === 1366 && screen.orientation != "landscape"){
            drawMeThis(smartsOnly, "#smallMultiplesContainer1");
            drawMeThis(applienceOnly, "#smallMultiplesContainer2");
            drawMeThis(clothesOnly, "#smallMultiplesContainer3");
        } else if (screen.width < 825) {
            drawMeThis(smartsOnly, "#smallMultiplesContainer1");
            drawMeThis(applienceOnly, "#smallMultiplesContainer2");
            drawMeThis(clothesOnly, "#smallMultiplesContainer3");
        }

        //Якщо ні, перемальовуємо в той самий на скролі
        else {
            $(document).ready(function () {
                window.addEventListener('scroll', function (e) {
                    if (isOnScreen("#scrollText2")  === true) {
                        drawMeThis(applienceOnly, "#smallMultiplesContainer1");
                    }
                });
            });

            $(document).ready(function () {
                window.addEventListener('scroll', function (e) {
                    if (isOnScreen("#scrollText3")  === true) {
                        drawMeThis(clothesOnly, "#smallMultiplesContainer1");
                    }
                });
            });

            $(document).ready(function () {
                window.addEventListener('scroll', function (e) {
                    if (isOnScreen("#scrollText1")  === true) {
                        drawMeThis(smartsOnly, "#smallMultiplesContainer1");
                    }
                });
            });
        }

        //Якщо екран перевертається
        window.addEventListener('resize', function(e){
            if(screen.width === 1024 && screen.height === 1366 && screen.orientation != "landscape"){
                drawMeThis(smartsOnly, "#smallMultiplesContainer1");
                drawMeThis(applienceOnly, "#smallMultiplesContainer2");
                drawMeThis(clothesOnly, "#smallMultiplesContainer3");
            }
            //для того, щоб модальне вікно відкривлось ок після screen turn треба перемальвувати графіки на ресайзі
            else if (screen.width < 825) {
                $('#smallMultiplesContainer1').html("");
                $('#smallMultiplesContainer2').html("");
                $('#smallMultiplesContainer3').html("");
                drawMeThis(smartsOnly, "#smallMultiplesContainer1");
                drawMeThis(applienceOnly, "#smallMultiplesContainer2");
                drawMeThis(clothesOnly, "#smallMultiplesContainer3");
            }

            else {
                $(document).ready(function () {
                    window.addEventListener('scroll', function (e) {
                        if (isOnScreen("#scrollText2") === true) {
                            drawMeThis(applienceOnly, "#smallMultiplesContainer1");
                        }
                    });
                });

                $(document).ready(function () {
                    window.addEventListener('scroll', function (e) {
                        if (isOnScreen("#scrollText3") === true) {
                            drawMeThis(clothesOnly, "#smallMultiplesContainer1");
                        }
                    });
                });

                $(document).ready(function () {
                    window.addEventListener('scroll', function (e) {
                        if (isOnScreen("#scrollText1") === true) {
                            $('#smallMultiplesContainer1').html("");
                            drawMeThis(smartsOnly, "#smallMultiplesContainer1");
                        }
                    });
                });
            }
        });

    });


function drawMeThis(df, container) {
    //для iPAd ProPortrait малюємо в окремі контейнери, тому не видаляємо контент першого
    if(screen.width != 1024 && screen.height != 1366 && screen.orientation != "landscape" && screen.width > 825) {
        $('#smallMultiplesContainer1').html("");
        $('#smallMultiplesContainer2').html("");
        $('#smallMultiplesContainer3').html("");
    }


    var rect1 = document.getElementById("phantom").getBoundingClientRect();

    var chartMargin = { top: 30, right: 40, bottom: 40, left: 40},
        chartWidth = rect1.width - chartMargin.left - chartMargin.right,
        chartHeight = chartWidth  - chartMargin.bottom - chartMargin.top;



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


    var dataset1 = d3.nest()
        .key(function (d) {
            return d.bigGat
        })
        .entries(df);


    x.domain([parseDate('2018-04-15'), parseDate('2018-12-30')]);
    y.domain([0, 4]);

    var cardsContainer = d3.select(container).selectAll("div")
        .data(dataset1)

        .enter()
        .append("div")
        .attr("class", "prod")
        .attr("height", chartHeight)
        .attr("width", chartWidth)
        .attr("id", function (d, i) {
            return "prod-" + i;
        });

    cardsContainer.append("h5")
        .attr("class", "theTitle")
        .style("font-size", '14px')
        .style("text-align", 'center')
        .text(function (d) {
            return d.key;
        })
    ;

    // var theCard = cardsContainer.append("div")
    //     .attr("class", "card")
    //     .attr("width", chartWidth);
    //
    // theCard.append("img")
    //     .attr("src", "img/any.jpg")
    //     .attr("width", "100%");
    //
    //
    // theCard.append("div")
    //     .attr("class", "buy-button")
    //     .append("h2")
    //     .text("Обрати");


    $(".buy-button").on("click", function () {
        $(this).closest(".card").toggleClass("hidden");
        $(this).closest(".prod").find("svg").css("display", "block");

    });

    var buyMeChart = cardsContainer.append("svg")
        .attr("id", function (d, i) {
            return "svg-" + i;
        })
        .attr("class", "multiples")
        .attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", chartHeight + chartMargin.bottom + chartMargin.top)
        .append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

    buyMeChart.append("g")
        // .attr("id", "yAxisG")
        .attr("class", "y axis").call(yAx);
    buyMeChart.append("g")
        // .attr("id", "xAxisG")
        .attr("class", "x axis").attr("transform", "translate(0," + chartHeight + ")")
        .call(xAx);
    d3.selectAll("path.domain").remove();

    buyMeChart.append('path')
        .attr("class", "line")
        .attr("d", function (d) {
            return valueline(d.values);
        });

    buyMeChart.append('path')
        .attr("class", "lineOld")
        .attr("d", function (d) {
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
        .attr("opacity", "0.2");

}







