function getSubmission(eventInfo,n) {
  //----------------------------------------------------------------------------
  var form3sendMail = function(eventInfo) {
    var url2htm = function(url) {  //    http://www.w3schools.com/jsref/jsref_link.asp
      var strArray = url.split('"');
      return(strArray[3].link(strArray[1]));
    };
    var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
    // Send email confirmation to beneficiary and client
    var msg = {};
    msg.to   = eventInfo.parameter.TImail;    // Client 
    msg.cc   = eventInfo.parameter['bMail'];  // Beneficiary in CC
    if(msg.to === msg.cc) {
      msg.cc   = '';
    };
    msg.repl = district.mail.FM;
    msg.bcc  = district.mail.FM;
    msg.subj = "District " + Drv.script.get('district') + " Reimbursements: Confirmation of submission";
    // https://developers.google.com/speed/articles/optimizing-javascript
    msg.body = ["<p>This message serves to confirm the reimbursement submission for ",
                "the following expense:</p>",
                "<p></p>",
                "<table border=0 cellpadding=2>",
                "<tr><th> Event Date </th><td>", eventInfo.parameter[id.event.date], "</td></tr>",
                "<tr><th> Event Type </th><td>", eventInfo.parameter[id.event.type], "</td></tr>",
                "<tr><th> Invoice Date </th><td>", eventInfo.parameter[id.invoice.date], "</td></tr>",
                "<tr><th> Invoice Amount </th><td>", eventInfo.parameter[id.invoice.valu], "</td></tr>",
                "<tr><th> Invoice Currency </th><td>", eventInfo.parameter[id.invoice.curr], "</td></tr>",
                "<tr><th> Expense Description </th><td>", eventInfo.parameter[id.expense.desc], "</td></tr>",
                "<tr><th> Documentation </th><td>", eventInfo.parameter[id.expense.url1], "</td></tr>",
                (eventInfo.parameter[id.expense.url2] == void(0) ? "" : ["<tr><th></th><td>", eventInfo.parameter[id.expense.url2], "</td></tr>"].join('')),
                (eventInfo.parameter[id.expense.url3] == void(0) ? "" : ["<tr><th></th><td>", eventInfo.parameter[id.expense.url3], "</td></tr>"].join('')),
                  "<tr><th> Expense Category </th><td>", eventInfo.parameter[id.expense.type], "</td></tr>",
                    (eventInfo.parameter[id.travel.mode] == void(0) ? "" : ["<tr><th> Mode of transport  </th><td>", eventInfo.parameter[id.travel.mode], "</td></tr>"].join('')),
                      (eventInfo.parameter[id.travel.dist] == void(0) ? "" : ["<tr><th> Distance from home </th><td>", eventInfo.parameter[id.travel.dist], "</td></tr>"].join('')),
                        (eventInfo.parameter[id.travel.gmap] == void(0) ? "" : ["<tr><th> Google map URL     </th><td>", url2htm(eventInfo.parameter[id.travel.gmap]), "</td></tr>"].join(''))
                        ].join(''); // With join() instead of join(''), the commas remain in place!
    msg.body = [msg.body,
                "</table>",
                "<p></p>",
                "<p>If approved by the District Governor, the beneficiary of this reimbursement will be:</p>",
                "<p></p>",
                "<table border=0 cellpadding=2>",
                "<tr><th> Name </th><td>", eventInfo.parameter.bName, "</td></tr>",
                "<tr><th> Email </th><td>", eventInfo.parameter.bMail, "</td></tr>",
                "<tr><th> Address L1 </th><td>", eventInfo.parameter.bAddr, "</td></tr>",
                "<tr><th> Address L2 </th><td>", eventInfo.parameter.bAdd2, "</td></tr>",
                "<tr><th> Address L3 </th><td>", eventInfo.parameter.bLand, "-", eventInfo.parameter.bCode, " ", eventInfo.parameter.bCity, "</td></tr>",
                "<tr><th> IBAN # </th><td>", eventInfo.parameter.bIBAN, "</td></tr>",
                "<tr><th> BIC/Swift </th><td>", eventInfo.parameter.bBICS, "</td></tr>",
                "<tr><th> Bank Name</th><td>", eventInfo.parameter.bBANK, "</td></tr>",
                "<tr><th> Bank Address</th><td>", eventInfo.parameter.bBADR, "</td></tr>",
                "</table>",
                "<p></p>",
                "<p>Regarding the authorization process,as your claim progresses through the pipeline, ",
                "we will notify you. We thank you for your patience, collaboration and service.</p>",
                "<p></p>",
                "<p>TM Cheers!</p>"
               ].join('');
    msg.signature = ['<table boder=none style="font-family:Verdana; font-size:10pt"><tr>',
                     '<td rowspan="3"><img src="http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/589AF548291545C085299E1AAC0DEA92.ashx" alt="TM Logo" height="55">&#160;&nbsp;</td>',
                     '<td style="color:#772432"><b><i>', district.name.FM, '</i></b></td></tr><tr>',
                     '<td style="color:#772432;text-decoration:none">District ', Drv.script.get('district'), ' Finance Manager</td></tr><tr>',
                     '<td style="color:#ff6600;text-decoration:none">Toastmasters International</td></tr></table>',
                     '<p></p>',
                     '<p><small>', emailQuotaRemaining, '% remaining of the daily mail quota</small></p>'
                    ].join('');
    msg.htmlBody = [msg.body,msg.signature].join('');
    
    if(emailQuotaRemaining > 3) {
      MailApp.sendEmail(
        msg.to, 
        msg.subj,
        msg.body,
        {
          name: ['District ', Drv.script.get('district'), ' Finance Manager'].join(''),
          replyTo: msg.repl,
          cc: msg.cc,
          //      bcc: msg.bcc,
          htmlBody: (msg.body+msg.signature)
        }
      );
    } else Svc.sendMail.createHTMLDraftInGmail(msg.repl,msg.to,msg.cc,msg.bcc,msg.subj,msg.htmlBody);
  }; // end var form3sendMail()
  //----------------------------------------------------------------------------
    
  var ui = UiApp.getActiveApplication();
  var trimInfo = function(str) {    //    http://www.w3schools.com/jsref/jsref_link.asp
    var strArray = str.split('(',1);
    var first = strArray.shift();
    return(first.trim());
  };

  // Check if data posted is new submission or request for email confirmation.
  var isSubmission = eventInfo.parameter.formId == "doPost[2]";
  //var isSubmission = (eventInfo.parameter[id.expense.blob1] != void(0))

  var upLoad = { // Define a container object for the upload(s)
    getFolder: function (pathStr) {
      var path = pathStr.split('/');
      var folder = DriveApp.getFileById(Drv.script.get('docId')).getParents().next();// Reimbursements folder
      for( var i=0; i < path.length ; i++ ){
        var folders = folder.getFoldersByName(path[i]);
        folder = (folders.hasNext() ? folders.next() : folder.createFolder(path[i]));
      };
      return(folder);
    },
  };
  
  // Check if the upload is a valid file
  try{    
    upLoad.blob2 = eventInfo.parameter[id.expense.blob2].setContentTypeFromExtension();
    upLoad.mimeType2 = upLoad.blob2.getContentType();
  } catch (error){Logger.log("upLoad.blob2: MimeType: %s",error)};

  
  if(isSubmission) {
    upLoad.mimeType1 = null;
    try{    
      upLoad.blob1 = eventInfo.parameter[id.expense.blob1].setContentTypeFromExtension();
      upLoad.mimeType1 = upLoad.blob1.getContentType();
    } catch (error){Logger.log("upLoad.blob1: MimeType: %s",error)}
    upLoad.valid1 = (upLoad.mimeType1 != null);
  } else {
    var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
    Logger.log("Remaining email quota: " + emailQuotaRemaining);

    // Send email confirmation to beneficiary and client
    form3sendMail(eventInfo);
    upLoad.valid1 = false;  // initialize this property, even in negative case
  };
  
  if(isSubmission && upLoad.valid1) {
    // Handle valid doPost() submissions from form: doPost[2] 
    
    // Get time-stamp and mutiple formats of it
    var dateValue = new Date();
    var yyyymmddHHmm = Utilities.formatDate(dateValue,Session.getScriptTimeZone(),"yyyy.MM.dd-HH:mm");
    var yyyymm = yyyymmddHHmm.substr(0,7); //    yyyymm = '2013.08';  // Hard-wire the month for testing
    var yyyy = yyyymm.substr(0,4);
    upLoad.path = ['Submissions/',yyyy,'/',yyyymm].join('');
    upLoad.folder = upLoad.getFolder(upLoad.path);
    var memberName = eventInfo.parameter['bName'];
    var sessionIndex = eventInfo.parameter['nSubm'];
    
    // Set boolean indicators for extra file uploads
    upLoad.mimeType2 = null;
    upLoad.mimeType3 = null;
    try{    
      upLoad.blob2 = eventInfo.parameter[id.expense.blob2].setContentTypeFromExtension();
      upLoad.mimeType2 = upLoad.blob2.getContentType(); //  Logger.log("getSubmission: mimeType2 = %s", upLoad.mimeType2);
    } catch (error){Logger.log("upLoad.blob2: MimeType: %s",error)}
    try{   
      upLoad.blob3 = eventInfo.parameter[id.expense.blob3].setContentTypeFromExtension();
      upLoad.mimeType3 = upLoad.blob3.getContentType();  //  Logger.log("getSubmission: mimeType3 = %s", upLoad.mimeType3);
    } catch (error){Logger.log("upLoad.blob3: MimeType: %s",error)}
    upLoad.valid2 = (upLoad.mimeType2 != null);
    upLoad.valid3 = (upLoad.mimeType3 != null);
    
    // Proocess the first upload
    upLoad.file1 = upLoad.folder.createFile(upLoad.blob1); // Add blob to folder
    upLoad.fileName1 = upLoad.file1.getName(); 
    upLoad.fileExtension1 = upLoad.fileName1.split('.').pop();
    //-----------------------------------------------------------------------------------------------
    // Migrate from DocsList File object's rename() method to DriveApp File object's setName() method.    
    //   upLoad.file1.rename(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+(upLoad.valid2||upLoad.valid3?'a':'')+'].'+upLoad.fileExtension1);
    //-----------------------------------------------------------------------------------------------
    upLoad.file1.setName(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+(upLoad.valid2||upLoad.valid3?'a':'')+'].'+upLoad.fileExtension1);
    upLoad.fileName1 = upLoad.file1.getName();
    // Get URL in G-drive -- OBS! Enable advanced services in Resources menu & developers console!
    // https://developers.google.com/apps-script/advanced/url-shortener
    // https://developers.google.com/apps-script/guides/services/advanced?hl=es#enabling_advanced_services
    // https://console.developers.google.com/project
    upLoad.url1 = UrlShortener.Url.insert({longUrl: upLoad.file1.getUrl()});  //    Logger.log('Shortened URL is "%s".', upLoad.url1.id);
    upLoad.hyperLink1 = '=HYPERLINK("'+upLoad.url1.id+'","'+upLoad.fileExtension1+'")';

    // If there is a second file upload, process it.
    if(upLoad.valid2) {
      upLoad.file2 = upLoad.folder.createFile(upLoad.blob2); // Add blob to folder
      upLoad.fileName2 = upLoad.file2.getName(); 
      upLoad.fileExtension2 = upLoad.fileName2.split('.').pop();
      //-----------------------------------------------------------------------------------------------
      // Migrate from DocsList File object's rename() method to DriveApp File object's setName() method.    
      //   upLoad.file2.rename(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+'b].'+upLoad.fileExtension2);
      //-----------------------------------------------------------------------------------------------
      upLoad.file2.setName(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+'b].'+upLoad.fileExtension2);
      upLoad.fileName2 = upLoad.file2.getName();
      upLoad.url2 = UrlShortener.Url.insert({longUrl: upLoad.file2.getUrl()});
      upLoad.hyperLink2 = '=HYPERLINK("'+upLoad.url2.id+'","'+upLoad.fileExtension2+'")';
    } else {upLoad.hyperLink2 = ''};

    // If there is a third file upload, process it.    
    if(upLoad.valid3) {
      upLoad.file3 = upLoad.folder.createFile(upLoad.blob3); // Add blob to folder
      upLoad.fileName3 = upLoad.file3.getName(); 
      upLoad.fileExtension3 = upLoad.fileName3.split('.').pop();
      //-----------------------------------------------------------------------------------------------
      // Migrate from DocsList File object's rename() method to DriveApp File object's setName() method.    
      //   upLoad.file3.rename(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+'c].'+upLoad.fileExtension3);
      //-----------------------------------------------------------------------------------------------
      upLoad.file3.setName(yyyymmddHHmm+'-'+memberName.replace(/ /g,'.')+'.['+sessionIndex+'c].'+upLoad.fileExtension3);
      upLoad.fileName3 = upLoad.file3.getName();
      upLoad.url3 = UrlShortener.Url.insert({longUrl: upLoad.file3.getUrl()});
      upLoad.hyperLink3 = '=HYPERLINK("'+upLoad.url3.id+'","'+upLoad.fileExtension3+'")';
    } else {upLoad.hyperLink3 = ''};

    // Read row of client data
    // Remember that while a range index starts at 1, 1, the JavaScript array will be indexed from [0][0]
    var idx = eventInfo.parameter.idxCli; // Index of client in the worksheet (values in column A)
    var sheet1 = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName(Wbk.tabNames[0])
    var range1 = sheet1.getRange(parseInt(idx,10)+1,2,1,(sheet1.getLastColumn()-1));
    var rowObj = range1.getValues(); // gets a single row object[][]
    var clientData = rowObj[0];
    
    // Write augmented data to submissions worksheet
    var workBk = SpreadsheetApp.openById(Drv.script.get('docId'));
    var sheet2 = workBk.getSheetByName(Wbk.tabNames[1]);
    var m = 1 + sheet2.getLastRow();
    
    var parsePotentiallyGroupedFloat = function(stringValue) { // http://stackoverflow.com/questions/7431833/convert-string-with-dot-or-comma-as-decimal-separator-to-number-in-javascript
      stringValue = stringValue.trim();
      var result = stringValue.replace(/[^0-9]/g, ''); // http://www.w3schools.com/jsref/jsref_obj_regexp.asp
      if (/[,\.]\d{1}$/.test(stringValue)) result = result.replace(/(\d{1})$/, '.$1'); else // if d.d  or d,d
      if (/[,\.]\d{2}$/.test(stringValue)) result = result.replace(/(\d{2})$/, '.$1');      // if d.dd or d,dd
      return parseFloat(result);
    };
    var currency = eventInfo.parameter[id.invoice.curr].toUpperCase();
    // Assemble row contents to append to the workbook (cf. http://jsperf.com/multi-array-concat/7)
    
    var strHistoricalFX = function(arg) { // Historical FX rate - NA() if GoogleFinance error
      var CUR = arg.toUpperCase();
      return(
        ['=if(Indirect(Address(ROW(),63),true)="', CUR, '",1,iferror(index(',
         'iferror(',
         'GoogleFinance("', CUR, '"&Upper(Indirect(Address(ROW(),63),true)),"price",Indirect(Address(ROW(),62),true)),', // invoice date
         'iferror(',
         'GoogleFinance("', CUR, '"&Upper(Indirect(Address(ROW(),63),true)),"price",(Indirect(Address(ROW(),62),true)-1)),', // minus 1 day
         'iferror(',
         'GoogleFinance("', CUR, '"&Upper(Indirect(Address(ROW(),63),true)),"price",(Indirect(Address(ROW(),62),true)-2)),', // minus 2 days
         'GoogleFinance("', CUR, '"&Upper(Indirect(Address(ROW(),63),true)),"price",now())',  // If all else fails try the current date
         ')))',
         ',2,2),na()))'].join('')); // If GoogleFinance() is down, return NA() to signal problem.
    };
    var a1 = [dateValue,             // A: Submission time-stamp
              'submitted',           // B: Status
              '',                    // C: Audit Team's time-stamp
              '',                    // D: Audit Team's comments
              '',                    // E: Transfer TimeStamp
              '',                    // F: Transfer Date
              '',                    // G: Transfer Amount
              '=round(Indirect(Address(ROW(),64),true)/Indirect(Address(ROW(),9),true),2)', // H: Line Item Amount EUR
              strHistoricalFX("EUR"),// I: Line item Cambio (to base currency)
              '',                    // J: Transfer notes
              '',                    // K: Link to Voucher PDF
              '',                    // L: District Gov's time-stamp
              '',                    // M: District Gov's comments
              '=Indirect(Address(ROW(),19),true)', // N: Link to LG's Account Label   '=S'+m,
              '=Indirect(Address(ROW(),20),true)', // O: Link to LG's Reporting Code  '=T'+m,  
              '',                    // P: Lt.Gov's time-stamp
              '',                    // Q: Lt. Gov.
              '',                    // R: Lt.Gov's comments
              '=Indirect(Address(ROW(),23),true)', // S: Link to TR's Account Label  '=W'+m,  
              '=Indirect(Address(ROW(),24),true)', // T: Link to TR's Reporting Code '=X'+m
              '',                    // U: Treasurer time-stamp
              '',                    // V: Treasurer's comments =OR(AC2="DG",AC2="TR",BL2<500*BM2)
              '',                    // W: Account Label
              '',                    // X: Reporting Code
              '=Indirect(Address(ROW(),60),true)', // Y: Event Period '=BH' + m
              upLoad.hyperLink1,     // Z: Uploaded Doc1
              upLoad.hyperLink2,     // AA: Uploaded Doc2
              upLoad.hyperLink3],    // AB: Uploaded Doc3
        a2 = clientData,             // AC-AV: Client data (20 columns)
        a3 = [eventInfo.parameter.bName, // Submission data (23 columns) AW
              eventInfo.parameter.bMail, // AX 
              eventInfo.parameter.bAddr, // AY
              eventInfo.parameter.bAdd2, // AZ
              eventInfo.parameter.bCity, // BA
              eventInfo.parameter.bCode, // BB
              eventInfo.parameter.bLand, // BC
              eventInfo.parameter.bIBAN, // BD
              eventInfo.parameter.bBICS, // BE
              eventInfo.parameter.bBANK, // BF
              eventInfo.parameter.bBADR, // BG
              eventInfo.parameter[id.event.date], // BH
              trimInfo(eventInfo.parameter[id.event.type]), // BI
              eventInfo.parameter[id.invoice.date], // BJ
              currency, // BK
              parsePotentiallyGroupedFloat(eventInfo.parameter[id.invoice.valu]), // Parse the input value into floating-point
              strHistoricalFX("USD"), // BM
              eventInfo.parameter[id.expense.desc], // BN
              trimInfo(eventInfo.parameter[id.expense.type])], // BO
        a4 = [(Svc.get.str(eventInfo.parameter[id.travel.mode]) === '' ? '' : trimInfo(eventInfo.parameter[id.travel.mode]))], // BP
        a5 = [(Svc.get.str(eventInfo.parameter[id.travel.dist]) === '' ? '' : eventInfo.parameter[id.travel.dist])], // BQ
        a6 = [(Svc.get.str(eventInfo.parameter[id.travel.gmap]) === '' ? '' : eventInfo.parameter[id.travel.gmap])]; // BR

    var rowContents = Array.prototype.concat.apply([], [a1, a2, a3, a4, a5, a6]); // http://jsperf.com/multi-array-concat/7
    
    sheet2.appendRow(rowContents); // Append the data as a new row
    var nLastRow = sheet2.getLastRow();
    sheet2.getRange(nLastRow, 1,1,1).setNumberFormat('dd"-"mmm"-"yy'); // Submissions!A, Submission date
    sheet2.getRange(nLastRow,60,1,1).setNumberFormat('dd"-"mmm"-"yy'); // Submissions!BH, Event date
    sheet2.getRange(nLastRow,62,1,1).setNumberFormat('dd"-"mmm"-"yy'); // Submissions!BJ, Invoice date
    var formatFX = (currency==="EUR" ? '#,##0.0 [$€/€]' : ['#,##0.00000 [$',currency,'/€]'].join(''));
    sheet2.getRange(nLastRow, 9,1,1).setNumberFormat(formatFX);        // Submissions!I, Line Item Cambio
  };
  
  var Body = ui.createVerticalPanel();
  var Form = ui.createFormPanel().setId((n>0?'doPost[':'doGet[')+n+']').setStyleAttributes(css.form2).add(Body);

  // Increment the ID stored in a hidden text-box
  var state = ui.createTextBox().setId('state').setName('state').setValue(1+n).setVisible(sw.state).setEnabled(false);

  // Increment the number of submissions if this is not a send-mail request
  var nSubm = ui.createTextBox().setId('nSubm').setName('nSubm').setEnabled(true);
  nSubm.setValue(''+((isSubmission && upLoad.valid1?1:0)+parseInt(eventInfo.parameter.nSubm)));

  // Define hidden data using text-boxes in a hidden panel
  var hidden = ui.createVerticalPanel().setVisible(false)
    .add(ui.createTextBox().setId('idxCli').setName('idxCli').setText(eventInfo.parameter.idxCli))
    .add(ui.createTextBox().setId('TInumb').setName('TInumb').setText(eventInfo.parameter.TInumb))
    .add(ui.createTextBox().setId('TIclub').setName('TIclub').setText(eventInfo.parameter.TIclub))
    .add(ui.createTextBox().setId('TImail').setName('TImail').setText(eventInfo.parameter.TImail))
    .add(ui.createTextBox().setId('TIoffc').setName('TIoffc').setText(eventInfo.parameter.TIoffc))
    .add(ui.createTextBox().setId('TIclnm').setName('TIclnm').setText(eventInfo.parameter.TIclnm))  
    .add(ui.createTextBox().setId('bName' ).setName('bName' ).setText(eventInfo.parameter.bName) )
    .add(ui.createTextBox().setId('bMail' ).setName('bMail' ).setText(eventInfo.parameter.bMail) )
    .add(ui.createTextBox().setId('bAddr' ).setName('bAddr' ).setText(eventInfo.parameter.bAddr) )
    .add(ui.createTextBox().setId('bAdd2' ).setName('bAdd2' ).setText(eventInfo.parameter.bAdd2) )
    .add(ui.createTextBox().setId('bCity' ).setName('bCity' ).setText(eventInfo.parameter.bCity) )
    .add(ui.createTextBox().setId('bCode' ).setName('bCode' ).setText(eventInfo.parameter.bCode) )
    .add(ui.createTextBox().setId('bLand' ).setName('bLand' ).setText(eventInfo.parameter.bLand) )
    .add(ui.createTextBox().setId('bIBAN' ).setName('bIBAN' ).setText(eventInfo.parameter.bIBAN) )
    .add(ui.createTextBox().setId('bBICS' ).setName('bBICS' ).setText(eventInfo.parameter.bBICS) )
    .add(ui.createTextBox().setId('bBANK' ).setName('bBANK' ).setText(eventInfo.parameter.bBANK) )
    .add(ui.createTextBox().setId('bBADR' ).setName('bBADR' ).setText(eventInfo.parameter.bBADR) );
  hidden.add(ui.createTextBox().setName(id.event.date).setText(eventInfo.parameter[id.event.date]));
  hidden.add(ui.createTextBox().setName(id.event.type).setText(eventInfo.parameter[id.event.type]));
  hidden.add(ui.createTextBox().setName(id.invoice.date).setText(eventInfo.parameter[id.invoice.date]));
  hidden.add(ui.createTextBox().setName(id.invoice.curr).setText(eventInfo.parameter[id.invoice.curr]));
  hidden.add(ui.createTextBox().setName(id.invoice.valu).setText(eventInfo.parameter[id.invoice.valu]));
  hidden.add(ui.createTextBox().setName(id.expense.desc).setText(eventInfo.parameter[id.expense.desc]));
  hidden.add(ui.createTextBox().setName(id.expense.type).setText(eventInfo.parameter[id.expense.type]));
  if(eventInfo.parameter[id.travel.mode] != void(0) && eventInfo.parameter[id.travel.mode] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.mode).setText(eventInfo.parameter[id.travel.mode]));
  }
  if(eventInfo.parameter[id.travel.dist] != void(0) && eventInfo.parameter[id.travel.dist] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.dist).setText(eventInfo.parameter[id.travel.dist]));
  }
  if(eventInfo.parameter[id.travel.gmap] != void(0) && eventInfo.parameter[id.travel.gmap] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.gmap).setText(eventInfo.parameter[id.travel.gmap]));
  }
  hidden.add(nSubm);
  if(isSubmission && upLoad.valid1) {
    eventInfo.parameter[id.expense.url1] = upLoad.url1.id; // need this to run form3sendMail() at this stage
    hidden.add(ui.createTextBox().setName(id.expense.url1).setText(eventInfo.parameter[id.expense.url1]));
  }
  if(upLoad.valid2) {
    eventInfo.parameter[id.expense.url2] = upLoad.url2.id; // need this to run form3sendMail() at this stage
    hidden.add(ui.createTextBox().setName(id.expense.url2).setText(eventInfo.parameter[id.expense.url2]));
  }
  if(upLoad.valid3) {
    eventInfo.parameter[id.expense.url3] = upLoad.url3.id; // need this to run form3sendMail() at this stage
    hidden.add(ui.createTextBox().setName(id.expense.url3).setText(eventInfo.parameter[id.expense.url3]));
  }
  
  if(main.sendMailHack){
    form3sendMail(eventInfo);
  };
  
  var H1 = ui.createHTML().setStyleAttributes(css.h1);
  var H2 = ui.createHTML().setStyleAttributes(css.bodyText);
