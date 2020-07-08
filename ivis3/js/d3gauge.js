
// d3 Gauge chart javascript


var name = "Requirement"; // Name for the requirement

// // Chart variables. Change these to modify the data used.
// var script_tag = document.getElementById('gauge'); // Fetches the gauge-script element
// var value = parseFloat(script_tag.getAttribute("data-gaugeValue")).toFixed(2); // Needle pointer value
// var requirement = parseFloat(script_tag.getAttribute("data-gaugeRequirement")).toFixed(2); // Requirement variable. Problably change to requirementValue + X for some offset between the requirement and the max value(incase developer exceeds requirement)


var needle;

function drawGauge(value,requirement=2.2, invertColor=false){

  if (value=="NA" || value == null){
    value = 0;
  }
  if (requirement=="NA" || requirement == null){
    requirement = 0;
  }

  d3.select("#gaugeid").remove();
  

  var gaugeMaxValue;
  if(requirement==0 && value==0){
    gaugeMaxValue = (2.0*1).toFixed(2);
  }
  else if(requirement==0 && value != 0){
    gaugeMaxValue = (1.0*value).toFixed(2);
  } 
  else{
    gaugeMaxValue = (2.0*requirement).toFixed(2); // Change this to modify the maximum value of the chart
  }

  
  //console.log(value);
  //console.log(requirement);

// data to calculate
var percentValue = value / gaugeMaxValue;
var requirementPercent = requirement / gaugeMaxValue;

// Swaps color if the value is below the requirement.
if(value<requirement && invertColor==false){
    getComputedStyle(document.documentElement).getPropertyValue('--firstChartColor');
    document.documentElement.style.setProperty('--firstChartColor', 'rgb(220,68,5)');
}
else if(value>requirement && invertColor==true){
  getComputedStyle(document.documentElement).getPropertyValue('--firstChartColor');
  document.documentElement.style.setProperty('--firstChartColor', 'rgb(220,68,5)');
}
// Swaps back to the green color. Might not be neccesary, but unsure how it interacts with a continues, non-refreshing page otherwise.
else if(value>=requirement && invertColor==false){
  getComputedStyle(document.documentElement).getPropertyValue('--firstChartColor');
  document.documentElement.style.setProperty('--firstChartColor', 'rgb(0,164,153)');
}
else{
  getComputedStyle(document.documentElement).getPropertyValue('--firstChartColor');
  document.documentElement.style.setProperty('--firstChartColor', 'rgb(0,164,153)');
}



  (function() {

    var barWidth, chart, chartInset, degToRad, repaintGauge,
      height, margin, numSections, padRad, percToDeg, percToRad,
      percent, radius, sectionIndx, svg, totalPercent, width;



    percent = percentValue;


    numSections = 1;
    sectionPerc = 1 / numSections / 2;
    padRad = 0.00; // Adds padding between the color sections
    chartInset = 10;

    // Orientation of gauge:
    totalPercent = .75;

    el = d3.select('#chart-gauge');
    margin = {
      top: 80,
      right: 20,
      bottom: 0,
      left: 60
    };

    width = 400 - margin.left - margin.right;
    height = width;
    radius = Math.min(width, height) / 2;
    barWidth = 40 * width / 300;

    // Measurement convertion methods

    percToDeg = function(perc) {
      return perc * 360;
    };

    percToRad = function(perc) {
      return degToRad(percToDeg(perc));
    };

    degToRad = function(deg) {
      return deg * Math.PI / 180;
    };

    // Create SVG element
    svg = el.append('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 400 200")
    .attr("id","gaugeid");
    //console.log(svg);



    // Add layer for the panel
    chart = svg.append('g').attr('transform', "translate(" + ((width + margin.left ) / 2) + ", " + ((height + margin.top) / 2) + ")");


    var section1 = chart.append('path').attr('class', "arc chart-first");
    var section2 = chart.append('path').attr('class', "arc chart-second");
    //chart.append('path').attr('class', "arc chart-third");
    formatValue = d3.format('1.00'); // D3 format



    chart.append("defs")
    .append("mask")
    .attr ("id", "mask-1")
    .append("circle")
    .attr("r", 180)
    .style("fill", "#FFF")
    ;
  d3.select("#mask-1")
      .append("circle")
    .attr("r", 108) // Changes how much of the needle is cut off.
    .style("fill", "#000");

    //console.log(svg);
    //console.log(el);

    //arc3 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    arc2 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    arc1 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    var count=0;
    repaintGauge = function() {
      
        //var interp = d3.interpolate(percent, count / gaugeMaxValue );
        perc = value / gaugeMaxValue;
        var next_start = totalPercent;
        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad(perc / 2);
        next_start += perc / 2;


        arc1.startAngle(arcStartRad).endAngle(arcEndRad);

        perc = 1 - perc;
        arcStartRad = percToRad(next_start);
        arcEndRad = arcStartRad + percToRad(perc / 2);
        next_start += perc / 2;

        arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

        chart.select(".chart-first").attr('d', arc1);
        chart.select(".chart-second").attr('d', arc2);



      }
      /////////

    var dataset = [{
      metric: name,
      value: value
    }]

    var texts = svg.selectAll("text")
      .data(dataset)
      .enter();


  /*
    texts.append("text") // Value variable name title below chart
      .text(function() {
        return dataset[0].metric;
      })
      .attr('id', "Name")
      .attr('transform', "translate(" + ((width + margin.left) / 4) + ", " + ((height + margin.top) / 1.5) + ")")
      .attr("font-size", 25)
      .style("fill", "#000000");

  */


    texts.append("text") // Value of the pointer below the chart
      .text(function() {
        return dataset[0].value + ""; // Add % here if you want percentage instead of flat number for the title below
      })
      .attr('id', "Value")
      .attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2.0) + ")")
      .attr("font-size", 50)
      .style("text-anchor", "middle")
      .style("fill", "#000000");




    texts.append("text") // 0 number to the left
      .text(function() {
        return 0 + ""; // Append % if percentage.
      })
      .attr('id', 'scale0')
      .attr('transform', "translate(" + ((width + margin.left) / 20) + ", " + ((height + margin.top) / 2) + ")")
      .attr("font-size", 14)
      .style("fill", "#000000");



    texts.append("text") // Text for the requirement above the chart
      .text(function() {
        if (requirement == 0){
          return "";
        }
        else{
        return requirement.toString(); // Requirement number. Add % here if you want %.
      }})
      .attr('id', 'scale10')
      .attr('transform', "translate(" + ((width + margin.left) / (gaugeMaxValue/requirement)) + ", " + ((height + margin.top) / 18) + ")")
      .attr("font-size", 14)
      .style("text-anchor", "middle")
      .style("fill", "#000000");


    texts.append("text") // Max value to the right
      .text(function() {
        return gaugeMaxValue + ""; // Append % if percentage.
      })
      .attr('id', 'scale20')
      .attr('transform', "translate(" + ((width + margin.left) / 1.08) + ", " + ((height + margin.top) / 2) + ")")
      .attr("font-size", 14)
      .style("fill", "#000000");

    var Needle = (function() {

      //Helper function that returns the `d` value for moving the needle
      var recalcPointerPos = function(perc) {
        var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
        thetaRad = percToRad(perc / 2);


        centerX = 0; // X location, always 0.
        centerY = 0; // Y location
        topX = centerX - this.len * Math.cos(thetaRad);
        topY = centerY - this.len * Math.sin(thetaRad);
        leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
        leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
        rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
        rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);


        return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
      };

      function Needle(el) {
        this.el = el;
        if(requirement == 0){
          this.len = 0;
        }
        else{
          this.len = width / 2.12;
        }
        
        this.radius = this.len / 12;
      }

      Needle.prototype.render = function() {

          /*
          //Normal curved needle
        this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
        return this.el.append('path').attr('class', 'needle').attr('id', 'client-needle').attr('d', recalcPointerPos.call(this, 0));
          */

          // Cut-off needle
          this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius)
         .attr("mask", "url(#mask-1)");

          return this.el.append('path').attr('class', 'needle').attr('d', recalcPointerPos.call(this, 0))
         .attr("mask", "url(#mask-1)");


      };

      Needle.prototype.moveTo = function(perc) {
        var self,
          oldValue = this.perc || 0;

        this.perc = perc;
        self = this;

        // Reset pointer position
        this.el.transition().delay(0).duration(0).ease(d3.easeQuad).select('.needle').tween('reset-progress', function() {
          var needle = d3.select(this);
          return function(percentOfPercent) {
            var progress = (1 - percentOfPercent) * oldValue;

            repaintGauge(progress);
            return needle.attr('d', recalcPointerPos.call(self, progress));
          };
        });

        this.el.transition().delay(0).duration(0).ease(d3.easeQuad).select('.needle').tween('progress', function() {
          var needle = d3.select(this);
          return function(percentOfPercent) {
            var progress = percentOfPercent * perc;

            repaintGauge(progress);
            return needle.attr('d', recalcPointerPos.call(self, progress));
          };
        });

      };


      return Needle;

    })();

    needle = new Needle(chart);
    needle.render();
    needle.moveTo(requirementPercent);

  })();
}


