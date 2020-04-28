mapboxgl.setRTLTextPlugin('https://cdn.maptiler.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js');
var x = 1;
var map = new mapboxgl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=Gi3106DynxuoFI5qOISp',
  //style: 'https://api.maptiler.com/maps/83d1b204-0e87-4183-af7f-e5937bae32cb/style.json?key=Gi3106DynxuoFI5qOISp',
  center: [0, 0],
  zoom: 0
});
document.getElementById('fly').addEventListener('click', function (e) {
  map.flyTo({
    zoom: 16,
    center: [
      14.42076,
      50.08804
    ],
    essential: true 
  });
});
document.getElementById('fly2').addEventListener('click', function (e) {
  map.flyTo({
    zoom: 16,
    center: [
      10.74609,
      59.91273
    ],
    essential: true 
  });
});


document.getElementById('fly3').addEventListener('click', function (e) {
  console.log("london");
  map.flyTo({
    zoom: 16,
    center: [
      -0.12574,
      51.50853
    ],
    essential: true 
  });
});

function hideName() {
  document.getElementById('test_form').style.visibility = "visible";
  document.getElementById('showName').style.display = "initial";
  document.getElementById('hideName').style.display = "none";
  document.getElementById('a1').innerHTML = "Score: " + correct + "/" + total + "<br> Please select a street.";
  if (map.getLayer('road_label'))
    map.removeLayer('road_label');
}
document.getElementById('scrclear').addEventListener('click', function (e) {

  var skore = document.getElementById("a1");
  correct=0;
  total=0;
  localStorage.clear();
  skore.innerHTML = "Score: " + correct + "/" + total + "<br> Please select a street.";
});

var street_name;

function showName() {
  document.getElementById('test_form').style.visibility = "hidden";
  document.getElementById('hideName').style.display = "initial";
  document.getElementById('showName').style.display = "none";
  document.getElementById('a1').innerHTML = "Score: " + correct + "/" + total + "<br> To start press start training.";

  map.addLayer({
    "id": "road_label",
    "type": "symbol",
    "metadata": {},
    "source": "openmaptiles",
    "source-layer": "transportation_name",
    "filter": [
      "all"
    ],
    "layout": {
      "symbol-placement": "line",
      "text-anchor": "center",
      "text-field": "{name:latin} {name:nonlatin}",
      "text-font": [
        "Roboto Regular",
        "Noto Sans Regular"
      ],
      "text-offset": [
        0,
        0.15
      ],
      "text-size": {
        "base": 1,
        "stops": [
          [
            13,
            12
          ],
          [
            14,
            13
          ]
        ]
      }
    },
    "paint": {
      "text-color": "#765",
      "text-halo-blur": 0.5,
      "text-halo-width": 1
    }

  });
}

map.on('style.load', function () {
  map.addSource('streets', {
    "type": "geojson",
    "data": "https://api.maptiler.com/maps/83d1b204-0e87-4183-af7f-e5937bae32cb/style.json?key=Gi3106DynxuoFI5qOISp"
  });
  map.addLayer({
    "id": "m_streets",
    "type": "line",
    "source": "streets",
    "interactive": true,
    "layout": {},
    "paint": {
      "line-color": "red",
      // "line-opacity": 0.0,
      "line-width": 2.5
    }
  });

  for(const ln of ["road_secondary_tertiary", "road_minor"]) { 
    map.on("click", ln, (e) => {
      console.log("D1", e.features);
      const geojson = [];
      for(const feature of e.features) {
        const gj = feature.toJSON();
        geojson.push(gj);
        console.log(gj);
        var x1 = [0,0];
        var y1 = [0,0];
        x1[0]=gj.geometry.coordinates[0][0];
        x1[1]=gj.geometry.coordinates[1][0];
        y1[0]=gj.geometry.coordinates[0][1];
        y1[1]=gj.geometry.coordinates[1][1];
        var prx = (x1[0]+x1[1])/2;
        var pry = (y1[0]+y1[1])/2;
        var geo = `https://api.maptiler.com/geocoding/${prx},${pry}.json?key=Gi3106DynxuoFI5qOISp`;
        fetch(geo).then(res =>
          res.json().then(json => {
            console.log(json);
            var street = null;
            for(const f of json.features) {
              if(f.place_type.filter(t => t == "street").length > 0) {
                street = f;
              }
            }
            console.log("You clicked on", street.text);
            street_name = street.text;
          })
        );
        console.log(geo);
      }
      if(map.getSource("__hldata")) {
      map.removeLayer("__highlight");
      map.removeSource("__hldata");
      }
      map.addSource("__hldata", {
      "type": "geojson",
      "data": {
        type: "FeatureCollection",
        features: geojson,
      }, 
      });
      map.addLayer({
        "id": "__highlight",
        "type": "line",
        "source": "__hldata",
        "interactive": true,
        "layout": {},
        "paint": {
          "line-color": "red",
          // "line-opacity": 0.0,
          "line-width": 2.5
        }
      });
    });
  }
});


//GET https://api.maptiler.com/geocoding/[location].json?key=Gi3106DynxuoFI5qOISp | cut -f9 -d"," | cut -f4 -d'"'
