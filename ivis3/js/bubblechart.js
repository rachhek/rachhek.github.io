
jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("click");
    e.dispatchEvent(evt);
  });
};

var diameter = 270;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var currentSelectedPhase;
var phaseData = "";
let chare_of_electrical_charging_points_scale = d3.scaleLinear().range([0, 10]);
let bicycle_parking_spacesapartment_scale = d3.scaleLinear().range([0, 10]);
let car_parking_spacesapartment_scale = d3.scaleLinear().range([0, 10]);
let total_energy_use_construction_scale = d3.scaleLinear().range([0, 10]);
let green_space_index_gsi_construction_scale = d3.scaleLinear().range([0, 10]);
var totalvalue_scale = d3.scaleLinear().domain([0, 500]).range([0, 100]);
var firstbubble = null;
var radius_scale = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 200]);


//setting weights
var skill_wt_dict = {
    "chare_of_electrical_charging_points_wt": 5,
    "bicycle_parking_spacesapartment_wt": 5,
    "car_parking_spacesapartment_wt": 5,
    "total_energy_use_construction_wt": 5,
    "green_space_index_gsi_construction_wt": 5
};

//Calculate the weighted sum
function calculate_total_score() {
    phaseData.forEach(developer => {
        developer.tot_score = 0;
        var sum = 0;
        developer["bicycle_parking_spacesapartment_construction"] = developer["bicycle_parking_spacesapartment_construction"] == "NA" ? 0 : developer["bicycle_parking_spacesapartment_construction"];
        developer["car_parking_spacesapartment"] = developer["car_parking_spacesapartment"] == "NA" ? 0 : developer["car_parking_spacesapartment"];
        sum = chare_of_electrical_charging_points_scale(developer["chare_of_electrical_charging_points"]) * skill_wt_dict["chare_of_electrical_charging_points_wt"] +
            bicycle_parking_spacesapartment_scale(developer["bicycle_parking_spacesapartment_construction"]) * skill_wt_dict["bicycle_parking_spacesapartment_wt"] +
            car_parking_spacesapartment_scale(developer["car_parking_spacesapartment"]) * skill_wt_dict["car_parking_spacesapartment_wt"] +
            total_energy_use_construction_scale(developer["total_energy_use_kwhm2_atemp_construction"]) * skill_wt_dict["total_energy_use_construction_wt"] +
            green_space_index_gsi_construction_scale(developer["green_space_index_gsi_construction"]) * skill_wt_dict["green_space_index_gsi_construction_wt"];
        developer.tot_score = totalvalue_scale(sum);
    });
}

//function for returning colors based on grade of the score
function developer_circle_color(total_score) {
    if (total_score > 60) {
        return "rgb(0,164,153)";
    } else if (total_score > 30) {
        return "rgb(0, 119, 200)";
    }
    else {
        return "rgb(206,0,88)";
    }
}

