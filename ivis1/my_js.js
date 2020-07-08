$(".nav-link").on("click", function () {
    $('.navbar-nav').find(".active").removeClass("active");
    $(this).parent().addClass("active");

    skill_name = $(this).attr("id");
    students = filter_by_skill(skill_name);
    d3.selectAll('.list-ul').html("");

    Object.keys(students).forEach(skill => {
        students[skill].forEach(student => {
            if (skill == "beginner_list") {
                d3.select('#beginner-list')
                    .append('li')
                    .attr("class", "list-group-item")
                    .text(student.full_name)
                    .on('mouseover', function () {
                        nameMouseOverFunc(student);
                    })
                    .on('mouseout', function () {
                        nameMouseOutFunc(student);
                    });
            }
            else if (skill == "intermediate_list") {
                d3.select('#intermediate-list')
                    .append('li')
                    .attr("class", "list-group-item")
                    .text(student.full_name)
                    .on('mouseover', function () {
                        nameMouseOverFunc(student);
                    })
                    .on('mouseout', function () {
                        nameMouseOutFunc(student);
                    });
            }
            else if (skill == "expert_list") {
                d3.select('#expert-list')
                    .append('li')
                    .attr("class", "list-group-item")
                    .text(student.full_name)
                    .on('mouseover', function () {
                        nameMouseOverFunc(student);
                    })
                    .on('mouseout', function () {
                        nameMouseOutFunc(student);
                    });
            }
        });
    });

});


function nameMouseOverFunc(student) {
    d3.select('#detail-bar').html("");
    updatePersonalInfo(student);
    updateBarChart(student);
}

function nameMouseOutFunc(student) {
    d3.select('#detail-bar').html("");
    d3.select('#std_name').html("");
    d3.select('#std_major').html("");
    d3.select('#std_degree').html("");
    d3.select('#std_hobbies').html("");
    createBarAxes(student);
}

function updatePersonalInfo(student) {
    d3.select('#std_name').text(student.full_name);
    d3.select('#std_major').text(student.major);
    d3.select('#std_degree').text(student.degree);
    d3.select('#std_hobbies').text(student.hobbies.substring(0, 100));
}

function createBarAxes(student) {
    new_arr = [];
    Object.keys(student).forEach(key => {
        if (["full_name", "major", "degree", "id", "learning_expectation", "hobbies", "skill_total"].indexOf(key) === -1) {
            var new_obj = {
                "key": key,
                "value": student[key]
            };
            new_arr.push(new_obj);
        }
    });

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 100, bottom: 30, left: 120 },
        width = document.getElementById('detail-bar').clientWidth - margin.left - margin.right,
        height = document.getElementById('detail-bar').offsetHeight - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#detail-bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    x.domain([0, 10])
    y.domain(new_arr.map(function (d) { return d.key; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

}

function updateBarChart(student) {
    new_arr = [];
    Object.keys(student).forEach(key => {
        if (["full_name", "major", "degree", "id", "learning_expectation", "hobbies", "skill_total"].indexOf(key) === -1) {
            var new_obj = {
                "key": key,
                "value": student[key]
            };
            new_arr.push(new_obj);
        }
    });

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 100, bottom: 30, left: 120 },
        width = document.getElementById('detail-bar').clientWidth - margin.left - margin.right,
        height = document.getElementById('detail-bar').offsetHeight - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#detail-bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    x.domain([0, 10])
    y.domain(new_arr.map(function (d) { return d.key; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(new_arr)
        .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function (d) { return x(d.value); })
        .attr("y", function (d) { return y(d.key); })
        .attr("height", y.bandwidth());




    // d3.select("#detail-bar")
    // .append("div")
    // .html(student);
}

$("#draw_skill").click();
student = json_data[0];
createBarAxes(student);




////slider logic

// var infoviz_range = document.getElementById("infoviz_range");
// var infoviz_wt = document.getElementById("infoviz_wt");
// infoviz_wt.innerHTML = infoviz_range.value; // Display the default slider value
// // Update the current slider value (each time you drag the slider handle)
// infoviz_range.oninput = function() {
//     infoviz_wt.innerHTML = this.value;
// }

var skill_wt_dict = {
    "infoviz_range_wt": 50,
    "stat_range_wt": 50,
    "maths_range_wt": 50,
    "draw_range_wt": 50,
    "computer_range_wt": 50,
    "programming_range_wt": 50,
    "cg_range_wt": 50,
    "hci_range_wt": 50,
    "ux_range_wt": 50,
    "comm_range_wt": 50,
    "collab_range_wt": 50,
    "repo_range_wt": 50,
};

$(".slider").on('input', function () {
    var clicked_id = $(this).attr("id");
    var range_val = document.getElementById(clicked_id + "_wt");
    range_val.innerHTML = this.value;
    skill_wt_dict[clicked_id + "_wt"] = this.value;
    d3.selectAll(".grp-table-td").html("");
    calculate_rank();
    assign_to_groups(json_data);
});

//ranking logic

function clear_table() {
    for (let index = 0; index < 10; index++) {
    }
}

function calculate_rank() {


    json_data.forEach(std_obj => {
        std_obj.total_wt_score = 0;
        sum = 0;
        sum = std_obj["infoviz_skill"] * skill_wt_dict["infoviz_range_wt"] +
            std_obj["stat_skill"] * skill_wt_dict["stat_range_wt"] +
            std_obj["maths_skill"] * skill_wt_dict["maths_range_wt"] +
            std_obj["draw_skill"] * skill_wt_dict["draw_range_wt"] +
            std_obj["computer_skill"] * skill_wt_dict["computer_range_wt"] +
            std_obj["programming_skill"] * skill_wt_dict["programming_range_wt"] +
            std_obj["cg_skill"] * skill_wt_dict["cg_range_wt"] +
            std_obj["hci_skill"] * skill_wt_dict["hci_range_wt"] +
            std_obj["ux_skill"] * skill_wt_dict["ux_range_wt"] +
            std_obj["communication_skill"] * skill_wt_dict["comm_range_wt"] +
            std_obj["collaboration_skill"] * skill_wt_dict["collab_range_wt"] +
            std_obj["repo_skill"] * skill_wt_dict["repo_range_wt"];
        std_obj.total_wt_score = sum;
    });
    json_data.sort((a, b) => (a.total_wt_score < b.total_wt_score) ? 1 : -1);
}

function assign_to_groups(data) {
    count = 1;
    for (let index = 0; index < json_data.length; index = index + 6) {
        group = json_data.slice(index, index + 5);
        ul = d3.select('#grp' + count).append('ul');
        ul.append('div').text("Group "+ count);
        group.forEach(student => {
            ul.append('li')
                .attr("class", "list-group-item py-1")
                .style("font-size", "14px")
                .style("color","white")
                .text(student.full_name)
                .style("background",function(student){
                    console.log(student.skill_total);
                    if(student.skill_total<54){
                        return "#5F6360";
                    }
                    else if(student.skill_total<72){
                        return "#0F5A6E";
                    }
                    else{
                        return "#DA6262";   
                    }
                } (student))           
                ;
        });
        count = count + 1;
    }
}

assign_to_groups(json_data);





//