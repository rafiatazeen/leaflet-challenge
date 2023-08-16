// store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    //once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    //define a function that we want to run once for each feature in the features array
    //give each feature a popup that describes the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><h3> Location: ${feature.properties.place}</h3><h3> Depth: ${feature.geometry.coordinates[2]}</h3><hr><p> Date: ${new Date(feature.properties.time)}</p>`);
    }

    //define function for the marker size
    function markerSize(magnitude) {
        return magnitude * 15000;
    }



    //create a GeoJSON layer that contains the features array on the earthquakeData object
    //run the onEachFeature function once for each piece of data in the array
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(earthquakeData, latlng) {
            if (earthquakeData.geometry.coordinates[2] < 10) {
                markerColor = "#93f300";
            }
            else if (earthquakeData.geometry.coordinates[2] < 30) {
                markerColor = "#7ccc00";
            }
            else if (earthquakeData.geometry.coordinates[2] < 50) {
                markerColor = "#64a500";
            }
            else if (earthquakeData.geometry.coordinates[2] < 70) {
                markerColor = "#4c7d00";
            }
            else if (earthquakeData.geometry.coordinates[2] < 90) {
                markerColor = "#345600";
            }
            else  markerColor = "#1c2f00";
            return L.circle(latlng, {
                radius: markerSize(earthquakeData.properties.mag),
                fillColor: markerColor,

                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                color: "#050800"
            });
        }
    });
    
    // send out earthquake layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    
    //create the base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  //create a baseMaps object
  let baseMaps = {
    "Street Map": street
  };

  //create our map, giving it the streetmap to display on load
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });


  //set up the legend
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend")
    let colors = ["#93f300", "#7ccc00", "#64a500", "#4c7d00", "#345600", "#1c2f00"];
    let labels = ["-10","10", "30", "50", "70", "90"];
    for (let i = 0; i < labels.length; i++) {
        div.innerHTML += "<i style='background: "
          + colors[i]
          + "'></i> "
          + labels[i]
          + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
      }
      return div;

  };

  legend.addTo(myMap);
}
