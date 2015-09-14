// Map server handler functions to container
var sh_onSubmitF1_ = function(eventInfo) {return sh.onSubmitF1(eventInfo)};
var sh_onSubmitF2_ = function(eventInfo) {return sh.onSubmitF2(eventInfo)};
var sh_onChangeF1_ = function(eventInfo) {return sh.onValueChangeIBAN(eventInfo)};
var sh_onChangeF2_ = function(eventInfo) {return sh.onChangeF2(eventInfo)};
var sh_onKeyUpF2_  = function(eventInfo) {return sh.onKeyUpF2 (eventInfo)};
var sh_onChangeP2_ = function(eventInfo) {return sh.onChangeP2(eventInfo)};
var sh_onCancelP2_ = function(eventInfo) {return sh.onCancelP2(eventInfo)};
var sh_onSubmitP2_ = function(eventInfo) {return sh.onSubmitP2(eventInfo)};

// Define functions for server handler events
var sh = {
  onSubmitF1: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    popUpMap.set(eventInfo);
    return ui;
  },
  onSubmitF2: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
//  popUpMap.set(eventInfo); // Reset map after submission
    return ui;
  },
  
  onValueChangeIBAN: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    var flag = IBAN.isValid(eventInfo.parameter.bIBAN);
    Logger.log("IBAN Test = %s", flag);
    Logger.log("Client index = %s", eventInfo.parameter.idxCli);
  
    ui.getElementById("bIBAN").setStyleAttributes(flag ? css.txtBx.Valid : css.txtBx.Wrong);
    ui.getElementById("y5").setVisible(flag);
    ui.getElementById("x5").setVisible(!flag).setHTML(crossHTML+msg.IBAN);
    ui.getElementById("s5").setValue((flag ? msg.blank : msg.IBAN),true);  // Set hidden switch for validation
    //  ui.getElementById('Btn.Load').setEnabled(true);
    return ui;
  },
  
  onKeyUpF2: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    var str = eventInfo.parameter[id.expense.desc];
    var len = str.length;
    //  Logger.log("length: %s, event.desc: %s", len, str);
    if(0 < len && len < maxD) {
      ui.getElementById("t2").setVisible(true).setHTML(('('+len+'/'+maxD+')'));
//    ui.getElementById("t2").setVisible(true).setHTML((''+(maxD - len)+' chars remain'));
    } else if(len >= maxD) {
      ui.getElementById("t2").setVisible(true).setHTML(('Text field full'));
      ui.getElementById(id.expense.desc).setValue(str.substring(0,maxD),true);
    }
    return ui;
  },
  onChangeF2: function(eventInfo) {
    for(var i in eventInfo.parameter)
      Logger.log(" - " + i + " = " + eventInfo.parameter[i]);
    
    var ui = UiApp.getActiveApplication(); //    Logger.log("event.source: %s", eventInfo.parameter.source);
    
    if(eventInfo.parameter.source == id.expense.type) {
      if(eventInfo.parameter[id.expense.type] == "Travel") {
        ui.getElementById(id.popup.paneB).setVisible(true).show();
        ui.getElementById("y3").setVisible(false);
        //    } else {
        //      ui.getElementById(id.travel.mode).setEnabled(false).setSelectedIndex(0);
      };
    } else if(eventInfo.parameter.source == id.event.date ||
              eventInfo.parameter.source == id.invoice.date) {
      var sourceId = eventInfo.parameter.source;
      var dateValue = eventInfo.parameter[sourceId];
      Logger.log("%s: %s.", sourceId, dateValue);

      if ( dateValue != '' && dateValue != null && dateValue != void(0)) {
        var input = new Date(dateValue);
        var programYear = main.programYear();
        var lower = new Date(programYear,(sourceId == id.event.date? 5: 4),1);   // month ranges from 0-11 so 5=June; for invoices give May as lower limit just in case somebody already bought a ticket in advance
        var upper = main.sessionKey;
        if(sourceId == id.event.date) { upper = new Date((programYear+1),10,30)}; // month ranges from 0-11 so 5=June, 10=Nov
        Logger.log("lower: %s.",  lower);
        Logger.log("upper: %s.",  upper);

        
        if(input.getTime() < lower.getTime()) { input = lower              };
        if(input.getTime() > upper.getTime()) { input = (sourceId == id.event.date ? upper : main.sessionKey) };
        ui.getElementById(sourceId).setValue(input);
        
        Logger.log("%s: %s.", sourceId, input);
      };
    };
    return ui;
  },
  onChangeP2: function(eventInfo) {
    popUpMap.update(eventInfo);
    return UiApp.getActiveApplication();
  },
  onCancelP2: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    ui.getElementById(id.expense.type).setSelectedIndex(0);
    ui.getElementById('s3a').setValue("0",true);
    ui.getElementById(id.popup.paneB).setVisible(true).hide();
    ui.getElementById(id.travel.mode).setEnabled(false).setSelectedIndex(0);
    ui.getElementById(id.travel.dist).setEnabled(false).setValue("");
    ui.getElementById(id.travel.gmap).setEnabled(false).setValue("");
    return ui;
  },
  onSubmitP2: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    ui.getElementById(id.travel.dist).setValue(main.cache.get('distance'),true);
//  ui.getElementById(id.travel.gmap).setValue(main.cache.get('gmaplink'),true);
//  ui.getElementById(id.travel.gmap).setValue(main.cache.get('tinylink'),true);
    ui.getElementById(id.travel.gmap).setValue(main.cache.get('hyperlnk'),true);
    ui.getElementById('s3c').setValue("1",true);
    ui.getElementById(id.popup.paneB).setVisible(true).hide();
    return ui;
  },
  template: function(eventInfo) {
    for(var i in eventInfo.parameter)
      Logger.log(" - " + i + " = " + eventInfo.parameter[i]);
    var ui = UiApp.getActiveApplication();
    return(ui); // Event handlers must return the app!
  },
};
