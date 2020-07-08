// 1. ENERGY CHART
var margin_bar = {
    top: 40,
    right: 40,
    bottom: 20,
    left: 45
  },
  width_bar = 450 - margin_bar.left - margin_bar.right,
  height_bar = 330 - margin_bar.top - margin_bar.bottom;

var svg_bar = d3.select("#stage-chart-energy-stack").append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-15 0 450 350")

var makeTooltip =
function(d) {
  var self = this;
  div.transition()
    .duration(200)
    .style("opacity", .7);
  div.html(function() {
    var fill = d3.select(self.parentNode).attr('fill')
    if(d.data.Stage == "Operation")
      var multipleValue = filtered_data[0];
    if(d.data.Stage == "Design")
      var multipleValue = filtered_data[1];
    if(d.data.Stage == "Construction")
      var multipleValue = filtered_data[2];

    var finalmulti = multipleValue["Total energy use_kWh/m2 Atemp"]
    if (multipleValue["Locally generated electricity kWh/m2 Atemp"] != "NA" ||
      multipleValue["Locally generated electricity kWh/m2 Atemp"] != 0 ||
      multipleValue["Locally generated electricity kWh/m2 Atemp"] != null)
      finalmulti = finalmulti + multipleValue["Locally generated electricity kWh/m2 Atemp"]
    if (multipleValue["Locally generated heating kWh/m2 Atemp"] != "NA" ||
  multipleValue["Locally generated heating kWh/m2 Atemp"] != 0 ||
  multipleValue["Locally generated heating kWh/m2 Atemp"] != null)
      finalmulti = finalmulti + multipleValue["Locally generated heating kWh/m2 Atemp"]
      // console.log(multipleValue, finalmulti)
    var result = tooltipLegend[fill] + "<br> <div class='tooltipwrap'><div class='tooltiprect' style='background-color:"+fill+"'></div><span>"
    result += Math.round(finalmulti*(y_bar(d[0]) - y_bar(d[1]))/270) + "kWh/m2"
    return result + "</span></div>"
  })
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
}


var final_data = []
var tooltipLegend = {
  "#3182bd": "Heating (District heating)",
  "#6baed6": "Heating (Electricity)",
  "#9ecae1": "Hot water (District heating)",
  "#c6dbef": "Hot water (Electricity)",
  "#e6550d": "Property electricity",
  "#fd8d3c": "Locally generated electricity",
  "#fdae6b": "Locally generated heating",
  "#fdd0a2": "ETC (Detail is not provided)"
}
projects.forEach(project => {
  var operation = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
    "Stage": "Operation",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_in_operation,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_in_operation,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_in_operation,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_in_operation,
    "Hot water (Electricity) kWh/m2 Atemp": project.hot_water_electricity_kwhm2_atemp_in_operation,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_in_operation,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_in_operation,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_in_operation,
    "ETC": project.total_energy_use_kwhm2_atemp_in_operation
            + project.locally_generated_electricity_kwhm2_atemp_in_operation
            + project.locally_generated_heating_kwhm2_atemp_in_operation
            - project.heating_district_heating_kwhm2_atemp_in_operation
            - project.heating_electricity_kwhm2_atemp_in_operation
            - project.hot_water_district_heating_kwhm2_atemp_in_operation
            - project.hot_water_electricity_kwhm2_atemp_in_operation
            - project.locally_generated_electricity_kwhm2_atemp_in_operation
            - project.locally_generated_heating_kwhm2_atemp_in_operation
  };

  var construction = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
    "Stage": "Construction",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_construction,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_construction,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_construction,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_construction,
    "Hot water (Electricity) kWh/m2 Atemp": project.hot_water_electricity_kwhm2_atemp_construction,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_construction,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_construction,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_construction,
    "ETC": project.total_energy_use_kwhm2_atemp_construction
            + project.locally_generated_electricity_kwhm2_atemp_construction
            + project.locally_generated_heating_kwhm2_atemp_construction
            - project.heating_district_heating_kwhm2_atemp_construction
            - project.heating_electricity_kwhm2_atemp_construction
            - project.hot_water_district_heating_kwhm2_atemp_construction
            - project.hot_water_electricity_kwhm2_atemp_construction
            - project.locally_generated_electricity_kwhm2_atemp_construction
            - project.locally_generated_heating_kwhm2_atemp_construction
  };

  var design = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
    "Stage": "Design",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_design,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_design,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_design,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_design,
    "Hot water (Electricity) kWh/m2 Atemp": project.hot_water_electricity_kwhm2_atemp_design,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_design,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_design,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_design,
    "ETC": project.total_energy_use_kwhm2_atemp_design
            + project.locally_generated_electricity_kwhm2_atemp_design
            + project.locally_generated_heating_kwhm2_atemp_design
            - project.heating_district_heating_kwhm2_atemp_design
            - project.heating_electricity_kwhm2_atemp_design
            - project.hot_water_district_heating_kwhm2_atemp_design
            - project.hot_water_electricity_kwhm2_atemp_design
            - project.locally_generated_electricity_kwhm2_atemp_design
            - project.locally_generated_heating_kwhm2_atemp_design
  };

  final_data.push(operation);
  final_data.push(construction);
  final_data.push(design);
})

