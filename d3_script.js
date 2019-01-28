	var data = [{"letter":"A","presses":1},{"letter":"B","presses":1},{"letter":"C","presses":1}];
	console.log(data);
	var attributes = [];
	attributes = Object.keys(json_data[1]);

	result1 = {};
		//console.log( "JSON Data: " + json.map(a=>a["repo_skill"]));
	attributes.forEach(attribute => {
		values = json_data.map(a=>a[attribute]);
		result1[attribute] = {};
		result1[attribute]["values"] = values;
		result1[attribute]["levels"] = segregrate_users(values);
	});	


	// var data1 = Object.values(result1["cg_skill"].levels);
	// var data2 = Object.values(result1["repo_skill"].levels);
	var data3 = result1["repo_skill"].levels;

	// console.log(data1);
	// console.log(data2);
	console.log(data3);

	function segregrate_users(data)
	{
		beginner = 0,intermediate = 0, expert = 0;
		result = [];
		data.forEach(element => {
			if(element <=3){
				beginner += 1;
			}
			else if(element >3 & element <=7){
				intermediate += 1;
			}
			else if(element >7 & element <=10){
				expert++;
			}
		});
		var obj1 = {
			"level_name":"beginner",
			"value" : beginner
		};
		var obj2 = {
			"level_name":"intermediate",
			"value" : intermediate
		};
		var obj3 = {
			"level_name":"expert",
			"value" : expert
		};
		result.push(obj1);
		result.push(obj2);
		result.push(obj3);
		// result["beginner"] = beginner;
		// result["intermediate"] = intermediate;
		// result["expert"] = expert;
		return result;
	}

	function filter_by_skill(skill_name){
		expert_list = [];
		intermediate_list = [];
		beginner_list = [];
		json_data.forEach(obj => {
			skill_value = obj[skill_name];

			if(skill_value> 0 & skill_value<=3){
				beginner_list.push(obj);
			}else if(skill_value>3 & skill_value<=7){
				intermediate_list.push(obj);
			}else if(skill_value>7 & skill_value<=10){
				expert_list.push(obj);
			}
		});
		var result_obj = {
			"beginner_list": beginner_list,
			"intermediate_list": intermediate_list,
			"expert_list" : expert_list
		}
		return result_obj;
	}

	console.log(filter_by_skill("repo_skill"));

	function get_user_data(full_name){
		return json_data.filter(x=>x.full_name==full_name)
	}


	var width = document.getElementById('pie').clientWidth - 10,
		height = 300,
		radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal()
		.range(["#2C93E8","#838690","#F56C4E"]);



	var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);


	var svg = d3.select("#pie")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point

	var arc = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0);

	var pie = d3.pie()
	.value(function(d) { return d.value; });

	var g = svg.selectAll("arc")
		.data(pie(data3))
		.enter().append("g")
		.attr("class", "arc");



	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.level_name);})
		.each(function(d) { this._current = d; }); // store the initial angles;


	g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.text(function(d) { return d.data.value ;})
		.style("fill", "#fff")
		.each(function(d) { this._current = d; }); // store the initial angles;



	function add(a, b) {
		return a + b;
	}

	function change(data) {
		var pie = d3.pie()
			.value(function(d) { return d.value; })(data);
		path = d3.select("#pie").selectAll("path").data(pie);
		//path.attr("d", arc);
		//d3.selectAll("text").data(pie).attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; });
		d3.selectAll("text").data(pie).text(function(d) { return d.data.value ;}).transition().duration(500).attrTween("transform", labelarcTween); // Smooth transition with labelarcTween
		path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween
	}

	function arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return arc(i(t));
	};
	}

	function labelarcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return "translate(" + labelArc.centroid(i(t)) + ")";
	};
	}

	$(".skill-btn").on('click', function(event){
		var id = this.id;
		// var data = Object.values(result1[id].levels);
		var data = result1[id].levels;
		change(data);
	});



	//legend
	
// define legend
// legend dimensions
var legendRectSize = 25; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

// define color scale

var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
    var horz = 6 * legendRectSize; // the legend is shifted to the left to make room for the text
    var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
      return 'translate(' + horz + ',' + vert + ')'; //return translation       
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
  .attr('width', legendRectSize) // width of rect size is defined above                        
  .attr('height', legendRectSize) // height of rect size is defined above                      
  .style('fill', color) // each fill is passed a color
  .style('stroke', color); // each stroke is passed a color

// adding text to legend
legend.append('text')                                  
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; }); // return label


  ///text box
  var studentListBox = d3.select("#studentList")
  .append('div')
  .attr('class','test1');


  var path = svg.selectAll('path');

  path.on('click', function(d) {  // when mouse enters div   
		skill_level = d.data.level_name;
		skill_name = $(".navbar-nav").find(".active")[0].childNodes[1].id;
		d3.select('#expert-list').html(d.data.level_name);   
   });                          
   
   
 

 
   



  //https://codepen.io/lisaofalltrades/pen/jZyzKo