//function to create bubble chart
function createBubbleChart(phaseName) {
    var dataset = { "children": phaseData };
    switch(phaseName) {
      case "Norra 2":
        var bubble = d3.pack(dataset)
            .size([500, 330])
            .padding(1.2);
        var svg_bubble = d3.select("#bubblechartarea")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 40 500 270")
            .attr("margin","0")
            .attr("id", "bubbleSvg")
            .attr("class", "bubble");
        break;
      case "Norra 1":
        var bubble = d3.pack(dataset)
            .size([500, 360])
            .padding(1.2);
        var svg_bubble = d3.select("#bubblechartarea")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 30 500 270")
            .attr("margin","0")
            .attr("id", "bubbleSvg")
            .attr("class", "bubble");
        break;
      case "Västra":
        var bubble = d3.pack(dataset)
            .size([500, 300])
            .padding(1.2);
        var svg_bubble = d3.select("#bubblechartarea")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 -10 500 270")
            .attr("margin","0")
            .attr("id", "bubbleSvg")
            .attr("class", "bubble");
          break;
      default:
        var bubble = d3.pack(dataset)
            .size([500, 270])
            .padding(1.2);
        var svg_bubble = d3.select("#bubblechartarea")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 500 270")
            .attr("margin","0")
            .attr("id", "bubbleSvg")
            .attr("class", "bubble");

    }


    firstbubble = bubble;

    //Container for the gradients
    var defs = svg_bubble.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id", "glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "3.5")
        .attr("result", "coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");


    var nodes = d3.hierarchy(dataset)
        .sum(function (d) { return d.tot_score; });

    var node = svg_bubble.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function (d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    var circle = node.append("circle")
        .attr("class","bubbleCircle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            return developer_circle_color(d.data.tot_score);
        })
        .attr("name", function(d) {
          return d.data.developer;
        })
        .style("opacity", 0.8)
        .on("mouseover", function (d,i) {
            if(bubble.selected!=i){
                d3.select(this).style("filter", null);
                d3.select(this).style("stroke","var(--yellow)");

                d3.select(this).style("stroke-width","5");
            }
            d3.select(this).style("cursor", "pointer");
            d3.select(this).style("filter", "url(#glow)");
            tooltip.html("<strong>Developer" + ": " + d.data.developer+"</strong>");
            tooltip.append("div").text("Bicycle parkings" + ": " + d.data.bicycle_parking_spacesapartment_construction);
            tooltip.append("div").text("Total energy" + ": " + Math.round(100*d.data.total_energy_use_kwhm2_atemp_construction)/100);
            tooltip.append("div").text("Car parkings" + ": " + d.data.car_parking_spacesapartment);
            tooltip.append("div").text("Electrical charging points" + ": " + d.data.chare_of_electrical_charging_points);
            tooltip.append("div").text("Green Space Index" + ": " + d.data.green_space_index_gsi_construction);
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function (d,i) {
            if(bubble.selected!=i){
                d3.select(this).style("filter", null);
                d3.select(this).style("stroke",null);
                d3.select(this).style("stroke-width",null);
            }else{

            }
            return tooltip.style("visibility", "hidden"); })
        .on("click", function (d,i) {
            d3.selectAll(".bubbleCircle").style("filter",null);
            d3.selectAll(".bubbleCircle").style("stroke",null);
            d3.selectAll(".bubbleCircle").style("stroke-width",null);
            d3.selectAll(".bubbleCircle").style("opacity",0.8);
            d3.selectAll(".bubbleCircle").attr("class", "bubbleCircle")

            document.querySelector('#devphase').innerHTML = d.data.phase;
            document.querySelector('#devname').innerHTML = d.data.developer;
            d3.select(this).style("stroke","var(--yellow)");
            d3.select(this).style("stroke-width","5");
            d3.select(this).style("opacity",1);
            d3.select(this).attr("class","bubbleCircle clicked");

            if(zoomLevel == "whole"){
              zoomLevel == "detail"
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

            }

            d3.select('.viewtext')
            .text("Phase View")
            .attr('font-size', '15')

            isBubbleCall = true;
            svg.selectAll('circle').filter(function(dd){
              return dd.phase == d.data.phase && dd.developer == d.data.developer;
            }).dispatch('click');

            // d3.select(this).style("filter", "url(#glow)");
            bubble.selected=i;
            RadarChart.draw("#radarchart-item", format_data({ "phase":d.data.phase, "developer": d.data.developer }), config);
            $("#radarStroke_0").d3Click();

            isBubbleCall = false;
        });

    node.append("text")
        .attr("dy", ".1em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.developer;
        })
        .attr("font-family", "Open Sans")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return "Grade:";
        })
        .attr("font-family", "Open Sans")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

        node.append("text")
        .attr("dy", "2.6em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return  parseInt(d.data.tot_score);
        })
        .attr("font-family", "Open Sans")
        .attr("font-size", function (d) {
            return d.r / 4;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");
}

//function that runs in the
$(".slider").on('input', function () {
    var clicked_id = $(this).attr("id");
    var range_val = document.getElementById(clicked_id + "_wt");
    var keepClicked = d3.select('.clicked')
    if (d3.select('.clicked')['_groups'][0][0] == null) {
      range_val.innerHTML = this.value;
      skill_wt_dict[clicked_id + "_wt"] = this.value;
      calculate_total_score();
      d3.select("#bubbleSvg").remove();
      createBubbleChart(currentSelectedPhase);
    } else {
      keepClicked = keepClicked.attr('name')
      range_val.innerHTML = this.value;
      skill_wt_dict[clicked_id + "_wt"] = this.value;
      calculate_total_score();
      d3.select("#bubbleSvg").remove();
      createBubbleChart(currentSelectedPhase);

      var clickedrestored = d3.selectAll('.bubbleCircle').filter(function(){
        return d3.select(this).attr("name") == keepClicked;
      })
      console.log(clickedrestored == null)
      if(clickedrestored == undefined) return;
      clickedrestored.attr("class", "bubbleCircle clicked")
      .style("filter", null)
      .style("stroke","var(--yellow)")
      .style("stroke-width","5")
      .style("opacity", 1);
    }



});

// console.log(phaseData);
updateDevelopersAndScale("Norra 2");
// console.log(phaseData);


var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");


function updateDevelopersAndScale(phaseName) {
    currentSelectedPhase = phaseName;
    phaseData = apidata.filter(a => a.phase == phaseName);
    //picking out values from json
    let chare_of_electrical_charging_points_scale_array = phaseData.map(a => parseFloat(a.chare_of_electrical_charging_points));
    let bicycle_parking_spacesapartment_array = phaseData.map(a => a.bicycle_parking_spacesapartment_construction == "NA" ? 0 : a.bicycle_parking_spacesapartment_construction);
    let car_parking_spacesapartment_array = phaseData.map(a => a.car_parking_spacesapartment == "NA" ? 0 : a.car_parking_spacesapartment);
    let total_energy_use_construction_array = phaseData.map(a => a.total_energy_use_kwhm2_atemp_construction);
    let green_space_index_gsi_construction_array = phaseData.map(a => a.green_space_index_gsi_construction);

    chare_of_electrical_charging_points_scale.domain([0, Math.max.apply(null, chare_of_electrical_charging_points_scale_array)]);
    bicycle_parking_spacesapartment_scale.domain([0, Math.max.apply(null, bicycle_parking_spacesapartment_array)]);
    car_parking_spacesapartment_scale.domain([0, Math.max.apply(null, car_parking_spacesapartment_array)]);
    // console.log(Math.max.apply(null, car_parking_spacesapartment_array))
    total_energy_use_construction_scale.domain([0, Math.max.apply(null, total_energy_use_construction_array)]);
    green_space_index_gsi_construction_scale.domain([0, Math.max.apply(null, green_space_index_gsi_construction_array)]);

    document.getElementById("bubblePhaseName").innerHTML= phaseName + " developers";

    d3.select("#bubbleSvg").remove();
    calculate_total_score();
    createBubbleChart(phaseName);
    // console.log("ened");
}

// initial Bonava
var clickedrestored = d3.selectAll('.bubbleCircle').filter(function(d, i){
  if (d3.select(this).attr("name") == "Bonava") {
    firstbubble.selected=i;
  }
  return d3.select(this).attr("name") == "Bonava";
})
clickedrestored.attr("class", "bubbleCircle clicked")
.style("filter", null)
.style("stroke","var(--yellow)")
.style("stroke-width","5")
.style("opacity", 1);
