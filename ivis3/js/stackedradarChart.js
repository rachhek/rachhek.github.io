var radarWidth = 410,
radarHeight = 300;

// Config for the Radar chart
var config = {
w: radarWidth,
h: radarHeight,
radarHeight: radarHeight,
levels: 5,
ExtraWidthX: 0
};

var local_electricity_scale ;
var total_energy_scale;
var green_space_index_scale;
var bicycle_parking_scale ;
var size_recycling_scale;
var size_requirement_scale;



function format_data(developerDict) {
phaseName =developerDict.phase;
// console.log(phaseName);
currentPhaseData = apidata.filter(obj => { return obj.phase ==phaseName})[0];

// console.log(currentPhaseData);

developerName=developerDict.developer
document.querySelector('#devphase').innerHTML = phaseName;
document.querySelector('#devname').innerHTML = developerName;
// console.log(apidata.filter(obj => { return obj.developer == developerDict.developer && obj.phase == developerDict.phase }))
curr_dev = apidata.filter(obj => { return obj.developer == developerDict.developer && obj.phase == developerDict.phase })[0];

test_requirement=requirement_levels_json.filter(obj=> { return obj.phase == developerDict.phase})[0];
 // console.log(test_requirement);

//set_scale(developerName);                             locally_generated_electricity_kwhm2_atemp_design
scaled_locally_generated_electricity_design = curr_dev["locally_generated_electricity_kwhm2_atemp_design"];
// console.log(scaled_locally_generated_electricity_design)
scaled_total_energy_use_design =curr_dev["total_energy_use_kwhm2_atemp_design"];
scaled_green_space_index_gsi_design = curr_dev["green_space_index_gsi_design"];
scaled_bicycle_parking_spacesapartment = curr_dev["bicycle_parking_spacesapartment_design"];
scaled_size_recycling_design = curr_dev["distance_to_recycling_room_m"];

// scaled_locally_generated_electricity_requirement = local_electricity_scale(curr_dev["locall"]);
// scaled_total_energy_use_requirement = total_energy_scale(curr_dev["total_energy_use_design"]);
// scaled_green_space_index_gsi_requirement = green_space_index_scale(curr_dev["green_space_index_gsi_design"]);
// scaled_bicycle_parking_spacesapartment = bicycle_parking_scale(curr_dev["bicycle_parking_spacesapartment"]);
// scaled_size_recycling_requirement = size_recycling_scale(curr_dev["size_recycling_design"]);

scaled_locally_generated_electricity_construction =curr_dev["locally_generated_electricity_kwhm2_atemp_construction"];
scaled_total_energy_use_construction = curr_dev["total_energy_use_kwhm2_atemp_construction"];
scaled_green_space_index_gsi_construction = curr_dev["green_space_index_gsi_construction"];
scaled_bicycle_parking_spacesapartment = curr_dev["bicycle_parking_spacesapartment_construction"];
scaled_size_recycling_construction =  curr_dev["distance_to_recycling_room_m"];

scaled_locally_generated_electricity_operation = curr_dev["locally_generated_electricity_kwhm2_atemp_in_operation"];
scaled_total_energy_use_operation = curr_dev["total_energy_use_kwhm2_atemp_in_operation"];
scaled_green_space_index_gsi_operation = curr_dev["green_space_index_gsi_in_operation"];
scaled_bicycle_parking_operation = curr_dev["bicycle_parking_spacesapartment_in_operation"];
scaled_size_recycling_operation = curr_dev["distance_to_recycling_room_m"];


//requirement level

locally_generated_electricity_requirement= test_requirement["locally_generated_energy"];
total_energy_use_requirement=test_requirement["measured_energy_use"];
green_space_index_gsi_requirement=test_requirement["green_space_index"];
bicycle_parking_requirement= test_requirement["bicycle_parking_spacesappartment"];
size_recycling_requirement=test_requirement["longest_distance_to_recycling_room"];


final_obj = [
  {"Local Electricity": locally_generated_electricity_requirement , "Total Energy":  total_energy_use_requirement, "Green Space Index":  green_space_index_gsi_requirement, "Bicycle Parking":  bicycle_parking_requirement, "Size Recycling":  size_recycling_requirement },
  {"Local Electricity": scaled_locally_generated_electricity_design, "Total Energy": scaled_total_energy_use_design , "Green Space Index": scaled_green_space_index_gsi_design , "Bicycle Parking": scaled_bicycle_parking_spacesapartment, "Size Recycling":  scaled_size_recycling_design},
  {"Local Electricity": scaled_locally_generated_electricity_construction, "Total Energy": scaled_total_energy_use_construction , "Green Space Index": scaled_green_space_index_gsi_construction , "Bicycle Parking": scaled_bicycle_parking_spacesapartment, "Size Recycling":  scaled_size_recycling_construction},
  {"Local Electricity": scaled_locally_generated_electricity_operation, "Total Energy": scaled_total_energy_use_operation , "Green Space Index": scaled_green_space_index_gsi_operation , "Bicycle Parking": scaled_bicycle_parking_spacesapartment, "Size Recycling":  scaled_size_recycling_operation},

];
// console.log("final obj");
// console.log(final_obj);
return final_obj;
}


