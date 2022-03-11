d3.csv("./data/beerStyleCountAbv2.csv").then(function(data) {

    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    const width = document.querySelector("#chartabv").clientWidth;
    const height = document.querySelector("#chartabv").clientHeight;
    const margin = {top: 20, left: 120, right: 50, bottom: 120};

    const svg = d3.select("#chartabv")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


        /*
    FILTER THE DATA
    */
    const data_APA = data.filter(function(d) {
        return d.style === "American Pale Ale (APA)";
    });
    console.log(data_APA);

    const data_IPA = data.filter(function(d) {
        return d.style === "American IPA";
    });

    const data_IMP = data.filter(function(d) {
        return d.style === "American Double / Imperial IPA";
    });

    const data_Blonde = data.filter(function(d) {
        return d.style === "American Blonde Ale";
    });

    const data_Amber = data.filter(function(d) {
        return d.style === "American Amber / Red Ale";
    });



    /*
    DETERMINE MIN AND MAX VALUES OF VARIABLES
    */
    const alc = {
        min: d3.min(data, function(d) { return +d.avgabv; }),
        max: d3.max(data, function(d) { return +d.avgabv; })
    };
    console.log(alc);

    const count_abv = {
        min: d3.min(data, function(d) { return +d.count; }),
        max: d3.max(data, function(d) { return +d.count; })
    };
    console.log(count_abv);



    /*
    CREATE X SCALES
    */
    const xScale = d3.scaleLinear()
        .domain([0.02,0.10])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0,150])
        .range([height-margin.bottom, margin.top]);

    
    /*
    CREATE A LINE GENERATOR 
    */   
    const line = d3.line()
        .x(function(d) { return xScale(d.avgabv); })
        .y(function(d) { return yScale(d.count); })
        /* LINEAR  */   
        .curve(d3.curveLinear);
        /* CURVED 
        .curve(d3.curveBundle.beta(1)); 
        */   


    /*
    GENERATE AXES
    */
    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform",`translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")))
        .attr("opacity", 0.5);

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform",`translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale))
        .attr("opacity", 0.5);

    /*
    DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabels")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .attr("fill", "#FFFFFF")
        .text("Alcohol By Volume(ABV)");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabels")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .attr("fill", "#FFFFFF")
        .text("Number Of Products");


    /*
    DRAW LINE
    */

    let path = svg.append("path")
        .datum(data_APA)
            .attr("d", function(d) { return line(d); })
            .attr("stroke","#A74DFF")
            .attr("fill","rgba(167, 77, 255, 0.2)")
            .attr("stroke-width",3);

    /*
    DRAW CIRCLES
    */

    let circle = svg.selectAll("circle")
        .data(data_APA)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill", "#A74DFF");


    /*
    TOOLTIP
    */
    const tooltip = d3.select("#chartabv")
        .append("div")
        .attr("class", "tooltip");
    
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);

    function mouseOverFunction(e, d) {
        let cx = +d3.select(this).attr("cx")+20;
        let cy = +d3.select(this).attr("cy")-10;
        tooltip.style("visibility","visible") 
            .style("left", `${cx}px`)
            .style("top", `${cy}px`)
            .html(`Average AVB: ${d.avgabv}<br>Number of Products: ${d.count}`);
        d3.select(this)
            .attr("stroke","white")
            .attr("stroke-width",4);
    };

    function mouseOutFunction() {
        tooltip.style("visibility","hidden");
        d3.select(this)
            .attr("stroke","none")
            .attr("stroke-width",0);           
    };



    /* 
    DATA UPDATE -APA
    */

    // UPDATE LINE 
    d3.select("#APA2").on("click", function() {
    path.datum(data_APA)
        .transition()
        .duration(1500)
        .attr("d", line)
        .attr("stroke","#A74DFF")
        .attr("fill","rgba(167, 77, 255, 0.2)");

    // UPDATE CIRCLES 
    let c = svg.selectAll("circle")
        .data(data_APA, function(d) { return d.avgabv; });
    c.enter().append("circle")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#A74DFF")
        .merge(c)   
            .transition() // a transition makes the changes visible...
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#A74DFF");
    c.exit()
        .transition()
        .duration(1500)
        .attr("r",0)
        .remove();

    // UPDATE TOOLTIP 
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);
    });



    /* 
    DATA UPDATE -IPA
    */

    // UPDATE LINE 
    d3.select("#IPA2").on("click", function() {
        path.datum(data_IPA)
            .transition()
            .duration(1500)
            .attr("d", line)
            .attr("stroke","#15E6FF")
            .attr("fill","rgba(21, 230, 255, 0.2)");
    
    // UPDATE CIRCLES 
    let c = svg.selectAll("circle")
        .data(data_IPA, function(d) { return d.avgabv; });
    c.enter().append("circle")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#15E6FF")
        .merge(c)   
            .transition() // a transition makes the changes visible...
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#15E6FF");
    c.exit()
        .transition()
        .duration(1500)
        .attr("r",0)
        .remove();
    
    // UPDATE TOOLTIP 
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);
    });





    /* 
    DATA UPDATE -IMP
    */

    // UPDATE LINE 
    d3.select("#IMP2").on("click", function() {
        path.datum(data_IMP)
            .transition()
            .duration(1500)
            .attr("d", line)
            .attr("stroke","#47E29A")
            .attr("fill","rgba(71, 266, 154, 0.2)");
    
    // UPDATE CIRCLES 
    let c = svg.selectAll("circle")
        .data(data_IMP, function(d) { return d.avgabv; });
    c.enter().append("circle")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#47E29A")
        .merge(c)   
            .transition() // a transition makes the changes visible...
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#47E29A");
    c.exit()
        .transition()
        .duration(1500)
        .attr("r",0)
        .remove();
    
    // UPDATE TOOLTIP 
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);
    });



    /* 
    DATA UPDATE -Blonde
    */

    // UPDATE LINE 
    d3.select("#Blonde2").on("click", function() {
        path.datum(data_Blonde)
            .transition()
            .duration(1500)
            .attr("d", line)
            .attr("stroke","#F7B500")
            .attr("fill","rgba(220, 255, 0, 0.2)");
    
    // UPDATE CIRCLES 
    let c = svg.selectAll("circle")
        .data(data_Blonde, function(d) { return d.avgabv; });
    c.enter().append("circle")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#F7B500")
        .merge(c)   
            .transition() // a transition makes the changes visible...
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#F7B500");
    c.exit()
        .transition()
        .duration(1500)
        .attr("r",0)
        .remove();
    
    // UPDATE TOOLTIP 
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);
    });




    /* 
    DATA UPDATE -Amber
    */

    // UPDATE LINE 
    d3.select("#Amber2").on("click", function() {
        path.datum(data_Amber)
            .transition()
            .duration(1500)
            .attr("d", line)
            .attr("stroke","#FF528B")
            .attr("fill","rgba(255, 82, 139, 0.2)");
    
    // UPDATE CIRCLES 
    let c = svg.selectAll("circle")
        .data(data_Amber, function(d) { return d.avgabv; });
    c.enter().append("circle")
            .attr("fill","#FF528B")
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
        .merge(c)   
            .transition() // a transition makes the changes visible...
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.avgabv); })
            .attr("cy", function(d) { return yScale(d.count); })
            .attr("r",6)
            .attr("fill","#FF528B");
    c.exit()
        .transition()
        .duration(1500)
        .attr("r",0)
        .remove();
    
    // UPDATE TOOLTIP 
    svg.selectAll("circle")
        .on("mouseover", mouseOverFunction)
        .on("mouseout", mouseOutFunction);
    });





});


