$(function() {

  // Handler for .ready() called.
  init();

  //initial 'active' states
  $("#layers, #results, #lccmr").hide();
  
  $('.navlist').click(function(e){
  	navTab($(this).data('navlist-id'));
    $("li.navlist").removeClass("active");
  	$( this ).addClass( "active" );
  })


});