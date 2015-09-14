//----------------------------------------------------------------------------
// Event handlers for simple triggers
//----------------------------------------------------------------------------
function onEdit(event) {Wbk.evt.onEdit(event)};
function onOpen(event) {Wbk.evt.onOpen(event)};
//----------------------------------------------------------------------------
// Event handlers for web apps (form and content service)
//----------------------------------------------------------------------------
function doPost(request){return main.GUI(request)}; // https://developers.google.com/apps-script/guides/web?#url_parameters
function doGet (request){
  if(request !== undefined) {
    if(request.parameters.mc !== undefined)
      return Svc.doGet(request);
  };
  return main.GUI(request);
};//{return((request.parameters != undefined && request.parameters.hasOwnProperty('mc'))? Svc.doGet(request) : main.GUI(request))};
//----------------------------------------------------------------------------
// Custom functions
//----------------------------------------------------------------------------
function fName(fun){var str  = fun.toString().substr('function '.length), name = str.substr(0, str.indexOf('(')); return name}; //http://stackoverflow.com/questions/3178892/get-function-name-in-javascript
function lc(a){return a.map(Function.prototype.call, String.prototype.toLowerCase)};
function ArrayTranspose(a){return Object.keys(a[0]).map(function(c){return a.map(function(r){return r[c]})})};  // https://gist.github.com/femto113/1784503
//----------------------------------------------------------------------------
function getDrvId()            {return Drv.script.get('docId')};
function getDrvOwner()         {return Drv.script.get('owner')};
function getDrvFolderId()      {return Drv.script.get('folderId')};
function getAppScriptId()      {return Drv.script.get('scriptId')};
function getDrvTemplateId(n)   {return Drv.script.get('templateId'+n)};
function getSheetID(sheetName) {return Wbk.get.sheetID(sheetName)};
function getAllLines()         {return Wbk.get.allLines()};
function getApproved()         {return Wbk.get.approved()};
function getWebAppID()         {return Svc.get.webAppID()};
function getWebAppURL()        {return Svc.get.webAppURL()};
//----------------------------------------------------------------------------
// Custom functions for menus
//----------------------------------------------------------------------------
function doAuthentication() {Wbk.show.authentication()  };
function doToastEditors()   {Wbk.show.sheetEditors()    };
function doToastRanges()    {Wbk.show.protectedRanges() };
function doToastAuthStatus(){Wbk.show.authStatus()      };
function doSetSharing()     {Wbk.set.sharing()          };
function doSetValidation()  {Wbk.set.validation()       };
function doSetShortURL()    {Wbk.set.shortWebAppUrl()   };
function doSetDocIds()      {Drv.evt.onAuth()           };
function doRevokeAuth()     {Wbk.call.revokeScriptAuthorization()};
function openSubmissionFrm(){Drv.show.popup(Svc.get.webAppURL())};
function openScriptEditor() {Drv.show.popup(["https://script.google.com/macros/d/",Drv.script.get('scriptId'),"/edit"].join(''))};
function openTemplate(n)    {Drv.show.popup(["https://docs.google.com/document/d/",Drv.script.get('templateId'+n),"/edit"].join(''))};
function openTemplateFM()   {openTemplate(0)};
function openTemplatePQD()  {openTemplate(1)};
function openTemplateCGD()  {openTemplate(2)};

function doAuthProcAll()     {Wbk.call.doAuth('all' )};
function doAuthApproved()    {Wbk.call.doAuth('yes' )};
function doAuthRejected()    {Wbk.call.doAuth('nej' )};
function doSortDate()        {Wbk.call.doSort('date')};
function doSortWorkflow()    {Wbk.call.doSort('wkfl')};
function doSortName()        {Wbk.call.doSort('name')};
function doSortStat()        {Wbk.call.doSort('stat')};
function doVouchers()        {Wbk.call.doVchr(      )};
function doShowEdit()        {Wbk.call.doAuth('edit')};
function doCopyRow()         {Wbk.call.doCopy()      };
function doCalcRefresh()     {Wbk.evt.onRefresh()    };

