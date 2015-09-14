var main = {
  cache: CacheService.getUserCache(),
  props: PropertiesService.getUserProperties(),
  sessionKey: new Date(),
  programYear: function() {var d = new Date(); return(parseInt(d.getFullYear() - (d.getMonth() < 6 ? 1 : 0),10))},
  sessionTimeOut: 3600, // 60 minute time-out
  sendMailHack: true,
  monthArr: ["January","February","March","April","May","June","July","August","Spetember","October","November","December"],
//  enumArr: [Month.JANUARY, Month.FEBRUARY, Month.MARCH, Month.APRIL, Month.MAY, JUNE, 
//            Month.JULY, Month.AUGUST, Month.SEPTEMBER, Month.OCTOBER, Month.NOVEMBER, Month.DECEMBER],  // https://developers.google.com/apps-script/reference/base/month
  
  GUI: function(eventInfo) {
    district.init(); // initialize this if not already loaded
    var n = 0;
    if(eventInfo !== undefined) {
      if(eventInfo.parameter.state !== undefined)
        n = parseInt(eventInfo.parameter.state,10);
      if(eventInfo.parameter.version !== undefined)
        main.props.setProperty('naked', eventInfo.parameter.version);
      if(eventInfo.parameter.debug !== undefined)
        main.cache.put('debug', eventInfo.parameter.debug, 360);
    };
//    var n = (eventInfo.parameter.state == void(0) ? 0 : parseInt(eventInfo.parameter.state,10));
//    if(eventInfo.parameter.version  != void(0)) {main.props.setProperty('naked', eventInfo.parameter.version)};
    var ui = (n == 0)? main.initSession() : UiApp.getActiveApplication();
    
    // Check for session time-out, or refresh cache on activity extending session
    if(main.cache.get('sessionKey') == null) {n = -2} else main.refreshSession();
    
    var Form = void(0);
    switch(n){
      case -2: {
        Form = ui.createFormPanel().add(ui.createHTML(h1.expiredSession).setStyleAttributes(css.h1)).setStyleAttributes(css.form1);
      } break;
      case -1: {
        Form = ui.createFormPanel().add(ui.createHTML(h1.exit).setStyleAttributes(css.h1)).setStyleAttributes(css.form1);
      } break;
      case 0: {
//        if(eventInfo.parameter.debug    != void(0)) {main.cache.put('debug', eventInfo.parameter.debug, 360)};
//      if(eventInfo.parameter.district != void(0)) {Drv.script.get('district') = eventInfo.parameter.district};
        if (main.props.getProperty('naked')!='naked') {
          setStyleAttributes(ui,css.app);// UiApp does not support the .setStyleAttributes() method
          var MastHead = ui.createAbsolutePanel().setWidth('auto').setHeight('190').setId('MastHead')
          .add(ui.createHTML(['District ', Drv.script.get('district'), ' Paperless Expense Submissions'].join('')).setStyleAttributes(css.title), 265,75)
          ui.add(MastHead);
        };
        var pp1 = main.createPopupPanel(id.popup.paneA); // Create two popup panels
        var pp2 = main.createPopupPanel(id.popup.paneB); // No need to add these widgets to the UiApp
        pp1.show().hide(); // Show and Hide the PopUpPanels to load it without affecting the initial widget layout
        pp2.show().hide();
        popUpMap.initialize(id.popup.paneB);
        Form = getLogin(eventInfo,0,0);
      } break;
      case 1: {
        var isClient = function(TInumb,TIclub,TImail) {
          var values = main.getClientData(TInumb,TIclub,TImail); // Return flag or value from column B
          return((values == -1 || values == -2 || values == -3) ? values : values[1] );
        };
        var flag = isClient(eventInfo.parameter.TInumb,eventInfo.parameter.TIclub,eventInfo.parameter.TImail);
        main.logAccess(eventInfo,flag);
        Form = (flag == -1 || flag == -2 || flag == -3) ? getLogin(eventInfo,1,flag) : getBeneficiary(eventInfo,1,flag);
      } break;
      case 2: {
        Form = getLineItems(eventInfo,n)
      } break;
      case 3:
      default: {
        Form = getSubmission(eventInfo,n) //    Form = getTemplateX(eventInfo,n)
      } break;
    }
    return ui.add(Form);
  },
  
  initSession: function() {
    var ui = UiApp.createApplication();
    main.refreshSession();
    main.logUserAgent();
    return(ui);
  },

  refreshSession: function() {
    main.cache.remove('sessionKey');
    main.cache.put('sessionKey', main.sessionKey, main.sessionTimeOut);
  },
  
  getVersion: function() {
    return (ScriptApp.getService().getUrl().split('?',1).shift().split('/').pop());
  },
  
  getParameters: function(eventInfo) {
    var ui = UiApp.getActiveApplication();
    var panel = ui.createVerticalPanel().add(ui.createLabel("Parameters: "));
    for( var p in eventInfo.parameter)
      panel.add(ui.createLabel(" - " + p + " = " + eventInfo.parameter[p]));
    return panel;
  },
  
  getClientData: function(TInumb,TIclub,TImail) {
    var regExp = new RegExp('^' + TImail + '$', 'i');
    var values = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName(Wbk.tabNames[0]).getDataRange().getValues();
    for(var row in values) {
      if(regExp.test(values[row][14])) {                             // Column O (oscar)
        if (parseInt(TIclub,10) == parseInt(values[row][2],10)) {    // Column C (charlie)
          if (parseInt(TInumb,10) == parseInt(values[row][3],10)) {  // Column D is index 3 (start from 0)
            return values[row]; // Return row of data
          } else {
            return(-2); // Return error flag: mail & club foound but TI number does not match
          } 
        } else {
          return(-1); // Return error flag: email found but TI home club does not match
        }
      }
    }
    return(-3); // Return error flag: Email not found
  },
  
  logUserAgent: function() {//     Logger.log("logUserAgent:");
    var isDef = function(str) {return (str == void(0) ? '' : str)};
    var ui = UiApp.getActiveApplication(); // Deprecated. The UI service was deprecated on December 11, 2014.
    var userAgent = UiApp.getUserAgent();
    var getMobile = {
      // http://stackoverflow.com/questions/11381673/javascript-solution-to-detect-mobile-browser
      // How to use: if( getMobile.any() ) alert('Mobile');
      Mozilla:    function(userAgent) {return userAgent.match(/Mozilla/i)},
      Android:    function(userAgent) {return userAgent.match(/Android/i)},
      BlackBerry: function(userAgent) {return userAgent.match(/BlackBerry/i)},
      iOS:        function(userAgent) {return userAgent.match(/iPhone|iPad|iPod/i)},
      Opera:      function(userAgent) {return userAgent.match(/Opera Mini/i)},
      Windows:    function(userAgent) {return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i)},
      any:        function(userAgent) {
        var platform = getMobile.Android(userAgent)
        || getMobile.BlackBerry(userAgent)
        || getMobile.iOS(userAgent)
        || getMobile.Opera(userAgent)
        || getMobile.Windows(userAgent);
        return platform; // Equals null if none of the above.
      },
    };
    var isMobile = getMobile.any(userAgent);
    main.cache.put('isMobile', isMobile, 3600);    //  Logger.log("Is mobile: %s", main.cache.get('isMobile'));
    var parser = new UAParser(userAgent);
    var sheet = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName('UserAgents');
    var rowContents = [
      new Date(),
      thisRelease+isDef(main.props.getProperty('naked')),
      getMobile.any(userAgent),
      isDef(parser.getOS().name),
      isDef(parser.getOS().version),
      isDef(parser.getDevice().model),
      isDef(parser.getDevice().type),
      isDef(parser.getDevice().vendor),
      isDef(parser.getBrowser().name),
      isDef(parser.getBrowser().major),
      isDef(parser.getBrowser().version),
      isDef(parser.getEngine().name),
      isDef(parser.getEngine().version),
      userAgent
    ];
    sheet.appendRow(rowContents);
  },
  
  logAccess: function(eventInfo,flag) {
    if(main.getVersion() !== 'dev') { // Do not log testing sessions
      var numb = eventInfo.parameter.TInumb;
      var club = eventInfo.parameter.TIclub;
      var user = eventInfo.parameter.TImail;
      var sheet = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName('AccessLog');
      sheet.appendRow([new Date(), user, numb, club, flag]);
    };
    return(void(0));
  },
  
  createPopupPanel: function(paneId) {
    var ui = UiApp.getActiveApplication();
    var pp = ui.createPopupPanel().setId(paneId).setGlassEnabled(true).setModal(true);
    var top = (main.props.getProperty('naked') != 'naked' ? 120 : 50);
    if (paneId==(id.popup.paneA)) {
      pp.setAutoHideEnabled(true)
      .setStyleAttributes(css.popupA)  // height+width must be set in CSS; .set methods do not work
      .setPopupPosition(50, top)        // Position cannot be set in CSS
    }
    if (paneId==(id.popup.paneB)) {
      pp.setAutoHideEnabled(false)
      .setStyleAttributes(css.popupB)  // height+width must be set in CSS; .set methods do not work
      .setPopupPosition(50, top)        // Position cannot be set in CSS
    }
    pp.show().hide().setVisible(false);
    return(pp);
  },
  
  getStr: function(obj) {
    var str;
    try { str = obj.toString() }
    catch (error) { str = ''   }
    return (str);
  },
  
  template: function(eventInfo) {
    for(var i in eventInfo.parameter)
      Logger.log(" - " + i + " = " + eventInfo.parameter[i]);
    return(void(0));
  },
};
