d3.csv("./data/beerStyleFilter.csv").then(function(data) {

    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 120, right: 50, bottom: 120};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    console.log(data);



    /*
    DETERMINE MIN AND MAX VALUES OF VARIABLES
    */

    const bitter = {
        min: d3.min(data, function(d) { return +d.ibu; }),
        max: d3.max(data, function(d) { return +d.ibu; })
    };

    console.log(bitter);

    const alcohol = {
        min: d3.min(data, function(d) { return +d.abv; }),
        max: d3.max(data, function(d) { return +d.abv; })
    };


    /*
    CREATE SCALES
    */
    const xScale = d3.scaleLinear()
        .domain([bitter.min/2, 1.1*bitter.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([alcohol.min/1.1, alcohol.max])
        .range([height-margin.bottom, margin.top]);

    var colorScale = d3.scaleOrdinal()
        .domain(["American Pale Ale (APA)", "American IPA", "American Double / Imperial IPA" ,"American Blonde Ale","American Amber / Red Ale"])
        .range([ "#A74DFF", "#15E6FF", "#47E29A", "#F7B500", "#FF52B4"]);


    /*
    DRAW AXES
    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .attr("opacity", 0.5);


    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale))
        .attr("opacity", 0.5);
    

    /*
    DRAW POINTS
    */
    const points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.ibu); })
            .attr("cy", function(d) { return yScale(d.abv); })
            .attr("r", 7)
            .attr("fill", function(d) { return colorScale(d.style); })
            .attr("opacity",0.4);
    
    /*
    DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabels")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .attr("fill", "#FFFFFF")
        .text("International Bitterness Units(IBU)");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabels")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .attr("fill", "#FFFFFF")
        .text("Alcohol By Volume(AVB)");


    /* TOOLTIP 
    */

    const tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    
    points.on("mouseover", function(e, d){
        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        console.log(cx,cy);
        
        tooltip.style("visibility", "visible")
            .style("left", `${cx}px`)
            .style("top", `${cy}px`)
            .html(`Product: ${d.name}<br>Style: ${d.style}<br>IBU:${d.ibu} <br>ABV: ${d.abv}`);

        d3.select(this)
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 6)
    }).on("mouseout", function(){
        tooltip.style("visibility", "hidden")

        d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);

    });


    /* FILTER BY CHECKBOX */

    d3.selectAll(".type--option").on("click", function(){
        let style = d3.select(this).property("value");

        let selection = points.filter(function(d){
            return d.style === style;
        });

        let isChecked = d3.select(this).property("checked");
        
        if(isChecked == true){
            selection.attr("opacity", 0.5)
            .style("pointer-events", "all");
        } else{
            selection.attr("opacity", 0)
            .style("pointer-events","none")
        }
    });










});
