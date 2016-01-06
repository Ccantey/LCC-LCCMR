//core business logic
var map, LandAcquisitions, switchMap ={},
	labelarray = [];

//map Layers
var pushPinMarker, vectorBasemap,streetsBasemap, MinnesotaBoundaryLayer;
//map overlay layers... called like overlayLayers.CongressionalBoundaryLayer


var geocoder = null;

//Set initial basemap with initialize() - called in helper.js
function init(){
	// $("#map").height('544px');

    var southWest = L.latLng(41.86956, -105.7140625),
    northEast = L.latLng(50.1487464, -84.202832),
    bounds = L.latLngBounds(southWest, northEast);
	
	map = L.map("map", {
		center: L.latLng(46.1706, -94.9678),
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
					});


	$.getJSON("php/getOverlayLayersAsGeoJSON.php", function(data) {

					LandAcquisitions = L.geoJson(data, {
						//style:myStyle,
						pointToLayer: function(feature, latlng){
							
							// var deselectedIcon = L.icon({iconUrl: 'images/pushpin.png'});
							// var selected = L.icon({iconUrl:'images/selectedpushpin.png'});
							var deselectedIcon = L.divIcon({className: 'deselected-icon'});
							var selected = L.divIcon({className: 'selected-icon'});
							pushPinMarker = L.marker(latlng, {icon:deselectedIcon})
							                 .on('click', function(e) { 
							                    LandAcquisitions.eachLayer(function(layer){
							                    	console.log(layer)
							                    	navTab('results', $("li[data-navlist-id='results']"));
							                    	if(layer.options.icon.options.className == "selected-icon"){
							                    		console.log("deselected");
							                    		layer.setIcon(deselectedIcon)
							                    	}
							                    })
							                 	console.log(e.target);
							                 	e.target.setIcon(selected)
							                 	// this.options.color ="red";
							                 	var html = "";
							                 	$('#data').html(html);
												for (prop in feature.properties){
													if (prop != 'memid'){
													  html += "<tr><th>" +prop+": </th><td>"+feature.properties[prop]+"</td></tr>";
													} else {}
												};
												//pushPinMarker.bindPopup(html);
												// /console.log(html);
										        $('#data').append(html); 

							                 });
						    return pushPinMarker;

						}
				    })
    }).done(function(e){

					var clusters = L.markerClusterGroup({
							spiderfyOnMaxZoom:false,
							disableClusteringAtZoom: 16,
							polygonOptions: {
							      color: '#ae4b37',
							      weight: 4,
							      opacity: 1,
							      fillOpacity: 0.5
							},

						    // this function defines how the icons
						    // representing  clusters are created
						    iconCreateFunction: function(cluster) {
						      // get the number of items in the cluster
						      var count = cluster.getChildCount();
						      // figure out how many digits long the number is
						      var digits = (count+'').length;
						      // return a new L.DivIcon with our classes so we can
						      // style them with CSS. Take a look at the CSS in
						      // the <head> to see these styles. You have to set
						      // iconSize to null if you want to use CSS to set the
						      // width and height.
						      return new L.divIcon({
									        html: count,
									        className:'cluster digits-'+digits,
									        iconSize: null
									      });
						    }

				     });
					 clusters.addLayer(LandAcquisitions);
					 clusters.addTo(map);
				}); //getJson


	// toggleBaseLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);



};

	  function navTab(id, tab){
	  	$("li.navlist").removeClass("active");
	  	$( tab ).addClass( "active" );
	  	$("#search, #layers, #results, #lccmr").hide();
        switch(id){
        	case "search":
        	    // console.log(id);
                $('#'+id).show();
        	    break;
        	case "layers":
        	    // console.log(id);
        	    $('#'+id).show();
        	    break;
        	case "results":
        	    // console.log(id);
        	    $('#'+id).show();
        	    break;
        	case "lccmr":
        	    // console.log(id);
        	    $('#'+id).show();
        	    break;

        }
     }
     
   //   function layerNavTab(id){
	  // 	$("#politicalSwitches, #physicalSwitches, #naturalSwitches, #basemap").hide();
   //      switch(id){
   //      	case "politicalSwitches":
   //      	    console.log(id);
   //              $('#'+id).show();
   //      	    break;
   //      	case "physicalSwitches":
   //      	    console.log(id);
   //      	    $('#'+id).show();
   //      	    break;
   //      	case "naturalSwitches":
   //      	    console.log(id);
   //      	    $('#'+id).show();
   //      	    break;
   //      	case "basemap":
   //      	    console.log(id);
   //      	    $('#'+id).show();
   //      	    break;

   //      }
   //   }