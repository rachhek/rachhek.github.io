var RadarChart = {
    draw: function(id, d, options){
      var cfg = {
       radius: 5,
       w: 300,
       h: 300,
       factor: 1,
       factorLegend: .85,
       levels: 3,
       maxValue: 0,
       radians: 2 * Math.PI,
       opacityArea: 0.2,
       ToRight: 5,
       TranslateX: 80,
       TranslateY: 30,
       ExtraWidthX: 100,
       ExtraWidthY: 100,
       color: d3.scaleOrdinal().range(["#CC333F","#00A0B0","#EDC951","#6F257F"])
      };

      if('undefined' !== typeof options){
        for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
        }
      }

      cfg.maxValue = 100;

      var allAxis = (d[0].map(function(i, j){return i.aspect}));
      var total = allAxis.length;
      var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
      var Format = d3.format('%');
      d3.select(id).select("svg").remove();

      var g = d3.select(id)
          .append("svg")
          .attr("width", cfg.w+cfg.ExtraWidthX)
          .attr("height", cfg.h+cfg.ExtraWidthY)
          .append("g")
          .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

          var tooltip;

      //Circular segments
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data(allAxis)
         .enter()
         .append("svg:line")
         .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
         .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
         .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
         .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
         .attr("class", "line")
         .style("stroke", "grey")
         .style("stroke-opacity", "0.75")
         .style("stroke-width", "0.3px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
      }

      //Text indicating at what % each level is
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data([1]) //dummy data
         .enter()
         .append("svg:text")
         .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
         .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
         .attr("class", "legend")
         .style("font-family", "sans-serif")
         .style("font-size", "10px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
         .attr("fill", "#737373")
         .text((j+1)*100/cfg.levels);
      }

      series = 0;

      var axis = g.selectAll(".axis")
          .data(allAxis)
          .enter()
          .append("g")
          .attr("class", "axis");

      axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

      axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(0, -10)"})
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


      d.forEach(function(y, x){
        dataValues = [];
        g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        });
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
               .data([dataValues])
               .enter()
               .append("polygon")
               .attr("class", "radar-chart-serie"+series)
               .style("stroke-width", "0px")
               .style("stroke", cfg.color(series))
               .attr("points",function(d) {
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                   str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
                })
               .style("fill", function(j, i){return cfg.color(series)})
               .style("fill-opacity", cfg.opacityArea)
               .on('mouseover', function (d){
                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", 0.1);
                        g.selectAll(z)
                         .transition(200)
                         .style("fill-opacity", .7);
                        })
               .on('mouseout', function(){
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
               });
        series++;
      });
      series=0;


  var tooltip = d3.select("body").append("div").attr("class", "toolTip");
      d.forEach(function(y, x){
        g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.aspect})
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series)).style("fill-opacity", .9)
        .on('mouseover', function (d){
          console.log(d.aspect)
              tooltip
                .style("left", d3.event.pageX - 40 + "px")
                .style("top", d3.event.pageY - 80 + "px")
                .style("display", "inline-block")
                        .html((d.aspect) + "<br><span>" + (d.value) + " %</span>");
              })
              .on("mouseout", function(d){ tooltip.style("display", "none");});

        series++;
      });
////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
.selectAll('svg')
.append('svg')
.attr("width", cfg.w +300)
.attr("height", cfg.h)

//Create the title for the legend
var text = svg.append("text")
.attr("class", "title")
.attr('transform', 'translate(90,0)')
.attr("x", cfg.w - 70)
.attr("y", 10)
.attr("font-size", "12px")
.attr("fill", "#404040")
.text("Different Stages");

var LegendOptions = ['Design','Requirement','Construction','In-Operation'];

//Initiate Legend
var legend = svg.append("g")
.attr("class", "legend")
.attr("height", 100)
.attr("width", 200)
.attr('transform', 'translate(90,20)')
;
//Create colour squares
legend.selectAll('rect')
  .data(LegendOptions)
  .enter()
  .append("rect")
  .attr("x", cfg.w - 65)
  .attr("y", function(d, i){ return i * 20;})
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", function(d, i){ return cfg.color(i);})
  ;
//Create text next to squares
legend.selectAll('text')
  .data(LegendOptions)
  .enter()
  .append("text")
  .attr("x",cfg.w - 52)
  .attr("y", function(d, i){ return i * 20 + 9;})
  .attr("font-size", "11px")
  .attr("fill", "#737373")
  .text(function(d) { return d; })
  ;
      }
  };