var RadarChart = {
draw: function (id, d, phaseName, options) {
  var cfg = {
    w: radarWidth, //Width of the circle
    h: radarHeight, //Height of the circle
    margin: {top: 25, right: 0, bottom: 0, left: 20}, //The margins of the SVG
    labelFactor: 1.25,  //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 90,      //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.3,  //The opacity of the area of the blob
    dotRadius: 4,       //The size of the colored circles of each blog
    opacityCircles: 0.1,//The opacity of the circles of each blob
    strokeWidth: 1,   //The width of the stroke around each blob
    roundStrokes: false,//If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal().range([ "#00A0B0","#CC333F", "#EDC951", "#6F257F"]),
    colorbackground: d3.scaleOrdinal().range([ "rgba(255, 255, 255, 0.5)","#CC333F", "#EDC951", "#6F257F"]),
    hover: true,
    axisLabels: true,
    tickLabels: true,
    fields: false,
    scalesAndAxes: false,
    factorLegend: .85,
    radians: 2 * Math.PI,
  };

//Put all of the options into a variable called cfg
if('undefined' !== typeof options){
  for(var i in options){
    if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
  }
}

cfg.fields = Object.keys(d[0]);
 // console.log(cfg.fields)

 // Auto-generate scales and axes from given data extents or use given ones.
 var autos;
 autos = autoScalesAxes(d);
 var scales = cfg.fields.map(function(k){ return autos[k].scale; });
 var axes = cfg.fields.map(function(k){ return autos[k].axis; });

   // Rearrange data to an array of arrays
data = d.map(function(row){
  var newRow = cfg.fields.map(function(key) {
      return {"axis": key, "value": row[key]};
  });
  return newRow;
});

//var axestotal=axes.length;
var total = cfg.fields.length,          //The number of different axes
radius = Math.min(cfg.w/2, cfg.h/2),    //Radius of the outermost circle
angleSlice = Math.PI * 2 / total;       //The width in radians of each "slice"
//console.log(total);
  // Update ranges of scales to match radius.
  scales = scales.map(function(i){
    // This is gross - no other way to get ordinal scales to behave correctly.
    if (typeof i.rangePoints !== 'undefined'){
        return i.rangePoints([0, radius]);
    } else {
        return i.range([0, radius]);
    }
  });

    //Remove whatever chart with the same id/class was present before
d3.select(id).select("svg").remove();

//Initiate the radar chart SVG
var svg = d3.select(id).append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 440 310")
  .attr("class", "radar"+id);

//Append a g element
var g = svg.append("g")
  .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
//////////////////// Draw the axes //////////////////////
/////////////////////////////////////////////////////////

//Wrapper for the grid & axes
var axisGrid = g.append("g").attr("class", "axisWrapper");
    //Create the straight lines radiating outward from the center
var axis = axisGrid.selectAll(".axis")
.data(cfg.fields)
.enter()
.append("g")
.attr("class", "axis");

    //Append the axes
axis.append("line")
.attr("x1",0)
.attr("y1", 0)
.attr("x2", function(d, i){ return (radius ) * Math.cos(angleSlice*i - Math.PI/2); })
.attr("y2", function(d, i){ return (radius) * Math.sin(angleSlice*i - Math.PI/2); })
.attr("class", "line")
.style("stroke", "grey")
//.style("stroke-width", "1px");
// .attr("transform", function(d, i){ return "rotate(" + ( 180/Math.PI * (i * angleSlice) + 270) + ")"; })

axis.append("g")
    .attr("transform", function(d, i){ return "rotate(" + (180 / Math.PI * (i * angleSlice) + 270) + ")"; })
    .attr("class", function(d, i){return "axis_"+i})
    .each(function(d, i){
      var ax = axes[i];
      if (cfg.tickLabels !== true){
        ax = ax.tickFormat(function(d){ return ""; });
      }
      ax(d3.select(this));
    });

d3.select(".axis_0").selectAll('text')
.attr("transform", "rotate(90) translate(12, -12)")

d3.select(".axis_4").selectAll('.tick').selectAll('line')
.attr("transform", "rotate(180)")

d3.select(".axis_4").selectAll('.tick').selectAll('text')
.attr("transform", "rotate(180)")

d3.select(".axis_3").selectAll('.tick').selectAll('line')
.attr("transform", "rotate(180)")

d3.select(".axis_3").selectAll('.tick').selectAll('text')
.attr("transform", "rotate(180)")
	//Append the labels at each axis
  g.append("text")
  .attr("class", "legend")
  .style("font-size", "11px")
  .attr("text-anchor", "middle")
  .attr("dy", "1.7em")
  .attr("x", 178)
  .attr("y", -45)
  .text(function(d){
    return "Total Energy"})

    //Append the labels at each axis
    g.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "1.7em")
    .attr("x", -178)
    .attr("y", -45)
    .text(function(d){
      return "Size Recycling"})

//Append the labels at each axis
g.append("text")
.attr("class", "legend")
.style("font-size", "11px")
.attr("text-anchor", "middle")
.attr("dy", "1.7em")
.attr("x", 0)
.attr("y", -175)
.text(function(d){
  return "Local Electricity"})

//Append the labels at each axis
g.append("text")
.attr("class", "legend")
.style("font-size", "11px")
.attr("text-anchor", "middle")
.attr("dy", "1.7em")
.attr("x", -135)
.attr("y", 100)
.text(function(d){
  return "Bicycle Parking"})

//Append the labels at each axis
g.append("text")
.attr("class", "legend")
.style("font-size", "11px")
.attr("text-anchor", "middle")
.attr("dy", "1.7em")
.attr("x", 140)
.attr("y", 100)
.text(function(d){
  return "Green Space Index"})
// //Append axis category labels
// if (cfg.axisLabels === true){
//   console.log(" Inside if")
//   axisGroup.append("text")
//   .attr("class", "legend")
//   .style("font-size", "10px")
//   .attr("text-anchor", "middle")
//   //.attr("transform", "translate(" + (radius * cfg.labelFactor -10)+ ", 8)")
//   //.attr("x", function(d, i){ return scales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2);})
//   //.attr("y", function(d, i){ return scales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2);})
//   .attr("dy", "1.5em")
//   .text(function(d){return d;})
//   .call(wrap, cfg.wrapWidth);
// }

/////////////////////////////////////////////////////////
///////////// Draw the radar chart blobs ////////////////
/////////////////////////////////////////////////////////


//The radial line function
var radarLine = d3.radialLine()
  .curve(d3.curveLinearClosed)
  .radius(function(d, i) { return scales[i](d.value); })
  .angle(function(d,i) {  return i*angleSlice; });

if(cfg.roundStrokes) {
  radarLine.curve(d3.curveCardinalClosed)
}
  //Create a wrapper for the blobs
  var blobWrapper = g.selectAll(".radarWrapper")
  .data(data)
  .enter().append("g")
  .attr("class", "radarWrapper")
  .attr("id", function(d,i){return "radarWrapper_"+1});

//Append the backgrounds
blobWrapper
  .append("path")
  .attr("class", "radarArea")
  .attr("id", function(d,i){return "radarArea_"+i})
  .attr("d", function(d,i) { return radarLine(d); })
  .style("fill", function(d,i) { return cfg.colorbackground(i)})
  .style("fill-opacity", cfg.opacityArea)
  .style("cursor","pointer")
  .on('mouseover', function (d,i){
    if (cfg.hover === true){
      //Dim all blobs

      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    }
  })
  .on('click',function(d,i){
    selected(d,i,cfg.color(i));
  }
    )
  .on('mouseout', function(){
    if (cfg.hover === true){
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    }
  });

//Create the outlines
blobWrapper.append("path")
  .attr("class", "radarStroke")
  .attr("id", function(d,i){return "radarStroke_"+i})
  .attr("d", function(d,i) { return radarLine(d); })
  .style("stroke-width", cfg.strokeWidth + "px")
  .style("stroke", function(d,i) { return cfg.color(i); })
  .style("fill", "none");

//zed: requirement handling
d3.select('#radarArea_0').remove()
d3.select('#radarStroke_0')
  .style("stroke-width", function() {
    return "4px";
  })
  .style("stroke-dasharray", ("3,3"))
  .style("cursor", "pointer")
  .on('click',function(d,i){
    selected(d,i,cfg.color(i));
  })

d3.select('#radarWrapper_1').each(function() {

    this.parentNode.appendChild(this);
})

//Append the circles
blobWrapper.selectAll(".radarCircle")
  .data(function(d,i) { return d; })
  .enter().append("circle")
  .attr("class", "radarCircle")
  .attr("r", cfg.dotRadius)
  .attr("cx", function(d,i){ return scales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2); })
  .attr("cy", function(d,i){ return scales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2); })
  .style("fill", function(d,i,j) { return cfg.color(j); })
  .style("fill-opacity", 0.8);

   /////////////////////////////////////////////////////////
