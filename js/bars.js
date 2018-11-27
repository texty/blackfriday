/**
 * Created by yevheniia on 24.11.18.
 */




d3.csv("data/range.csv", function(error, myRange) {
    var rect = document.getElementById("treemapContainer").getBoundingClientRect();
    var width = rect.width * 0.65,
        height = window.innerHeight * 0.8,
        ratio = 4;

    const margin = {top: 5, right: 10, bottom: 10, left: 10};

    // var format = d3.format(",d");

    var colors = ["#D7D7D7", '#ff36ad'];

    var color = d3.scaleOrdinal()
        .range(colors);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var treemap = d3.treemap()
        .tile(d3.treemapSquarify.ratio(1))
        .size([width / ratio, height]);
    
    // var onlySale = myRange.filter(function(d) {
    //     if(d.id.startsWith("range.націнка")) { return false
    //     } else {  return d  }
    // });

     var root = stratify(myRange)
            .sum(function(d) {
                return +d.value;
            })
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
            .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    var nodeLabel = node.append("div")
            .attr("class", "node-label")
            .attr("height", "min-content")
            .text(function(d) {
                if(+d.value > 1) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
                }

            });


    // var nodeValue = node.append("div")
    //         .attr("class", "node-value")
    //         .text(function(d) {
    //               return d.value;
    //         });




    function redrawToReal() {
        var newRoot = stratify(myRange)
            .sum(function(d) { return +d.valueReal; })
            .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

        var node = div.datum(newRoot).selectAll(".node")
            .data(tree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


        var nodeValue = div.datum(newRoot).selectAll(".node-value")
            .data(tree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 0) {
                    return d.value;
                }
            });


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
            .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


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
            .attr("title", function(d) { return d.data.label + " на " + d.value + " товарiв"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
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
    // redrawToReal();
    // redrawToShop();


    $('input[type=radio][name=discount]').change(function() {
        if (this.value == 'redrawToShop') {
            redrawToShop() ;
        }
        else if (this.value == 'redrawToMean') {
            redrawToReal();
        }
        else if (this.value == 'redrawToMin') {
            redrawToMin();
        }
    });

    $("#redrawToMean").on("click", function(d) {
        //жирний шрифт на обране
        $(this).addClass("text-bold");
        $("#redrawToShop").removeClass("text-bold");

        //прибираємо блінк
        $(this).removeClass("first-blink");

        //змінюємо заголовок чарту
        $("#treemapTitle").html("Такими є знижки до середньої ціни за півроку");

        //перемальовуємо графік
        redrawToReal();

        //показуємо додаткову інфу під кнопками
        $("#redrawToShop").css("display", "block");
        $(".treemaplegend").css("display", "block");
    });

    $("#redrawToShop").on("click", function(d) {
        $(this).removeClass("first-blink");
        $(this).addClass("text-bold");
        $("#redrawToMean").removeClass("text-bold");
        $("#treemapTitle").html("Такі знижки обійяли магазини");
        redrawToShop() ;
    });

});





    //
    // function type(d) {
    //     d.value = +d.value;
    //     return d;
    // }





