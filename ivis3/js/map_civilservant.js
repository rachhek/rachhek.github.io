
function unicodeToChar(text) {
 return text.replace(/\\u[\dA-F]{4}/gi,
  function (match) {
       return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}

const color_meet = 'rgb(0,126,196)';
const color_below = 'rgb(196,0,104)';
const normal_opacity = 0.7;
const hover_opacity = 0.5;
const click_opacity = 0.8;

let year_start = 2004;
let year_start_end = 2013;
let clicked = false;
let currentView = "energy";
let margin = {top: 0, right: 10, bottom: 0, left: 0},
    width = 940 - margin.left - margin.right,
    height = 660 - margin.top - margin.bottom;

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
  clicked = false;
  // document.querySelector('.graph').style.display = 'none';
  allInitialize();
});

let x1 = d3.scaleLinear().range([0, 947.8]);
let y1 = d3.scaleLinear().range([668.6, 0]);

x1.domain([0, 100]);
y1.domain([100, 0]);

let changeInformation = (phase, stage, apartment, developer, year_start, year_end) => {
  document.querySelector("#phase").innerHTML = phase;
  document.querySelector("#stage").innerHTML = stage;
  document.querySelector("#apartment").innerHTML = apartment;
  document.querySelector("#developer").innerHTML = developer;
  document.querySelector("#year_start").innerHTML = year_start;
  document.querySelector("#year_end").innerHTML = year_end;
}

let allInitialize = function() {
  g.selectAll(".mapPolygon")
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
  clicked = true;
  allInitialize();
  d3.select(this).style("cursor", "pointer");
  svg.selectAll(".mapCircle")
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
  button.select('text')
    .text("Phase View")
  d3.select(this)
    .attr("fill","rgb(104, 55, 136)")
    .attr("fill-opacity", click_opacity)

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
  updateDevelopersAndScale(d[d.length-1].phase);
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


g.selectAll(".mapPolygon")
  .data(phases)
  .enter().append("polygon")
  .attr("points",function(d) {
      return d.map(function(d) {
        // console.log(x1(d.x),y1(d.y), d.x, d.y)

          if(d.x == null){
            return;
          }else{
            return [x1(d.x),y1(d.y)].join(",");
          }
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
  .style("stroke-opacity", 1)
  .attr("class","mapPolygon")
  ;

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
  if(val == "car_parking_spacesappartment") {
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
  if(criteria == null) {
    return "rgb(0,126,196)";
  } else if ( compared < criteria) {
    return "rgb(196,0,104)";
  } else {
    return "rgb(0,126,196)";
  }
}

document.getElementById("colorBox").onchange = () => {
  svg.selectAll(".mapCircle").attr("fill", fillEachDots)
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
  svg.selectAll(".mapCircle")
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
  .attr("class","mapCircle")
  .attr("r", 5)
  .attr("cx", (d) => {
    return x1(getCoordinateValue(d["coordinates"].split(',')[0], 'x')+0.5)
  })
  .attr("cy", (d) => y1(getCoordinateValue(d["coordinates"].split(',')[1], 'y')-0.3))
  .attr("fill", fillEachDots)
  .attr("fill-opacity", 0.8)
  .style('display', 'none')
  .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .7);
       div.html(unicodeToChar(d.fastighetsbeteckning))
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
   .on("mouseout", function(d) {
     div.transition()
       .duration(500)
       .style("opacity", 0);
     });

svg.selectAll(".mapPolygon")
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
      svg.selectAll(".mapCircle")
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
    }else {
      t.text("Phase View")
      .attr('font-size', '15')
      svg.selectAll(".mapCircle")
      .style('display', 'none')
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    }
  });

let fillDots = (currentView) => {

  g.selectAll(".mapCircle")
    .attr("fill", fillEachDots);
}

let filters = document.querySelectorAll('.filterButton');
filters.forEach(filter => {
  filter.onclick = e => {
    if(e.target.classList.contains("active")) {
      switch(e.target.id) {
        case "nodata":
          d3.selectAll(".mapCircle").filter(function(){
            return d3.select(this).attr('fill') == 'black'
          }).style('display', 'none');
          break;
        case "meet":
          d3.selectAll(".mapCircle").filter(function(){
            return d3.select(this).attr('fill') == color_meet
          }).style('display', 'none');
          break;
        case "below":
          d3.selectAll(".mapCircle").filter(function(){
            return d3.select(this).attr('fill') == color_below
          }).style('display', 'none');
          break;
      }
    }else {
      switch(e.target.id) {
        case "nodata":
          d3.selectAll(".mapCircle").filter(function(){
            return d3.select(this).attr('fill') == 'black'
          }).style('display', 'block');
          break;
        case "meet":
          d3.selectAll(".mapCircle").filter(function(){
            return d3.select(this).attr('fill') == color_meet
          }).style('display', 'block');
          break;
        case "below":
          d3.selectAll(".mapCircle").filter(function(){
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
  .text("Phase View")
  .attr('font-size', '15')
  .attr("transform", "translate(7,24)")
  .attr("fill", "white")

changeSize();
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));
//
// svg.append("g")
//   .call(d3.axisLeft(y));
