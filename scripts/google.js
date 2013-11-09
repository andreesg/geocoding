var points = new Array();
var matrix;
var map;
var geocoder;
var directionsService, directionDisplay;;
var bounds = new google.maps.LatLngBounds();
var markersArray = [];


function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  geocoder = new google.maps.Geocoder();

  var center = new google.maps.LatLng(40.209032, -8.425784);
  var opts = {
    center: center,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map'), opts);

  directionsDisplay.setMap(map);

  google.maps.event.addListener(map, 'click', function(event) {
    var request = {
      origin: event.latLng,
      destination: event.latLng,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        addPoint(response.routes[0].legs[0].start_location, true);
      }
    });
  });
}

function calculateDistances() {
  if (points.length > 1) {
    matrix = new Array(points.length);

    for (i = 0; i < points.length; i++) {
      matrix[i] = new Array(points.length);
    }

    var latLngObjects = new Array();

    for (var i = 0; i < points.length; i++) {
      latLngObjects.push(points[i].getPosition());
      //console.log(points[i].getPosition());
    }

    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins: latLngObjects,
      destinations: latLngObjects,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, callback);

  } else {
    console.log("ERROR: Poucos pontos.");
  }
}


function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {

    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        matrix[i][j] = results[j].distance.text;
      }
    }
  }
}


function addPoints(array) {
  var i, latLngStr, lat, lng;
  for (i = 0; i < array.length; i++) {
    //console.log(array[i]);
    //pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
    latlngStr = array[i].split(',', 2);
    lat = parseFloat(latlngStr[0]);
    lng = parseFloat(latlngStr[1]);
    addPoint(new google.maps.LatLng(lat, lng), false);
  }
}


function addPoint(location, auto) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP
  });

  marker.setDraggable(true);
  google.maps.event.addListener(marker, 'dragend', function(event) {

    var request = {
      origin: event.latLng,
      destination: event.latLng,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        marker.setPosition(response.routes[0].legs[0].start_location);
        var id = marker.getTitle();
        console.log("muda de sitio: " + id);
        console.log("Nova position: " + marker.getPosition().lat() + "," + marker.getPosition().lng());
        $("#" + id).val(marker.getPosition().lat() + "," + marker.getPosition().lng());
      }
    });
  });

  var id = _.uniqueId('coordinate_');
  marker.setTitle(id);

  points.push(marker);

  if (auto) {
    geocoding.renderNewCoordinate(marker.getPosition().lat() + "," + marker.getPosition().lng(), 'coordinate', true, id);
  }
  if (points.length > 1) {
    geocoding.traceRouteBtn.removeClass('disabled');
  }
}

function deleteOverlays() {
  var i;
  if (points) {
    for (i in points) {
      points[i].setMap(null);
    }
  }
}

function removePoint(id) {
  console.log("remove id = " + id);
  console.log(points);
  var i;
  for (i = 0; i < points.length; i++) {
    if (points[i].getTitle() == id) {
      console.log("remove point!");
      points[i].setMap(null);
      points.splice(i, 1);
      break;
    }
  }

  if (!(points.length > 2)) {
    geocoding.traceRouteBtn.addClass('disabled');
  }
}

function resetMaps() {
  deleteOverlays();
  directionsDisplay.setMap(null);
  points = [];
}


function traceRoute() {
  var start = points[0].getPosition();
  var avoidTolls = false;
  var avoidHighways = false;
  var end = points[points.length - 1].getPosition();
  var waypts = [];

  for (var i = 1; i < points.length - 1; i++) {
    waypts.push({
      location: points[i].getPosition(),
      stopover: true
    });
  }

  if ($("#avoid-toll-road").is(':checked')) {
    avoidTolls = true;
  }
  if ($("#avoid-highway").is(':checked')) {
    avoidHighways = true;
  }

  var request = {
    origin: start,
    destination: end,
    waypoints: waypts,
    optimizeWaypoints: true,
    avoidHighways: avoidHighways,
    avoidTolls: avoidTolls,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      deleteOverlays();
      directionsDisplay.setDirections(response);
      console.log(directionsDisplay);
      $("#message").html('Successfully traced route <br /> with ' + points.length + ' locations!');
    }
  });
}

function codeAddress(address) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      addPoint(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);