function goToWorkFlow()      {Wbk.goto.workFlow()          };
function goToApproved()      {Wbk.goto.sheet('Approved')};
function goToRejected()      {Wbk.goto.sheet('Rejected')};
function goToConfig()        {Wbk.goto.sheet('Properties')};
function goToDashboard()     {Wbk.goto.sheet('Dashboard')};
function goToDO()            {Wbk.goto.sheet(Wbk.tabNames[0])};
function goToAL()            {Wbk.goto.sheet('AL')};
function goToRC()            {Wbk.goto.sheet('RC')};
//----------------------------------------------------------------------------
// Common code shared between Form, Svc and Wbk
//----------------------------------------------------------------------------
var Drv = {
  ss: function(){
    try         {var ss = SpreadsheetApp.openById(Drv.script.get('docId'))}
    catch(error){var ss = SpreadsheetApp.getActiveSpreadsheet()}
    finally{return(ss)};
  }, // Drv.ss()
  version:     "2.4",
  user: {
    get:   function(){
      var value = CacheService.getUserCache().get('user');
      if(!value) {
        value = PropertiesService.getUserProperties().getProperty('user');
        CacheService.getUserCache().put('user', value, (6*60*60)); // 6 hour refresh
      };
      return (value);
    }, // Drv.user.get()
    put:   function(value){
      if(value) {
        CacheService.getUserCache().put('user', value, (6*60*60)); // 6 hour refresh
        PropertiesService.getUserProperties().setProperty('user', value);
      };
    }, // Drv.user.put() 
    clear: function(){
      CacheService.getUserCache().remove('user');
      PropertiesService.getUserProperties().deleteAllProperties();
    },
    log:   function(){Logger.log('\nDrv.user.log: ' + Drv.user.get('user'))},
  },
  is: {
    blank:     function(val){return(!val||/^\s*$/.test(val)? true : false )},
    validId:   function(id){return(/^[-\w]{25,}$/.test(id) ? true : false )},
    owner:     function(usr){return((usr && usr === Drv.script.get('owner'))? true : false )},
  }, // end Drv.is context
  script: {
    keys: {
      district: 'district',
      folderId: 'folderId',
      docId:    'docId',
      scriptId: 'scriptId',
      owner:    'owner',
      authUrl:  'authUrl',
      templateId0:  'templateId0',
      templateId1:  'templateId1',
      templateId2:  'templateId2',
      version: 'version',
    },
    clear: function() {
      Drv.user.clear();
      CacheService.getScriptCache().removeAll(Object.keys(Drv.script.keys));
      PropertiesService.getScriptProperties().deleteAllProperties();
    },
    get: function(key) {
      var value = CacheService.getScriptCache().get(key);
      if(!value) {
        value = PropertiesService.getScriptProperties().getProperty(key);
        CacheService.getScriptCache().put(key, value, (6*60*60)); // 6 hour refresh
      };
      return (value);
    },
    put: function(key,value) {
      if(value) {
        CacheService.getScriptCache().put(key, value, (6*60*60));
        PropertiesService.getScriptProperties().setProperty(key, value);
      };
    },
    reset: function(key,newVal) {
      if(newVal) {
        var oldVal = Drv.script.get(key);
        if(!oldVal || newVal != oldVal)
          Drv.script.put(key,newVal);
      };
    },
    log: function() {
      Logger.log("Drv.script.log:")
      for(var key in Drv.script.keys)
        if (Drv.script.keys.hasOwnProperty(key))
          Logger.log(key+': ' + Drv.script.get(key));
      Drv.user.log();
    }, // end Drv.script.log()
  },
  evt: {
    onOpen: function(event){ // https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
      // Drv.script.log();
      var user = event.user.getEmail() || Drv.user.get(); // Logger.log("Drv.onOpen: user: "+user);
      var district = event.source.getSheetByName("Properties").getSheetValues(1,4,1,1)[0][0].split('District').pop().trim().split(' ').shift().trim(),
          docId    = event.source.getId(),
          owner    = event.source.getOwner().getEmail().toLowerCase(),
          authUrl  = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationUrl(),
          scriptId = authUrl.split("/")[5];
      Drv.script.reset(Drv.script.keys.district, district);
      Drv.script.reset(Drv.script.keys.docId,    docId);
      Drv.script.reset(Drv.script.keys.owner,    owner);
      Drv.script.reset(Drv.script.keys.authUrl,  authUrl);
      Drv.script.reset(Drv.script.keys.scriptId, scriptId); // Drv.script.log();
      if(user) Drv.show.dialogAuthorized();
      else     Drv.show.dialogAuthRequired();
    },// Drv.evt.onOpen()
    
    onAuth: function(){ // These initializations use API's that cannot be called in simple onOpen() event triggers
      var docId = Drv.script.get('docId');
      if(docId) {
        var folder   = DriveApp.getFileById(docId).getParents().next(),
            folderId = folder.getId(),
            files = folder.getFilesByType(MimeType.GOOGLE_DOCS), // https://developers.google.com/apps-script/reference/base/mime-type
            version =  [Drv.version, Drive.Files.get(docId).version ].join('.');
        Drv.script.reset(Drv.script.keys.folderId, folderId);
        Drv.script.reset(Drv.script.keys.version,  version);
        while (files.hasNext()) {
          var file = files.next(),
              fileName = file.getName();
          if(/^voucher/.test(fileName)) { // if voucher template
            if     (fileName.search(Wbk.tabNames[11]) != -1) // if PQD
              Drv.script.reset(Drv.script.keys.templateId1, file.getId());
            else if(fileName.search(Wbk.tabNames[12]) != -1) // if CGD
              Drv.script.reset(Drv.script.keys.templateId2, file.getId());
            else if(fileName.search(Wbk.tabNames[ 1]) != -1) // if FM  (NB: logic order critical here!)
              Drv.script.reset(Drv.script.keys.templateId0, file.getId());
          };
        };
      }; // Drv.script.log();
    }, // Drv.evt.onAuth()
  }, // end Drv.evt context
  show: {
    popup: function(url) {
      var htmlString = ['<script>window.open("', (url || 'http://www.google.com'), '");window.setTimeout(function(){google.script.host.close()},1);</script>'].join(''),
          htmlOutput = HtmlService.createHtmlOutput(htmlString).setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(1).setWidth(1);
      SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'Be sure to allow pop-ups from docs.google.com');
    }, //Drv.show.popup(url)
    dialogAuthRequired: function() {
      var url         = Drv.script.get('authUrl'),
          dialogTitle = ' ', // Cannot contain HTML markup
          boxLogoTag  = 'http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/D0D3F1B844EA478E895BCA4532574442.ashx', //png
          strHTML = ['<p align="center"style="margin:0cm 0cm 0.0001pt;">',
                     '<a href="http://www.toastmasters.org/" target="_blank">',
                     '<img width="90%" src="', boxLogoTag, '" alt="TM Logo"></a>',
                     '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="left" style="margin:0cm 0cm 0.0001pt;">',
                     '<b><i><span style="font-size:12pt;font-family:Verdana,sans-serif;color:rgb(119,36,50)">',
                     'District ',Drv.script.get('district'),' Reimbursements',
                     '</span></i></b></p>',          
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(100,100,100)">',
                     'Version ', Drv.version, // Drv.script.get('version'),
                     '</span></p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(50,50,50)">',
                     'Welcome! This workbook requires your Google account authorization to run.',
                     'If you have not already done so, please open the ',
                     '<a href="', url, '" target="_blank" onclick="return close();" >Google Script Authorization</a>',
                     ' dialogue.',
                     '</span></p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(50,50,50)">',
                     'Proceed by closing this dialogue and then authenticating yourself using the district menu.',
                     '</span></p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(50,50,50)">',
                     '<input type="button" value="Close" onclick="google.script.host.close()" />',
                     '</span></p>',
                     '<script>setTimeout(function(){google.script.host.close()},(15*1000));</script>'
                    ].join(' '),
          htmlOutput = HtmlService.createHtmlOutput(strHTML),
          htmlOutput = htmlOutput.setSandboxMode(HtmlService.SandboxMode.IFRAME),
          htmlOutput = htmlOutput.setWidth(280).setHeight(400);
      return(SpreadsheetApp.getUi().showModalDialog(htmlOutput, dialogTitle));
    }, // end Drv.show.dialogAuthRequired()
    
    dialogAuthorized: function() {
      var dialogTitle = ' ', // Cannot contain HTML markup
          boxLogoTag  = 'http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/D0D3F1B844EA478E895BCA4532574442.ashx', //png
          strHTML = ['<p align="center"style="margin:0cm 0cm 0.0001pt;">',
                     '<a href="http://www.toastmasters.org/" target="_blank">',
                     '<img width="90%" src="', boxLogoTag, '" alt="TM Logo"></a>',
                     '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="left" style="margin:0cm 0cm 0.0001pt;">',
                     '<b><i><span style="font-size:12pt;font-family:Verdana,sans-serif;color:rgb(119,36,50)">',
                     'District ',Drv.script.get('district'),' Reimbursements',
                     '</span></i></b></p>',          
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(100,100,100)">',
                     'Version ', Drv.version, // Drv.script.get('version'),
                     '</span></p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(50,50,50)">',
                     'Thanks for your patience while the workbook loads.',
                     'Proceed by closing this dialogue and then authenticating yourself using the district menu.',
                     '</span></p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;font-size:6pt">', '&nbsp;', '</p>',
                     '',
                     '<p align="justify" style="margin:0cm 0cm 0.0001pt;">',
                     '<span style="font-size:8pt;font-family:Verdana,sans-serif;color:rgb(50,50,50)">',
                     '<input type="button" value="Close" onclick="google.script.host.close()" />',
                     '</span></p>',
                     '<script>setTimeout(function(){google.script.host.close()},(10*1000));</script>'
                    ].join(' '),
          htmlOutput = HtmlService.createHtmlOutput(strHTML),
          htmlOutput = htmlOutput.setSandboxMode(HtmlService.SandboxMode.IFRAME),
          htmlOutput = htmlOutput.setWidth(280).setHeight(260);
      return(SpreadsheetApp.getUi().showModalDialog(htmlOutput, dialogTitle));
    }, // end Drv.show.dialogAuthorized()
  }, // end Drv.show context
}; // end Drv container context

