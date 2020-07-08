function unicodeToChar(text) {
 return text.replace(/\\u[\dA-F]{4}/gi,
  function (match) {
       return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}

function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

const color_meet = 'rgb(0,126,196)';
const color_below = 'rgb(196,0,104)';
const normal_opacity = 0.7;
const hover_opacity = 0.5;
const click_opacity = 0.8;

let zoomLevel = "whole";
let currentView = "politician";
let currentPhase = "Norra 2";
let year_start = 2004;
let year_start_end = 2013;
let clicked = false;
let margin = {top: 0, right: 10, bottom: 0, left: 0},
    width = 940 - margin.left - margin.right,
    height = 660 - margin.top - margin.bottom;
let isBubbleCall = false;

let zoom = d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([[0,0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);
let mapColors = d3.scaleLinear()
                .domain(d3.ticks(year_start, year_start_end,2))
                .range(['rgb(0,0,0)', 'rgb(104, 55, 136)']);
let svg = d3.select("#map").append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 940 660")

let g = svg.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
  // .call(zoom) // mouse zooming

function zoomed(){
  g.attr("transform", d3.event.transform);
}

g.append("image")
.attr("xlink:href", "./pictures/map.jpg")
.attr("width", 947.8)
.attr("height", 668.6)
.on("click", function(d){
  // clicked = false;
  // var selector = d3.select("#dropdown");
  // selector.selectAll("option").remove();
  // changeInformation("","","","","","")
  // document.querySelector('.graph').style.display = 'none';
  // allInitialize();
});

let x = d3.scaleLinear().range([0, 947.8]);
let y = d3.scaleLinear().range([668.6, 0]);

x.domain([0, 100]);
y.domain([100, 0]);

let changeInformation = (phase, stage, apartment, developer, year_start, year_end) => {
  document.querySelector("#phase").innerHTML = phase;
  document.querySelector("#stage").innerHTML = stage;
  document.querySelector("#apartment").innerHTML = apartment;
  document.querySelector("#developer").innerHTML = developer;
  document.querySelector("#year_start").innerHTML = year_start;
  document.querySelector("#year_end").innerHTML = year_end;
  if(stage == "In Operation"){
    $(".phase").css("background-color", "var(--darkGreen)");
    $(".phase-bar").css("background-color", "var(--darkGreen)");


  }
  else if (stage == "Construction"){
    $(".phase").css("background-color", "var(--darkOrange)");
    $(".phase-bar").css("background-color", "var(--darkOrange)");

  }
}

let allInitialize = function() {
  g.selectAll("polygon")
  .attr("fill", d => mapColors(d[d.length-1].year_start))
  .attr("fill-opacity", normal_opacity);
}

let mouseoverPhase = function (d, i) {
  d3.select(this).style("cursor", "pointer");
  d3.select(this)
    .attr("fill-opacity", d => {
      if(d3.select(this).attr("fill-opacity") != click_opacity) {
        return hover_opacity;
      } else {
        return click_opacity;
      }
    });
}

let clickPhase = function (d, i) {
  if (clicked == true && currentPhase == d[d.length-1]['phase']) {

    // console.log("transition")
    svg.transition()
    .duration(750)
    .call( zoom.transform, d3.zoomIdentity.scale(2.5) );
    zoomLevel = "phase";
    clicked = false;
    let t = d3.select('.viewtext')
    t.text("Whole View")
    return;

  }
  zoomLevel = "detail";
  clicked = true;
  allInitialize();
  var phase = d[d.length-1]['phase'];
  var elements = [];
  projects.forEach(project => {
    if (project.phase == phase) {
      elements.push(project.fastighetsbeteckning)
    }
  })

  var selector = d3.select("#dropdown");
  selector.selectAll("option").remove();
  selector.selectAll("option")
    .data(elements).enter()
    .append("option")
    .attr("value", function(d){
      return d;
    })
    .text(function(d){
      return d;
    })
  sortSelect(document.getElementById('dropdown'))
  d3.select(this).style("cursor", "pointer");

  svg.selectAll('circle')
  .filter(function(){
    let circleColor = d3.select(this).attr('fill')
    let availableColor = [];
    let filters = document.querySelectorAll('.filterButton.active');
    filters.forEach(filter => {
      if (filter.id == 'meet'){
        availableColor.push(color_meet);
      }else if (filter.id == 'below'){
        availableColor.push(color_below);
      }else{
        availableColor.push('black')
      }
    });
    return availableColor.includes(circleColor)
  })
  .style('display', 'block')
  // .append('text')
  // .text(d => {
  //   var e = document.getElementById("colorBox");
  //   var crit = e.options[e.selectedIndex].value;
  //   let criteria = getCriteriaValue(d, crit)
  //   let compared = getComparingValue(d, crit)
  //   return Math.round(100*(compared/criteria))
  // })
  button.select('text')
    .text("Phase View")
  d3.select(this)
    .attr("fill","rgb(104, 55, 136)")
    .attr("fill-opacity", click_opacity)
  // console.log(d[d.length-1].phase, d[d.length-1].stage, d[d.length-1].apartment, d[d.length-1].developer, d[d.length-1].year_start, d[d.length-1].year_end)
  changeInformation(d[d.length-1].phase, d[d.length-1].stage, d[d.length-1].apartment, d[d.length-1].developer, d[d.length-1].year_start, d[d.length-1].year_end)
  // console.log(i)
  if (i == 0){
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*20, -d[i].y*60).scale(9) );
  } else if (i==1) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*32, -d[i].y*50).scale(7.5) );
  } else if (i==2) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*55, -d[i].y*35).scale(10) );

  } else if (i==3) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*60, -d[i].y*20).scale(10) );

  } else if (i==4) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*80, -d[i].y*68).scale(11) );

  } else if (i==5) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*30, -d[i].y*37).scale(7) );

  } else if (i==6) {
    svg.transition()
    .duration(750)
    // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
    .call( zoom.transform, d3.zoomIdentity.translate(-d[i].x*20, -d[i].y*25).scale(6) );

  }
  currentPhase = d[d.length-1]['phase'];

  updateProjectView();
  dynamicGaugeHandler();
  updateDevelopersAndScale(d[d.length-1].phase);

  // bubble chart update
  svg.selectAll('circle').filter(function(dd){
    // console.log("haha", dd.phase, currentPhase, dd.fastighetsbeteckning, document.getElementById('dropdown').value)
    if(dd.phase == currentPhase && dd.fastighetsbeteckning == document.getElementById('dropdown').value) {
      // console.log("hej hej", currentPhase, dd.developer)
      d3.select('#bubbleSvg').selectAll('circle').filter(function(ddd) {
        if(ddd.data != undefined && dd.developer == ddd.data.developer) {
          d3.select(this).dispatch('click');
        }
      });
      // RadarChart.draw("#radarchart-item", format_data({"phase":currentPhase, "developer": dd.developer}), config);
    }
  })

}

