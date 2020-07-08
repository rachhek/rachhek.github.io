var svgHeight = 300;
var svgWidth = 1000;

var radius = 10;

var svg = d3.select("#graph")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

test_data = [1, 1, 1];

let construction_waste_kgm2_gfa_array = norra2_json.map(a => parseFloat(a.construction_waste_kgm2_gfa));


console.log(Math.max.apply(null,construction_waste_kgm2_gfa_array));

let co2_emissions_tonnes_array = norra2_json.map(a => a.co2_emissions_tonnes);
let total_energy_use_construction_array = norra2_json.map(a => a.total_energy_use_construction);
let green_space_index_gsi_construction_array = norra2_json.map(a => a.green_space_index_gsi_construction);

console.log(construction_waste_kgm2_gfa_array);
console.log(total_energy_use_construction_array);
console.log(green_space_index_gsi_construction_array);
console.log(co2_emissions_tonnes_array);
console.log(Math.max.apply(null,green_space_index_gsi_construction_array));
console.log("total energy" + Math.max.apply(null,total_energy_use_construction_array));


let construction_waste_kgm2_gfa_scale = d3.scaleLinear().range([0,50]);
let co2_emissions_tonnes_scale = d3.scaleLinear().range([0,50]);
let total_energy_use_construction_scale = d3.scaleLinear().range([0,50]);
let green_space_index_gsi_construction_scale = d3.scaleLinear().range([0,50]);

construction_waste_kgm2_gfa_scale.domain([0, Math.max.apply(null,construction_waste_kgm2_gfa_array)]);
co2_emissions_tonnes_scale.domain([0, Math.max.apply(null,co2_emissions_tonnes_array)]);
green_space_index_gsi_construction_scale.domain([0, Math.max.apply(null,green_space_index_gsi_construction_array)]);
total_energy_use_construction_scale.domain([0, Math.max.apply(null,total_energy_use_construction_array)]);

var radius_scale = d3.scaleLinear()
	.domain([0, 1000])
	.range([0, 200]);


var skill_wt_dict = {
	"construction_waste_kgm2_gfa_wt": 50,
	"co2_emissions_tonnes_wt": 50,
	"total_energy_use_construction_wt": 50,
	"green_space_index_gsi_construction_wt": 50
};

developers = [
	{
		"developer": "zed developer",
		"green_score": 90,
		"carbon_score": 80
	},
	{
		"developer": "rachhek developer",
		"green_score": 50,
		"carbon_score": 50
	},
	{
		"developer": "yuwen developer",
		"green_score": 5,
		"carbon_score": 5
	}
];


function calculate_total_score() {
	norra2_json.forEach(developer => {
		developer.tot_score = 0;
		sum = 0;
		sum =  construction_waste_kgm2_gfa_scale(developer["construction_waste_kgm2_gfa"]) * skill_wt_dict["construction_waste_kgm2_gfa_wt"] +
		co2_emissions_tonnes_scale(developer["co2_emissions_tonnes"])  * skill_wt_dict["co2_emissions_tonnes_wt"]+
		total_energy_use_construction_scale(developer["total_energy_use_construction"] )	* skill_wt_dict["total_energy_use_construction_wt"]+
		green_space_index_gsi_construction_scale(developer["green_space_index_gsi_construction"]) * skill_wt_dict["green_space_index_gsi_construction_wt"];
		developer.tot_score = sum;
	});
}


var radius_scale = d3.scaleLinear()
	.domain([0, 1000])
	.range([0, 200]);


calculate_total_score();
var circle = svg.selectAll("circle")
	.data(norra2_json)
	.enter()
	.append("circle")
	.attr("cx", function (d, i) {
		//  console.log(this.r["animVal"]); 
		return 50 + (i * svgWidth / norra2_json.length);
	})
	.attr("cy", 100)
	.attr("r", d => Math.sqrt(radius_scale(d.tot_score)))
    .style("fill",d=> developer_circle_color(d.tot_score))
    .on('mouseover', function (d) {
        alert(d.developer);
    })
    ;

    function nameMouseOverFunc(){

    }


function change_test_data(value) {
	test_data = test_data.map(function (item) { return item + value; })
	// circle.selectAll("circle")
	// 		.data(test_data)
	// 		.attr("r", d=> Math.sqrt(radius_scale(d)));
	circle
		.data(test_data)
		.transition()
		.duration(100)
		.attr("r", d => Math.sqrt(radius_scale(d.tot_score)));
	// console.log(test_data);
}

function developer_circle_color(total_score)
{
	sum = 20000;
	if(total_score/sum>0.6){
		return "rgb(0,164,153)";
	}else if(total_score/sum>0.3)
	{
		return "rgb(0, 119, 200)";
	}
	else{
		return "rgb(206,0,88)";
	}
}

				// d => Math.sqrt(d)
				// function(d){return Math.sqrt(d)} 