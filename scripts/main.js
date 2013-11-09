window.geocoding = {
    outerLayout: null,
    map: null,
    updateMapBtn: $("#update-map-button"),
    traceRouteBtn: $("#trace-route-btn"),

    init: function() {},

    /* function to render the view of a single coordinate */

    renderNewCoordinate: function(coord, type, auto, coordID) {
        if (type == 'coordinate' && coord != null) {
            coord = coord.split(',');
        }

        var options = {
            coordinateID: coordID,
            coordinateValue: coord,
            type: type
        };

        var tmpl = _.template($('#coordinates-form-content').html(), options);

        if (type == 'coordinate') $("#coordinates-list").append(tmpl);
        else {
            $("#locations-list").append(tmpl);
        }

        /* if it's not an auto generated input, made by addPoint function of Mapquest.js 
            enables the button so the user can update the content displayed on the map tile
        */
        if (!auto) {
            geocoding.updateMapBtn.removeClass('disabled');

        }

        if (coord) $("#message").html(points.length + " locations to trace route");

        $(".input-append-coordinates").focus(function() {
            $("#warning-label").fadeIn();
            geocoding.updateMapBtn.removeClass('disabled');
        });

        $(".input-append-locations").focus(function() {
            $("#warning-label").fadeIn();
            geocoding.updateMapBtn.removeClass('disabled');
        });
    },

    /* function to fetch all coordinates and use them to render on map */

    submitCoordinates: function() {

        var coords = [];
        var counter = 0;
        var latlnStr, lat, lng;
        /* check if button is enabled, if not, returns */
        if (geocoding.updateMapBtn.hasClass('disabled')) {
            return false;
        }

        deleteOverlays();

        /* foreach input add it to an array of coordinates */
        $('.input-append-coordinates').each(function(index) {
            if ($(this).val() == '') {
                $(this).parent().remove();
            } else {
                coords.push($(this).val());
                counter++;

                latlngStr = $(this).val().split(',', 2);
                lat = parseFloat(latlngStr[0]);
                lng = parseFloat(latlngStr[1]);
                updateCoordinate(new google.maps.LatLng(lat, lng),$(this).attr('id'));
            }
        });

        /* foreach location geocode it and add the poi */
        $('.input-append-locations').each(function(index) {
            if ($(this).val() == '') {
                $(this).parent().remove();
            } else {
                updateLocation($(this).val(),$(this).attr('id'));
                counter++;
            }
        });

        /* checks if there's more then one point to enable trace route button */
        if (counter > 1 || points.length > 1) geocoding.traceRouteBtn.removeClass('disabled');
        else geocoding.traceRouteBtn.addClass('disabled');

        /* since the update was done, there's no need to have the button enabled */
        geocoding.updateMapBtn.addClass('disabled');


        $("#message").html(counter + " locations to trace route");
        $("#warning-label").hide();
        $("#warning-remove-label").hide();


    },

    traceRoute: function() {

        if (geocoding.traceRouteBtn.hasClass('disabled')) return false;

        $("#message").html('Calculating route for <br /> ' + points.length + ' locations...');


        if (!$("#entry-order-check").is(':checked')) {
            traceShortest();
        } else {
            traceRoute();
        }


        $('.trace-class').change(function() {
            geocoding.traceRouteBtn.removeClass('disabled');
        });

        /* since the traceroute was done, there's no need to have the button enabled */
        geocoding.updateMapBtn.addClass('disabled');
        geocoding.traceRouteBtn.addClass('disabled');
        $("#warning-label").hide();
        $("#warning-remove-label").hide();

    },

    resetAll: function() {
        var r = confirm("Are you sure you want to reset ? All markers and routes will be cleared.")
        if (r == true) {
            var listCoordinates = $("#coordinates-list");
            var listAddress = $("#locations-list");

            listCoordinates.html('');

            $("#matrix").html('');
            $("#message").html('No locations to trace route, <br /> start adding locations <br /> manually or click on the map');
            $("#warning-label").hide();
            $("#warning-remove-label").hide();

            geocoding.outerLayout.close('south');
            geocoding.updateMapBtn.hasClass('disabled');
            geocoding.traceRouteBtn.hasClass('disabled');


            listAddress.html('');
            resetMaps(); // call resetAll from mapquest.js
        }
    },

    removePoint: function(id) {

        var coord = $("#" + id);

        if (coord.val() != '') {
            removePoint(id);
        }

        coord.parent().remove();

        $("#message").html(points.length + " locations to trace route");

        if (points.length > 1 && geocoding.traceRouteBtn.hasClass('disabled')) {
            $("#warning-remove-label").fadeIn().delay(6000).fadeOut();
            geocoding.traceRouteBtn.removeClass('disabled');
        }
    }


};


$(document).ready(function() {

    geocoding.init();
    geocoding.outerLayout = $('body').layout({
        applyDefaultStyles: true,
        east__initClosed: true,
        east__spacing_open: 5,
        east__spacing_closed: 5,
        east__size: 250,
        west__spacing_open: 0,
        south__size: 60,
        south__resizable: true,
        south__initClosed: true
    });


    $('#fixed-first-check').attr('checked', true);


    $('#entry-order-check').change(function() {
        if ($('#entry-order-check').is(':checked')) {
            $('#fixed-first-check').attr('checked', true);

            $('#fixed-last-check').attr('checked', true);
        } else {
            document.getElementById("fixed-first-check").setAttribute('checked', 'checked');
            $('#fixed-first-check').attr('checked');
            document.getElementById("fixed-last-check").removeAttribute('checked');
        }
    });



    /* -------- FILE HANDLING -------- */




    if (isAPIAvailable()) {
        $('#files').bind('change', handleFileSelect);
    }

    function isAPIAvailable() {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            return true;
        } else {
            // source: File API availability - http://caniuse.com/#feat=fileapi
            // source: <output> availability - http://html5doctor.com/the-output-element/
            document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
            // 6.0 File API & 13.0 <output>
            document.writeln(' - Google Chrome: 13.0 or later<br />');
            // 3.6 File API & 6.0 <output>
            document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
            // 10.0 File API & 10.0 <output>
            document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
            // ? File API & 5.1 <output>
            document.writeln(' - Safari: Not supported<br />');
            // ? File API & 9.2 <output>
            document.writeln(' - Opera: Not supported');
            return false;
        }
    }

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var file = files[0];


        // read the file metadata
        var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

        // read the file contents
        addCoordinates(file);

        // post the results
        //$('#list').append(output);
    }

    
    function addCoordinates(file) {
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(event) {
            var csv = event.target.result;
            var data = $.csv.toArrays(csv);


            _.each(data, function(index) {
                var type = 0;

                index[0] == 0 ? type = 'coordinate' : type = 'address';

                if(index[1] != '')
                    geocoding.renderNewCoordinate(index[1], type, false, _.uniqueId('coordinate'));

            });
           
        };

        $("#warning-label").fadeIn();

        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }


});