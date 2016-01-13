$(function() {

  //initial 'active' states
  // $("#layers, #results, #lccmr").hide();
  $("#physicalSwitches, #naturalSwitches, #basemap").hide();
  //activate tooltips
  $('[data-toggle="tooltip"]').tooltip();

  //load map layers
  init();

  //Populate Search Select Boxes  
  $.getJSON("php/getCounty.php",function(data){
      var items="";
      items = "<option value='' selected>County</option>"
      for (i in data.features) {
        var option = data.features[i].properties.name;
        //console.log(data.features[i].properties.name);
        items+="<option value='"+option+"'>"+option+"</option>";
      }
      $("#countydropdown").html(items); 
    });


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
    clearmap();
    navTab('search', $("li[data-navlist-id='search']"));
    //clearmap();
  });

      //fetch overlay layers
  $('#laonoffswitch,#sponoffswitch,#sflayeronoffswitch,#wmalayeronoffswitch,#wmdlayeronoffswitch,' +
     '#snalayeronoffswitch,#wmdlayeronoffswitch,#bwcalayeronoffswitch,#nflayeronoffswitch,#nwrlayeronoffswitch,#countylayeronoffswitch,' +
     '#cononoffswitch, #senatelayeronoffswitch, #houselayeronoffswitch, #citylayeronoffswitch').click(function(){
    //console.log(typeof($(this).attr('id')));
        getOverlayLayers($(this), $(this).attr('id'));
  });

  $('.closetab').click(function(){
     $('.sidebar').css('left','-237px');
     $('.leaflet-left').css('left', '50px');
  })




});