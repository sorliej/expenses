//----------------------------------------------------------------------------
// WebApp context
//----------------------------------------------------------------------------
var Svc = {
  args: {
    macros: ['sort', // 0
             'all',  // 1
             'yes',  // 2 
             'nej',  // 3
             'vchr', // 4
             'edit', // 5
             'copy' ],//6
    orders: ['date',
             'wkfl',
             'name',
             'stat' ],
  }, // end Svc.args object
  //----------------------------------------------------------------------------
  // WebApp helper functions
  //----------------------------------------------------------------------------
  get: {
    webAppID: function() {
      var svc = ScriptApp.getService();
      return( svc.isEnabled() ? svc.getUrl().split("/")[5] : "unpublished" );
    }, // end Svc.get.webAppID()
    
    webAppURL: function() {
      var svc = ScriptApp.getService();
      return( svc.isEnabled() ? svc.getUrl() : "unpublished" );
    }, // end Svc.get.webAppURL()
    
    str: function(obj) {
      var str;
      try { str = obj.toString() }
      catch (error) { str = ''   }
      return (str);
    }, // end Svc.get.str()
  }, // end Svc.get object
  sendMail: {
    createHTMLDraftInGmail: function (fromAddr,toAddr,ccAddr,bccAddr,subj,htmlBody) {
      //----------------------------------------------------------------------------
      // Gmail API -- OBS! Enable advanced services in Resources menu & developers console!
      // THis is a work around to save messages as drafts whenever the daily quota of 100 messages is exceeded.
      // Inspiration:
      // https://developers.google.com/apps-script/guides/services/quotas
      // http://ctrlq.org/code/19832-save-gmail-draft-with-google-apps-script
      // http://stackoverflow.com/questions/25391740/how-to-use-the-google-apps-script-code-for-creating-a-draft-email-from-985
      var forScope = GmailApp.getInboxUnreadCount(); // needed for auth scope
      var raw = ['From: ', fromAddr, '\r\n',
                 'To: ', toAddr, '\r\n',
                 'CC: ', ccAddr, '\r\n',
                 'BCC: ', bccAddr, '\r\n',
                 'Subject: ',subj, '\r\n',
                 'Content-Type: text/html; charset=UTF-8\r\n',
                 '\r\n',
                 htmlBody].join('');
      var draftBody = Utilities.base64Encode(raw, Utilities.Charset.UTF_8).replace(/\//g,'_').replace(/\+/g,'-');
      var params = {
        method      : "post",
        contentType : "application/json",
        headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
        muteHttpExceptions:true,
        payload:JSON.stringify({
          "message": {
            "raw": draftBody
          }
        })
      };
      var resp = UrlFetchApp.fetch("https://www.googleapis.com/gmail/v1/users/me/drafts", params);
      Logger.log(resp.getContentText());
    }, // end Svc.sendMail.createHTMLDraftInGmail()
  }, // end Svc.sendMail object
  //----------------------------------------------------------------------------
  // WebApp interface: Content Service
  //----------------------------------------------------------------------------
  doGet: function(request) {
    //----------------------------------------------------------------------------
    var getArgs = function(request){
      var strArr =  ['']; // Start with an array of strings
      for( var p in request.parameters) {strArr.push(p,"=",request.parameters[p],'&')};
      return(strArr.join('')); // Finish with the string itself
    };
    //----------------------------------------------------------------------------
    var validate = function(request){
      var idxMc    = Svc.args.macros.indexOf(Svc.get.str(request.parameters.mc)),
          idxOrder = Svc.args.orders.indexOf(Svc.get.str(request.parameters.order)),
          idxSh    = Wbk.tabNames.slice(1,7).concat(["Rejected"]).indexOf(Svc.get.str(request.parameters.sh)),
          idxRow   = (parseInt(request.parameters.row,10) || 0),
          idxUsr   = Wbk.eMail.workflow.indexOf((Svc.get.str(request.parameters.usr) === "" ? "na" : Svc.get.str(request.parameters.usr)));
      if (idxUsr == -1 && 0 < idxMc && idxMc < 5) {return(-2)}; // Error if NOT( sort || edit || fldr ) -- Sort users not in workflow  incorrect on workbook loading
      if((idxSh < 0 || idxSh > 6) && (idxMc < 4)) {return(-3)};
//    if (idxMc == -1) {return(-4)};
      if (idxMc == 6 && (idxSh != 0 || !(idxRow > 1) || !(idxUsr == 1 || idxUsr ==  9 || idxUsr == 10))) {return(-4)};
      if (idxOrder == -1 && idxMc == 0) {return(-5)}; // doAuth & doVoucher do not use the order arg
      if(0 < idxMc && idxMc < 4) { // Note: idxSh is shifted 1 row down relative to Properties!
        if(idxSh == 0 && (idxUsr == 1 || idxUsr ==  9 || idxUsr == 10)) return (0);
        if(idxSh == 1 && (idxUsr == 11 || idxUsr == 12)               ) return (0);
        if(idxSh == 2 && (idxUsr == 3)                                ) return (0);
        if(idxSh == 3 && (idxUsr == 1 || idxUsr ==  9 || idxUsr == 10)) return (0);
        if(idxSh == 4 && (idxUsr == 5 || idxUsr ==  6 || idxUsr == 7 )) return (0);
        if(0 <= idxSh && idxSh < 5)                                    return (-6); // not authorized
        else                                                           return (-7); // not relevant for sheet
      };
      return(0);
    }; // end validate()
    //----------------------------------------------------------------------------
    request.args = getArgs(request);  // Get string of request args
    request.code = validate(request); // Validate input args
    if( request.code < 0) { // If input args invalid, return error code
      return ContentService.createTextOutput(['error code: ', request.code,
                                              ' args:  ',     request.args].join('') );
    };
    // Switch execution to one of the macros
    var msgStr = "undefined,";
    switch(Svc.args.macros.indexOf(Svc.get.str(request.parameters.mc))) {
      case 0: { msgStr = Svc.sort.exec(request) }; break; // sort
      case 4: { msgStr = Svc.vchr.exec(request) }; break; // vchr
      case 5: { msgStr = Svc.show.exec(request) }; break; // edit
      case 6: { msgStr = Svc.copy.exec(request) }; break; // fldr->copy
      default:{ msgStr = Svc.auth.exec(request) }; break; // auth
    };
    // Return string of invocation args 
    return( ContentService.createTextOutput(['args: ', request.args, ', msg: ',msgStr].join('')));
  },// end Svc.doGet()
  //----------------------------------------------------------------------------
  // WebApp services
  //----------------------------------------------------------------------------
  copy: {
    exec: function(request) {
      var ss  = Drv.ss(),
          sh  = Svc.get.str(request.parameters.sh),
          row = Svc.get.str(request.parameters.row),
          sheet = Drv.ss().getSheetByName(sh).insertRowAfter(row),
          rowToCopy = sheet.getRange(row, 1, 1, sheet.getLastColumn());
      try {
        rowToCopy.copyTo(rowToCopy.offset(1,0));
        return("1 row duplicated");
      } catch(error) { 
        return("Error: 0 rows duplicated");
      };
    }, // end Svc.copy.exec()
  }, // end Svc.copy object
  show: {
    //----------------------------------------------------------------------------
    // Query setup information
    //----------------------------------------------------------------------------
    exec: function(request) {
      var strArr = [],
          macro  = Svc.get.str(request.parameters.mc),
          ss     = Drv.ss(); // var workBookId = Drv.script.get('docId'); //Svc.get.str(request.parameters.wb);
      if(macro === 'fldr') {
        try          { strArr.push(DriveApp.getFileById(ss.getId()).getParents().next().getId()) }
        catch(error) { strArr.push("Drive error")};
      } else {
        var sheetName  = Svc.get.str(request.parameters.sh),
            sheet = ss.getSheetByName(sheetName),
            owner = ss.getOwner().getEmail().toLowerCase(),
            sheetProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
        for(var i = 0; i < sheetProtections.length; i++) {
          var users = sheetProtections[i].getEditors(),
              nUsers = users.length;
          if(nUsers > 1) {
            for(var j = 0; j < nUsers; j++)
              if(users[j].getEmail() !== owner)
                strArr.push(users[j]);
          } else strArr.push(owner);
        };
      };
      return(strArr.sort().join('\n')); // Logger.log(strArray.join('\n'));
    }, // end Svc.show.exec()
  }, // end Svc.show object
  
  sort: {
    //----------------------------------------------------------------------------
    // Sort authorization queues
    //----------------------------------------------------------------------------
    exec: function(request) {
      var sort = {date: {column: 1, ascending: true},
                  wkfl: [{column: 3, ascending: true},{column: 5, ascending: true},{column: 12, ascending: true},{column: 16, ascending: true},{column: 21, ascending: true},{column: 1, ascending: true}],
                  name: [{column: 29, ascending: true},{column: 49, ascending: true},{column: 2, ascending: true},{column: 1, ascending: true}],
                  stat: [{column: 2, ascending: true},{column: 29, ascending: true},{column: 49, ascending: true},{column: 1, ascending: true}],
                 },
          sheet = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName(Svc.get.str(request.parameters.sh)),
          n0 = sheet.getLastRow();
      if( n0 > 1) {  // Check if there is anything in the queue to sort
        return([
          sheet.getRange(2,1,(n0 - 1),sheet.getLastColumn())
          .sort(sort[Svc.get.str(request.parameters.order)]).getHeight(),
          "lines sorted"].join(" "));
      } else {
        return("Zero lines to sort.");
      };
    }, // end Svc.sort.exec()
  }, // end Svc.sort object
  
  auth: {
    //----------------------------------------------------------------------------
    // Authorizations: Promote line items across workflow queues
    //----------------------------------------------------------------------------
    exec: function(request) {
      var sh  = Svc.get.str(request.parameters.sh),
          usr = Svc.get.str(request.parameters.usr),
          mc  = Svc.get.str(request.parameters.mc),
          msg = "undefined,";
      if     (mc === 'all') {var strArr = Svc.auth.proc(sh,usr,true,true);  msg = strArr.join(', ')  }
      else if(mc === 'yes') {var strArr = Svc.auth.proc(sh,usr,true,false); msg = strArr[0];}
      else if(mc === 'nej') {var strArr = Svc.auth.proc(sh,usr,false,true); msg = strArr[1];};
      return(msg);
    }, // end Svc.auth.exec()
    //----------------------------------------------------------------------------
    proc: function (sheetName,usr,doApproved,doRejected) { //function doAuths(sheetName,doApproved,doRejected)
      //----------------------------------------------------------------------------
      var doSendMail = {
        sent: [],
        transferConfirmation: function (amount,toAddr,ccAddr,formula) {// Send email confirmation to beneficiary and client
          var url2htm = function(url) {  //    http://www.w3schools.com/jsref/jsref_link.asp
            var strArray = url.split('"');
            return(strArray[3].link(strArray[1]));
          };
          var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
          var msg = {};
          msg.to   = toAddr;  // Client
          if(toAddr !== ccAddr) {
            msg.cc   = [ccAddr, ", ", district.mail.DD].join('');  // Beneficiary in CC
          } else {
            msg.cc   = district.mail.DD;
          };
          msg.repl = district.mail.FM;
          msg.bcc  = district.mail.FM;
          msg.subj = "District " + Drv.script.get('district') + " Reimbursements: Confirmation of transfer";
          
          // https://developers.google.com/speed/articles/optimizing-javascript
          msg.body = ["<p>This message serves to confirm transfer today of ",
                      Utilities.formatString('%.2f', parseFloat(amount)),
                      " Euro to the account you indicated in your recent expense submissions (",
                      url2htm(formula),
                      "). If you do not receive the transfer within a week, please contact me.</p>",
                      "<p></p>",
                      "<p></p>",
                      "<p>TM Cheers!</p>"
                     ].join('');
          msg.signature = ['<table boder=none style="font-family:Verdana; font-size:10pt"><tr>',
                           '<td rowspan="3"><img src="http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/4BDB0DB436004830BA1DB7780BC6B3A0.ashx" alt="TM Logo" height="55">&#160;&nbsp;</td>',
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
                //        bcc: msg.bcc,  
                htmlBody: (msg.body+msg.signature)
              }
            );
          } else Svc.sendMail.createHTMLDraftInGmail(msg.repl,msg.to,msg.cc,msg.bcc,msg.subj,msg.htmlBody);
        }, // end transferConfirmation()
      }; // end doSendMail object
      //----------------------------------------------------------------------------
      var sheetNames = Wbk.tabNames,
          officer    = sheetNames[Wbk.eMail.workflow.indexOf(usr)],
          ss         = SpreadsheetApp.openById(Drv.script.get('docId')),
          idxQ       = sheetNames.indexOf(sheetName),
          regExp     = new RegExp('^=HYPERLINK', 'i'),
          now        = new Date(),
          nApproved  = 0,
          nRejected  = 0;
      if(idxQ == 4/*BT*/) {
        district.init();
      };
      var idxQ1 = idxQ + (idxQ == 1 ? 2 : 1); // Define promotion logic
      var idxQ2 = idxQ + 1; // DG approval required for all cases
      var sheetName1 = sheetNames[idxQ1],
          sheetName2 = sheetNames[idxQ2], // Logger.log("sheetName1: %s, sheetName2; %s", sheetName1, sheetName2);
          sheet = {
            submissions: ss.getSheetByName(sheetNames[idxQ]),
            rejected:    ss.getSheetByName("Rejected"),
            promote1:    ss.getSheetByName(sheetNames[idxQ1]),
            promote2:    ss.getSheetByName(sheetNames[idxQ2]),
          },
          rangeAll = sheet.submissions.getDataRange().offset(1,0,(sheet.submissions.getLastRow() - 1)), // account for a single header row
          notes    = rangeAll.getNotes(),               // String[][]  //  Logger.log("notes %s", notes);
          values   = rangeAll.getValues(),              // Object[][]
          formulas = rangeAll.getFormulas(),            // String[][]  //  Logger.log("formulas %s", formulas);
          wraps    = rangeAll.getWraps(),               // Boolean[][]
          formats  = rangeAll.getNumberFormats(),       // String[][]
          nColumns = sheet.submissions.getLastColumn(); // Integer
      
      for(var row in values) { // for(var row=0; row<values.length; row++) {
        var rowI = parseInt(row,10);
        //----------------------------------------------------------------------------
        if(doApproved &&
           values[row][Wbk.aI['ST'][sheetName]] === 'ok' &&
           values[row][Wbk.aI['CM'][sheetName]] !== ''   &&  // Comment is not blank
           values[row][Wbk.aI['AL'][sheetName]] !== ''   &&  // Account Label is not blank
           values[row][Wbk.aI['RC'][sheetName]] !== ''   &&  // Reporting Code is not blank
           values[row][Wbk.aI['EM'][sheetName]] !== ''   &&   // Event Month is not blank
           (idxQ != 2 || values[row][Wbk.aI['OF'][sheetName]] !== officer) &&  // VD cannot authorize themselves
           (idxQ != 4 || values[row][Wbk.aI['LK'][sheetName]] !== '')) // Voucher link is not blank in BT(4)
        {
          nApproved += 1;
          // Define a boolean value for line items to be promoted to District Governor
          // Sumbissions >$500 or by DG, or by TR require LG approval (cf. De Morgan's law)
          var currency = values[row][Wbk.aI['CR'][sheetName]],
              fx = values[row][Wbk.aI['FX'][sheetName]],
              value = parseFloat( values[row][Wbk.aI['VL'][sheetName]] ),
              isBelow500USD = ((currency === 'USD' && value < 500.0) || (value < fx*500.0));
          var office = values[row][Wbk.aI['OF'][sheetName]],
              rowIs4DG = (isBelow500USD && office !== sheetNames[3]/*DD*/ && office.substr(0,2) !== sheetNames[1]/*FM*/);
          // Set the time stamp and value (strip any locale dependent format and formulated double quotes)
          values[row][Wbk.aI['TS'][sheetName]] = now;
          values[row][Wbk.aI['VL'][sheetName]] = value;
          // Copy OK'd line items to the DG or LG depending on who submitted the line item
          values[row][Wbk.aI['ST'][sheetName]] = 'submitted';              // Reset status copied to DG/LG
          if(rowIs4DG) sheet.promote1.appendRow(values[row]); // DG submissions
          else         sheet.promote2.appendRow(values[row]); // LG submissions
          // Copy formulas and notes as well
          var range1 = rangeAll.offset(rowI, 0, 1, nColumns),      // submissions
              range5 = sheet.promote1.getRange(sheet.promote1.getLastRow(),1, 1, nColumns), // DG submissions
              range6 = sheet.promote2.getRange(sheet.promote2.getLastRow(),1, 1, nColumns); // LG submissions
          if(sheetName === sheetNames[1]/*FM*/ ||
             sheetName === sheetNames[2]/*VD*/) {
            if(rowIs4DG){
              notes[row][Wbk.aI.AL[sheetName1]] = notes[row][Wbk.aI.AL[sheetName]];
              notes[row][Wbk.aI.RC[sheetName1]] = notes[row][Wbk.aI.RC[sheetName]];
            } else {
              notes[row][Wbk.aI.AL[sheetName2]] = notes[row][Wbk.aI.AL[sheetName]];
              notes[row][Wbk.aI.RC[sheetName2]] = notes[row][Wbk.aI.RC[sheetName]];
            };
          };
          for(var col in notes[row])
            if(notes[row][col] !== '' && notes[row][col] !== ' ') {
              var n = 1 + parseInt(col,10); // Logger.log("col: " + col.toString() + ", n: " + n.toString()  + ", notes[][]:" + notes[row][col] + "::");
              if(rowIs4DG) {
                range5.getCell(1,n).setNote(notes[row][col]);  // DG submissions
              } else {
                range6.getCell(1,n).setNote(notes[row][col]); // LG submissions
              };
            };
          for(var col in formulas[row])
            if(regExp.test(formulas[row][col])) {//      if(formulas[row][col] !== '') {
              var n = 1 + parseInt(col,10);
              if(rowIs4DG) {
                range5.getCell(1,n).setFormula(formulas[row][col]); // DG submissions
              } else {
                range6.getCell(1,n).setFormula(formulas[row][col]); // LG submissions
              };
            };
          if(rowIs4DG) range5.setNumberFormats([formats[row]]).setWraps([wraps[row]]); // DG submissions
          else         range6.setNumberFormats([formats[row]]).setWraps([wraps[row]]); // LG submissions
          // Clear the OK'd line item from the submissions sheet
          sheet.submissions.insertRowAfter((2+rowI)).deleteRow((2+rowI)); // range1.clearContent().clearNote().clear({commentsOnly: true});
          if(sheetName === sheetNames[3]/*DD*/) { // Set formulas in BT columns F:G for this row
            range5.getCell(1,6).setFormula("=today()");
            range5.getCell(1,7).setFormula("=SUMPRODUCT($H$2:H,$AW$2:$AW=Indirect(Address(ROW(),49),true))");
          };
          if(sheetName === sheetNames[4]/*BT*/) { // If doing Bank Transnfers, send one mail for each beneficiary
            var bfName = values[row][Wbk.aI['BF'][sheetName]],
                idxBf = doSendMail.sent.lastIndexOf(bfName); // Check to see if the beneficiary name (BF) has already been sent a message
            if( idxBf == -1) { // if not, then send a transfer confirmation message
              doSendMail.sent.push(bfName); // push the bfName at the end of the array
              var amount = values[row][6],
                  ccAddr = values[row][41], // District Officer
                  toAddr = values[row][49], // Beneficiary
                  link = formulas[row][10];
              doSendMail.transferConfirmation(amount,toAddr,ccAddr,link);
            };
          };
        }  // end of if status is ok'd
        //----------------------------------------------------------------------------
        else if(doRejected &&
                values[row][Wbk.aI['ST'][sheetName]] === 'rejected' &&
                values[row][Wbk.aI['CM'][sheetName]] !== '') {         // Comment is not blank
          nRejected += 1;
          // Set the time stamp
          values[row][Wbk.aI['TS'][sheetName]] = now;
          // Copy rejected line items to local archived and rejected work sheets
          sheet.rejected.appendRow(values[row]); // reject
          var range1 = rangeAll.offset(rowI, 0, 1, nColumns),      // submissions
              range4 = sheet.rejected.getRange(sheet.rejected.getLastRow(),1, 1, nColumns); // reject
          for(var col in notes[row])
            if(notes[row][col] !== '' &&
               notes[row][col] !== ' ') {
              var n = 1 + parseInt(col,10);
              range4.getCell(1,n).setNote(notes[row][col]); // reject
            };
          for(var col in formulas[row])
            if(regExp.test(formulas[row][col])) {//      if(formulas[row][col] !== '') {
              var n = 1 + parseInt(col,10);
              range4.getCell(1,n).setFormula(formulas[row][col]); // reject
            };
          range4.setNumberFormats([formats[row]]).setWraps([wraps[row]]);
          // Clear the rejected line item from the submissions sheet
          sheet.submissions.insertRowAfter((2+rowI)).deleteRow((2+rowI)); // range1.clearContent().clearNote().clear({commentsOnly: true});
        }; // end of if status is rejected
      }; // end of for loop through submissions sheet
      var n0 = sheet.submissions.getLastRow(),
          n1 = Math.max(2,n0), // Always maintain queue with minimally one blank line below the header row
          n2 = sheet.submissions.getMaxRows() - n1; // number of blank lines to delete
      if( n0 > 1) // If there is anything in the queue, sort it by submission dates
        sheet.submissions.getDataRange().offset(1,0,(n0 - 1)).sort({column: 1, ascending: true});
      if(n2 > 0) // If there are any blank lines, delete them (leaving minimally one blank line).
        sheet.submissions.deleteRows( (1 + n1), n2 );
      return([[nApproved, 'approved'].join(' '),
              [nRejected, 'rejected'].join(' ')]);
    }, // end Svc.auth.proc()
  }, // end Svc.auth object
  
  vchr: {
    //----------------------------------------------------------------------------
    // Vouchers: Generate vouchers based on templates
    //----------------------------------------------------------------------------
    exec: function(request) { // fillTpl()
      var archive = {};
      var sheetNames = Wbk.tabNames,
          wbkId    = Drv.script.get('docId');
      //----------------------------------------------------------------------------
      var copyTpl = function(tplId,name){
        var getFolder = function(pathStr){
          Logger.log("folderId: "+Drv.script.get('folderId'));
          var folder = DriveApp.getFolderById(Drv.script.get('folderId')), // Reimbursements folder
              path = pathStr.split('/');
          for(var i =0; i < path.length ; i++ ){
            var folders = folder.getFoldersByName(path[i]);
            folder = (folders.hasNext() ? folders.next() : folder.createFolder(path[i]));
          };
          return(folder);
        }; // end getFolder()
        var dt = {val: new Date()};
        dt.yyyymmddHHmm = Utilities.formatDate(dt.val,Session.getScriptTimeZone(),"yyyy.MM.dd-HH:mm");
        dt.yyyymm       = dt.yyyymmddHHmm.substr(0,7);
        dt.yyyy         = dt.yyyymm.substr(0,4);
        var path = ['Vouchers/',dt.yyyy,'/',dt.yyyymm,'/auto'].join('');
//      archive.folder = getFolder(path);   // This may be broken ? (sets object outside the subroutine)
        var copy = DriveApp.getFileById(tplId).makeCopy(name,getFolder(path));
        return(copy);
      }; // end copyTpl()
      //----------------------------------------------------------------------------
      // Load the key-value pairs from the Tpl-sheet
      var sheet = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName('BT:Tpl'),
          values = sheet.getDataRange().getValues(),
          dt = new Date(),
          yyyymmdd = Utilities.formatDate(dt,Session.getScriptTimeZone(),"yyyy.MM.dd"),
          fileName = [yyyymmdd, '-', values[7][1]].join(''),
          tplId;
      if     (values[8][1] === sheetNames[11]) tplId = Drv.ss().getSheetByName("Properties").getRange('D13').getValue(); // PQD template ID
      else if(values[8][1] === sheetNames[12]) tplId = Drv.ss().getSheetByName("Properties").getRange('D14').getValue(); // CGD template ID
      else                                     tplId = Drv.ss().getSheetByName("Properties").getRange('D12').getValue(); // FM template ID
      var copy = copyTpl(tplId,fileName),           // Copy the appropriate template to the archive directory
          copyId = copy.getId(),
          doc = DocumentApp.openById(copyId),
          body = doc.getBody(),                     // Replace all the template key-words in the document's body
          folder = DriveApp.getFileById(copyId).getParents().next(); // Reimbursements folder
      for(var row in values)
        body.replaceText(values[row][0],value = values[row][1]);
      doc.saveAndClose();                           // Close the document and flush all pending updates
      var pdfFile = folder.createFile(copy.getAs('application/pdf'));// Convert the document to a PDF file
      pdfFile.setName([fileName,".pdf"].join(''));  // Set the voucher hyperlink in column K on the Submissions sheet
      var url = UrlShortener.Url.insert({longUrl: pdfFile.getUrl()}),
          link = ["=HYPERLINK(\"",url.id,"\",\"pdf\")"].join(''),
          colK = (parseInt(Wbk.aI['LK'][sheetNames[4]],10) + 1),
          rangeAll = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName(sheetNames[4]).getDataRange();
      rangeAll = rangeAll.offset(1,0,(rangeAll.getNumRows() - 1)); // account for a single header row
      var values   = rangeAll.getValues(); // Object[][]
      var nVLines = 0;
      for(var row in values)
        if(values[row][1] === 'voucher') {
          nVLines += 1;
          var rowI = 1 + parseInt(row,10);
          rangeAll.getCell(rowI,colK).setFormula(link);
        };
      return([nVLines, ' line items in voucher'].join(''));
    },// end Svc.vchr.exec()  == fillTpl()
  }, // end Svc.vchr object
}; // end of Svc object
