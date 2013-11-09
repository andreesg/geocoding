<?php 
    session_start();
    if(!isset($_SESSION['loggedIn'])) { 
        header('Location:auth.php'); 
    } 
    if($_SESSION['loggedIn'] == false) {
        header('Location:auth.php'); 
    }
?>


<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> 
<html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <title>Prototype</title>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width"/>
        <link href="styles/bootstrap.min.css" rel="stylesheet">



        <style>
            .less-margin{ margin: 5px };
            .table-condensed th, .table-condensed td {
                padding:5px 5px;
            }
            #map img {
                max-width:none;
            }
        </style>

    </head>


    <body>



        <div class="ui-layout-west">

            <a href="auth.php?do=logout" class="btn btn-mini" style="width:90%;">Log out</a>

            <hr class="less-margin">


            <span class="label label-info customz" style="margin-bottom:10px;width:170px;text-align:center" id="message">No locations yet, <br /> start by adding locations <br /> manually, or click on the map</span>

            <hr class="less-margin">

            <div id="inputs" style="text-align:bottom"> 
                <input style="max-width:134px;width:130px;padding-top:5px;font-size:10px;" type="file" id="files" name="files[]" multiple="">
            </div>

            <hr class="less-margin">

            <span class="label label-warning customz" style="display:none;margin-bottom:10px;width:170px;text-align:center" id="warning-label">
                You are adding or updating<br /> locations manually.<br /> Click Update Map in order<br /> to correctly render the map.
            </span>

            <span class="label label-warning customz" style="display:none;margin-bottom:10px;width:170px;text-align:center" id="warning-remove-label">
                You have deleted a location,<br /> it will be removed from <br /> the map once you request </br > a new trace route.
            </span>


            <h4>Coordinates</h4>  


            <div id="coordinates-list">


            </div>

            <hr>

            <h4>Addresses</h4>  


            <div id="locations-list">
                

            </div>

        </div>


        <div class="ui-layout-center" style="margin-top:50px;">

            <div class='notifications top-left'></div>

            <button onclick="javascript:geocoding.renderNewCoordinate(null,'coordinate',false,_.uniqueId('coordinate'))" class="btn btn-primary btn-mini"> New coordinate </button> 

            <button onclick="javascript:geocoding.renderNewCoordinate(null,'location',false,_.uniqueId('coordinate'))" class="btn btn-primary btn-mini"> New address </button>

            <button onclick="javascript:geocoding.submitCoordinates()" class="btn btn-success btn-mini disabled" id="update-map-button"> Update Map</button>

            <button onclick="javascript:geocoding.traceRoute()" class="btn btn-mini btn-inverse disabled" id="trace-route-btn"> <strong>Trace Route</strong> </button>

            <button class="btn btn-warning dropdown-toggle btn-mini" data-toggle="dropdown" onclick="$('#options').toggle();">Options</button>

            <button onclick="javascript:geocoding.resetAll()" class="btn btn-mini btn-danger pull-right"> Reset </button>

            <hr class="less-margin">    


            <div id="options" style="display:none;height:auto">
                
                <div class="row-fluid">

                    <div class="span3">
                        <strong> Main options </strong>
                        <br />

                        <label class="checkbox" style="width:50px;font-size:10px;">
                          <input type="checkbox" class="trace-class" id="fixed-first-check" value="first" checked> Fixed First
                        </label>

                        <label class="checkbox" style="width:50px;font-size:10px;">
                          <input type="checkbox" class="trace-class" id="fixed-last-check" value="last"> Fixed Last
                        </label>

                        <label class="checkbox" style="width:55px;font-size:10px;">
                          <input type="checkbox" class="trace-class" id="entry-order-check" value="all"> Entry Order
                        </label>

                        <label class="checkbox" style="width:65px;font-size:10px;">
                          <input type="checkbox" class="trace-class" id="closed-check" value="shortest" checked> Closed Route
                        </label>

                    </div>

                    <div class="span3">
                        <strong> Driving styles </strong>
                        <br />
                       
                        <form>
                            <label class="radio" style="font-size:10px;">
                                <input type="radio" name="driving-style" value="normal" id="driving-style-normal" checked>
                                Normal
                            </label>

                            <label class="radio" style="font-size:10px;">
                                <input type="radio" name="driving-style" value="aggressive" id="driving-style-aggressive">
                                Aggressive
                            </label>

                            <label class="radio" style="font-size:10px;">
                                <input type="radio" name="driving-style" value="cautious" id="driving-style-cautious">
                                Cautious
                            </label>
                        </form>
                       
                    </div>

                    <div class="span3">
                        <strong> Avoid </strong>
                        <br />

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="Avoidnormal" value="option1" id="avoid-limited-access">
                            Limited access
                        </label>

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="Avoidagreessive" value="option2" id="avoid-toll-road">
                            Toll Road
                        </label>

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="sdfsdf" value="option2" id="avoid-approximate">
                            Approximate seasonal closure
                        </label>

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="sdfsdf" value="option2" id="avoid-unpaved">
                            Unpaved
                        </label>

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="sdfsdf" value="option2" id="avoid-ferry">
                            Ferry
                        </label>

                        <label class="checkbox" style="font-size:10px;">
                            <input type="checkbox" name="sdfsdf" value="option2" id="avoid-country">
                            Country border crossing
                        </label>

                    </div>
                </div>
                <hr class="less-margin">    
            </div>

            <div id="map" style="height:100%">

            </div>

        </div>
 

        <div class="ui-layout-east" id="results">

        </div>

        <div class="ui-layout-south" id="matrix">

        </div>


        


        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/jquery.layout.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>

        <!--<script src="//open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js"></script>-->
        <script src="scripts/jquery.csv.js"></script>
        <!--<script src="scripts/mapquest.js"></script>-->
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
        <script src="scripts/google.js"></script>

        <script src="scripts/main.js"></script>



        <script type="text/template" id="coordinates-form-content">
            <div class="input">

                <input class="span2 <%= type == 'coordinate' ? 'input-append-coordinates' : 'input-append-locations' %>" 
                style="margin:0px;padding:0px;width:137px;font-size:10px;" 
                id="<%= coordinateID %>" type="text" 
                placeholder="<%= type == 'coordinate' ? 'latitude, longitude' : 'Address' %>" 

                <%
                    var testCoordinateTypeOutput = "";
                    if(coordinateValue && type == 'coordinate') {
                        testCoordinateTypeOutput += "value= '" + coordinateValue[0] +","+ coordinateValue[1] +"'";
                    } else if(coordinateValue && type != 'coordinate') {
                        testCoordinateTypeOutput += "value= '" + coordinateValue +"'";
                    }

                %>

                <%= testCoordinateTypeOutput %>

                </input>

                <button class="btn btn-mini btn-link" onclick="javascript:geocoding.removePoint('<%= coordinateID %>')"> x </button>
            </div>
        </script>


        <script type="text/template" id="distance-matrix"> 
        
            <p> Driving Distances (km) </p>

            <table class="table table-condensed">
                <thead>
                    <tr>
                        <% _.each(locations, function(index) { %>
                            <%= "<th>" + index.street + ", " + index.adminArea5 + "</th>" %>
                        <% }); %>             
                    </tr>
                </thead>
                <tbody>

                    <% _.each(locations, function(index) { %>
                        <%= "<th>" + index.street + ", " + index.adminArea5 + "</th>" %>
                    <% }); %>   

                </tbody>
            </table>

        </script>

    </body>
</html>