const color_red = 'red';
let co2Colors = d3.scaleLinear()
  .domain(d3.ticks(0, 50, 7))
  .range(['blue', 'rgb(0, 60, 200)', 'rgb(0, 90, 200)', 'rgb(0, 119, 210)', 'rgb(132,50,155)', 'rgb(220,68,5)', 'red']);

function animateValue(id, start, end, duration) {
  // assumes integer values for start and end

  var obj = document.getElementById(id);
  var range = end - start;
  // no timer shorter than 50ms (not really visible any way)
  var minTimer = 50;
  // calc step time to show all interediate values
  var stepTime = Math.abs(Math.floor(duration / range));

  // never go below minTimer
  stepTime = Math.max(stepTime, minTimer);

  // get current time and calculate desired end time
  var startTime = new Date().getTime();
  var endTime = startTime + duration;
  var timer;

  function run() {
    var now = new Date().getTime();
    var remaining = Math.max((endTime - now) / duration, 0);
    var value = Math.round(end - (remaining * range));
    obj.innerHTML = value;
    if (value >= 50)
      obj.style.color = 'red'
    else {
      obj.style.color = co2Colors(value)
    }
    if (value == end) {
      clearInterval(timer);
    }
  }

  timer = setInterval(run, stepTime);
  run();
}

var updateProjectView = () => {
  //change developer information

  projects.forEach(project => {
    if (project.fastighetsbeteckning == document.getElementById('dropdown').value) {
      document.querySelector("#detail_apart>span").innerHTML = project.no_of_appartments
      document.querySelector("#detail_atemp>span").innerHTML = project.atemp_m2
      document.querySelector("#detail_dev>span").innerHTML = project.developer
  		document.querySelector("#energy_req>span").innerHTML = project.requirement_level_kwhm2_atemp
  		document.querySelector("#energy_BBR>span").innerHTML = project.national_legislation_bbr
      // document.querySelector("#co2").innerHTML = Math.round(project.co2_emissions_tonnes,2)
      if (isNaN(project.co2_emissions_tonnes) == true)
        animateValue("co2", document.querySelector("#co2").innerHTML, 0, 500)
      else
        animateValue("co2", document.querySelector("#co2").innerHTML, Math.round(project.co2_emissions_tonnes, 2), 500)
      return;
    }
  })


}

var g_bar = svg_bar.append("g")
  .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var x_bar = d3.scaleBand()
  .rangeRound([0, width_bar])
  .paddingInner(0.1)
  .align(0.2);

var y_bar = d3.scaleLinear()
  .range([height_bar, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory20c);

var t = d3.transition()
  .duration(500);

var stack = d3.stack()
  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetExpand);

var selection = null;
var selectedProject = null;