function btnSearch_Click() {
  alert("hello");
}

function gaugeTest(){
				needle.moveTo(Math.random());
      };
      


window.onload = function(){

var button1 = document.getElementById('option1');
var button2 = document.getElementById('option2');
var button3 = document.getElementById('option3');

clicked_eventHandler1();
button1.onclick = clicked_eventHandler1;
button2.onclick = clicked_eventHandler2;
button3.onclick = clicked_eventHandler3;
}



function dynamicGaugeHandler(){
  if(document.getElementById("option1").classList.contains('active')){
    clicked_eventHandler1();
  }
  else if (document.getElementById("option2").classList.contains('active')){
    clicked_eventHandler2();;
  }
  else if (document.getElementById("option3").classList.contains('active')){
    clicked_eventHandler3();
  }
  else{
    clicked_eventHandler1();
  }
  
}




function clicked_eventHandler1() {
  jQuery(function($) {

  $('#option1').addClass('active')
  $('#option2').removeClass('active')
  $('#option3').removeClass('active')
  
  // removing all children from element id="vis"
  //var svg = d3.select("#gaugeid");
  //svg.selectAll("*").remove();
    
  selection = document.getElementById("dropdown");
  var selectedProject = selection.value;
  

  //console.log(apidata.filter(obj => { return obj.fastighetsbeteckning == selectedProject }));
  var bicylevalue = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].bicycle_parking_spacesapartment_in_operation;
  
  var bicylevaluerq = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].requirement_bicycle_parkingapartment;
  
  drawGauge(bicylevalue, bicylevaluerq, false);
  });
  
  };



  function clicked_eventHandler2() {
    jQuery(function($) {

    $('#option2').addClass('active')
    $('#option1').removeClass('active')
    $('#option3').removeClass('active')

    selection = document.getElementById("dropdown");
    var selectedProject = selection.value;

    var car_parking = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].car_parking_spacesapartment;
    var car_parkingrq = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].requirment_car_parkingapartment;

    drawGauge(car_parking, car_parkingrq, true);
    });
    
    };

    function clicked_eventHandler3() {
      jQuery(function($) {
      
      $('#option3').addClass('active')
      $('#option1').removeClass('active')
      $('#option2').removeClass('active')

    
      selection = document.getElementById("dropdown");
      var selectedProject = selection.value;
    
      var electrical = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].chare_of_electrical_charging_points;
      var electricalrq = projects.filter(obj => { return obj.fastighetsbeteckning == selectedProject })[0].requiremant_electrical_chargning_points;
      drawGauge(electrical, electricalrq, false);
      });
      
      };

