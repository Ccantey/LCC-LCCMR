$(function() {

  // Handler for .ready() called.
  init();

  //initial 'active' states
  $("#layers, #results, #lccmr").hide();
  
  //Gray sidebar navigation
  $('.navlist').click(function(e){
  	navTab($(this).data('navlist-id'));
    $("li.navlist").removeClass("active");
  	$( this ).addClass( "active" );
  })

  //map layers navigation
  $('.layersli').click(function(e){
  	layerNavTab($(this).data('layerlist-id'));
    $("li.layersli").removeClass("active");
  	$( this ).addClass( "active" );
  })


});