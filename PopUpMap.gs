var popUpMap = {
  initialize: function(paneId) {
    var ui = UiApp.getActiveApplication();
    var pp = ui.getElementById(paneId);
    var bodyId = id.popup.bodyB;
    var Body = ui.createVerticalPanel().setId(bodyId)
    var fromText = ui.createTextBox().setId(id.popup.fromB).setName(id.popup.fromB).setStyleAttributes(css.txtBx.popup);
    var destText = ui.createTextBox().setId(id.popup.destB).setName(id.popup.destB).setStyleAttributes(css.txtBx.popup);
    var lblA = ui.createHTML("&thinsp;A&thinsp;",false).setStyleAttributes(css.lblA); // no word wrap
    var lblB = ui.createHTML("&thinsp;B&thinsp;",false).setStyleAttributes(css.lblA);
    var cb1 = ui.createCheckBox('Avoid highways',true).setId(id.popup.chkb1).setName(id.popup.chkb1).setVisible(true);
    var cb2 = ui.createCheckBox('Avoid tolls'   ,true).setId(id.popup.chkb2).setName(id.popup.chkb2).setVisible(true);
    var cbP = ui.createVerticalPanel().add(cb1).add(cb2);
    //  var lblAs = ui.createHTML("&thinsp;&thinsp;",false) // no word wrap
    //  var lblBs = ui.createHTML("&thinsp;&thinsp;",false) // no word wrap
    //  var hpA = ui.createHorizontalPanel().add(lblA).add(lblAs).add(fromText).setCellVerticalAlignment(lblA,enm.valign).setCellVerticalAlignment(fromText,enm.valign);
    //  var hpB = ui.createHorizontalPanel().add(lblB).add(lblBs).add(destText).setCellVerticalAlignment(lblB,enm.valign).setCellVerticalAlignment(destText,enm.valign);
    var xO = ui.createHTML(crossHTML).setVisible(false).setId('xO');
    var xD = ui.createHTML(crossHTML).setVisible(false).setId('xD');
    var Btn = {};
    Btn.Next = ui.createSubmitButton(txt.popup.nextB).setId(id.popup.nextB).setStyleAttributes(css.btn).setTitle(txt.popup.nextBtoolTip).setEnabled(false);
    Btn.Back = ui.createSubmitButton(txt.popup.backB).setId(id.popup.backB).setStyleAttributes(css.btn).setTitle(txt.popup.backBtoolTip).setEnabled(true);
    var Buttons = ui.createHorizontalPanel().add(Btn.Next).add(Btn.Back);
    var grid = ui.createGrid(3,4)
    .setWidget(0, 0, ui.createLabel('Home Address:').setStyleAttributes(css.lbl))
    .setWidget(1, 0, ui.createLabel('Event Location:').setStyleAttributes(css.lbl))
    .setWidget(0, 1, lblA)
    .setWidget(1, 1, lblB)
    .setWidget(0, 2, fromText)
    .setWidget(1, 2, destText)
    .setWidget(0, 3, xO)
    .setWidget(1, 3, xD)
    .setWidget(2, 2, cbP)
    .setWidget(2, 0, Buttons);
    var smap = ui.createImage().setId(id.popup.smapB).setStyleAttributes(css.mapImage);
    if (main.cache.get('isMobile') == '')
      smap.setPixelSize(maxWn, maxHn);
    else
      smap.setPixelSize(maxWm, maxHm);
    // Add components to popup panel
    pp.add(Body.add(grid).add(smap));
    // Wire client/server handlers to process valueChange events
    var onO = ui.createClientHandler().validateLength(   fromText,3,80).forTargets(xO).setVisible(false);
    var onD = ui.createClientHandler().validateLength(   destText,3,80).forTargets(xD).setVisible(false);
    var off = ui.createClientHandler().forTargets(Btn.Next).setEnabled(false);
    var offO= ui.createClientHandler().validateNotLength(fromText,3,80).forTargets(xO).setVisible(true).forTargets(Btn.Next).setEnabled(false);
    var offD= ui.createClientHandler().validateNotLength(destText,3,80).forTargets(xD).setVisible(true).forTargets(Btn.Next).setEnabled(false);
    var sh_onChangeP2_ = ui.createServerHandler().validateLength(fromText,3,80).validateLength(destText,3,80).addCallbackElement(Body).setCallbackFunction('sh_onChangeP2_');
    fromText.addValueChangeHandler(onO).addValueChangeHandler(offO).addValueChangeHandler(sh_onChangeP2_);
    destText.addValueChangeHandler(onD).addValueChangeHandler(offD).addValueChangeHandler(sh_onChangeP2_);
    cb1.addValueChangeHandler(off).addValueChangeHandler(sh_onChangeP2_);
    cb2.addValueChangeHandler(off).addValueChangeHandler(sh_onChangeP2_);
    // Wire server handlers to process button click events
    var sh_onSubmitP2_ = ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onSubmitP2_');
    var sh_onCancelP2_ = ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onCancelP2_');
    Btn.Next.addClickHandler(sh_onSubmitP2_);
    Btn.Back.addClickHandler(sh_onCancelP2_);
    return(pp); // Return the popup-panel
  },
  set: function(eventInfo) {  // Triggered by previous form's onFormSubmit event
    var ui = UiApp.getActiveApplication();
    var fromText = ui.getElementById(id.popup.fromB);
    var destText = ui.getElementById(id.popup.destB);
    var fromAddr = eventInfo.parameter.bAddr
    + ', ' + eventInfo.parameter.bCity
    + ', ' + eventInfo.parameter.bLand;
    // Initialize these two that have not come in the payload
    eventInfo.parameter[id.popup.fromB] = fromAddr;
    eventInfo.parameter[id.popup.destB] = fromAddr;
    eventInfo.parameter[id.popup.chkb1] = false;
    eventInfo.parameter[id.popup.chkb2] = false;
    popUpMap.update(eventInfo); // Center initial map on beneficiary's home address
    fromText.setValue(fromAddr);
    destText.setValue(fromAddr);
    ui.getElementById(id.popup.nextB).setEnabled(false);
    return(void(0));
  },
  update: function(eventInfo) {
    //    Logger.log("popUpMap.update:");
    //    for(var i in eventInfo.parameter)
    //      Logger.log(" - " + i + " = " + eventInfo.parameter[i]);
    var start = eventInfo.parameter[id.popup.fromB];
    var end   = eventInfo.parameter[id.popup.destB];
    var cb1   = eventInfo.parameter[id.popup.chkb1];
    var cb2   = eventInfo.parameter[id.popup.chkb2];
    // Create a new UI Application, which we use to display the map
    var ui = UiApp.getActiveApplication();
    var map = {};
    map.smap = ui.getElementById(id.popup.smapB);
    if (CacheService.getPrivateCache().get('isMobile') == '')
      map.static = Maps.newStaticMap().setSize(maxWn, maxHn);
    else
      map.static = Maps.newStaticMap().setSize(maxWm, maxHm);
    try {
      if(cb1=="true") {  // Chaining of methods seems broken
        if(cb2=="true") {//  with the DirectionFinder object
          map.df = Maps.newDirectionFinder().setAlternatives(true)
          .setAvoid(Maps.DirectionFinder.Avoid.HIGHWAYS)
          .setAvoid(Maps.DirectionFinder.Avoid.TOLLS)
          .setMode(Maps.DirectionFinder.Mode.DRIVING).setRegion('eu')
          .setOrigin(start).setDestination(end).getDirections();
        } else {
          map.df = Maps.newDirectionFinder().setAlternatives(true)
          .setAvoid(Maps.DirectionFinder.Avoid.HIGHWAYS)
          .setMode(Maps.DirectionFinder.Mode.DRIVING).setRegion('eu')
          .setOrigin(start).setDestination(end).getDirections();
        }
      } else {
        if(cb2=="true") {
          map.df = Maps.newDirectionFinder().setAlternatives(true)
          .setAvoid(Maps.DirectionFinder.Avoid.TOLLS)
          .setMode(Maps.DirectionFinder.Mode.DRIVING).setRegion('eu')
          .setOrigin(start).setDestination(end).getDirections();
        } else {
          map.df = Maps.newDirectionFinder().setAlternatives(true)
          .setMode(Maps.DirectionFinder.Mode.DRIVING).setRegion('eu')
          .setOrigin(start).setDestination(end).getDirections();
        }
      }
      map.stat = map.df.status;
    } catch(error) {
      map.stat = error;
      //      ui.getElementById(id.popup.nextB).setEnabled(false);
      Logger.log("ERROR: %s", error);
      var destin = new RegExp('destination', 'i');
      var origin = new RegExp('origin', 'i');
      if(origin.test(error)) {ui.getElementById('xO').setVisible(true)};
      if(destin.test(error)) {ui.getElementById('xD').setVisible(true)};
    };
    //  https://developers.google.com/maps/documentation/directions/#StatusCodes
    map.route = void(0);
    map.dist = '';
    map.crow = '';
    switch(map.stat) {
      case "OK": {
        map.route = map.df.routes[0];
        map.dist = map.route.legs[0].distance.text;
        map.static.addPath(map.route.overview_polyline.points);
      };
      case "ZERO_RESULTS": {
        var Haversine = {
          // How to use:
          // d = Haversine.distance(p1,p2);
          // d = Haversine.distanceChuck(lt1,ln1,lt2,ln2);
          // d = Haversine.distanceDali (lt1,ln1,lt2,ln2);
          distance: function(p1, p2) {
            // http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
            // Mike Williams, answered Oct 1 '09 at 9:07
            //    var p1 = Maps.newGeocoder().geocode(YOUR_ADDRESS1).results[0].geometry.location;
            //    var p2 = Maps.newGeocoder().geocode(YOUR_ADDRESS2).results[0].geometry.location;
            //    var d = Haversine.distance(p1,p2);
            var rad = function(x) {return x * Math.PI / 180};
            var R = 6378137; // Earth’s mean radius in meter
            var dLat = rad(p2.lat - p1.lat);
            var dLong = rad(p2.lng - p1.lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d; // returns the distance in meter
          },
          distanceChuck: function(lat1,lon1,lat2,lon2) {
            // Chuck, answered Aug 26 '08 at 12:55
            // http://en.wikipedia.org/wiki/Haversine_formula
            var deg2rad = function(deg) {return deg * (Math.PI/180)};
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d;
          },
          distanceDali: function(lat1, lon1, lat2, lon2) {
            // http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
            // Salvador Dali, Salvador Dali
            var R = 6371;
            var a = 
                0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                    (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
            return R * 2 * Math.asin(Math.sqrt(a));
          },
        }; // end Haversine object
        // Add a path for the entire route.
        map.static.setMarkerStyle(Maps.StaticMap.MarkerSize.MID,
                                  Maps.StaticMap.Color.RED,
                                  String.fromCharCode('A'.charCodeAt()));
        map.static.addMarker(start);
        map.static.setMarkerStyle(Maps.StaticMap.MarkerSize.MID,
                                  Maps.StaticMap.Color.RED,
                                  String.fromCharCode('B'.charCodeAt()));
        map.static.addMarker(end);
        // https://developers.google.com/apps-script/reference/maps/static-map#setPathStyle(Integer,String,String)
        // https://developers.google.com/maps/documentation/staticmaps/#PathStyles
        map.static.setPathStyle(5, Maps.StaticMap.Color.BLACK , 'red')
        .beginPath()
        .addAddress(start)
        .addAddress(end)
        .endPath();
        var ll1 = Maps.newGeocoder().geocode(start).results[0].geometry.location;
        var ll2 = Maps.newGeocoder().geocode(end  ).results[0].geometry.location;
        map.crow = '' + Math.floor(Haversine.distance(ll1, ll2)/1000.0).toFixed() + ' km';
      } break;
      case "NOT_FOUND": {
      } break;
      case "MAX_WAYPOINTS_EXCEEDED":
      case "INVALID_REQUEST":
      case "OVER_QUERY_LIMIT":
      case "REQUEST_DENIED":
      case "UNKNOWN_ERROR":
      default: {
      }
    };
    map.url = map.static.getMapUrl();
    if( map.stat == "OK" || map.stat == "ZERO_RESULTS") {
       map.smap.setUrl(map.url);
    }
    if( start != end ) {
      ui.getElementById(id.popup.nextB).setEnabled(true);
    }
    map.link = 'https://maps.google.com/maps?'
    + 'dirflg=' + (cb1=="true" ? 'h': '') + (cb2=="true" ? 't': '') 
    + '&saddr=' + start 
    + '&daddr= '+ end;
    map.tiny = UrlFetchApp.fetch('http://tinyurl.com/api-create.php?url='+map.link).getContentText();
    map.hypl = '=HyperLink("' + map.tiny + '","from:' + start + ', to:' + end +'")';
    
    // http://maps.googleapis.com/maps/api/directions/json?origin=Lisbon,+Portugal&destination=Roma,+Italy
    // https://developers.google.com/maps/documentation/directions/#Legs
    // https://developers.google.com/apps-script/reference/cache/cache#putAll(Object)
    main.cache.putAll({
      'tinylink': map.tiny,
      'gmaplink': map.link,
      'hyperlnk': map.hypl,
      'crowdist': map.crow,
      'distance': (map.dist !== '' ? map.dist : map.crow),
    }, 3600);
    main.refreshSession();
    return(void(0));
  },
  template: function() {
    return(void(0)); // Return nothing
  },
};
