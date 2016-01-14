$(function() {

  //initial 'active' states
  // $("#layers, #results, #lccmr").hide();
  $("#physicalSwitches, #naturalSwitches, #basemap").hide();
  //activate tooltips
  $('[data-toggle="tooltip"]').tooltip();

  //load map layers
  init();

  //Populate Search Select Boxes 
  // MAYBE PUT THIS INTO A FUNCITON IN APP AND STORE DATA IN AN OBJECT FOR LATER USE ON SELECTION 
  $.getJSON("php/getCounty.php",function(data){
      var items="";
      items = "<option value='' selected>County</option>"
      for (i in data.features) {
        var option = data.features[i].properties.name;
        //console.log(data.features[i].properties.name);
        items+="<option value='"+option+"'>"+option+"</option>";
      }
      $("#cty2010").html(items); 
    });

    $.getJSON("php/getSenate.php",function(data){
      var items="";
      items = "<option value='' selected>Senate District</option>"
      for (i in data.features) {
        var option = data.features[i].properties.district;
        //console.log(data.features[i].properties.name);
        items+="<option value='"+option+"'>"+option+"</option>";
      }
      $("#sen2012").html(items); 
    });

    $.getJSON("php/getHouse.php",function(data){
      var items="";
      items = "<option value='' selected>House District</option>"
      for (i in data.features) {
        var option = data.features[i].properties.district;
        //console.log(data.features[i].properties.name);
        items+="<option value='"+option+"'>"+option+"</option>";
      }
      $("#hse2012_1").html(items); 
    });

    $('.locationzoom').change(function (e){
      var targetId = "#" + this.id;
      var selections = ['#cty2010', '#hse2012_1', '#sen2012'];
      
      //reset other select boxes
      for (var i = 0, il = selections.length; i < il; i++) {
        if (targetId !== selections[i]){
          $(selections[i]).prop('selectedIndex', 0);
        }      
      }
      //pass to getSelectLayer
      $( targetId ).each(function() {
          getSelectLayer( $( this ).val(), this.id);
      });

    });
    //END select form helpers

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