var updateBarChart = (d) => {


  //change gauge
  dynamicGaugeHandler();

  //update project view
  updateProjectView();

  let selection = document.getElementById("dropdown");
  selectedProject = selection.value;

  let selectedCircle = svg.selectAll('circle').filter(function(d){
    if(d.fastighetsbeteckning == selectedProject) {
      svg.selectAll('circle')
        .attr('stroke', 'none')
        .attr('stroke-width', '0')
      this.parentNode.appendChild(this);
      d3.select(this)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    }
    return d.fastighetsbeteckning == selectedProject;

  });

  // console.log(selectedProject)
  filtered_data = final_data.filter(function(d) {
    return d.Fastighetsbeteckning == selectedProject;
  })

  x_bar.domain(filtered_data.map(function(d) {
    return d.Stage;
  }));



  stacked_data = stack.keys([
    //			  "Total energy use_kWh/m2 Atemp",
    "Heating (District heating) kWh/m2 Atemp",
    "Heating (Electricity) kWh/m2 Atemp",
    "Hot water (District heating) kWh/m2 Atemp",
    "Hot water (Electricity) kWh/m2 Atemp",
    "Property electricity  kWh/m2 Atemp",
    "Locally generated electricity kWh/m2 Atemp",
    "Locally generated heating kWh/m2 Atemp",
    "ETC"
  ])(filtered_data)



  // g_bar.selectAll(".serie").remove();
  var serie = g_bar.selectAll(".serie")
    .data(stacked_data)
    // .enter()
    .append("g")
    .attr("class", "serie")
    .attr("fill", function(d) {
      return z(d.key);
    });

  svg_bar.selectAll("rect")
    .attr('class', 'old')

  serie.selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function(d) {
      return x_bar(d.data.Stage);
    })

    //tooltips
    .on("mouseover", makeTooltip)
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .attr("width", x_bar.bandwidth())
    .transition().duration(500)
    .attr("y", function(d, i) {
      if(isNaN(d[1]) == true)
        return y_bar(0);
      else {
        return y_bar(d[1]);
      }
    })
    .attr("height", function(d, i) {
      return (y_bar(d[0]) - y_bar(d[1]));
    });

    svg_bar.selectAll(".total")
    .remove()
    //
    //	//add title for stacked barchart
    svg_bar.append('text')
    .attr("width", 100)
    .attr("height", 30)
    .attr("transform", "translate(93,30)")
    .attr("class", "total")
    .style("font-size", "20px")
    .text(function(d) { return Math.round(filtered_data[0]["Total energy use_kWh/m2 Atemp"])});

    //	//add title for stacked barchart
    svg_bar.append('text')
    .attr("width", 100)
    .attr("height", 30)
    .attr("transform", "translate(214,30)")
    .attr("class", "total")
    .style("font-size", "20px")
    .text(function(d) { return Math.round(filtered_data[1]["Total energy use_kWh/m2 Atemp"])});

    //	//add title for stacked barchart
    svg_bar.append('text')
    .attr("width", 100)
    .attr("height", 30)
    .attr("transform", "translate(340,30)")
    .attr("class", "total")
    .style("font-size", "20px")
    .text(function(d) { return Math.round(filtered_data[2]["Total energy use_kWh/m2 Atemp"])});
   //remove
    svg_bar.selectAll(".old")
     .remove()
}
var selector = d3.select("#drop2")
  .append("select")
  .attr("id", "dropdown")
  .attr("class", "custom-select")
  .on("change", updateBarChart);

