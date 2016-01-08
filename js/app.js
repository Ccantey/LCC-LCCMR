//core business logic
var map, bounds, LandAcquisitions, switchMap = {};
//map Layers
var pushPinMarker, vectorBasemap, streetsBasemap, MinnesotaBoundaryLayer, selectedIcon;
//map overlay layers... called like overlayLayers.CongressionalBoundaryLayer
var previousSelection = [];
var geocoder = null;


//Set initial basemap with init() - called in helper.js
function init () {

    var southWest = L.latLng(41.86956, -105.7140625),
        northEast = L.latLng(50.1487464, -84.202832);
    bounds = L.latLngBounds(southWest, northEast);

    map = L.map("map", {
        center: L.latLng(46.1706, -94.9678),
        maxBounds: bounds,
        zoom: 7
    });
    // geocoder = new google.maps.Geocoder;

    // Add vector basemap
    vectorBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
        maxZoom: 18,
        minZoom: 6,
        zIndex: 1,
        attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
                'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map);

    // Add streets basemap
    streetsBasemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g', {
        maxZoom: 18,
        minZoom: 6,
        zIndex: 1,
        attribution: 'Basemap data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                'Legislative data &copy; <a href="http://www.gis.leg.mn/">LCC-GIS</a>, ' +
                'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets-satellite'
    });

    // Add LandAq data
    $.getJSON("php/getOverlayLayersAsGeoJSON.php", function (data) {

        LandAcquisitions = L.geoJson(data, {
            //style:myStyle,
            pointToLayer: function (feature, latlng) {
                // alternatively use image icons - i prefer divIcons for styling
                // var deselectedIcon = L.icon({iconUrl: 'images/pushpin.png'});
                // var selectedIcon = L.icon({iconUrl:'images/selectedpushpin.png'});
                deselectedIcon = L.divIcon({className: 'deselected-icon', html: "<div class='divtext'>" + feature.properties.lccmrid + "</div>"});
                
                pushPinMarker = L.marker(latlng, {icon: deselectedIcon})
                    .on('click', function (e) {
                    	var selectedProperty = e.target;
                        showParcelTable(selectedProperty);
                    }); //end onclick
                return pushPinMarker;
            } //end pointToLayer method
        }) //end LandAcquisition object
    }).done( function (e) {  //end $.geoJSON begin leaflet cluster group next
            var clusters = L.markerClusterGroup({
                spiderfyOnMaxZoom:false,
                disableClusteringAtZoom: 16,
                polygonOptions: {
                    color: '#ae4b37',
                    weight: 4,
                    opacity: 1,
                    fillOpacity: 0.5
            },
                // this method defines how the graduated symbol clusters are created
                iconCreateFunction: function (cluster) {
                    // get the number of items in the cluster
                    var count = cluster.getChildCount();
                    // figure out how many digits long the number is
                    var scale;
                    // Set graduated symbol scaling
                    if (count <= 10) {
                    	scale = 1;
                    }
                    if (count > 10 && count <= 33) {
                    	scale = 2;
                    }
                    if (count > 33 && count <= 50) {
                    	scale = 3;
                    }
                    if (count > 50) {
                    	scale = 4;
                    }
                    // return a new L.DivIcon with our classes so we can
                    // style them with CSS. You have to set iconSize to null
                    // if you want to use CSS to set the width and height.
                    return new L.divIcon({
                        html: count,
                        className:'cluster scale-' + scale,
                        iconSize: null
                    });
                } //end iconCreateFunction method
            }); //end clusters object
            clusters.addLayer(LandAcquisitions);
            clusters.addTo(map);
    }); //getJson
    // toggleBaseLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);
} //end init()

function showParcelTable (selection) {
    var html = "";
    $('#data').html(html);
    //console.log(selection);
    for (prop in selection.feature.properties) {
    	//console.log(prop)
    	if (prop === 'lccmrid') {
            html += "<tr><th>" + prop + ": </th><td><a href='http://www.lccmr.leg.mn/LandAcquisitions/Initial_Report_PDFs/" + selection.feature.properties[prop] + ".pdf' target = '_blank'>" + selection.feature.properties[prop] + "</a></td></tr>";
        }
    	if (prop !== 'memid' && prop !== 'lccmrid') {
            html += "<tr><th>" + prop + ": </th><td>" + selection.feature.properties[prop] + "</td></tr>";
        }        
    };
    $('#data').append(html);
	showSelectedIcon(selection);
}

function showSelectedIcon (selection) {	
    //display the correct id, otherwise displays current selection to previous selection point	
    previousSelection.push(selection.feature.properties.lccmrid);

    toggleIcon(2);

    selectedIcon = L.divIcon({className: 'selected-icon', html: "<div class='divtext'>" + selection.feature.properties.lccmrid + "</div>"});

    selection.setIcon(selectedIcon);
    //load geojson parcel, make available only at scale below x, zoom to it, if zoom out back to selectedIcon
    loadParcel(selection.feature.properties.lccmrid)
}

//common task, requires the last index of array - if a property is selected only once before clearmap(), throws an error
//so index will always be either 1 or 2
function toggleIcon (index) {
	LandAcquisitions.eachLayer(function (layer) {
        //toggle navigation tab
        navTab('results', $("li[data-navlist-id='results']"));
        if (layer.options.icon.options.className === "selected-icon") {
            deselectedIcon = L.divIcon({className: 'deselected-icon', html: "<div class='divtext'>" + previousSelection[previousSelection.length - index] + "</div>"});
            layer.setIcon(deselectedIcon);
        }
    });
}

function loadParcel (id) {
	var lccmrid = {id:id};
	$.ajax("php/getParcelData.php", {
		data: lccmrid,
		success: function(result){			
			showParcel(result);
		}, 
		error: function(){
			console.log('error');
		}
	});
}

function showParcel (d) {
    // console.log(d);
    if (typeof parcelGeoJSON !== "undefined" ){ 
        map.removeLayer(parcelGeoJSON);			
    }
    //parcel polygon overlay styling
    var myStyle = {
        "color": "#991a36",
        "weight": 2,
        "opacity": 0.65
    };
    parcelGeoJSON = L.geoJson(d, {
        style:myStyle
    }).addTo(map);
    //zoom to selection
    var parcelBounds = parcelGeoJSON.getBounds();
    map.fitBounds(parcelBounds, {maxZoom:14});
}

function navTab (id, tab) {
    $("li.navlist").removeClass("active");
    $(tab).addClass("active");
    $("#search, #layers, #results, #lccmr").hide();
    switch (id) {
    case "search":
        $('#' + id).show();
        break;
    case "layers":
        $('#' + id).show();
        break;
    case "results":
        $('#' + id).show();
        break;
    case "lccmr":
        $('#' + id).show();
        break;
    }
}
function clearmap () {
    
    $('#data').hide();	
	map.fitBounds(bounds).setZoom(7);
	toggleIcon(1);
	if (typeof parcelGeoJSON !== "undefined" ){
		map.removeLayer(parcelGeoJSON);
		delete parcelGeoJSON;
	}
	

}


// function layerNavTab (id) {
//     $("#politicalSwitches, #physicalSwitches, #naturalSwitches, #basemap").hide();
//     switch(id){
//         case "politicalSwitches":
//             console.log(id);
//             $('#'+id).show();
//         break;
//         case "physicalSwitches":
//             console.log(id);
//             $('#'+id).show();
//         break;
//         case "naturalSwitches":
//             console.log(id);
//             $('#'+id).show();
//         break;
//         case "basemap":
//             console.log(id);
//             $('#'+id).show();
//         break;
//     }
// }