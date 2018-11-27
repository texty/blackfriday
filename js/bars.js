/**
 * Created by yevheniia on 24.11.18.
 */

d3.csv("data/range.csv", function(error, myRange) {
    var rect = document.getElementById("treemapContainer").getBoundingClientRect();
    var width = rect.width * 0.65,
        height = window.innerHeight * 0.8,
        ratio = 4;


    var total = myRange.filter(function(d){
        return d.type !== "applience" && d.type !== "clothes"
    });

    var clothes = myRange.filter(function(d){
        return d.type !== "applience" && d.type !== "total"
    });

    var applience = myRange.filter(function(d){
        return d.type !== "total" && d.type !== "clothes"
    });

    const margin = {top: 5, right: 10, bottom: 10, left: 10};

    var colors = ["#D7D7D7", '#ff36ad'];

    var color = d3.scaleOrdinal()
        .range(colors);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var treemap = d3.treemap()
        .tile(d3.treemapSquarify.ratio(1))
        .size([width / ratio, height]);
    
   var root = stratify(total)
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


    function redrawToReal() {
        var newRoot = stratify(total)
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


    function redrawToShop() {

        var newRoot = stratify(total)
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


    
/* ----------------- Одяг ------------------------*/

    var sm_width = window.innerWidth / 2.5,
        sm_height = 300,
        sm_ratio = 4;


    var treemap_sm = d3.treemap()
        .tile(d3.treemapSquarify.ratio(1))
        .size([sm_width / sm_ratio, sm_height]);

    var clothesRoot = stratify(clothes)
        .sum(function(d) {
            return +d.value;
        })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    const clothesTree = treemap_sm(clothesRoot);

    const clothesDiv = d3.select("#shop_clothes").append("div")
            .style("position", "relative")
            .style("width", (sm_width + margin.left + margin.right) + "px")
            .style("height", (sm_height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")
        ;

    var clothesNode = clothesDiv.datum(clothesRoot).selectAll(".node")
        .data(clothesTree.leaves())
        .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
        .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
        .style("top", function(d) { return Math.round(d.y0) + "px"; })
        .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
        .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
        .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    var clothesNodeLabel = clothesNode.append("div")
        .attr("class", "node-label")
        .attr("height", "min-content")
        .text(function(d) {
            if(+d.value > 1) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            }

        });


    var clothesRootReal = stratify(clothes)
        .sum(function(d) {
            return +d.valueReal;
        })
        .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

    const clothesTreeReal = treemap_sm(clothesRootReal);

    const clothesDivReal = d3.select("#real_clothes").append("div")
            .style("position", "relative")
            .style("width", (sm_width + margin.left + margin.right) + "px")
            .style("height", (sm_height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")
        ;

    var clothesNodeReal = clothesDivReal.datum(clothesRootReal).selectAll(".node")
        .data(clothesTreeReal.leaves())
        .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
        .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
        .style("top", function(d) { return Math.round(d.y0) + "px"; })
        .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
        .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
        .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    clothesNodeReal.append("div")
        .attr("class", "node-label")
        .attr("height", "min-content")
        .text(function(d) {
            if(+d.value > 1) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            }

        });
    /*--------------------------------------------------*/


    /*------------------------ Техніка ---------------------------*/

    var applRoot = stratify(applience)
        .sum(function(d) {
            return +d.value;
        })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    const applTree = treemap_sm(applRoot);

    const applDiv = d3.select("#shop_appl").append("div")
            .style("position", "relative")
            .style("width", (sm_width + margin.left + margin.right) + "px")
            .style("height", (sm_height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")
        ;

    var applNode = applDiv.datum(applRoot).selectAll(".node")
        .data(applTree.leaves())
        .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
        .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
        .style("top", function(d) { return Math.round(d.y0) + "px"; })
        .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
        .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
        .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    var applNodeLabel = applNode.append("div")
        .attr("class", "node-label")
        .attr("height", "min-content")
        .text(function(d) {
            if(+d.value > 1) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            }

        });


    var applRootReal = stratify(applience)
        .sum(function(d) {
            return +d.valueReal;
        })
        .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

    const applTreeReal = treemap_sm(applRootReal);

    const applDivReal = d3.select("#real_appl").append("div")
            .style("position", "relative")
            .style("width", (sm_width + margin.left + margin.right) + "px")
            .style("height", (sm_height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")
        ;

    var applNodeReal = applDivReal.datum(applRootReal).selectAll(".node")
        .data(applTreeReal.leaves())
        .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
        .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
        .style("top", function(d) { return Math.round(d.y0) + "px"; })
        .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
        .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
        .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


    applNodeReal.append("div")
        .attr("class", "node-label")
        .attr("height", "min-content")
        .text(function(d) {
            if(+d.value > 1) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
            }

        });
    /*-----------------------------------------------------*/




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



$('input[type=radio][name=discount]').change(function() {
    if (this.value == 'redrawToShop') {
        // redrawToShop() ;
    }
    else if (this.value == 'redrawToMean') {
        // redrawToReal();
    }
    else if (this.value == 'redrawToMin') {
        redrawToMin();
    }
});