//////// Append invisible circles for tooltip ///////////
/////////////////////////////////////////////////////////

if (cfg.hover === true){

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
  .data(function(d,i) { return d; })
  .enter().append("circle")
  .attr("class", "radarInvisibleCircle")
  .attr("r", cfg.dotRadius*1.5)
  .attr("cx", function(d,i){ return scales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2); })
  .attr("cy", function(d,i){ return scales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2); })
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function(d,i) {
    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
    newY =  parseFloat(d3.select(this).attr('cy')) - 10;
    tooltip
    .text(function(x){
      if(d.value == null)
        return 0
      else
        return d.value;})
    .transition().duration(200)
    .style("visibility", "visible");
    })
    .on("mousemove", function () {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function(){
      return tooltip.style("visibility", "hidden")
    });


}
/////////////////////////////////////////////////////////
/////////////////// Helper Function /////////////////////
/////////////////////////////////////////////////////////

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}//wrap

}
}

function autoScalesAxes(data){

var ret = {};
var test={};
var fieldNames = Object.keys(data[0]);
// console.log(fieldNames);

local_electricity_arr = apidata.map(a=>a.locally_generated_electricity_kwhm2_atemp_construction == "NA" ? 0: a.locally_generated_electricity_kwhm2_atemp_construction )
.concat(apidata.map(a=>a.locally_generated_electricity_kwhm2_atemp_design  == "NA" ? 0: a.locally_generated_electricity_kwhm2_atemp_design ))
.concat(apidata.map(a=>a.locally_generated_electricity_kwhm2_atemp_in_operation  == "NA" ? 0: a.locally_generated_electricity_kwhm2_atemp_in_operation ))
.concat(requirement_levels_json.map(a=>a.locally_generated_energy =="NA" ? 0 : a.locally_generated_energy));
// console.log(local_electricity_arr)

max_total_energy_arr = apidata.map(a=>a.total_energy_use_kwhm2_atemp_design == "NA" ? 0: a.total_energy_use_kwhm2_atemp_design  )
.concat(apidata.map(a=>a.total_energy_use_kwhm2_atemp_construction == "NA" ? 0: a.total_energy_use_kwhm2_atemp_construction ))
.concat(apidata.map(a=>a.total_energy_use_kwhm2_atemp_in_operation == "NA" ? 0: a.total_energy_use_kwhm2_atemp_in_operation ))
.concat(requirement_levels_json.map(a=>a.measured_energy_use =="NA" ? 0 : a.measured_energy_use));
// console.log(max_total_energy_arr)

green_space_index_gsi_design_arr = apidata.map(a=>a.green_space_index_gsi_design == "NA" ? 0: a.green_space_index_gsi_design )
.concat(apidata.map(a=>a.green_space_index_gsi_construction == "NA" ? 0: a.green_space_index_gsi_construction ))
.concat(apidata.map(a=>a.green_space_index_gsi_in_operation == "NA" ? 0: a.green_space_index_gsi_in_operation ))
.concat(requirement_levels_json.map(a=>a.green_space_index =="NA" ? 0 : a.green_space_index));
// console.log(green_space_index_gsi_design_arr)

bicycle_parking_arr = apidata.map(a=>a.bicycle_parking_spacesapartment_design == "NA"?0: a.bicycle_parking_spacesapartment_design ).
concat(apidata.map(a=>a.bicycle_parking_spacesapartment_construction =="NA"? 0 : a.bicycle_parking_spacesapartment_construction )).
concat(apidata.map(a=>a.bicycle_parking_spacesapartment_in_operation =="NA" ? 0 :a.bicycle_parking_spacesapartment_in_operation ))
.concat(requirement_levels_json.map(a=>a.bicycle_parking_spacesappartment =="NA" ? 0 : a.bicycle_parking_spacesappartment));
// console.log(bicycle_parking_arr)

max_size_recycling_arr = apidata.map(a=>a.distance_to_recycling_room_m == "NA"?0: a.distance_to_recycling_room_m )
.concat(apidata.map(a=>a.distance_to_recycling_room_m == "NA"?0: a.distance_to_recycling_room_m ))
.concat(apidata.map(a=>a.distance_to_recycling_room_m == "NA"?0: a.distance_to_recycling_room_m ))
.concat(requirement_levels_json.map(a=>a.longest_distance_to_recycling_room =="NA" ? 0 : a.longest_distance_to_recycling_room));
// console.log(max_size_recycling_arr)

max_local_electricity = Math.max.apply(null, local_electricity_arr);
max_total_energy = Math.max.apply(null, max_total_energy_arr);
max_green_space_index = Math.max.apply(null, green_space_index_gsi_design_arr);
max_bicycle_parking = Math.max.apply(null, bicycle_parking_arr);
max_size_recycling = Math.max.apply(null,max_size_recycling_arr);

// console.log("max_local_electricity" + max_local_electricity);
// console.log("max_total_energy" + max_total_energy);
// console.log("max_green_space_index" + max_green_space_index);
// console.log("max_bicycle_parking" + max_bicycle_parking);
// console.log("max_size_recycling" + max_size_recycling);
max_obj=[
  {
    "Local Electricity":0,"Total Energy":0,"Green Space Index":0,"Bicycle Parking":0,"Size Recycling":0
  },
  {
    "Local Electricity":max_local_electricity,"Total Energy":max_total_energy,"Green Space Index":max_green_space_index,"Bicycle Parking":max_bicycle_parking,"Size Recycling":max_size_recycling
  }
];
fieldNames.map(function(i){

  // Get all data for axis
  var axisData = data.map(function(row){
    return row[i];
  });

  var scale;
  var axis;
  // Numeric values get a linear scale
  var extent = d3.extent(max_obj, function(a){return a[i];});
  var min =extent[0]

  var max =extent[1]

  if(i=="Total Energy")
  {
    scale = d3.scaleLinear().domain([max,min]);
    axis = d3.axisTop()
    .scale(scale)
    .ticks(5)
   .tickFormat(function(d, i){ if(i != 0){return d + "";} else {return "";}  });

  } else if (i=="Size Recycling")
  {
    scale = d3.scaleLinear().domain([min,max]);
    axis = d3.axisTop()
    .scale(scale)
    .ticks(5)
   .tickFormat(function(d, i){ if(i != 0){return d + " ";} else {return "";}  });

  }
  else{
    scale = d3.scaleLinear().domain([min,max]);
    axis = d3.axisBottom()
    .scale(scale)
    .ticks(5)
   .tickFormat(function(d, i){ if(i != 0){return d + "";} else {return "";}  });

  }

  ret[i] = {};
  ret[i].scale = scale;
  ret[i].axis = axis;

});

// console.log(ret);
return ret;
}