let mouseoutPhase = function (d, i) {
    d3.select(this)
      .attr("fill", d => {
        if(d3.select(this).attr("fill-opacity") != click_opacity) {
          return mapColors(d[d.length-1].year_start);
        } else {
          return "rgb(104, 55, 136)";
        }
      })
      .attr("fill-opacity", d => {
        if(d3.select(this).attr("fill-opacity") != click_opacity) {
          return normal_opacity;
        } else {
          return click_opacity;
        }
      });
}
let phase = 0;


g.selectAll("polygon")
  .data(phases)
  .enter().append("polygon")
  .attr("points",function(d) {
      return d.map(function(d) {
          return [x(d.x),y(d.y)].join(",");
      }).join(" ");
  })
  .attr("fill", d => mapColors(d[d.length-1].year_start))
  .attr("id", function() {
    phase = phase + 1;
    return "phase"+phase;
  })
  .attr("fill-opacity", normal_opacity)
  .style("stroke", "yellow")
  .style("stroke-width", 1.5)
  .style("stroke-opacity", 1);

let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let getComparingValue = (d, val) => {
  return d[val]
};

let getCriteriaValue = (d, val) => {
  let num = requirements_number[d.phase]
  // console.log(num, requirements[num])
  if(val == "total_energy_use_kwhm2_atemp_in_operation") {
    return requirements[num]['measured_energy_use']
  }
  if(val == "total_no._bicycle_parkingspace") {
    return requirements[num]['bicycle_parking_spacesappartment']
  }
  if(val == "car_parking_spacesapartment") {
    return requirements[num]['car_parking_spacesappartment']
  }
  if(val == "locally_generated_electricity_kwhm2_atemp_in_operation") {
    return requirements[num]['locally_generated_energy']
  }
  if(val == "locally_generated_heating_kwhm2_atemp_in_operation") {
    return requirements[num]['locally_generated_energy']
  }
  if(val == "green_space_index_gsi_in_operation") {
    return requirements[num]['green_space_index']
  }
  if(val == "chare_of_electrical_charging_pointsb") {
    return requirements[num]['electrical_vehicle_charging_points']
  }
  if(val == "co2_emissions_tonnes") {
    return 50
  }
  if(val == "construction_waste_kgm2_gfa") {
    return requirements[num]['construction_waset']
  }
  if(val == "distance_to_recycling_room_m") {
    return requirements[num]['longest_distance_to_recycling_room']
  }
  if(val == "distance_to_vwc_m") {
    return requirements[num]['longest_distance_from_entrance_to_vwc']
  }
};

