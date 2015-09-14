function testParseInt(){Logger.log(parseInt('',10))};
function getVoucherIds(){Drv.evt.onAuth()};
function getVoucherIds(){Drv.evt.onAuth()};
function logTabnames(){Logger.log(Wbk.tabNames)}
function logEmails(){Logger.log(Wbk.eMail.workflow)}
function logCache(){Drv.script.log()};

function clearCache(){
  Drv.script.log();
  Drv.script.clear();
  Drv.script.log();
};

function testRegex() {
 var ss          = SpreadsheetApp.getActiveSpreadsheet(),
     sheets      = ss.getSheets();
  for( var i=0; i < sheets.length; i++){
    var name = sheets[i].getName();
    if(/^Approved:|^BT:|^Access|^Login|^UserAgents|^2014|^2015|^Column|^DO\(|^DO \(/.test(name))
      Logger.log(name);
  };
};
  

function testUser(){
  var user    = Session.getActiveUser().getEmail().toLowerCase(),
      owner   = SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail().toLowerCase();
  Logger.log("testUser: "+user+", Owner: "+owner);
}
function testVersion(){
  var fileId = SpreadsheetApp.getActiveSpreadsheet().getId(),
      propertyKey = "version",
      properties = Drive.Properties.list(fileId);
  // Logger.log(Drive.Files.list())
  
  // https://developers.google.com/drive/v2/reference/files#resource
  Logger.log(  Drive.Files.get(fileId).copyable );
  Logger.log(  Drive.Files.get(fileId).version );
  Logger.log(  Drive.Files.get(fileId).mimeType );
  
  Logger.log(  Drive.Files.get(fileId).kind );
  Logger.log(  Drive.Files.get(fileId).etag );
  Logger.log(  Drive.Files.get(fileId).selfLink );
  Logger.log(  Drive.Files.get(fileId).webContentLink );
  Logger.log(  Drive.Files.get(fileId).webViewLink );
  Logger.log(  Drive.Files.get(fileId).alternateLink );
  Logger.log(  Drive.Files.get(fileId).embedLink );
  Logger.log(  Drive.Files.get(fileId).defaultOpenWithLink );
  Logger.log(  Drive.Files.get(fileId).labels.restricted );
  Logger.log(  Drive.Files.get(fileId).description );
  Logger.log(  Drive.Files.get(fileId).headRevisionId );
  Logger.log(  Drive.Files.get(fileId).ownedByMe );
  
  Logger.log(  Drive.Files.get(fileId).writersCanShare );
  

  //  Drive.Files.get(fileId, optionalArgs)
  //   Logger.log(  Drive.Properties.list(fileId) );
  //  Logger.log("version: "+version)
};
function testThisObj(){
  var a = {myName: JSON.stringify(this).match(/"(.*?)"/)[1]};
  Logger.log("myName: " + a.myName);
//  var str =  JSON.stringify(a).match(/"(.*?)"/)[1];
//  var str =  JSON.stringify(a).match(/"(.*?)"/)[1];
//  Logger.log("myName: " + a.myName + ", str: "+ str);
};
function testArgN(a){
  Logger.log(arguments.length);
  Logger.log(testArgN.length);
};


function testId(){
  var key   = 'driveId',
      value = CacheService.getScriptCache().get(key);
  Logger.log("cache: "+ value);
  Logger.log("props: "+ PropertiesService.getScriptProperties().getProperty(key));

  var key   = 'folderId',
      value = CacheService.getScriptCache().get(key);
  Logger.log("cache: "+ value);
  Logger.log("props: "+ PropertiesService.getScriptProperties().getProperty(key));

  var id = Drv.script.get('folderId'),
      valid = /^[-\w]{10,}$/.test(id);
  Logger.log("id: valid=" + valid + ": " + id);

  var key   = 'authUrl',
      value = CacheService.getScriptCache().get(key);
  Logger.log("cache: "+ value);
  Logger.log("props: "+ PropertiesService.getScriptProperties().getProperty(key));

  var key   = 'scriptId',
      value = CacheService.getScriptCache().get(key);
  Logger.log("cache: "+ value);
  Logger.log("props: "+ PropertiesService.getScriptProperties().getProperty(key));
};


function testAuth(){
//  doAuthProcAll();
  var strArr = Svc.auth.proc('BT',true,true);
//  var strArr = Svc.auth.proc('FM',true,true);
  Logger.log(strArr);
};

function testVchr(){
  var request = { };
  var msgStr = Svc.vchr.exec(request);
  Logger.log(msgStr);
};

function testStrArrToLower() {
  var str1 = ['A'].map(String.prototype.toLowerCase.call, String.prototype.toLowerCase);
  var str2 = ['A'].map(String.prototype.toLowerCase.call.bind(String.prototype.toLowerCase));
  var str3 = ['A'].map(Function.prototype.call, String.prototype.toLowerCase);
  var str4 = ['A'].map(Function.prototype.call.bind(String.prototype.toLowerCase));
  Logger.log([str1, str2, str3, str4].join(''));
};

function testGetLongUrl() {
  var url = UrlShortener.Url.get('https://goo.gl/f4yc6L');
  Logger.log(url.longUrl);
  Logger.log('status: ' + url.status);
  Logger.log('kind:   ' + url.kind);
  Logger.log('date:   ' + url.created);
};