//H2.setHTML("<h2>"+(eventInfo.parameter.formId==void(0)?"":"Created by submission of form "+eventInfo.parameter.formId)+"</h2>");
  
  if(!isSubmission) {
    H1.setHTML(h1.form3c);
    H2.setHTML("<p></p><p>Confirmation message sent to both you and beneficiary.</p><p></p>");
  } else if(upLoad.valid1) {
    if(main.sendMailHack) {
      H1.setHTML(h1.form3a);
      H2.setHTML("<p></p><p>The submission and file upload suceeded. A confirmation E-mail was sent to both the beneficiary and yourself.</p><p></p><p>If you have more claims to enter, go back and add more line items. </p><p>In the future we will try to aggregate your session's line item submissions, allowing you to send this confirmation as just one summary E-mail message. </p><p></p>");
    } else {
      H1.setHTML(h1.form3a);
      H2.setHTML("<p></p><p>The submission and file upload suceeded. For your records, send an E-mail message as confirmation for each line item submission. Then, if you have more claims to enter, go back and add more line items. </p><p>In the future we will try to aggregate your session's line item submissions, allowing you to send this confirmation as just one summary E-mail message. </p><p></p>");
    };
  } else {
    H1.setHTML(h1.form3b);
    H2.setHTML('<p></p><p>An error occured with your submission and file upload. Please go back and resubmit your data.  The file must have an extension of any image type or PDF!</p><p>Visit <I>www.SmallPDF.com/merge-pdf</i> for help to convert images to PDF.</p><p></p>');
  }
  var grid = ui.createGrid(9, 3).setVisible(false);
  

  // Add four submit buttons to go forward, backward, to stay/validate and to exit the form
  var Btn = {};
  Btn.Next = ui.createSubmitButton("Next").setEnabled(true).setVisible(false).setStyleAttributes(css.btn).setTitle(txt.exitToolTip);
  Btn.Back = ui.createSubmitButton(txt.Back.label3).setEnabled(n>1).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.exitToolTip);
  Btn.Stay = ui.createSubmitButton(txt.Stay.label3).setEnabled(n>0).setVisible(isSubmission && upLoad.valid1 && !main.sendMailHack).setStyleAttributes(css.btn).setTitle(txt.exitToolTip);
  Btn.Exit = ui.createSubmitButton(txt.Exit.label3).setEnabled(n>0).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.Exit.enabled3);
  Btn.onFormSubmit= ui.createHTML().setId(id.onFormSubmit).setHTML(html.pleaseWait).setVisible(false);
  var Buttons = ui.createHorizontalPanel().add(Btn.Back).add(Btn.Stay).add(Btn.Next).add(Btn.Exit)
    .add(Btn.onFormSubmit).setCellVerticalAlignment(Btn.onFormSubmit,enm.valign)
  //.add(Btn.stat)//.add(Btn.Rset);

  Body.add(state).add(hidden).add(H1).add(H2).add(grid).add(Buttons);
  if (main.cache.get('debug')=='parameters'){Body.add(main.getParameters(eventInfo))};

  // Add client handlers using setText() to adjust state prior to form submission
  // NB: Use of the .setValue(val) and .setValue(val,bool) methods give runtime errors!
  Btn.Stay.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n))).forTargets(Btn.onFormSubmit).setHTML(html.onFormSubmit3));
  Btn.Back.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n)-1)));
  Btn.Exit.addClickHandler(ui.createClientHandler().forTargets(state).setText('-1'));
  
  // Add an event handler executed prior to form submission
  var onFormSubmit = ui.createClientHandler()
  .forTargets(Btn.Next,Btn.Back,Btn.Stay,Btn.Exit).setEnabled(false)
  .forTargets(Btn.onFormSubmit).setVisible(true)
  .forTargets(state).setEnabled(true) // Enable so value gets included in post parameters
  .forTargets(Body).setStyleAttributes(css.onFormSubmit);    
  Form.addSubmitHandler(onFormSubmit);
  
  return Form;
}; // end getSubmission()