let fillEachDots = (d) => {
  var e = document.getElementById("colorBox");
  var crit = e.options[e.selectedIndex].value;
  let criteria = getCriteriaValue(d, crit)
  let compared = getComparingValue(d, crit)

  if(compared == null || compared == "NA") {
    return "black";
  }

  if (crit == 'total_energy_use_kwhm2_atemp_in_operation' || crit == "car_parking_spacesapartment") {
    if(criteria == null) {
      return "rgb(0,126,196)";
    } else if ( compared > criteria) {
      return "rgb(196,0,104)";
    } else {
      return "rgb(0,126,196)";
    }
  }else {
    if(criteria == null) {
      return "rgb(0,126,196)";
    } else if ( compared <= criteria) {
      return "rgb(196,0,104)";
    } else {
      return "rgb(0,126,196)";
    }
  }

}

document.getElementById("colorBox").onchange = () => {
  g.selectAll("circle").attr("fill", fillEachDots)
};

let getMinMax = (crit) => {
  let arr = []
  projects.forEach(project => {
    arr.push(project[crit])
  })

  for(let i=0;i<arr.length;i++){
    if(arr[i]== "NA" || isNaN(arr[i]) == true || arr[i] === undefined || arr[i] === null){
      arr[i] = 0;
    }
  }
  // console.log(arr)
  let minmax = [Math.min(...arr), Math.max(...arr)]
  return minmax;
}

let changeSize = () => {
  var e = document.getElementById("sizeBox");
  var crit = e.options[e.selectedIndex].value;
  let minmax = getMinMax(crit);
  let sizes = d3.scaleLinear()
                  .domain([minmax[0], minmax[1]])
                  .range([5, 10]);

  // console.log(minmax)
  svg.selectAll('circle')
    .transition()
    .attr("r", (d) => {
      // console.log(d)
      if(d != undefined) {
        // console.log(d[crit], d[crit] == undefined)
        if(isNaN(d[crit]) == true || d[crit] == undefined || d[crit] == null) {
          return sizes(0)
        }
        else
          return sizes(d[crit])
      }
    });
  //change dots size

}
document.getElementById("sizeBox").onchange = changeSize;

