
dataset = {
    "children": [{ "Name": "Olives", "Count": 4319 },
    { "Name": "Tea", "Count": 4159 },
    { "Name": "Mashed Potatoes", "Count": 2583 },
    { "Name": "Boiled Potatoes", "Count": 2074 },
    { "Name": "Milk", "Count": 1894 },
    { "Name": "Chicken Salad", "Count": 1809 },
    { "Name": "Vanilla Ice Cream", "Count": 1713 },
    { "Name": "Cocoa", "Count": 1636 },
    { "Name": "Lettuce Salad", "Count": 1566 },
    { "Name": "Lobster Salad", "Count": 1511 },
    { "Name": "Chocolate", "Count": 1489 },
    { "Name": "Apple Pie", "Count": 1487 },
    { "Name": "Orange Juice", "Count": 1423 },
    { "Name": "American Cheese", "Count": 1372 },
    { "Name": "Green Peas", "Count": 1341 },
    { "Name": "Assorted Cakes", "Count": 1331 },
    { "Name": "French Fried Potatoes", "Count": 1328 },
    { "Name": "Potato Salad", "Count": 1306 },
    { "Name": "Baked Potatoes", "Count": 1293 },
    { "Name": "Roquefort", "Count": 1273 },
    { "Name": "Stewed Prunes", "Count": 1268 }]
};


let construction_waste_kgm2_gfa_array = norra2_json.map(a => parseFloat(a.construction_waste_kgm2_gfa));
let co2_emissions_tonnes_array = norra2_json.map(a => a.co2_emissions_tonnes);
let total_energy_use_construction_array = norra2_json.map(a => a.total_energy_use_construction);
let green_space_index_gsi_construction_array = norra2_json.map(a => a.green_space_index_gsi_construction);


let construction_waste_kgm2_gfa_scale = d3.scaleLinear().range([0, 100]);
let co2_emissions_tonnes_scale = d3.scaleLinear().range([0, 100]);
let total_energy_use_construction_scale = d3.scaleLinear().range([0, 100]);
let green_space_index_gsi_construction_scale = d3.scaleLinear().range([0, 100]);

construction_waste_kgm2_gfa_scale.domain([0, Math.max.apply(null, construction_waste_kgm2_gfa_array)]);
co2_emissions_tonnes_scale.domain([0, Math.max.apply(null, co2_emissions_tonnes_array)]);
green_space_index_gsi_construction_scale.domain([0, Math.max.apply(null, green_space_index_gsi_construction_array)]);
total_energy_use_construction_scale.domain([0, Math.max.apply(null, total_energy_use_construction_array)]);

var skill_wt_dict = {
    "construction_waste_kgm2_gfa_wt": 50,
    "co2_emissions_tonnes_wt": 50,
    "total_energy_use_construction_wt": 50,
    "green_space_index_gsi_construction_wt": 50
};

function calculate_total_score() {
    norra2_json.forEach(developer => {
        developer.tot_score = 0;
        sum = 0;
        sum = construction_waste_kgm2_gfa_scale(developer["construction_waste_kgm2_gfa"]) * skill_wt_dict["construction_waste_kgm2_gfa_wt"] +
            co2_emissions_tonnes_scale(developer["co2_emissions_tonnes"]) * skill_wt_dict["co2_emissions_tonnes_wt"] +
            total_energy_use_construction_scale(developer["total_energy_use_construction"]) * skill_wt_dict["total_energy_use_construction_wt"] +
            green_space_index_gsi_construction_scale(developer["green_space_index_gsi_construction"]) * skill_wt_dict["green_space_index_gsi_construction_wt"];
        developer.tot_score = totalvalue_scale(sum);
    });
}

var totalvalue_scale = d3.scaleLinear().domain([0,40000]).range([0,100]);

var radius_scale = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 200]);

function developer_circle_color(total_score) {
    sum = 20000;
    // console.log(total_score/sum);
    if (total_score > 60) {
        return "rgb(0,164,153)";
    } else if (total_score > 30) {
        return "rgb(0, 119, 200)";
    }
    else {
        return "rgb(206,0,88)";
    }
}

$(".slider").on('input', function () {
    var clicked_id = $(this).attr("id");
    var range_val = document.getElementById(clicked_id + "_wt");
    range_val.innerHTML = this.value;
    skill_wt_dict[clicked_id + "_wt"] = this.value;
    calculate_total_score();
    dataset = { "children": norra2_json };
    d3.select("svg").remove();

    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("body")
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

    node.append("title")
        .text(function (d) {
            return d.atemp_m2 + ": " + d.atemp_m2;
        });

    var circle = node.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            // console.log("to");
            // console.log(d.data.tot_score);
            
            return developer_circle_color(d.data.tot_score);
            // return color(i);
        });

        node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return parseInt(d.data.tot_score);
        })
        .attr("font-family", "Gill Sans", "Gill Sans MT")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");
    // circle
    //     .data(norra2_json)
    //     .transition()
    //     .duration(100)
    //     .style("fill", d => developer_circle_color(d.tot_score))
    //     .attr("r", d => Math.sqrt(radius_scale(d.tot_score)));

});

calculate_total_score();

var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);
dataset = { "children": norra2_json };
var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body")
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

node.append("title")
    .text(function (d) {
        return d.atemp_m2 + ": " + d.atemp_m2;
    });

var circle = node.append("circle")
    .attr("r", function (d) {
        // console.log(d);
        return d.r;
    })
    .style("fill", function (d, i) {
        // console.log("to");
        // console.log(d.data.tot_score);

        developer_circle_color(d.data.tot_score);
        // return color(i);
    });

// node.append("text")
//     .attr("dy", ".2em")
//     .style("text-anchor", "middle")
//     .text(function(d) {
//         return d.data.atemp_m2.substring(0, d.r / 3);
//     })
//     .attr("font-family", "sans-serif")
//     .attr("font-size", function(d){
//         return d.r/5;
//     })
//     .attr("fill", "white");

node.append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return parseInt(d.data.tot_score);
    })
    .attr("font-family", "Gill Sans", "Gill Sans MT")
    .attr("font-size", function (d) {
        return d.r / 5;
    })
    .attr("fill", "white");

d3.select(self.frameElement)
    .style("height", diameter + "px");

