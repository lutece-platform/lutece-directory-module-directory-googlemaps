if ( typeof(geocoders) == 'undefined' )
{
	var geocoders = new Array(  );
}

function MapObject( idField ) 
{
	this.id_field = idField;
	this.bounds = new google.maps.LatLngBounds();//useful to zoom the map correctly
	// var MAP;
	this.OFFSET_FACTOR = 1; //taille des sauts fait quand on scrolle la liste
	this.offset = 0;
	this.elementsCount = 0;
	
	this.centerMap = function( )
	{
		this.MAP.fitBounds(this.bounds);
		this.MAP.setCenter(this.bounds.getCenter());
	}
 
	this.addEntityOnMap = function( x, y , labelHtml, labelText, sideNode, icon ) 
	{
		var latlng = new google.maps.LatLng( x, y );
		/* var image = "images/admin/skin/plugins/directory/green-drop.png";
		var marker = new google.maps.Marker({ position: latlng, map: MAP, icon: image }); */
		var marker;
		if ( icon == null || icon == "" )
		{
			marker = new google.maps.Marker({ map: this.MAP, position: latlng });
		}
		else
		{
			marker = new google.maps.Marker({ map: this.MAP, position: latlng, icon: icon });
		}
 
		var infowindow = new google.maps.InfoWindow({ content: labelHtml });
		
		var map_object = this;
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open( map_object.MAP, marker );
			cm_setInfowindow( infowindow );
		});
		this.bounds.extend( latlng );
 
		var element = document.createElement("div");
		$(element).addClass( "directory-elem" );
		$(element).append( labelText );
		sideNode.append( $(element) );
		$(element).mouseover(function () { 
			infowindow.open( map_object.MAP, marker );
			cm_setInfowindow( infowindow );
		});
		this.elementsCount++;
	}
 
	this.render = function( sideNode ) 
	{
		// $(".directory-elem").hide();
		var map_object = this;
		var currentSize = 0;
		$("#" + map_object.id_field + "_map-container").find(".directory-elem").each(function (i) {
			// prevents overflow effects
			var availableHeight = 
				$("#" + map_object.id_field + "_map-container").height(  ) - 
				$("#" + map_object.id_field + "_go-up").height(  ) - 
				$("#" + map_object.id_field + "_elements-inputs").height(  ) -
				$("#" + map_object.id_field + "_go-down").height(  );
			// margin : their might be padding, margin or anything reducing pixels
			var margin = 50;
			if( i >= map_object.offset && ( currentSize + $(this).height(  ) ) < availableHeight - margin )
			{
				currentSize += $(this).height(  );
				$(this).show();
			}
			else
			{
				$(this).hide();
			}
			
		});
	}
 
	this.initMap = function( mapNode )
	{
		// centrage sur Paris
		var latlng = new google.maps.LatLng( 48.857572, 2.351675 );
		var myOptions = {
			zoom: 4,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		this.MAP = new google.maps.Map( mapNode, myOptions );
		
		var _map = this;
		$("#" + _map.id_field + "_go-up").click(function () {
			_map.offset = Math.max( _map.offset - _map.OFFSET_FACTOR, 0 );
			_map.render( $("#" + _map.id_field + "_elements-list") );
		});
		
		$("#" + _map.id_field + "_go-down").click(function () {
			_map.offset = Math.min( _map.offset + _map.OFFSET_FACTOR, _map.elementsCount - _map.OFFSET_FACTOR );
			_map.render( $("#" + _map.id_field + "_elements-list") );
		});
	}
}
 
var cm_openInfowindow;

function cm_setInfowindow( newInfowindow )
{
	if ( cm_openInfowindow != undefined )
	{
		cm_openInfowindow.close();
	}
	cm_openInfowindow = newInfowindow;
}
 
function gmap_result_list( id_field ) 
{
	$("#" + id_field + "_map-button").show();
	$("#" + id_field + "_map-button").click(function () {
		$(".directory-result-list").hide();
		$("#" + id_field + "_map-button").hide();
		$("#" + id_field + "_map-container").show();
		var mapObject = new MapObject( id_field );
		mapObject.initMap( document.getElementById("" + id_field + "_map") );
		$("#results_list").find("input[name='geolocation']").each( function(index) 
		{
			if ( this.value == id_field )
			{
				/* get x and y sibilings */
				var xs = $(this).siblings("input[name=x]");
				var ys = $(this).siblings("input[name=y]");
				if ( xs != null && xs.length > 0 && ys != null && ys.length > 0 )
				{
					var xValue = xs[0].value;
					var yValue = ys[0].value;
					
					var parent = $(this).parent().parent("tr");
					var labelHtml = $(parent).children("td.link-directory-record").html();
					if ( !labelHtml )
					{
						// get actions [back office]
						labelHtml = $(this).siblings("#" + id_field + "_span_actions").html();
					}
					labelHtml += "&#160;";
					
					var icons = $(this).siblings("input[name=state_icon]");
					var icon = null;
					if ( icons != null && icons.length > 0 )
					{
						icon = icons[0].value;
					}
					
					var text = "<br/>";
					
					var record_ids = $(this).siblings("input[name=record_id]");
					if ( record_ids != null && record_ids.length > 0 )
					{
						recordId = record_ids[0].value;
						if ( record_titles != null )
						{
							text += record_titles[recordId];
						}
					}
		
					/* var titles = $(this).siblings("input[name=title]");
					if ( titles != null && titles.length > 0 )
					{
						text += titles[0].value;
					} */
					
					labelHtml += text;
					var labelText = text;
					
					if( ( !isNaN( xValue ) && !isNaN( yValue ) ) && ( xValue != 0 && yValue != 0 ) )
					{
						mapObject.addEntityOnMap( xValue, yValue, labelHtml, labelText, $("#" + id_field + "_elements-list"), icon );
					}
				}
			}
		});
		mapObject.render( $("#" + id_field + "_elements-list") );
		$(".directory-elem").filter(':odd').addClass("odd");
		mapObject.centerMap( );
	});
}

