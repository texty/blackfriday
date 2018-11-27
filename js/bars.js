/**
 * Created by yevheniia on 24.11.18.
 */

d3.csv("data/range.csv", function(error, myRange) {
    // var rect = document.getElementById("treemapContainer").getBoundingClientRect();
    // var width = rect.width * 0.65,
    //     height = window.innerHeight * 0.8,
     var   ratio = 4;


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

    // var treemap = d3.treemap()
    //     .tile(d3.treemapSquarify.ratio(1))
    //     .size([width / ratio, height]);
    
   // var root = stratify(total)
   //          .sum(function(d) {
   //              return +d.value;
   //          })
   //          .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
   //
   //  const tree = treemap(root);
   //
   //  const div = d3.select("#area-chart").append("div")
   //      .style("position", "relative")
   //      .style("width", (width + margin.left + margin.right) + "px")
   //      .style("height", (height + margin.top + margin.bottom) + "px")
   //      .style("left", margin.left + "px")
   //      .style("top", margin.top + "px")
   //      ;
   //
   //      var node = div.datum(root).selectAll(".node")
   //          .data(tree.leaves())
   //          .enter().append("div")
   //          .attr("class", "node")
   //          .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
   //          .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
   //          .style("top", function(d) { return Math.round(d.y0) + "px"; })
   //          .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
   //          .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
   //          .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });
   //
   //
   //  var nodeLabel = node.append("div")
   //          .attr("class", "node-label")
   //          .attr("height", "min-content")
   //          .text(function(d) {
   //              if(+d.value > 1) {
   //                  return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
   //              }
   //
   //          });
   //
   //
   //  function redrawToReal() {
   //      var newRoot = stratify(total)
   //          .sum(function(d) { return +d.valueReal; })
   //          .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });
   //
   //      var node = div.datum(newRoot).selectAll(".node")
   //          .data(tree.leaves());
   //
   //      node.enter().append("div")
   //          .attr("class", "node");
   //
   //      node.data(treemap(newRoot).leaves())
   //          .transition()
   //          .duration(1500)
   //          .attr("title", function(d) { return d.data.label + " на " + d.value + " товара(-ів)"})
   //          .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
   //          .style("top", function(d) { return Math.round(d.y0) + "px"; })
   //          .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
   //          .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
   //          .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });
   //
   //
   //      var nodeValue = div.datum(newRoot).selectAll(".node-value")
   //          .data(tree.leaves());
   //
   //      nodeValue.enter().append("div")
   //          .attr("class", "node-value");
   //
   //
   //      nodeValue.data(treemap(newRoot).leaves())
   //          .transition()
   //          .duration(1500)
   //          .text(function(d) {
   //              if(d.value > 0) {
   //                  return d.value;
   //              }
   //          });
   //
   //
   //      var nodeLabel = div.datum(newRoot).selectAll(".node-label")
   //          .data(tree.leaves());
   //
   //      nodeLabel.data(treemap(newRoot).leaves())
   //          .transition()
   //          .duration(1500)
   //          .text(function(d) {
   //              return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
   //
   //
   //          });
   //  }


    // function redrawToShop() {
    //
    //     var newRoot = stratify(total)
    //         .sum(function(d) { return d.value; })
    //         .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    //
    //     var node = div.datum(newRoot).selectAll(".node")
    //         .data(tree.leaves());
    //
    //     node.enter().append("div")
    //         .attr("class", "node");
    //
    //     node.data(treemap(newRoot).leaves())
    //         .transition()
    //         .duration(1500)
    //         .attr("title", function(d) { return d.data.label + " на " + d.value + " товарiв"})
    //         .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
    //         .style("top", function(d) { return Math.round(d.y0) + "px"; })
    //         .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
    //         .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
    //         .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })
    //
    //
    //     var nodeValue = div.datum(newRoot).selectAll(".node-value")
    //         .data(tree.leaves());
    //
    //     nodeValue.enter().append("div")
    //         .attr("class", "node-value");
    //
    //
    //     nodeValue.data(treemap(newRoot).leaves())
    //         .transition()
    //         .duration(1500)
    //         .text(function(d) { return d.value; });
    //
    //
    //     var nodeLabel = div.datum(newRoot).selectAll(".node-label")
    //         .data(tree.leaves());
    //
    //     nodeLabel.data(treemap(newRoot).leaves())
    //         .transition()
    //         .duration(1500)
    //         .text(function(d) {
    //             return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
    //         });
    // }


    
/* ----------------- Одяг ------------------------*/
    var smallTreemapRect = document.getElementById("shop_clothes").getBoundingClientRect();
    var sm_width = smallTreemapRect.width,
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
        .attr("title", function(d) { return  d.value + " товара(-ів)"})
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

    var initFun = true;

     function redrawToClothesReal() {
         $("#redrawClothesChart").removeClass("first-blink");
         $("#redrawClothesChart").html("Обіцяні");
         $("#treeTitleClothes").html("Реальні знижки... і націнки. Одяг");
         var newRoot = stratify(clothes)
             .sum(function(d) { return +d.valueReal; })
             .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

         var node = clothesDiv.datum(newRoot).selectAll(".node")
             .data(clothesTree.leaves());

         node.enter().append("div")
             .attr("class", "node");

         node.data(treemap_sm(newRoot).leaves())
             .transition()
             .duration(1500)
             .attr("title", function(d) { d.value + " товара(-ів)"})
             .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
             .style("top", function(d) { return Math.round(d.y0) + "px"; })
             .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
             .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
             .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


         var nodeValue = clothesDiv.datum(newRoot).selectAll(".node-value")
             .data(clothesTree.leaves());

         nodeValue.enter().append("div")
             .attr("class", "node-value");


         nodeValue.data(treemap_sm(newRoot).leaves())
             .transition()
             .duration(1500)
             .text(function(d) {
                 if(d.value > 0) {
                     return d.value;
                 }
             });


         var nodeLabel = clothesDiv.datum(newRoot).selectAll(".node-label")
             .data(clothesTree.leaves());

         nodeLabel.data(treemap_sm(newRoot).leaves())
             .transition()
             .duration(1500)
             .text(function(d) {
                 return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
             });

         initFun = false;
     }


    function redrawToClothesShop() {
        $("#redrawClothesChart").html("А насправді?");
        $("#treeTitleClothes").html("Заявлені знижки на одяг");

        var newRoot = stratify(clothes)
            .sum(function(d) { return +d.value; })
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        var node = clothesDiv.datum(newRoot).selectAll(".node")
            .data(clothesTree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


        var nodeValue = clothesDiv.datum(newRoot).selectAll(".node-value")
            .data(clothesTree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 0) {
                    return d.value;
                }
            });


        var nodeLabel = clothesDiv.datum(newRoot).selectAll(".node-label")
            .data(clothesTree.leaves());

        nodeLabel.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");


            });
        initFun = true;
    }


    function toggleNav() {
        initFun ? redrawToClothesReal() : redrawToClothesShop();
    }






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
        .attr("title", function(d) { return d.value + " товара(-ів)"})
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

     var initFun_2 = true;

    function redrawToApplienceToReal() {
        $("#redrawApplienceChart").removeClass("first-blink");
        $("#redrawApplienceChart").html("Обіцяні");
        $("#treeTitleApplience").html("Реальні знижки. Техніка.");
        var newRoot = stratify(applience)
            .sum(function(d) { return +d.valueReal; })
            .sort(function(a, b) { return b.height - a.height || b.valueReal - a.valueReal; });

        var node = applDiv.datum(newRoot).selectAll(".node")
            .data(applTree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


        var nodeValue = applDiv.datum(newRoot).selectAll(".node-value")
            .data(applTree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 20) {
                    return d.value;
                }
            });


        var nodeLabel = applDiv.datum(newRoot).selectAll(".node-label")
            .data(applTree.leaves());

        nodeLabel.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 20 ) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
                }
            });

        initFun_2 = false;
    }


    function redrawApplienceToShop() {
        $("#redrawApplienceChart").removeClass("first-blink");
        $("#redrawApplienceChart").html("Реальні");
        $("#treeTitleApplience").html("Заявлені знижки на техніку");
        var newRoot = stratify(applience)
            .sum(function(d) { return +d.value; })
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        var node = applDiv.datum(newRoot).selectAll(".node")
            .data(applTree.leaves());

        node.enter().append("div")
            .attr("class", "node");

        node.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .attr("title", function(d) { d.value + " товара(-ів)"})
            .style("left", function(d) { return Math.round(d.x0 * ratio) + "px"; })
            .style("top", function(d) { return Math.round(d.y0) + "px"; })
            .style("width", function(d) { return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + "px"; })
            .style("height", function(d) { return Math.round(d.y1) - Math.round(d.y0) - 1 + "px"; })
            .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); });


        var nodeValue = applDiv.datum(newRoot).selectAll(".node-value")
            .data(applTree.leaves());

        nodeValue.enter().append("div")
            .attr("class", "node-value");


        nodeValue.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 20) {
                    return d.value;
                }
            });


        var nodeLabel = applDiv.datum(newRoot).selectAll(".node-label")
            .data(applTree.leaves());

        nodeLabel.data(treemap_sm(newRoot).leaves())
            .transition()
            .duration(1500)
            .text(function(d) {
                if(d.value > 20 ) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
                }
            });

        initFun_2 = true;
    }










    function toggleNav2() {
        initFun_2 ? redrawToApplienceToReal() : redrawApplienceToShop();
    }



    /*-----------------------------------------------------*/


    $("#redrawClothesChart").on("click", function(d) {
        //перемальовуємо графік
        toggleNav();
    });


    $("#redrawApplienceChart").on("click", function(d) {
        //перемальовуємо графік
        toggleNav2();
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

