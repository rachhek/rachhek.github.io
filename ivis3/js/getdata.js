



// Example on how to use the functions. You can use the json objects within this function


// No filters, all sustainability data
/*
getSustainability("", "", function(data){
    console.log(data);
    // Create chart here with data etc.
})
*/

function getRequirements(phaseFilter="", developerFilter="", callback) {

    var requirementapi = 'https://bridge.buddyweb.fr/api/requirementlevelssustainabilitydatasrsv40/requirementlevelssustainabilitydatasrsv40';

    $.getJSON( requirementapi, {
      tags: "",
      tagmode: "",
      format: "json"
    })
      .done(function( data ) {

        console.log("Sustainability API call");
        if(phaseFilter != ""){
            var data = data.filter(function(v){ return v.phase==phaseFilter})
        }

        if(developerFilter != ""){
            var data = data.filter(function(v){ return v.developer==developerFilter})
        }
        callback(data);
    });
}


function getSustainability(phaseFilter="", developerFilter="", callback) {

    var sustainabilityapi = 'https://bridge.buddyweb.fr/api/kthnorrasustainabilitydatasrsv40/kthnorrasustainabilitydatasrsv40';

    $.getJSON( sustainabilityapi, {
      tags: "",
      tagmode: "",
      format: "json"
    })
      .done(function( data ) {

        console.log("Sustainability API call");
        if(phaseFilter != ""){
            var data = data.filter(function(v){ return v.phase==phaseFilter})
        }

        if(developerFilter != ""){
            var data = data.filter(function(v){ return v.developer==developerFilter})
        }



        //console.log(sustainability);
        for(var i=0;i<data.length; i++){
          // typo handling
          data[i]["heating_district_heating_kwhm2_atemp_design"] = data[i]["heating_district_geating_kwhm2_atemp_design"]
        }
        // Replaces missing data with related data if available
        for(var i=0; i<data.length; i++){
            for(var property in data[i]){
                if(data[i].hasOwnProperty(property)){
                    if(data[i][property] == "NA" || data[i][property] == null || data[i][property] == "Not reported yet"){

                        //console.log(property);
                        //console.log(data[i][property]);


                        if(/_in_operation/.test(property)){
                            var newKey1 = property.toString().replace(/_in_operation/, '_construction');
                            var newKey2 = property.toString().replace(/_in_operation/, '_design');
                            console.log(newKey1);
                            console.log(data[i][newKey1]);
                            console.log(newKey2);
                            console.log(data[i][newKey2]);

                            if(!(data[i][newKey1] == "NA" || data[i][newKey1] == null || data[i][property] == "Not reported yet")){
                                data[i][property] = data[i][newKey1];
                            }

                            else if(!(data[i][newKey2] == "NA" || data[i][newKey2] == null || data[i][property] == "Not reported yet")){
                                data[i][property] = data[i][newKey2];
                                data[i][newKey1] = data[i][newKey2];
                            }

                        }

                        if(/_construction/.test(property)){
                            var newKey = property.toString().replace(/_construction/, '_design');
                            //console.log(newKey);
                            //console.log(data[i][newKey]);
                            if(!(data[i][newKey] == "NA" || data[i][newKey] == null || data[i][property] == "Not reported yet")){
                                data[i][property] = data[i][newKey];
                            }
                        }

                        if(/_design/.test(property)){
                            var newKey = property.toString().replace(/_design/, '_construction');
                            //console.log(newKey);
                            //console.log(data[i][newKey]);
                            if(!(data[i][newKey] == "NA" || data[i][newKey] == null || data[i][property] == "Not reported yet")){
                                data[i][property] = data[i][newKey];
                            }
                        }


                    }
                }
            }
        }

        //final NA work
        for(var i=0; i<data.length; i++){
            for(var property in data[i]){
              if(data[i][property] == "NA" || data[i][property] == null || data[i][property] == "Not reported yet") {
                data[i][property]=0
              }
            }
          }
        callback(data);
      });
  };