/**
 * Called when adding or modifying a record
 * @param x
 * @param y
 * @param field_id
 * @param button_text the text that should appear on the button
 * @return
 */
function gmap_directory( x, y, field_id, button_text ) 
{
	geocoders[field_id] = new google.maps.Geocoder();
	var ZOOM = 14;
	var X = document.getElementById(field_id + "_x");
	var Y = document.getElementById(field_id + "_y");

	if( X.value.length > 0 )
	{
		x = eval(X.value.replace(",","."));
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = eval(Y.value.replace(",","."));
	}
	else
	{
		Y.value = y;
	}
	
	if ( x == 0 && y == 0 )
	{
		/* PARIS */
		x = 48.8566667;
		y = 2.3509871;
	}

	var latlng = new google.maps.LatLng( x, y );
	var myOptions = { zoom: ZOOM, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP };
	var map = new google.maps.Map( document.getElementById(field_id + "_gmap"), myOptions );
	var marker = new google.maps.Marker({ map: map, position: latlng, draggable: true });
	
	// simple click
	google.maps.event.addListener(map, 'click', function(event) {
		marker.draggable=false;
		X.value = event.latLng.lat();
		Y.value = event.latLng.lng();
		marker.setPosition(event.latLng);
		// reverse geocoding
		reverse( document.getElementById( field_id + "_address" ), event.latLng, field_id );
		marker.draggable=true;
	});
	
	// dragndrop
	google.maps.event.addListener(marker, 'dragend', function(event) {
		marker.draggable=false;
		X.value = event.latLng.lat();
		Y.value = event.latLng.lng();
		// reverse geocoding
		reverse( document.getElementById( field_id + "_address" ), event.latLng, field_id );
		marker.draggable=true;
	});
	
	// add button "Find on map"
	var block = $("#" + field_id + "_address").parent();
	var button = document.createElement("input");
	button.value=button_text;
	button.id= field_id + "_gmap_button";
	button.type="button";
	$(button).addClass("button");
	block.append(button);
	$(button).click(function () {
		var address = document.getElementById( field_id + "_address").value;
		if ( address != null && address != '')
		{
			geocoders[field_id].geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var latlng = results[0].geometry.location;
					map.setCenter(latlng);
					marker.setPosition( latlng );
					X.value = latlng.lat();
					Y.value = latlng.lng();
					if ( document.getElementById(field_id + "_noGeolocation") )
					{
						document.getElementById(field_id + "_noGeolocation").innerHTML = "";
					}
				} else {
					alert("Une erreur s'est produit lors de la recherche de l'adresse");
				}
			});
		}
	});
}

/**
 * Create a map for the given field. Marker is static
 * @param x x field
 * @param y y field
 * @param field_id field id
 * @return nothing
 */
function gmap_view( x, y, field_id ) 
{
	var ZOOM = 14;
	var X = document.getElementById(field_id + "_x");
	var Y = document.getElementById(field_id + "_y");

	if( X.value.length > 0 )
	{
		x = eval(X.value.replace(",","."));
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = eval(Y.value.replace(",","."));
	}
	else
	{
		Y.value = y;
	}
	
	if ( x == 0 && y == 0 )
	{
		x = 48.8566667;
		y = 2.3509871;
	}

	var latlng = new google.maps.LatLng( x, y );
	var myOptions = { zoom: ZOOM, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP };
	var map = new google.maps.Map( document.getElementById(field_id + "_gmap"), myOptions );
	var marker = new google.maps.Marker({ map: map, position: latlng, draggable: false });
}

/**
 * Reverse geocoding
 * @param input the input to fill
 * @param latlng latlng object
 * @return void
 */
function reverse( input, latlng, field_id ) 
{
	displayLoading( field_id );
    if (geocoders[field_id]) {
    	geocoders[field_id].geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
        	  input.value = results[0].formatted_address;
          } else {
            alert("Aucune correspondance");
          }
        } else {
        	alert("Une erreur s'est produite lors de la recherche de l'adresse");
        }
      });
    }
    hideLoading( field_id );
  }

/**
 * Display loading area
 * @param id_entry
 * @return
 */
function displayLoading( id_entry )
{
	document.getElementById( id_entry + "_waiting" ).style.display='';
}

/**
 * Hide loading area
 * @param id_entry
 * @return
 */
function hideLoading( id_entry )
{
	document.getElementById( id_entry + "_waiting" ).style.display='none';
}

/**
 * Trim function
 */
function trim( strToTrim ) {

	if ( strToTrim == null )
	{
		return null;
	}
	
    return strToTrim.replace(/^\s+/, "").replace(/\s+$/, "");
}