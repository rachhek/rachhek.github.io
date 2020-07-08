var margin_bar = {top: 10, right: 40, bottom: 20, left: 45},
    width_bar = 450 - margin_bar.left - margin_bar.right,
    height_bar = 300 - margin_bar.top - margin_bar.bottom;

var svg_bar = d3.select(".stage-chart-energy-stack").append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 450 300")

var final_data = []

projects.forEach(project => {
	var operation = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
	  "Stage":"Operation",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_in_operation,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_in_operation,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_in_operation,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_in_operation,
    "Hot water (Electricity) kWh/m2 Atemp":project.hot_water_electricity_kwhm2_atemp_in_operation,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_in_operation,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_in_operation,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_in_operation,
    "Total": project.total_energy_use_kwhm2_atemp_in_operation
		+ project.heating_district_heating_kwhm2_atemp_in_operation
		+ project.heating_electricity_kwhm2_atemp_in_operation
		+ project.hot_water_district_heating_kwhm2_atemp_in_operation
		+ project.hot_water_electricity_kwhm2_atemp_in_operation
		+ project.property_electricity_kwhm2_atemp_in_operation
		+ project.locally_generated_electricity_kwhm2_atemp_in_operation
	+ project.locally_generated_heating_kwhm2_atemp_in_operation};

	var construction = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
	  "Stage":"Construction",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_construction,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_construction,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_constructionn,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_construction,
    "Hot water (Electricity) kWh/m2 Atemp":project.hot_water_electricity_kwhm2_atemp_construction,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_construction,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_construction,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_construction,
    "Total": project.total_energy_use_kwhm2_atemp_construction
		+ project.heating_district_heating_kwhm2_atemp_construction
		+ project.heating_electricity_kwhm2_atemp_construction
		+ project.hot_water_district_heating_kwhm2_atemp_construction
		+ project.hot_water_electricity_kwhm2_atemp_construction
		+ project.property_electricity_kwhm2_atemp_construction
		+ project.locally_generated_electricity_kwhm2_atemp_construction
	+ project.locally_generated_heating_kwhm2_atemp_construction};

	var design = {
    "Fastighetsbeteckning": project.fastighetsbeteckning,
	  "Stage":"Design",
    "Total energy use_kWh/m2 Atemp": project.total_energy_use_kwhm2_atemp_design,
    "Heating (District heating) kWh/m2 Atemp": project.heating_district_heating_kwhm2_atemp_design,
    "Heating (Electricity) kWh/m2 Atemp": project.heating_electricity_kwhm2_atemp_design,
    "Hot water (District heating) kWh/m2 Atemp": project.hot_water_district_heating_kwhm2_atemp_design,
    "Hot water (Electricity) kWh/m2 Atemp":project.hot_water_electricity_kwhm2_atemp_design,
    "Property electricity  kWh/m2 Atemp": project.property_electricity_kwhm2_atemp_design,
    "Locally generated electricity kWh/m2 Atemp": project.locally_generated_electricity_kwhm2_atemp_design,
    "Locally generated heating kWh/m2 Atemp": project.locally_generated_heating_kwhm2_atemp_design,
    "Total": project.total_energy_use_kwhm2_atemp_design
		+ project.heating_district_heating_kwhm2_atemp_design
		+ project.heating_electricity_kwhm2_atemp_design
		+ project.hot_water_district_heating_kwhm2_atemp_design
		+ project.hot_water_electricity_kwhm2_atemp_design
		+ project.property_electricity_kwhm2_atemp_design
		+ project.locally_generated_electricity_kwhm2_atemp_design
	+ project.locally_generated_heating_kwhm2_atemp_design};

	final_data.push(operation);
	final_data.push(design);
	final_data.push(construction);
})

var g_bar = svg_bar.append("g")
    .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