let getCoordinateValue = (data, type) => {
  let min_x = 154630
  let min_y = 6580208
  let max_x = 158596
  let max_y = 6582996
  data = parseInt(data)
  if (type == 'x')
    return (data - min_x) / (max_x - min_x) * 100

  if (type == 'y')
    return (data - max_y) / (min_y - max_y) * 100
}

g.selectAll('.dot')
  .data(projects).enter()
  .append("circle")
  .attr("r", 5)
  .attr("cx", (d) => {
    return x(getCoordinateValue(d["coordinates"].split(',')[0], 'x')+0.5)
  })
  .attr("cy", (d) => y(getCoordinateValue(d["coordinates"].split(',')[1], 'y')-0.3))
  .attr("fill", fillEachDots)
  .attr("fill-opacity", 0.8)
  .style('display', 'none')
  .style('cursor', 'pointer')
  .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .7);
       div.html(function() {
         var result = ""
         var color_e = document.getElementById("colorBox");
         var color_crit = d[color_e.options[color_e.selectedIndex].value];
         var size_e = document.getElementById("sizeBox");
         var size_crit =  d[size_e.options[size_e.selectedIndex].value];

         result += unicodeToChar(d.fastighetsbeteckning)
         result += "<br>Size: "+Math.round(100*size_crit)/100;
         result += "<br>Color: "+Math.round(100*color_crit)/100;


         return result;
       })
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
   .on("mouseout", function(d) {
     div.transition()
       .duration(500)
       .style("opacity", 0);
     })
    .on("click", function(d) {
      svg.selectAll('circle')
        .attr('stroke', 'none')
        .attr('stroke-width', '0')
      this.parentNode.appendChild(this);
      d3.select(this)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
      document.getElementById('dropdown').value = unicodeToChar(d.fastighetsbeteckning);
      //update project view
      updateProjectView();
      dynamicGaugeHandler();


      //zooming
      if (d.phase == "Norra 1"){
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[0][0].x*20, -phases[0][0].y*60).scale(9) );
      } else if (d.phase=="Västra") {
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[1][1].x*32, -phases[1][1].y*50).scale(7.5) );
      } else if (d.phase == "Norra 2") {
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[2][2].x*55, -phases[2][2].y*35).scale(10) );

      } else if (d.phase == "Brofästet") {
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[3][3].x*60, -phases[3][3].y*20).scale(10) );

      } else if (d.phase=="Värtahamnen") {
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[4][4].x*80, -phases[4][4].y*68).scale(11) );

      } else if (d.phase=="Gasverket") {
        svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(-phases[5][5].x*30, -phases[5][5].y*37).scale(7) );
      }

      if (isBubbleCall == false) {
        // Redraw bubble!!!
        if(currentPhase != d.phase) {
          updateDevelopersAndScale(d.phase);
        }

        // update bubble
        d3.selectAll('.bubbleCircle').filter(function(){
          return d3.select(this).attr("name") == d.developer;
        }).dispatch('click')


        currentPhase = d.phase;
      } else {
        isBubbleCall == false;
      }

    });


// elemEnter.append("text")
//    .text(function(d) {
//      return d.label
//    })
//    .attr({
//      "text-anchor": "middle",
//      "font-size": function(d) {
//        return d.r / ((d.r * 10) / 100);
//      },
//      "dy": function(d) {
//        return d.r / ((d.r * 25) / 100);
//      }
//    });
svg.selectAll("polygon")
  .on('mouseover', mouseoverPhase)
  .on('click', clickPhase)
  .on('mouseout', mouseoutPhase);

