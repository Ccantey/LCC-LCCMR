$(function() {

  // Handler for .ready() called.
  init();

  //initial 'active' states
  $("#layers, #results, #lccmr").hide();
  $("#physicalSwitches, #naturalSwitches, #basemap").hide();
  
  //Gray sidebar navigation
  $('.navlist').click(function(e){
  	var id = $(this).data('navlist-id');
  	$("#search, #layers, #results, #lccmr").hide();
  	$('#'+id).show();
    $("li.navlist").removeClass("active");
  	$( this ).addClass( "active" );
  })

  //map layers navigation
  $('.layersli').click(function(e){
  	var id = $(this).data('layerlist-id');
  	$("#politicalSwitches, #physicalSwitches, #naturalSwitches, #basemap").hide();
  	$('#'+id).show();
    $("li.layersli").removeClass("active");
  	$( this ).addClass( "active" );
  })


});