//map update
svg.selectAll('circle')
  .on('click.bar', function(d) {
    var elements = [];
    projects.forEach(project => {
      if (project.phase == d.phase) {
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

    document.getElementById('dropdown').value = unicodeToChar(d.fastighetsbeteckning);

    let ph = phases[requirements_number[d.phase]][phases[requirements_number[d.phase]].length-1]
    changeInformation(ph.phase, ph.stage, ph.apartment, ph.developer, ph.year_start, ph.year_end)

    updateProjectView(d);
    updateBarChart(d)
  });


svg.selectAll('polygon')
  .on('click.bar', function(d){

    updateBarChart(d)
  });

var elements = [];
projects.forEach(project => {
  if (project.phase == "Norra 2") {
    elements.push(project.fastighetsbeteckning)
  }
})

var selector = d3.select("#dropdown");
selector.selectAll("option")
  .data(elements).enter()
  .append("option")
  .attr("value", function(d) {
    return d;
  })
  .text(function(d) {
    return d;
  })

projects.forEach(project => {
  if (project.fastighetsbeteckning == document.getElementById('dropdown').value) {
    document.querySelector("#detail_apart>span").innerHTML = project.no_of_appartments
    document.querySelector("#detail_atemp>span").innerHTML = project.atemp_m2
    document.querySelector("#detail_dev>span").innerHTML = project.developer
	document.querySelector("#energy_req>span").innerHTML = project.requirement_level_kwhm2_atemp
	document.querySelector("#energy_BBR>span").innerHTML = project.national_legislation_bbr
    animateValue("co2", 0, Math.round(project.co2_emissions_tonnes, 2), 500)
    return;
  }
})


sortSelect(document.getElementById('dropdown'))
document.getElementById('dropdown').value = "Sonfjället 2";
animateValue("co2", 0, document.querySelector("#co2").innerHTML, 500)
dynamicGaugeHandler();

var selection = document.getElementById("dropdown");
var selectedProject = selection.value;

// var selection = document.getElementById("dropdown");
// var selectedProject = selection.value;

let filtered_data = final_data.filter(function(d) {
  return d.Fastighetsbeteckning == selectedProject;
})
  // filtered_data.sort(function(a, b) { return b.Total-a.Total; });

// x_bar.domain(filtered_data.map(function(d) {
//   return d.Stage;
// }));

x_bar.domain(filtered_data.map(function(d) {
   return d.Stage;
 }));
let stacked_data = stack.keys([
  // "Total energy use_kWh/m2 Atemp",
  "Heating (District heating) kWh/m2 Atemp",
  "Heating (Electricity) kWh/m2 Atemp",
  "Hot water (District heating) kWh/m2 Atemp",
  "Hot water (Electricity) kWh/m2 Atemp",
  "Property electricity  kWh/m2 Atemp",
  "Locally generated electricity kWh/m2 Atemp",
  "Locally generated heating kWh/m2 Atemp",
  "ETC"
])(filtered_data)

var serie = g_bar.selectAll(".serie")
  .data(stacked_data)
  .enter()
  .append("g")
  .attr("class", "serie")
  .attr("fill", function(d) {
    return z(d.key);
  });

serie.selectAll("rect")
  .data(function(d) {
    return d;
  })
  .enter().append("rect")
  .attr("x", function(d) {
    return x_bar(d.data.Stage);
  })
  .on("mouseover", makeTooltip)
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  })
  .attr("y", function(d) {
    return y_bar(d[1]);
  })
  .attr("height", function(d) {
    return y_bar(d[0]) - y_bar(d[1]);
  })
  .attr("width", x_bar.bandwidth());



z.domain([
  "Heating (District heating) kWh/m2 Atemp",
  "Heating (Electricity) kWh/m2 Atemp",
  "Hot water (District heating) kWh/m2 Atemp",
  "Hot water (Electricity) kWh/m2 Atemp",
  "Property electricity  kWh/m2 Atemp",
  "Locally generated electricity kWh/m2 Atemp",
  "Locally generated heating kWh/m2 Atemp",
  "ETC"
]);

g_bar.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height_bar + ")")
  .call(d3.axisBottom(x_bar));

g_bar.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y_bar).ticks(10, "p"));

  svg_bar.append('text')
	.attr("width", 100)
	.attr("height", 30)
	.attr("transform", "translate(93,30)")
	.attr("class", "total")
	.style("font-size", "20px")
	.text(function(d) { return Math.round(filtered_data[0]["Total energy use_kWh/m2 Atemp"])});

//	//add title for stacked barchart
	svg_bar.append('text')
	.attr("width", 100)
	.attr("height", 30)
	.attr("transform", "translate(214,30)")
	.attr("class", "total")
	.style("font-size", "20px")
	.text(function(d) { return Math.round(filtered_data[1]["Total energy use_kWh/m2 Atemp"])});

//	//add title for stacked barchart
	svg_bar.append('text')
	.attr("width", 100)
	.attr("height", 30)
	.attr("transform", "translate(340,30)")
	.attr("class", "total")
	.style("font-size", "20px")
	.text(function(d) { return Math.round(filtered_data[2]["Total energy use_kWh/m2 Atemp"])});



  svg_bar.select(".axis--x")
    .selectAll("text")
    .style("font-size", "18px")

  svg_bar.select(".axis--y")
    .selectAll("text")
    .style("font-size", "14px")


  svg.selectAll('circle').filter(function(d){
    if(d.fastighetsbeteckning == selectedProject) {
      svg.selectAll('circle')
        .attr('stroke', 'none')
        .attr('stroke-width', '0')
      this.parentNode.appendChild(this);
      d3.select(this)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    }
  });