let button = svg.append("g")
  .attr("width", 100)
  .attr("height", 40)
  .attr("transform", "translate("+(width-120)+",20)")
  .on("mouseover", function(d) {
    d3.select(this).style("cursor", "pointer");
  })
  .on("click", function(d) {
    let t = d3.select(this).select('text')
    if(t.text() == "Phase View") {
      svg.selectAll('circle')
      .filter(function(){
        let circleColor = d3.select(this).attr('fill')
        let availableColor = [];
        let filters = document.querySelectorAll('.filterButton.active');
        filters.forEach(filter => {
          if (filter.id == 'meet'){
            availableColor.push(color_meet);
          }else if (filter.id == 'below'){
            availableColor.push(color_below);
          }else{
            availableColor.push('black')
          }
        });
        return availableColor.includes(circleColor)
      })
      .style('display', 'block')
      t.text("Whole View")
      .attr('font-size', '15')
      svg.transition()
      .duration(750)
      // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity.scale(2.5) );
      // clicked = true;
      zoomLevel = "phase";

    }else {
      t.text("Phase View")
      .attr('font-size', '15')
      svg.selectAll('circle')
      .style('display', 'none')
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);

        zoomLevel = "whole";
      clicked = false;
    }
  });

let fillDots = (currentView) => {

  g.selectAll('circle')
    .attr("fill", fillEachDots);
}

let filters = document.querySelectorAll('.filterButton');
filters.forEach(filter => {
  filter.onclick = e => {
    console.log(zoomLevel)
    if(zoomLevel == "whole") {
      return;
    };
    if(e.target.classList.contains("active")) {
      switch(e.target.id) {
        case "nodata":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == 'black'
          }).style('display', 'none');
          break;
        case "meet":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == color_meet
          }).style('display', 'none');
          break;
        case "below":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == color_below
          }).style('display', 'none');
          break;
      }
    }else {
      switch(e.target.id) {
        case "nodata":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == 'black'
          }).style('display', 'block');
          break;
        case "meet":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == color_meet
          }).style('display', 'block');
          break;
        case "below":
          svg.selectAll('circle').filter(function(){
            return d3.select(this).attr('fill') == color_below
          }).style('display', 'block');
          break;
      }
    }
  }
})

button.append('rect')
  .attr("width", 100)
  .attr("height", 40)
  .attr("fill", "rgb(196,0,104)")

button.append('text')
  .attr('class', 'viewtext')
  .text("Phase View")
  .attr('font-size', '15')
  .attr("transform", "translate(7,24)")
  .attr("fill", "white")

let toggleView = () => {
  if(currentView == "politician") {
    document.querySelector(".phase-detail").style.display = 'none';
    document.querySelector(".developer-tool-container").style.display = 'grid';
    document.querySelector("#swapPage").text = 'Phases Overview';
    document.querySelector("#help").setAttribute("onclick", "civilIntro();")
    currentView = "servants"
  } else {
    document.querySelector(".phase-detail").style.display = 'grid';
    document.querySelector(".developer-tool-container").style.display = 'none';
    document.querySelector("#swapPage").text = 'Compare Developers';
    document.querySelector("#help").setAttribute("onclick", "runIntro();")
    currentView = "politician"
  }
}

// gradient thing
var legend_map = svg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend_map.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#000000")
      .attr("stop-opacity", 1);

    legend_map.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgb(132,50,155)")
      .attr("stop-opacity", 1);

    svg.append("rect")
      .attr("width", 200)
      .attr("height", 50 - 30)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(50,600)");

    var y_legend = d3.scaleLinear()
      .range([200, 0])
      .domain([2013, 2004]);

    var yAxis_legend = d3.axisBottom()
      .scale(y_legend)
      .tickFormat(d3.format("d"))
      .tickValues(["2004", "2013"])

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,620)")
      .call(yAxis_legend)
      .style('font-size', "14px")
    svg.append("text")
      .attr("width", 200)
      .attr("height", 20)
      .attr("transform", "translate(120,635)")
      .style("text-anchor", "center")
      .style('font-size', "14px")
      .text("Start year");

let initial_phase = phases[requirements_number["Norra 2"]][phases[requirements_number["Norra 2"]].length-1]
changeSize();
changeInformation(initial_phase.phase, initial_phase.stage, initial_phase.apartment, initial_phase.developer, initial_phase.year_start, initial_phase.year_end)