var district = {
  mail:      {},
  name:      {},
  init:      function() {
    var editors    = lc(ArrayTranspose(Drv.ss().getSheetByName("Properties").getSheetValues(2, 3,13,1))[0]),
        sheetNames =    ArrayTranspose(Drv.ss().getSheetByName("Properties").getSheetValues(2, 2,13,1))[0];
    district.mail.DD = editors[4];
    district.mail.FM = editors[2];
    var values = Drv.ss().getSheetByName(sheetNames[0]).getSheetValues(2, 2,15,5);
    for(var row in values)
      if(values[row][0] == sheetNames[1]) {
        district.name.FM = [values[row][4],' ',values[row][3]].join('');
        break;
      };
    return(void(0));
  }, // end Drv.district.init()
}; // container for district context


//----------------------------------------------------------------------------
// Spreadsheet Editor context
//----------------------------------------------------------------------------
var Wbk = {
  tabNames:      ArrayTranspose(Drv.ss().getSheetByName("Properties").getSheetValues(2, 2,13,1))[0],
  eMail: {
    workflow: lc(ArrayTranspose(Drv.ss().getSheetByName("Properties").getSheetValues(2, 3,13,1))[0]),
  },
  //----------------------------------------------------------------------------
  // Event context for simple triggers
  //----------------------------------------------------------------------------
  evt: {
    onRefresh: function(){
      try{SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard").getRange('A1').setValue(Math.random());
      }catch(error){Logger.log(error)};
    }, // Wbk.evt.onRefresh()
    
    // Only users who have permission to edit a spreadsheet, document, or form can run its bound script.
    onOpen: function(event) { // Logger.log("Wbk.evt.onOpen:"); Logger.log(event);
      Drv.evt.onOpen(event);
      Wbk.menu.init();  // Setup a custom user menu (doesn't work in AuthMode.NONE)
      Wbk.nameValue.init(); // Setup the name-value cache with associative arrays.
//    Wbk.evt.onRefresh(); // SpreadsheetApp.flush(); // Flush the toilet.
    }, // end Wbk.evt.onOpen() event handler
    
    onEdit: function(event) { // Logger.log(event);
      var sheet          = event.source.getActiveSheet(),
          sheetName      = sheet.getSheetName(),
          idxSheet       = Wbk.tabNames.indexOf(sheetName),
          col            = event.range.getColumn() - 1;  // Define col as an array index
      if(idxSheet == 1 || idxSheet == 3 || idxSheet == 4) { // only on [FM,DD,BT]   Logger.log(sheetName)
        if(col == Wbk.aI.AL[sheetName]) { // If column is an account label, insert note with description of the AL
          var m   = event.range.getNumRows(),
              row = event.range.getRow(); // Logger.log("col: %s, row: %s, m: %s", col, row, m);
          for(var i=0 ; i<m ; i++) {
            var range = sheet.getRange(row+i,col+1),
                note  = CacheService.getScriptCache().get(range.getValue());
            if(note == null) {
              Wbk.nameValue.init(); // refresh the cache if it eventually expired
              note = CacheService.getScriptCache().get(range.getValue());
            };
            range.setComment(note); // Logger.log("note: "+note)
          }; //SpreadsheetApp.flush(); // Flush the toilet only if necessary
        }  // end of if AL column
        else if(col == Wbk.aI.RC[sheetName]) { // If column is a reporting Wbk, insert note with description of the RC
          var m   = event.range.getNumRows(),
              row = event.range.getRow(); // Logger.log("col: %s, row: %s, m: %s", col, row, m);
          for(var i=0 ; i<m ; i++) {
            var range = sheet.getRange(row+i,col+1),
                note  = CacheService.getScriptCache().get(range.getValue());
            if(note == null) {
              Wbk.nameValue.init(); // refresh the cache if it eventually expired
              note = CacheService.getScriptCache().get(range.getValue());
            };
            range.setComment(note);
          }; //SpreadsheetApp.flush(); // Flush the toilet only if necessary
        }; // end of if RC column
      }; // end of if sheetName in [FM,VD,DD,BT]
    }, // end Wbk.evt.onEdit() event handler

    onFetchContentSvc: function(url) {
      var errorCode, macro, mc, msg, strArr,
          ss = SpreadsheetApp.getActiveSpreadsheet(),
          sheetName = ss.getActiveSheet().getName(),
          text = UrlFetchApp.fetch( url ).getContentText(),  // Call the Svc.doGet() context service
          timeoutSeconds = 10;
      SpreadsheetApp.flush();
      strArr = text.split('msg:');
      msg = (strArr.length > 1 ? strArr[1].trim() : '');
      strArr = text.split('mc=');
      mc  = (strArr.length > 1 ? strArr[1].split('&')[0] : '');
      strArr = text.split('rror code:');        // error code: -3 args:  mc=sort&order=da
      errorCode = (strArr.length > 1 ? parseInt(strArr[1].trim().split(' ')[0],10) : 0 );
      macro = (mc === "sort" ? "Sort Service" : (mc !== "vchr" ? (mc === "edit" ? "Authorized editors" :(mc === "copy" ? "Duplicate row" :"Authorizations")) : "Voucher Generation"));
      if(text.search('<!DOCTYPE html>') != -1) { //"<!DOCTYPE html><html><head><link rel="shortcut icon" href="//ssl.gstatic.com/docs/script/images/favicon.ico"><title>Erro</title><style type="text/css">body {background-color: #fff; margin: 0; padding: 0;}.errorMessage {font-family: Arial,sans-serif; font-size: 12pt; font-weight: bold; line-height: 150%; padding-top: 25px;}</style></head><body><div><img src="//ssl.gstatic.com/docs/script/images/logo.png"></div><center>The coordinates or dimensions of the range are invalid. (linha 1094, ficheiro &quot;&quot;)</center></body></html>"
        strArr = text.split('center>');
        msg = (strArr.length > 1 ? strArr[1].split('</')[0] : 'untrapped error');
        ss.toast(msg,'Content Service Error', -1);
        return(void(0));
      };
      if( errorCode == 0) {
        if(macro != "Sort Service")
          ss.toast(msg, macro, timeoutSeconds);
      } else { 
        if (errorCode == -3)      ss.toast((macro != "Sort Service" ?
                                            ["No authorization workflow on this tab (",sheetName,")."].join('')
                                           :["Cannot sort this tab (",sheetName,")."].join('')), macro, timeoutSeconds);
        else if (errorCode == -4) ss.toast(["Row-duplication error on ",sheetName," queue."].join(''), "Duplicate row", timeoutSeconds);
        else if (errorCode == -6) ss.toast([Drv.user.get()," is not signatory of ",sheetName," queue."].join(''), macro, timeoutSeconds);
        else if (errorCode == -7) ss.toast(["Function not relevant on  ",sheetName," tab"].join(''), macro, timeoutSeconds);
        else                     ss.toast(("Error code: "+errorCode), macro, -1);
      };
      return(void(0));
    }, // end Wbk.evt.onFetchContentSvc()
  }, // end Wbk.evt object
  
  goto: {
    sheet: function(name){
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name).activate();
    }, // end Wbk.goto.sheet()
    
    workFlow: function() {
      var sheetNames = Wbk.tabNames,
          user       = Drv.user.get(),
          idxUsr     = Wbk.eMail.workflow.indexOf((user === "" ? "na" : user));
      switch(idxUsr) {
        case 0:
        case 1:
        case 3:
        case 5: Wbk.goto.sheet(sheetNames[idxUsr]); break;
        case 6:
        case 7: Wbk.goto.sheet(sheetNames[5]); break;
        case 9:
        case 10:Wbk.goto.sheet(sheetNames[1]); break;
        case 11:
        case 12:Wbk.goto.sheet(sheetNames[2]); break;
      };
    }, // end Wbk.goto.workFlow()
  }, // end Wbk.evt object
  
  //----------------------------------------------------------------------------
  // Associatitve arrays (name-value pairs) cf. http://en.wikipedia.org/wiki/Associative_array
  //----------------------------------------------------------------------------
  aI: {  // array indices  (= range indices - 1) 
    ST: {AU:  1, BT:  1, DD:  1, VD:  1,  FM:  1}, // Status             = Column B
    TS: {AU:  2, BT:  4, DD: 11, VD: 15,  FM: 20}, // TimeStamp          = Columns C, E, L, P, U
    VD: {AU: 16, BT: 16, DD: 16, VD: 16,  FM: 16}, // Lt. Gov.           = Columns Q, Q, Q, Q, Q
    CM: {AU:  3, BT:  9, DD: 12, VD: 17,  FM: 21}, // Comments           = Columns D, J, M, R, V
    AL: {AU: 13, BT: 13, DD: 13, VD: 18,  FM: 22}, // Account Label      = Columns N, N, N, S, W
    RC: {AU: 14, BT: 14, DD: 14, VD: 19,  FM: 23}, // Reporting Wbks    = Columns O, O, O, T, X
    LK: {AU: 10, BT: 10, DD: 10, VD: 10,  FM: 10}, // Voucher Link       = Column K
    EM: {AU: 24, BT: 24, DD: 24, VD: 24,  FM: 24}, // Event Month        = Column Y
    OF: {AU: 28, BT: 28, DD: 28, VD: 28,  FM: 28}, // District Office    = Column AC
    BF: {AU: 48, BT: 48, DD: 48, VD: 48,  FM: 48}, // Beneficiary Name   = Column AW
    CR: {AU: 62, BT: 62, DD: 62, VD: 62,  FM: 62}, // Line item currency = Column BK
    VL: {AU: 63, BT: 63, DD: 63, VD: 63,  FM: 63}, // Line item total    = Column BL
    FX: {AU: 64, BT: 64, DD: 64, VD: 64,  FM: 64}, // Line item fx rate  = Column BM
  }, // end Wbk.aI object
  
  nameValue: {
    init: function () {
      Wbk.nameValue.acctLbls();    
      Wbk.nameValue.rptWbks();
    },
    acctLbls: function () {
      var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AL').getDataRange().getValues(),
          keys   = ArrayTranspose(values)[0],
          keyValueObj = {};
      for(var row in values)
        if(values[row][0] !== '')
          keyValueObj[ values[row][0] ] = values[row][1];
      try {
        CacheService.getScriptCache().removeAll(keys);
      } catch (error) {};
      CacheService.getScriptCache().putAll(keyValueObj,(6*60*60)); // 60 sec/min x 60 min/hr x 6 hours = 21,600 secconds
    },  
    rptWbks: function () {
      var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RC').getDataRange().getValues(),
          keys = ArrayTranspose(values)[1],
          keyValueObj = {};
      for(var row in values)
        if(values[row][1] !== '')
          keyValueObj[ values[row][1] ] = values[row][4];
      try {
        CacheService.getScriptCache().removeAll(keys);
      } catch (error) {};
      CacheService.getScriptCache().putAll(keyValueObj,(6*60*60)); // 60 sec/min x 60 min/hr x 6 hours = 21,600 secconds
    },
  }, // end Wbk.nameValue object
  
  //----------------------------------------------------------------------------
  // Custom menus
  //----------------------------------------------------------------------------
  menu: {
    init: function() {
      var menus   = {},
          ui      = SpreadsheetApp.getUi(),  // https://developers.google.com/apps-script/guides/menus
          cachUsr = Drv.user.get(),
          actvUsr = Session.getActiveUser().getEmail().toLowerCase(), // always empty onOpen() except for owner
          idxUsr  = Wbk.eMail.workflow.indexOf(cachUsr),
          isOwner = (Drv.script.get('owner') == cachUsr);
      Logger.log("menu.init: ActiveUser: "+cachUsr);
      menus.main = ui.createMenu(['District ', Drv.script.get('district')].join('')); // Define main menu
      if(!cachUsr || !actvUsr || !Drv.script.get('folderId')) { // Force user to do Drv.user.put(...)
        menus.main.addItem('User Authentication', 'doAuthentication');
        menus.main.addItem('Revoke Authorization','doRevokeAuth' );
      } else {
        menus.goto = ui.createMenu('Go to');      // Define Goto sub-menu
        if(idxUsr != -1)
          menus.goto.addItem('My workflow',      'goToWorkFlow');
        menus.goto.addItem('Dashboard',          'goToDashboard');
        menus.goto.addItem('Clients',            'goToDO');
        menus.goto.addItem('Account Labels',     'goToAL');
        menus.goto.addItem('Reporting Codes',    'goToRC');
        menus.goto.addItem('Approved',           'goToApproved');
        menus.goto.addItem('Rejected',           'goToRejected');
        menus.goto.addSeparator();
        if(idxUsr === 9 || isOwner) { // if(idxUsr === 1  || idxUsr === 9 || idxUsr === 10 || isOwner){
          menus.goto.addItem('Configuration',      'goToConfig');
          menus.goto.addItem('Script editor',      'openScriptEditor');
        };
        menus.goto.addItem('Submission form',      'openSubmissionFrm');
        // Assemble the main menu
        menus.main.addSubMenu(menus.goto);
        if(1 <= idxUsr) {  // any workflow member besides administration manager
          menus.auth = ui.createMenu('Authorizations');      // Define Authorizations sub-menu
          menus.auth.addItem('Process all',        'doAuthProcAll' );
          menus.auth.addItem('Process approved',   'doAuthApproved');
          menus.auth.addItem('Process rejected',   'doAuthRejected');
          menus.main.addSubMenu(menus.auth);
        };
        menus.sort = ui.createMenu('Sort');      // Define Sort sub-menu
        menus.sort.addItem('Order by Submission Date',     'doSortDate');
        menus.sort.addItem('Order by District Office',     'doSortName');
        menus.sort.addItem('Order by Status',              'doSortStat');
        menus.sort.addItem('Order by Workflow Status',     'doSortWorkflow');
        menus.main.addSubMenu(menus.sort); // Add Sort sub-menu for all users
        if(isOwner || idxUsr === 1  || idxUsr === 9 || idxUsr === 10) {
          menus.edit = ui.createMenu('Edit rows');   // Define Voucher sub-menu
          menus.edit.addItem('Duplicate active row (FM queue only)', 'doCopyRow');
          menus.main.addSubMenu(menus.edit); // Add Edit sub-menu if user is a Finance Manager or Assistant FM
          menus.vchr = ui.createMenu('Vouchers');   // Define Voucher sub-menu
          menus.vchr.addItem('Generate Voucher', 'doVouchers');
          menus.vchr.addSeparator();
          menus.vchr.addItem('Edit template: FM-only', 'openTemplateFM');
          menus.vchr.addItem('Edit template: PQD',     'openTemplatePQD');
          menus.vchr.addItem('Edit template: CGD',     'openTemplateCGD');
          menus.main.addSubMenu(menus.vchr); // Add Voucher sub-menu if user is a Finance Manager or Assistant FM
        };
        menus.main.addSeparator(); // Add a seperator to the main menu
        menus.toast = ui.createMenu('Settings');
        menus.toast.addItem('Show active sheet editors', 'doToastEditors');
        menus.toast.addItem('Show protected ranges',   'doToastRanges'    );
        menus.toast.addItem('Show script authorization status', 'doToastAuthStatus');
        menus.toast.addItem('Refresh query functions', 'doCalcRefresh');
        if(idxUsr === 9 || isOwner) { // if(idxUsr === 1  || idxUsr === 9 || idxUsr === 10 || isOwner){
          menus.toast.addSeparator();
          menus.toast.addItem('Reset workbook editors',         'doSetSharing'  );
          menus.toast.addItem('Reset workbook data validation', 'doSetValidation'  );
          menus.toast.addItem('Update document Id\'s',          'doSetDocIds'  );
          menus.toast.addItem('Update short web-app URL',       'doSetShortURL'  );
        };
        menus.toast.addSeparator();
        menus.toast.addItem('Revoke script authorization','doRevokeAuth' );
        menus.main.addSubMenu(menus.toast); // Add post-init settings sub-menu
      };
      menus.main.addToUi(); // Add main menu to the workbook's GUI
    }, // end of Wbk.menu.init()
  }, // end Wbk.menu context
  
  call: {      
    doAuth: function(macro) {
      var url = [Svc.get.webAppURL(),
                 '?usr=', Drv.user.get(),
                 '&sh=',  SpreadsheetApp.getActiveSheet().getSheetName(),
                 '&mc=',  macro
                ].join('');
      Wbk.evt.onFetchContentSvc(url);
    }, // end Wbk.call.doAuth() callback function
    
    doCopy: function() {
      var url = [Svc.get.webAppURL(),
                 '?usr=', Drv.user.get(),
                 '&sh=',  SpreadsheetApp.getActiveSheet().getSheetName(),
                 '&mc=',  'copy',
                 '&row=', SpreadsheetApp.getActiveRange().getRow()
                ].join('');
      Wbk.evt.onFetchContentSvc(url);
    }, // end Wbk.call.doSort() callback function
    
    doSort: function(order) {
      var url = [Svc.get.webAppURL(),
                 '?usr=', Drv.user.get(),
                 '&sh=',  SpreadsheetApp.getActiveSheet().getSheetName(),
                 '&mc=',  'sort',
                 '&order=', order
                ].join('');
      Wbk.evt.onFetchContentSvc(url);
    }, // end Wbk.call.doSort() callback function
    
    doVchr: function() {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if(ss.getSheetByName('BT:Voucher').getLastRow() > 1) {
        var url = [Svc.get.webAppURL(),
                   '?usr=', Drv.user.get(),
                   '&sh=',  ss.getActiveSheet().getSheetName(),
                   '&mc=',  'vchr'
                  ].join('');
        Wbk.evt.onFetchContentSvc(url);
      } else {
        ss.toast("No lines selected for a voucher", 'Generate Voucher', 10);
      };
    }, // end Wbk.call.doVchr() callback function
    
    revokeScriptAuthorization: function() {
      SpreadsheetApp.getActiveSpreadsheet().toast(['Please close the workbook and then re-open it. ',
                                                   'You will be asked to reauthorize the script when authenticate yourself.'].join(''),
                                                  'Revoke script authorization',-1);
      if(ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationStatus() != ScriptApp.AuthorizationStatus.REQUIRED) {
        if(Drv.user.get() === Drv.script.get('owner')) Drv.script.clear();
        else                                          Drv.user.clear();
        ScriptApp.invalidateAuth();
      };
    }, // end Wbk.call.revokeScriptAuthorization() callback function
  }, // end Wbk.call context
   
  show: {
    authentication: function() {
      var ss    = SpreadsheetApp.getActiveSpreadsheet(),
          actvUsr  = Session.getEffectiveUser().getEmail().toLowerCase(),
          title = 'User Authentication',
          msg   = ['District ',Drv.script.get('district'),' menus enabled for ',actvUsr].join(''),
          timeoutSeconds = 3;
      if(!actvUsr) {
        msg = "Please reload the workbook";
        timeoutSeconds = -1;
      } else {
        Drv.user.put(actvUsr);
        if(Drv.is.owner(actvUsr)) {
          Drv.evt.onAuth();
          Wbk.set.shortWebAppUrl();
        };
        Wbk.menu.init();  //SpreadsheetApp.flush();
        Wbk.goto.workFlow();
      };
      ss.toast(msg, title, timeoutSeconds)
    }, // end of Wbk.show.authentication()
    
    protectedRanges: function() {
      var ss = SpreadsheetApp.getActiveSpreadsheet(),
          sheet = ss.getActiveSheet(),
          rangeProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE),
          sheetProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET),
          strArray = [],
          nRanges = rangeProtections.length,
          timeoutSeconds = 10;
      if(nRanges > 1) {
        for(var i = 0; i < rangeProtections.length; i++)
          strArray.push(rangeProtections[i].getRange().getA1Notation());
      } else strArray.push("Entire sheet locked");
      //    ss.toast(strArray.sort(function(a, b){
      //      var aa = a.split(":").shift(), bb = b.split(":").shift(), t0 = aa.length - bb.length;
      //      if(t0 != 0) return t0; else return aa[0] -bb[0];
      //    }).join(', '),"Protected ranges",10); // Logger.log(strArray.join('\n'));
      ss.toast(strArray.sort().join(', '),"Protected ranges",timeoutSeconds); // Logger.log(strArray.join('\n'));
    }, // end of Wbk.show.protectedRanges()
    
    sheetEditors: function() {
      var timeoutSeconds = 10;
      SpreadsheetApp.getActiveSpreadsheet().toast(Wbk.get.editors(),"Authorized editors",timeoutSeconds); 
    }, // end of Wbk.show.sheetEditors()
    
    authStatus: function() {
      // Get an object to determine whether the user needs to authorize this script to use one or more services.
      // Note: In almost all cases, the value for authMode should be ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL)
      // since no other authorization mode requires that users grant authorization.
      // https://developers.google.com/apps-script/reference/script/script-app#getauthorizationinfoauthmode
      // https://developers.google.com/apps-script/reference/script/authorization-info
      // https://developers.google.com/apps-script/reference/script/authorization-status
      // https://developers.google.com/apps-script/reference/script/auth-mode
      var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL),
          status  = authInfo.getAuthorizationStatus(), // Get the authorization status (REQUIRED or NOT_REQUIRED).
          timeoutSeconds = 10;
      SpreadsheetApp.getActiveSpreadsheet().toast(status, "Script Authorization",timeoutSeconds);
    }, // end of Wbk.show.authStatus()
  }, // end Wbk.show context

  set: {
    sheetProtections: function(sheets,sheetNames,me,editors) {// SpreadsheetApp.ProtectionType.SHEET)
        var names = sheetNames.slice(0,6).concat('Approved'); // [DO, FM, VD, DD, BT, AU, Approved]
        for( var i=0; i < sheets.length; i++){
          var name = sheets[i].getName();
          // Step 1a: Remove edit permissions from all sheets, leaving only owner and super user (array index # 9)    
          var sheetProtection = sheets[i].protect();
          if(/^Dashboard$/.test(name)) {  
            var ranges = [ sheets[i].getRange('A1') ];
            sheetProtection.setUnprotectedRanges(ranges);
            continue; // Do not remove edit permissions on Dashboard
          } else {
            sheetProtection.addEditor(me).removeEditors(sheetProtection.getEditors()).addEditor(editors[9]);
            if(sheetProtection.canDomainEdit())
              sheetProtection.setDomainEdit(false);
          };
          // Step 1b: Add edit workflow permissions to specific sheets
          if(/^Approved:|^BT:|^Access|^Login|^UserAgents|^2014|^2015|^Column|^DO\(|^DO \(/.test(name))
            sheetProtection
              .addEditor(editors[1])   // Finance Manager
              .addEditor(editors[3])   // District Director
              .addEditor(editors[10]); // Finance Manager Assistant
          else switch(names.indexOf(name)) {
            case 0: // DO or Clients
              sheetProtection
              .addEditor(editors[0])   // Administration Manager
              .addEditor(editors[1])   // Finance Manager
              .addEditor(editors[3])   // District Director
              .addEditor(editors[10]); // Finance Manager Assistant
              break;
            case 1: // FM
            case 4: // BT     FM and FM assistant (plus owner and super user)
              sheetProtection.addEditor(editors[1]).addEditor(editors[10]); break;
            case 2: // VD     PQD and CGD alone (besides owner and super user)
              sheetProtection.addEditor(editors[11]).addEditor(editors[12]); break;
            case 6: // Approved
            case 3: // DD     District Director alone (besides owner and super user)
              sheetProtection.addEditor(editors[3]); break;
            case 5: // AU
              sheetProtection
              .addEditor(editors[5])   // Audit Team 1
              .addEditor(editors[6])   // Audit Team 2
              .addEditor(editors[7]);  // Audit Team 3
              break;
          }; // end switch specific sheet (Step 1b)
        }; // end for-sheets[] (Step 1)
    },// end Wbk.set.sheetProtections()
  
    rangeProtections: function(sheets,sheetNames,me,editors) {
      var setRP = function(sheet,a1Notation,me,editor) {
        var rangeProtection = sheet.getRange(a1Notation).protect();
        rangeProtection.addEditor(me).removeEditors(rangeProtection.getEditors()).addEditor(editor);
        if (rangeProtection.canDomainEdit())
          rangeProtection.setDomainEdit(false);
      };// end rangeProtection()
      //----------------------------------------------------------------------------
      var names = sheetNames.slice(0,6).concat('Dashboard'); // [DO, FM, VD, DD, BT, AU, Dashboard]
      for(var i=0; i < sheets.length; i++) {
        var name = sheets[i].getName();
        // Step 2a: Remove all range protections in the spreadsheet that the user has permission to edit.
        var rangeProtections = sheets[i].getProtections(SpreadsheetApp.ProtectionType.RANGE);
        for(var j = 0; j < rangeProtections.length; j++) {
          var rangeProtection = rangeProtections[j];
          if (rangeProtection.canEdit())
            rangeProtection.remove();
        }; // end for-range protections removal
        // Step 2b: Add range protections to specific sheets
        switch(names.indexOf(name)) {
          case 0: { // DO or Clients
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]); } break;
          case 1: { // FM
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]);
            setRP(sheets[i],'C:G',me,editors[9]);
            setRP(sheets[i],'J:U',me,editors[9]);
            setRP(sheets[i],'Y:Y',me,editors[9]);
            setRP(sheets[i],'AC:BG',me,editors[9]); } break;
          case 2: { // VD
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]);
            setRP(sheets[i],'C:P',me,editors[9]);
            setRP(sheets[i],'S:BR',me,editors[9]); } break;
          case 3: { // DD
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]);
            setRP(sheets[i],'C:L',me,editors[9]);
            setRP(sheets[i],'P:BR',me,editors[9]); } break;
          case 4: { // BT
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]);
            setRP(sheets[i],'C:E',me,editors[9]);
            setRP(sheets[i],'L:M',me,editors[9]);
            setRP(sheets[i],'P:U',me,editors[9]);
            setRP(sheets[i],'Z:BG',me,editors[9]); } break;
          case 5: { // AU
            setRP(sheets[i],'1:1',me,editors[9]);
            setRP(sheets[i],'A:A',me,editors[9]);
            setRP(sheets[i],'C:C',me,editors[9]);
            setRP(sheets[i],'E:BR',me,editors[9]); } break;
