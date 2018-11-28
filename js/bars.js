/**
 * Created by yevheniia on 24.11.18.
 */

d3.csv("data/range.csv", function(error, myRange) {
     var ratio = 4;


    // //загальні дані
    // var total = myRange.filter(function(d){
    //     return d.type !== "applience" && d.type !== "clothes"
    // });

    //одяг
    var clothes = myRange.filter(function(d){
        return d.type !== "applience" && d.type !== "total"
    });

    //техніка
    var applience = myRange.filter(function(d){
        return d.type !== "total" && d.type !== "clothes"
    });

    const margin = {top: 5, right: 10, bottom: 10, left: 10};

    var colors = ["#D7D7D7", '#ff36ad'];

    var color = d3.scaleOrdinal()
        .range(colors);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });


    
/* ----------------- Одяг ------------------------*/

    var initFun = true;


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

     //Функція перемальовки графіку ОДЯГ по вилику і на ресайз

     function redrawClothes(myvar, navstatus, buttonText, titleText) {
         var smallTreemapRect = document.getElementById("shop_clothes").getBoundingClientRect();
         var sm_width = smallTreemapRect.width,
             sm_height = 300,
             sm_ratio = 4;

         var treemap_sm = d3.treemap()
             .tile(d3.treemapSquarify.ratio(1))
             .size([sm_width / sm_ratio, sm_height]);

         $("#redrawClothesChart").removeClass("first-blink");
         $("#redrawClothesChart").html(buttonText);
         $("#treeTitleClothes").html(titleText);
         var newRoot = stratify(clothes)
             .sum(function(d) { return +d[myvar]; })
             .sort(function(a, b) { return b.height - a.height || b[myvar] - a[myvar]; });

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

         initFun = navstatus;
     }



    /*------------------------ Техніка ---------------------------*/
    var initFun_2 = true;


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




    //Функція перемальовки графіку ТЕХНІКА по вилику і на ресайз

    function redrawApplience(myvar, navstatus, buttonText, titleText) {
        var smallTreemapRect = document.getElementById("shop_clothes").getBoundingClientRect();
        var sm_width = smallTreemapRect.width,
            sm_height = 300,
            sm_ratio = 4;

        var treemap_sm = d3.treemap()
            .tile(d3.treemapSquarify.ratio(1))
            .size([sm_width / sm_ratio, sm_height]);

        $("#redrawApplienceChart").removeClass("first-blink");
        $("#redrawApplienceChart").html(buttonText);
        $("#treeTitleApplience").html(titleText);


        var newRoot = stratify(applience)
            .sum(function(d) {
                return  +d[myvar]; })
            .sort(function(a, b) {
                return b.height - a.height || b[myvar] - a[myvar]; });

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

        initFun_2 = navstatus;
    }

    $("#redrawClothesChart").on("click", function(d) {
        //перемальовуємо графік
        toggleNav();
    });


    $("#redrawApplienceChart").on("click", function(d) {
        //перемальовуємо графік
        toggleNav2();
    });


    //Перемикач одягу
    function toggleNav() {
        initFun ? redrawClothes("valueReal", false, "Реальні",  "Реальні знижки. Одяг.") : redrawClothes("value", true, "Обіцяні", "Заявлені знижки. Одяг.");
    }


    //Перемикач техніки
    function toggleNav2() {
        initFun_2 ? redrawApplience("valueReal", false, "Реальні", "Реальні знижки. Техніка.") : redrawApplience("value", true, "Обіцяні",  "Заявлені знижки. Техніка.");
    }


    $( window ).resize(function() {
        initFun ? redrawClothes("value", true, "Обіцяні", "Заявлені знижки. Одяг.") : redrawClothes("valueReal", false, "Реальні",  "Реальні знижки. Одяг.");
        initFun_2 ? redrawApplience("value", true, "Обіцяні",  "Заявлені знижки. Техніка.") :  redrawApplience("valueReal", false, "Реальні", "Реальні знижки. Техніка.");
    });


    /*-----------------------------------------------------*/








});







