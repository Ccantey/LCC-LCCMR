//core business logic
var map, LandAcquisitions, switchMap = {}, labelarray = [];

var previousSelection = [];
//map Layers
var pushPinMarker, vectorBasemap, streetsBasemap, MinnesotaBoundaryLayer;
//map overlay layers... called like overlayLayers.CongressionalBoundaryLayer


var geocoder = null;

function navTab (id, tab) {
    $("li.navlist").removeClass("active");
    $(tab).addClass("active");
    $("#search, #layers, #results, #lccmr").hide();
    switch (id) {
    case "search":
        // console.log(id);
        $('#' + id).show();
        break;
    case "layers":
        // console.log(id);
        $('#' + id).show();
        break;
    case "results":
        // console.log(id);
        $('#' + id).show();
        break;
    case "lccmr":
        // console.log(id);
        $('#' + id).show();
        break;
    }
}
//Set initial basemap with initialize() - called in helper.js
function init() {
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
                // console.log(feature.properties)
                // var deselectedIcon = L.icon({iconUrl: 'images/pushpin.png'});
                // var selected = L.icon({iconUrl:'images/selectedpushpin.png'});
                var deselectedIcon = L.divIcon({className: 'deselected-icon', html: "<div class='divtext'>" + feature.properties.lccmrid + "</div>"});
                var selected = L.divIcon({className: 'selected-icon', html: "<div class='divtext'>" + feature.properties.lccmrid + "</div>"});

                pushPinMarker = L.marker(latlng, {icon: deselectedIcon})
                    .on('click', function (e) {
                        previousSelection.push(e.target.feature.properties.lccmrid);
                        // console.log(previousSelection)
                        LandAcquisitions.eachLayer(function (layer) {
                            // console.log(layer)
                            navTab('results', $("li[data-navlist-id='results']"));
                            if (layer.options.icon.options.className === "selected-icon") {
                                //console.log("selected");
                                deselectedIcon = L.divIcon({className: 'deselected-icon', html: "<div class='divtext'>" + previousSelection[previousSelection.length - 2] + "</div>"});
                                layer.setIcon(deselectedIcon);
                            }
                        });
                        //console.log(e.target.feature.properties.lccmrid);
                        e.target.setIcon(selected);
                        var html = "";
                        $('#data').html(html);
                        console.log(Object.keys(feature.properties));
                        for (prop in feature.properties) {
                            if (prop !== 'memid') {
                                html += "<tr><th>" + prop + ": </th><td>" + feature.properties[prop] + "</td></tr>";
                            }
                        };
                        $('#data').append(html);
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

                // this function defines how the icons
                // representing  clusters are created
                iconCreateFunction: function (cluster) {
                    // get the number of items in the cluster
                    var count = cluster.getChildCount();
                    // figure out how many digits long the number is
                    console.log(count);
                    var scale;
                    //var digits = (count + '').length;
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
                    // style them with CSS. Take a look at the CSS in
                    // the <head> to see these styles. You have to set
                    // iconSize to null if you want to use CSS to set the
                    // width and height.
                    return new L.divIcon({
                        html: count,
                        className:'cluster digits-' + scale,
                        iconSize: null
                    });
                }

            });
            clusters.addLayer(LandAcquisitions);
            clusters.addTo(map);
    }); //getJson
    // toggleBaseLayers($('#satellitonoffswitch'),vectorBasemap,streetsBasemap);
}//end init()



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