function radarBorder(d,i,color)
{
  // console.log(i);
}

function selected(d,i,legend_color) {
  switch(i){
    case 0:{
      document.getElementById("radar-clicked-text").innerHTML ="Requirement" ;
      $("#radar-clicked-text").css("background-color",legend_color);
      $("#radar-clicked-text").css("color","white");
      break;
    }

    case 1:{
      document.getElementById("radar-clicked-text").innerHTML ="Design" ;
      $("#radar-clicked-text").css("background-color",legend_color);
      $("#radar-clicked-text").css("color","white");
      break;
    }

    case 2:{
      document.getElementById("radar-clicked-text").innerHTML ="Construction" ;
      $("#radar-clicked-text").css("background-color",legend_color);
      $("#radar-clicked-text").css("color","black");
      break;
    }

    case 3:{
      document.getElementById("radar-clicked-text").innerHTML ="In-Operation  " ;
      $("#radar-clicked-text").css("background-color",legend_color);
      $("#radar-clicked-text").css("color","white");
      break;
    }
  }

  var obj=d;
// console.log(obj)
var local_electricity = obj.filter(obj => { return obj.axis == "Local Electricity"})[0]
if(local_electricity["value"] != null)
  local_electricity_value=Math.round(100*local_electricity["value"])/100;
else
  local_electricity_value = 0;

// console.log(local_electricity_value);
document.getElementById("dev-electricity-value").innerHTML =local_electricity_value ;

var total_energy = obj.filter(obj => { return obj.axis == "Total Energy"})[0]
if(total_energy["value"] != null)
  total_energy=Math.round(100*total_energy["value"])/100;
else
  total_energy = 0;
// console.log(total_energy);
document.getElementById("dev-energy-value").innerHTML =total_energy ;


var size_recycling = obj.filter(obj => { return obj.axis == "Size Recycling"})[0]
if(size_recycling["value"] != null)
  size_recycling=Math.round(100*size_recycling["value"])/100;
else
  size_recycling = 0;
// console.log(size_recycling);
document.getElementById("dev-recycling-value").innerHTML =size_recycling ;


var green_space_index = obj.filter(obj => { return obj.axis == "Green Space Index"})[0]

if(green_space_index["value"] != null)
  green_space_index=Math.round(100*green_space_index["value"])/100;
else
  green_space_index = 0;
// console.log(green_space_index);
document.getElementById("dev-gsi-value").innerHTML =green_space_index ;

var bicycle_parking = obj.filter(obj => { return obj.axis == "Bicycle Parking"})[0]

if(bicycle_parking["value"] != null)
  bicycle_parking=Math.round(100*bicycle_parking["value"])/100;
else
  bicycle_parking = 0;
// console.log(bicycle_parking);
document.getElementById("dev-bicycle-value").innerHTML =bicycle_parking ;


}


RadarChart.draw("#radarchart-item", format_data({"phase":"Norra 2","developer":"Bonava"}), config);
