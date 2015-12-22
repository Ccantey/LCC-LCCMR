//core business logic
var map, geojson, mapDistrictsLayer, overlayLayerLabels ={},
	fields = ["district", "name"], switchMap ={},
	labelarray = [];

//map Layers
var pushPinMarker, vectorBasemap,streetsBasemap, MinnesotaBoundaryLayer;
//map overlay layers... called like overlayLayers.CongressionalBoundaryLayer
var overlayLayers ={};

var geocoder = null;

//Set initial basemap with initialize() - called in helper.js
function init(){
	// $("#map").height('544px');

    var southWest = L.latLng(41.86956, -104.4140625),
    northEast = L.latLng(50.1487464, -82.902832),
    bounds = L.latLngBounds(southWest, northEast);
	
	map = L.map("map", {
		center: L.latLng(46.1706, -93.6678),
	maxBounds: bounds,
		zoom: 7
	});
    // geocoder = new google.maps.Geocoder;



	vectorBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,

					 zIndex: 1,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.light'
					}).addTo(map);
	streetsBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
					maxZoom: 18,
					minZoom: 6,

					 zIndex: 1,
					attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
						'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
						'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.streets-satellite'
					})

	// $.getJSON("php/getOverlayLayersAsGeoJSON.php", function(data) {
	// 				var myStyle = {
	// 			    	"color": "#991a36",
	// 			    	"weight": 2,
	// 			    	"opacity": 0.65
	// 				};
	// 				overlayLayers['polygon'] = L.geoJson(data, {
	// 					style:myStyle,
	// 					onEachFeature: function (feature, layer) {
	// 						var html = "";
	// 						for (prop in feature.properties){
	// 							if (prop != 'memid'){
	// 							  html += prop+": "+feature.properties[prop]+"<br>";
	// 							} else {}
	// 						};
	// 				        layer.bindPopup(html);
	// 				    }

	// 				});						 
	// 			}).done(function(){
	// 				//console.log(switchMap[switchId]);
	// 				overlayLayers['polygon'].addTo(map);
	// 				$('#loading').hide();
	// 			});

	// toggleBaseLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);

};