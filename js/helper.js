$(function() {

  //initial 'active' states
  $("#layers, #results, #lccmr").hide();
  $("#physicalSwitches, #naturalSwitches, #basemap").hide();

  //load map layers
  init();
  
  map.on('zoomend', function (e) {
    if (typeof parcelGeoJSON !== "undefined" ){
      if (map.getZoom() < 12){
        map.removeLayer(parcelGeoJSON);
      } else {
        map.addLayer(parcelGeoJSON);
      }
    }
  })
  //Gray sidebar navigation
 $('.navlist').click(function(e){
  	navTab($(this).data('navlist-id'), this);    
  });

  //map layers navigation
  $('.layersli').click(function(e){
  	var id = $(this).data('layerlist-id');
  	$("#politicalSwitches, #physicalSwitches, #naturalSwitches, #basemap").hide();
  	$('#'+id).show();
    $("li.layersli").removeClass("active");
  	$( this ).addClass( "active" );
  });

  $('.first').click(function(){
    navTab('search', $("li[data-navlist-id='search']"));
    clearmap();
    //clearmap();
  })




});