//          case 6: { // Dashboard
//            setRP(sheets[i],'B:H',me,editors[9]);// Complement of A1
//            setRP(sheets[i],'A2:A',me,editors[9]); } break;
          default: {}
        };// end switch specific sheet (Step 2b)
      }; // end for-sheets[] (Step 2)
    },// end Wbk.set.rangeProtections()

    sharing: function() {
      var ss          = SpreadsheetApp.getActiveSpreadsheet(),
          fileId      = ss.getId(),
          sheets      = ss.getSheets(),
          editors     = Wbk.eMail.workflow,
          sheetNames  = Wbk.tabNames,
          viewersDO   = ArrayTranspose(ss.getSheetByName(sheetNames[0]).getSheetValues(2, 2,15,1))[0],
          viewersMail = ArrayTranspose(ss.getSheetByName(sheetNames[0]).getSheetValues(2,15,15,1))[0],
          me          = Session.getEffectiveUser(), // The owner will always have edit permission
          timeoutSeconds = 10;
      ss.toast('TTT: This takes time!', 'Reset workbook editors', -1);
      {
        var owner   = ss.getOwner().getEmail();
        try{
          for(var i=0, users = ss.getViewers(); i<users.length ; i++)
            if(users[i].getEmail() !== owner)
              ss.removeViewer(users[i]);
        } catch(error) {
          Logger.log("getViewers: "+error);
          ss.toast("getViewers: "+error, 'Reset workbook editors', -1);
        }
        for(var i=0, users = ss.getEditors(); i<users.length ; i++)
          if(users[i].getEmail() !== owner)
            ss.removeEditor(users[i]);
        // Add all core district officers as workbook editors (for them to have menus)
        for(var i=0; i < viewersMail.length; i++){
          if((/^[A-Z][0-9]$/.test(viewersDO[i]) == false) && (/^\S+@\S+[\.][0-9a-z]+$/.test(viewersMail[i]) == true)) 
          try {
            ss.addEditor(viewersMail[i]); //  ss.addViewer(viewersMail[i]);
          } catch(error) {
            ss.toast(['Cannot add non-Google user: ', viewersMail[i]].join(''), 'Reset workbook editors', -1);
          };
        };
      };
      ss.toast('Setting workflow permissions', 'Reset workbook editors', -1);
      {  // Add workflow collaborators as workbook editors
        for(var i=0; i < editors.length; i++){
          if(i==2 || i==4)
            continue; // Skip non-Google reply-to addresses in Properties!E4 and Properties!E6
          else
            if(/^\S+@\S+[\.][0-9a-z]+$/.test(editors[i]))
              try {
                ss.addEditor(editors[i]);
              } catch(error) {
                ss.toast(['Cannot add non-Google workflow member: ', editors[i]].join(''), 'Reset workbook editors', -1);
              };
        };
      };
      ss.toast('Setting tab-level permissions', 'Reset workbook editors', -1);
      Wbk.set.sheetProtections(sheets,sheetNames,me,editors);
      ss.toast('Setting range-specific permissions', 'Reset workbook editors', -1);
      Wbk.set.rangeProtections(sheets,sheetNames,me,editors);
      ss.toast('Setting sharing permissions', 'Reset workbook editors', -1);
      {
        var file = DriveApp.getFileById(fileId),
            accessType     = DriveApp.Access.PRIVATE,  // https://developers.google.com/apps-script/reference/drive/access
            permissionType = DriveApp.Permission.EDIT; // https://developers.google.com/apps-script/reference/drive/file#setshareablebyeditorsshareable
        if(file.getSharingAccess() != accessType) file.setSharing(accessType,permissionType);
        if(file.isShareableByEditors())           file.setShareableByEditors(false);
        // Disable options to download, print, and copy for commenters and viewers
        // Collaborators who have only view access cannot open the script editor, although if they make a copy of
        // the parent file, they become the owner of the copy and will be able to see and run a copy of the script.
        // cf. https://developers.google.com/apps-script/guides/bound
        var resources = {labels:{restricted:true},copyable:false,writersCanShare:false};
        Drive.Files.patch(resources, fileId); // https://developers.google.com/drive/v2/reference/files#resource
      };
      ss.toast('Done!', 'Reset workbook editors', timeoutSeconds);
      return( void (0) );
    }, // end Wbk.set.sharing() callback function

    validation: function() {
      var setDV = function(rule,destinationRange){
        var rules = destinationRange.getDataValidations();
        for(var row in rules) {
          rules[row][0] = rule;
        };
        destinationRange.setDataValidations(rules);
        return(void (0));
      }; // end setDV()
      //----------------------------------------------------------------------------
      var ss = SpreadsheetApp.getActiveSpreadsheet(),
          AL = ss.getSheetByName('AL'), rangeAL = AL.getRange(2,1,AL.getLastRow()-1,1), // AL!A2:A
          RC = ss.getSheetByName('RC'), rangeRC = RC.getRange(2,2,RC.getLastRow()-1,1), // RC!B2:B
          states = ['submitted', 'ok', 'pending', 'rejected',  'voucher'],
          names = Wbk.tabNames.slice(1,6), // [FM, VD, DD, BT, AU]
          timeoutSeconds = 10;
      ss.toast('TTT: This takes time!', 'Reset data validation', -1);
      
      var rule1a = SpreadsheetApp.newDataValidation()
      .requireValueInList(states.slice(0,4),true)
      .setAllowInvalid(false)//.setHelpText('Set status to OK, PENDING or REJECTED')
      .build();
      
      var rule1b = SpreadsheetApp.newDataValidation()
      .requireValueInList(states,true)
      .setAllowInvalid(false)//.setHelpText('Set status to OK, PENDING, REJECTED or VOUCHER')
      .build();
      
      var ruleAL = SpreadsheetApp.newDataValidation()
      .requireValueInRange(rangeAL,true)
      .setAllowInvalid(false)//.setHelpText('Set the Account Label (AL)')
      .build();
      
      var ruleRC = SpreadsheetApp.newDataValidation()
      .requireValueInRange(rangeRC,true)
      .setAllowInvalid(false)//.setHelpText('Set the Reporting Wbk (RC)')
      .build();
      
      var ruleVD = SpreadsheetApp.newDataValidation()
      .requireValueInList(['CGD','PQD'],true)
      .setAllowInvalid(false)//.setHelpText('Set status to OK, PENDING, REJECTED or VOUCHER')
      .build();

      
      for( var i=0; i < names.length; i++){
        var sheet = ss.getSheetByName(names[i]);
        var mRows = sheet.getMaxRows();
        // Step 1: Clear sheet of all / any existing validations
        sheet.getRange(1,1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();
        // Step 2: Add validation rules to specific sheets
        var nRows = mRows - 1;
        //    var colI = Wbk.aI['ST'][names[i]] + 1;
        var colST = sheet.getRange(2,(Wbk.aI['ST'][names[i]] + 1),nRows,1); // status
        var colAL = sheet.getRange(2,(Wbk.aI['AL'][names[i]] + 1),nRows,1); // account label
        var colRC = sheet.getRange(2,(Wbk.aI['RC'][names[i]] + 1),nRows,1); // reporting Wbk
        var colVD = sheet.getRange(2,(Wbk.aI['VD'][names[i]] + 1),nRows,1); // Lt. Gov
        //    var colST = sheet.getRange(2,(parseInt(Wbk.aI['ST'][names[i]],10) + 1),nRows,1); // status
        //    var colAL = sheet.getRange(2,(parseInt(Wbk.aI['AL'][names[i]],10) + 1),nRows,1); // account label
        //    var colRC = sheet.getRange(2,(parseInt(Wbk.aI['RC'][names[i]],10) + 1),nRows,1); // reporting Wbk
        if(i != 3) setDV(rule1a,colST); // if not BT
        else       setDV(rule1b,colST); // include voucher option on BT
        if(i != 1 && i != 4) { // VD & AU don't work with AL or RC's
          setDV(ruleAL,colAL);
          setDV(ruleRC,colRC);
        } else if(i == 1) {
          setDV(ruleVD,colVD);
        };
      }; // end for-names[]
      ss.toast('Done!', 'Reset data validation', timeoutSeconds);
    }, // end Wbk.set.validation()
    
    shortWebAppUrl: function () {
      var svc = ScriptApp.getService();
      if(svc.isEnabled()) {
        var B1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard").getRange('B1'),
            properties = UrlShortener.Url.get(B1.getValue()),
            longUrl = svc.getUrl();
        if(longUrl !== properties.longUrl) {
          var newUrl = UrlShortener.Url.insert({longUrl: longUrl });
          B1.setValue(newUrl.id); // Logger.log("URL updated in B1");
        } else Logger.log("URL mapped by short URL is up-to-date");
      };
    }, // end Wbk.set.shortWebAppUrl()
}, // end Wbk.set context
  
  //----------------------------------------------------------------------------
  // Define workbook helper functions
  //----------------------------------------------------------------------------
  get: {
    sheetID: function(name) {
      return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name).getSheetId();
    }, // end Wbk.get.sheetID()
    
    allLines: function() {
      var names = Wbk.tabNames.slice(1,6); // [FM, VD, DD, BT, AU]
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(names[0]);
      var nColumns = sheet.getLastColumn(); // Logger.log("n Columns: " + nColumns);
      var newValues = [ ["Queue", "Status"].concat(sheet.getSheetValues(1,2,1,(nColumns - 1))[0]) ];
      for(var i=0 ; i<names.length ; i++) {
        sheet = ss.getSheetByName(names[i]);
        var n = sheet.getLastRow() - 1; // Logger.log("(i,n): " + i + "," + n);
        if(n > 0) {
          var values = sheet.getSheetValues(2,1,n,nColumns);
          for(var row in values) {
            newValues.push( [(i+1).toString()].concat( values[row] ) );
          };
        };
      };
      return newValues;
    }, // end Wbk.get.allLines()
    
    approved: function() {
      var names = Wbk.tabNames.slice(4,7); // [BT, AU, AA]
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(names[0]);
      var nColumns = sheet.getLastColumn(); // Logger.log("n Columns: " + nColumns);
      var newValues = [sheet.getSheetValues(1,1,1,nColumns)[0]];
      newValues[0][1] = "Approved";
      for(var i=0 ; i < names.length ; i++) {
        sheet = ss.getSheetByName(names[i]);
        var n = sheet.getLastRow() - 1; // Logger.log("(i,n): " + i + "," + n);
        if(n > 0) {
          var values = sheet.getSheetValues(2,1,n,nColumns);
          for(var row in values) {
            newValues.push(values[row]);
          };
        };
      };
      return newValues;
    }, // end Wbk.get.approved()
    
    editors: function() {
      // Use Content Service to get editors because not all users have permissions to getEditors() of all sheets
      var url = [Svc.get.webAppURL(),
                 '?usr=', Drv.user.get(),
                 '&sh=',  SpreadsheetApp.getActiveSheet().getSheetName(),
                 '&mc=',  'edit'
                ].join('');
      var strArr = UrlFetchApp.fetch(url).getContentText().split('msg:'); // Call the Svc.doGet() context service
      return(strArr.length > 1 ? strArr[1].trim() : 'error');
    }, // end Wbk.get.editors()
    
    folder: function() {
      var url = [Svc.get.webAppURL(),
                 '?usr=', Drv.user.get(),
                 '&sh=',  SpreadsheetApp.getActiveSheet().getSheetName(),
                 '&mc=',  'fldr'
                ].join('');
      var strArr = UrlFetchApp.fetch(url).getContentText().split('msg:'); // Call the Svc.doGet() context service
      return(strArr.length > 1 ? strArr[1].trim() : strArr[0] );
    }, // end Wbk.get.folder()            
  }, // end Wbk.get object
}; // end Wbk context definitios