var data = final_data;

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


  var selector = d3.select("#drop2")
	.append("select")
	.attr("id","dropdown")
	.attr("class", "custom-select")
	.on("change", function(d){

     let selection = document.getElementById("dropdown");
     var selectedProject = selection.value;

		  let filtered_data = data.filter(function(d){
			return d.Fastighetsbeteckning == selectedProject;
		  })

		  x_bar.domain(filtered_data.map(function(d) { return d.Stage; }));

		console.log(filtered_data)
		  stacked_data = stack.keys([
//			  "Total energy use_kWh/m2 Atemp",
			"Heating (District heating) kWh/m2 Atemp",
			"Heating (Electricity) kWh/m2 Atemp",
			"Hot water (District heating) kWh/m2 Atemp",
			"Hot water (Electricity) kWh/m2 Atemp",
			"Property electricity  kWh/m2 Atemp",
			"Locally generated electricity kWh/m2 Atemp",
			"Locally generated heating kWh/m2 Atemp"])(filtered_data)

		g_bar.selectAll(".serie").remove();

		var serie = g_bar.selectAll(".serie")
					.data(stacked_data)
					.enter()
					.append("g")
					.attr("class", "serie")
					.attr("fill", function(d) { return z(d.key); });


	   serie.selectAll("rect")
		.data(function(d) {return d; })
    	.enter().append("rect")
        .attr("x", function(d) {return x_bar(d.data.Stage); })
		//tooltips
		.on("mouseover", function(d) {
				   div.transition()
					 .duration(200)
					 .style("opacity", .7);
				   div.html(Math.round(y_bar(d[0]) - y_bar(d[1]))+"kWh/m2 Atemp")
					 .style("left", (d3.event.pageX) + "px")
					 .style("top", (d3.event.pageY - 28) + "px");
				   })
	   .on("mouseout", function(d) {
		 div.transition()
		   .duration(500)
		   .style("opacity", 0);
		 })
      .attr("width", x_bar.bandwidth())
	  .transition().duration(500)
                        .attr("y", function(d,i) { return y_bar(d[1]); })
                        .attr("height", function(d,i) { return (y_bar(d[0]) - y_bar(d[1])); });

   });

//total energy

   projects.forEach(project => {
     if(project.fastighetsbeteckning == document.getElementById('dropdown').value) {
//       document.querySelector("#detail_barbarbar>span").innerHTML = project.total_energy_use_kwhm2_atemp_design
//       document.querySelector("#detail_atemp>span").innerHTML = project.atemp_m2
//       document.querySelector("#detail_dev>span").innerHTML = project.developer
//       animateValue("co2",0,Math.round(project.co2_emissions_tonnes,2),500)
       return;
     }
   })


var elements = [];
projects.forEach(project => {
 if (project.phase == "Norra 2") {
   elements.push(project.fastighetsbeteckning)
 }
})

console.log(elements)
var selector = d3.select("#dropdown");
selector.selectAll("option")
 .data(elements).enter()
 .append("option")
 .attr("value", function(d){
   return d;
 })
 .text(function(d){
   return d;
 })

  var selection = document.getElementById("dropdown");
  var selectedProject = selection.value;

  let filtered_data = data.filter(function(d){
	return d.Fastighetsbeteckning == selectedProject;
  })
//  filtered_data.sort(function(a, b) { return b.Total-a.Total; });

  x_bar.domain(filtered_data.map(function(d) { return d.Stage; }));




  let stacked_data = stack.keys([
//	  "Total energy use_kWh/m2 Atemp",
    "Heating (District heating) kWh/m2 Atemp",
    "Heating (Electricity) kWh/m2 Atemp",
    "Hot water (District heating) kWh/m2 Atemp",
    "Hot water (Electricity) kWh/m2 Atemp",
    "Property electricity  kWh/m2 Atemp",
    "Locally generated electricity kWh/m2 Atemp",
    "Locally generated heating kWh/m2 Atemp"])(filtered_data)

  var serie = g_bar.selectAll(".serie")
    .data(stacked_data)
    .enter()
 	.append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

   serie.selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
      .attr("x", function(d) {return x_bar(d.data.Stage); })
      .attr("y", function(d) { return y_bar(d[1]); })
      .attr("height", function(d) { return y_bar(d[0]) - y_bar(d[1]); })
      .attr("width", x_bar.bandwidth()-20);

z.domain([
    "Heating (District heating) kWh/m2 Atemp",
    "Heating (Electricity) kWh/m2 Atemp",
    "Hot water (District heating) kWh/m2 Atemp",
    "Hot water (Electricity) kWh/m2 Atemp",
    "Property electricity  kWh/m2 Atemp",
    "Locally generated electricity kWh/m2 Atemp",
    "Locally generated heating kWh/m2 Atemp"]);

g_bar.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height_bar + ")")
  .call(d3.axisBottom(x_bar));

g_bar.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y_bar).ticks(10, "p"));
