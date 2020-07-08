var diameter = 450;
var color = d3.scaleOrdinal(d3.schemeCategory20);

//picking out values from json
let chare_of_electrical_charging_points_scale_array = norra2_json.map(a => parseFloat(a.chare_of_electrical_charging_points));
let bicycle_parking_spacesapartment_array = norra2_json.map(a => a.bicycle_parking_spacesapartment == "NA" ? 0 : a.bicycle_parking_spacesapartment);
let car_parking_spacesapartment_array = norra2_json.map(a => a.car_parking_spacesapartment == "NA" ? 0 : a.car_parking_spacesapartment);
let total_energy_use_construction_array = norra2_json.map(a => a.total_energy_use_construction);
let green_space_index_gsi_construction_array = norra2_json.map(a => a.green_space_index_gsi_construction);

//setting the range
let chare_of_electrical_charging_points_scale = d3.scaleLinear().range([0, 10]);
let bicycle_parking_spacesapartment_scale = d3.scaleLinear().range([0, 10]);
let car_parking_spacesapartment_scale = d3.scaleLinear().range([0, 10]);
let total_energy_use_construction_scale = d3.scaleLinear().range([0, 10]);
let green_space_index_gsi_construction_scale = d3.scaleLinear().range([0, 10]);

chare_of_electrical_charging_points_scale.domain([0, Math.max.apply(null, chare_of_electrical_charging_points_scale_array)]);
bicycle_parking_spacesapartment_scale.domain([0, Math.max.apply(null, bicycle_parking_spacesapartment_array)]);
car_parking_spacesapartment_scale.domain([0, Math.max.apply(null, car_parking_spacesapartment_array)]);
total_energy_use_construction_scale.domain([0, Math.max.apply(null, total_energy_use_construction_array)]);
green_space_index_gsi_construction_scale.domain([0, Math.max.apply(null, green_space_index_gsi_construction_array)]);
var totalvalue_scale = d3.scaleLinear().domain([0, 500]).range([0, 100]);
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
    norra2_json.forEach(developer => {
        developer.tot_score = 0;
        sum = 0;
        developer["bicycle_parking_spacesapartment"] = developer["bicycle_parking_spacesapartment"] == "NA" ? 0 : developer["bicycle_parking_spacesapartment"];
        developer["car_parking_spacesapartment"] = developer["car_parking_spacesapartment"] == "NA" ? 0 : developer["car_parking_spacesapartment"];
        sum = chare_of_electrical_charging_points_scale(developer["chare_of_electrical_charging_points"]) * skill_wt_dict["chare_of_electrical_charging_points_wt"] +
            bicycle_parking_spacesapartment_scale(developer["bicycle_parking_spacesapartment"]) * skill_wt_dict["bicycle_parking_spacesapartment_wt"] +
            car_parking_spacesapartment_scale(developer["car_parking_spacesapartment"]) * skill_wt_dict["car_parking_spacesapartment_wt"] +
            total_energy_use_construction_scale(developer["total_energy_use_construction"]) * skill_wt_dict["total_energy_use_construction_wt"] +
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
function createBubbleChart() {
    dataset = { "children": norra2_json };
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubblechartarea")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset)
        .sum(function (d) { return d.tot_score; });

    var node = svg.selectAll(".node")
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
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            return developer_circle_color(d.data.tot_score);
        })
        .on("mouseover", function (d) {
            tooltip.text("Developer" + ": " + d.data.developer);
            tooltip.append("div").text("bicycle_parking_spacesapartment" + ": " + d.data.bicycle_parking_spacesapartment);
            tooltip.append("div").text("total_energy_use_construction" + ": " + d.data.total_energy_use_construction);
            tooltip.append("div").text("car_parking_spacesapartment" + ": " + d.data.car_parking_spacesapartment);
            tooltip.append("div").text("total_energy_use_construction" + ": " + d.data.total_energy_use_construction);
            tooltip.append("div").text("green_space_index_gsi_construction" + ": " + d.data.green_space_index_gsi_construction);
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })

        ;

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.developer;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return "Grade:" + parseInt(d.data.tot_score);
        })
        .attr("font-family", "Gill Sans", "Gill Sans MT")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");
}

//function that runs in the 
$(".slider").on('input', function () {
    var clicked_id = $(this).attr("id");
    var range_val = document.getElementById(clicked_id + "_wt");
    range_val.innerHTML = this.value;
    skill_wt_dict[clicked_id + "_wt"] = this.value;
    calculate_total_score();
    d3.select("svg").remove();
    createBubbleChart();
});

calculate_total_score();
createBubbleChart();

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

