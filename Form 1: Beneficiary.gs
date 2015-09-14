function getBeneficiary(eventInfo,n,flag) {
  var ui = UiApp.getActiveApplication();
  var Body = ui.createVerticalPanel();
  var Form = ui.createFormPanel().setId((n>0?'doPost[':'doGet[')+n+']').setStyleAttributes(css.form1).add(Body);

  // Increment the ID stored in a hidden text-box
  var state = ui.createTextBox().setId('state').setName('state').setValue(1+n).setVisible(sw.state).setEnabled(true);
  var nSubm = ui.createTextBox().setId('nSubm').setName('nSubm').setValue(eventInfo.parameter.nSubm).setEnabled(true);
  
  var H1 = ui.createHTML(h1.form1).setStyleAttributes(css.h1);
  var grid = ui.createGrid(9, 3);
  
  // Get row data for the client
  var row = main.getClientData(eventInfo.parameter.TInumb,eventInfo.parameter.TIclub,eventInfo.parameter.TImail);
  Logger.log("getBeneficiary: Client ID = %s ", row[0]);
  
  // Define hidden data using text-boxes in a hidden panel
  var opt = (row[17]!=msg.required && row[18]!=msg.required && row[19]!=msg.required && row[20]!=msg.required);
  var optDt = ui.createTextBox().setId('optDt').setName('optDt').setValue(opt).setVisible(sw.state).setEnabled(true);
  var hidden = ui.createVerticalPanel().setVisible(false)
    .add(ui.createTextBox().setId('idxCli').setName('idxCli').setText(row[0]))  // Column A
    .add(ui.createTextBox().setId('TIoffc').setName('TIoffc').setText(row[1]))  // Column B
    .add(ui.createTextBox().setId('TIclub').setName('TIclub').setText(row[2]))  // Column C
    .add(ui.createTextBox().setId('TInumb').setName('TInumb').setText(row[3]))  // Column D
    .add(ui.createTextBox().setId('TImail').setName('TImail').setText(row[14])) // Column O
    .add(ui.createTextBox().setId('TIclnm').setName('TIclnm').setText(row[16])) // Column Q
    .add(optDt)
    .add(nSubm);
 
  // Add hidden TextBoxes for data from Form 2.
  // NB: Do not use .setId() method here with the ID's from Form 2! This causes a runtime error.
  //     But do specify .setName() method so the data is included in the doPost() payload.
  //     Cf.: https://developers.google.com/apps-script/guides/ui-service#Forms
//  var f2id = [id.event.date,
//             id.event.type,
//             id.invoice.date,
//             id.invoice.curr,
//             id.invoice.valu,
//             id.expense.desc,
//             id.expense.type,
//             id.travel.mode,
//             id.travel.dist,
//             id.travel.gmap ];
//  for( var s in f2id ) {
//    if(eventInfo.parameter[s] != void(0) ){//&& eventInfo.parameter[s] != "") {
//      // NB: Do not use .setId() method here with the ID's from Form 2! This causes a runtime error.
//      //     But do specify .setName() method so the data is included in the doPost() payload.
//      //     Cf.: https://developers.google.com/apps-script/guides/ui-service#Forms
//      hidden.add(ui.createTextBox().setName(s).setText(eventInfo.parameter[s]));
//    }
//  };
  if(eventInfo.parameter[id.event.date] != void(0) && eventInfo.parameter[id.event.date] != "") {
    hidden.add(ui.createTextBox().setName(id.event.date).setText(eventInfo.parameter[id.event.date]));
  }
  if(eventInfo.parameter[id.event.type] != void(0) && eventInfo.parameter[id.event.type] != "") {
    hidden.add(ui.createTextBox().setName(id.event.type).setText(eventInfo.parameter[id.event.type]));
  }
  if(eventInfo.parameter[id.invoice.date] != void(0) && eventInfo.parameter[id.invoice.date] != "") {
    hidden.add(ui.createTextBox().setName(id.invoice.date).setText(eventInfo.parameter[id.invoice.date]));
  }
  if(eventInfo.parameter[id.invoice.curr] != void(0) && eventInfo.parameter[id.invoice.curr] != "") {
    hidden.add(ui.createTextBox().setName(id.invoice.curr).setText(eventInfo.parameter[id.invoice.curr]));
  }
  if(eventInfo.parameter[id.invoice.valu] != void(0) && eventInfo.parameter[id.invoice.valu] != "") {
    hidden.add(ui.createTextBox().setName(id.invoice.valu).setText(eventInfo.parameter[id.invoice.valu]));
  }
  if(eventInfo.parameter[id.expense.desc] != void(0) && eventInfo.parameter[id.expense.desc] != "") {
    hidden.add(ui.createTextBox().setName(id.expense.desc).setText(eventInfo.parameter[id.expense.desc]));
  }
  if(eventInfo.parameter[id.expense.type] != void(0) && eventInfo.parameter[id.expense.type] != "") {
    hidden.add(ui.createTextBox().setName(id.expense.type).setText(eventInfo.parameter[id.expense.type]));
  }
  if(eventInfo.parameter[id.travel.mode] != void(0) && eventInfo.parameter[id.travel.mode] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.mode).setText(eventInfo.parameter[id.travel.mode]));
  }
  if(eventInfo.parameter[id.travel.dist] != void(0) && eventInfo.parameter[id.travel.dist] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.dist).setText(eventInfo.parameter[id.travel.dist]));
  }
  if(eventInfo.parameter[id.travel.gmap] != void(0) && eventInfo.parameter[id.travel.gmap] != "") {
    hidden.add(ui.createTextBox().setName(id.travel.gmap).setText(eventInfo.parameter[id.travel.gmap]));
  }
  
  // Define beneficiary text-boxes, setting names, values and ID's
  var bName = ui.createTextBox().setId('bName').setName('bName').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bName).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bName);
  var bMail = ui.createTextBox().setId('bMail').setName('bMail').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bMail).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bMail);
  var bAddr = ui.createTextBox().setId('bAddr').setName('bAddr').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bAddr).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bAddr);
  var bAdd2 = ui.createTextBox().setId('bAdd2').setName('bAdd2').setText(msg.blank).setEnabled(true).setStyleAttributes(css.txtBx.bAdd2).setTitle(txt.bAdd2);
  var bCity = ui.createTextBox().setId('bCity').setName('bCity').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bCity).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bAdd3);
  var bCode = ui.createTextBox().setId('bCode').setName('bCode').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bCode).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bAdd3);
  var bLand = ui.createTextBox().setId('bLand').setName('bLand').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bLand).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bAdd3);
  var bIBAN = ui.createTextBox().setId('bIBAN').setName('bIBAN').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bIBAN).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bIBAN);
  var bBICS = ui.createTextBox().setId('bBICS').setName('bBICS').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bBICS).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bBICS);
  var bBANK = ui.createTextBox().setId('bBANK').setName('bBANK').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bBANK).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bBANK);
  var bBADR = ui.createTextBox().setId('bBADR').setName('bBADR').setText(msg.required).setEnabled(true).setStyleAttributes(css.txtBx.bBADR).setStyleAttributes(css.txtBx.Wrong).setTitle(txt.bBADR);

  var y0 = ui.createHTML(checkHTML).setVisible(false);
  var x0 = ui.createHTML(crossHTML).setVisible(false);
  var p0 = ui.createHorizontalPanel()
    .add(y0).setCellVerticalAlignment(y0,enm.valign)
    .add(x0).setCellVerticalAlignment(x0,enm.valign);
  var y1 = ui.createHTML(checkHTML).setVisible(false);
  var x1 = ui.createHTML(crossHTML).setVisible(false);
  var p1 = ui.createHorizontalPanel()
    .add(y1).setCellVerticalAlignment(y1,enm.valign)
    .add(x1).setCellVerticalAlignment(x1,enm.valign);
  var y2 = ui.createHTML(checkHTML).setVisible(false);
  var x2 = ui.createHTML(crossHTML).setVisible(false);
  var p2 = ui.createHorizontalPanel()
    .add(y2).setCellVerticalAlignment(y2,enm.valign)
    .add(x2).setCellVerticalAlignment(x2,enm.valign);
  var y3 = ui.createHTML(checkHTML).setVisible(false);
  var x3 = ui.createHTML(crossHTML).setVisible(false);
  var p3 = ui.createHorizontalPanel()
    .add(y3).setCellVerticalAlignment(y3,enm.valign)
    .add(x3).setCellVerticalAlignment(x3,enm.valign);
  var y4 = ui.createHTML(checkHTML).setVisible(false);
  var x4 = ui.createHTML(crossHTML).setVisible(false);
  var p4 = ui.createHorizontalPanel()
    .add(y4).setCellVerticalAlignment(y4,enm.valign)
    .add(x4).setCellVerticalAlignment(x4,enm.valign);
  var y5 = ui.createHTML(checkHTML).setVisible(false).setId('y5');
  var x5 = ui.createHTML(crossHTML).setVisible(false).setId('x5');
  var s5 = ui.createTextBox().setVisible(false).setId('s5').setName('s5').setValue(msg.IBAN);
  var p5 = ui.createHorizontalPanel().add(s5) // Add a hidden switch to hold the IBAN status
    .add(y5).setCellVerticalAlignment(y5,enm.valign)
    .add(x5).setCellVerticalAlignment(x5,enm.valign);
  var y6 = ui.createHTML(checkHTML).setVisible(false);
  var x6 = ui.createHTML(crossHTML).setVisible(false);
  var p6 = ui.createHorizontalPanel()
    .add(y6).setCellVerticalAlignment(y6,enm.valign)
    .add(x6).setCellVerticalAlignment(x6,enm.valign);
  var y7 = ui.createHTML(checkHTML).setVisible(false);
  var x7 = ui.createHTML(crossHTML).setVisible(false);
  var p7 = ui.createHorizontalPanel()
    .add(y7).setCellVerticalAlignment(y7,enm.valign)
    .add(x7).setCellVerticalAlignment(x7,enm.valign);
  var y8 = ui.createHTML(checkHTML).setVisible(false);
  var x8 = ui.createHTML(crossHTML).setVisible(false);
  var p8 = ui.createHorizontalPanel()
    .add(y8).setCellVerticalAlignment(y8,enm.valign)
    .add(x8).setCellVerticalAlignment(x8,enm.valign);

  grid.setWidget(0, 0, ui.createLabel('Name:').setStyleAttributes(css.lbl).setTitle(txt.bName));
  grid.setWidget(1, 0, ui.createLabel('Email:').setStyleAttributes(css.lbl).setTitle(txt.bMail));
  grid.setWidget(2, 0, ui.createLabel('Address L1:').setStyleAttributes(css.lbl).setTitle(txt.bAddr));
  grid.setWidget(3, 0, ui.createLabel('Address L2:').setStyleAttributes(css.lbl).setTitle(txt.bAdd2));
  grid.setWidget(4, 0, ui.createLabel('Address L3:').setStyleAttributes(css.lbl).setTitle(txt.bAdd3));
  grid.setWidget(5, 0, ui.createLabel('IBAN:').setStyleAttributes(css.lbl).setTitle(txt.bIBAN));
  grid.setWidget(6, 0, ui.createLabel('BIC/Swift:').setStyleAttributes(css.lbl).setTitle(txt.bBICS));
  grid.setWidget(7, 0, ui.createLabel('Bank Name:').setStyleAttributes(css.lbl).setTitle(txt.bBANK));
  grid.setWidget(8, 0, ui.createLabel('Bank Address:').setStyleAttributes(css.lbl).setTitle(txt.bBADR));

  grid.setWidget(0, 1, bName)
  grid.setWidget(1, 1, bMail);
  grid.setWidget(2, 1, bAddr);
  grid.setWidget(3, 1, bAdd2);
  grid.setWidget(4, 1, ui.createHorizontalPanel().add(bLand).add(bCode).add(bCity));
  grid.setWidget(5, 1, bIBAN);
  grid.setWidget(6, 1, bBICS);
  grid.setWidget(7, 1, bBANK);
  grid.setWidget(8, 1, bBADR);

  grid.setWidget(0, 2, p0)
  grid.setWidget(1, 2, p1);
  grid.setWidget(2, 2, p2);
  grid.setWidget(3, 2, p3);
  grid.setWidget(4, 2, p4);
  grid.setWidget(5, 2, p5);
  grid.setWidget(6, 2, p6);
  grid.setWidget(7, 2, p7);
  grid.setWidget(8, 2, p8);
  
  // Define Server Handlers & Buttons
  var sh_onChangeF1_ = ui.createServerHandler()
    .addCallbackElement(Body)
    .setCallbackFunction('sh_onChangeF1_');
//  var loadDefault = ui.createServerHandler()
//    .addCallbackElement(Body)
//    .setCallbackFunction('loadDefault');
//  var saveDefault = ui.createServerHandler()
//    .addCallbackElement(Body)
//    .setCallbackFunction('saveDefault');
  
  // Add three submit buttons to go forwards, backwards and to validate the form
  var Btn = {};
  Btn.Next = ui.createSubmitButton(txt.Sbmt.label1)
    .setStyleAttributes(css.btn)
    .setVisible(true)
    .setId('Btn.Next')
    .setTitle(txt.Sbmt.enabled1)
    .setEnabled((opt && eventInfo.parameter.optDt=='load')||eventInfo.parameter.optDt=='save');
  Btn.Load = ui.createSubmitButton(txt.load1)
    .setStyleAttributes(css.btn)
    .setVisible(true)
    .setId('Btn.Load')
    .setTitle(txt.loadToolTip)
    .setEnabled(eventInfo.parameter.optDt==void(0));
//    .addClickHandler(loadDefault);
  Btn.Save = ui.createSubmitButton(txt.save1)
    .setStyleAttributes(css.btn)
    .setVisible(true)
    .setId('Btn.Save')
    .setTitle(txt.saveToolTip)
    .setEnabled(eventInfo.parameter.optDt=='load');
//    .addClickHandler(saveDefault);
  Btn.Exit = ui.createSubmitButton(txt.Exit.label1)
    .setStyleAttributes(css.btn)
    .setEnabled(n>0)
    .setVisible(true)
    .setTitle(txt.Exit.enabled1);
  Btn.onFormSubmit= ui.createHTML().setId(id.onFormSubmit).setHTML(html.pleaseWait).setVisible(false);
  var Buttons = ui.createHorizontalPanel().add(Btn.Load).add(Btn.Save).add(Btn.Next).add(Btn.Exit)
    .add(Btn.onFormSubmit).setCellVerticalAlignment(Btn.onFormSubmit,enm.valign)

  Body.add(state)
    .add(hidden)
    .add(H1)
//    .add(H2)
    .add(grid)
    .add(Buttons);
  if (main.cache.get('debug')=='parameters'){Body.add(main.getParameters(eventInfo))};

  // Add client handlers using setText() to adjust state prior to form submission
  // NB: Use of the .setValue(val) and .setValue(val,bool) methods give runtime errors!
  Btn.Save.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n))).forTargets(optDt).setText('save'));
  Btn.Load.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n))).forTargets(optDt).setText('load'));
  Btn.Exit.addClickHandler(ui.createClientHandler().forTargets(state).setText('-1'));

  // Wire event handlers to be executed prior to form submission
  var ch_onSubmitF1_ = ui.createClientHandler()
  .forTargets(Btn.Next,Btn.Load,Btn.Save,Btn.Exit).setEnabled(false)
  .forTargets(Btn.onFormSubmit).setVisible(true)
  .forTargets(state).setEnabled(true) // Enable so value gets included in post parameters
  .forTargets(Body).setStyleAttributes(css.onFormSubmit);
  var sh_onSubmitF1_ = ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onSubmitF1_');
  Form.addSubmitHandler(ch_onSubmitF1_).addSubmitHandler(sh_onSubmitF1_);

  
  // Define client handlers for validation of the input fields
  // Beneficiary Name
  var on0 = ui.createClientHandler()
    .validateLength(bName,minL,maxL)
    .validateNotEmail(bName)
    .validateNotNumber(bName)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x0).setVisible(false)
    .forTargets(y0).setVisible(true);
  var off0a = ui.createClientHandler() // 3 handlers to check negation
    .validateNotLength(bName,minL,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y0).setVisible(false)
    .forTargets(x0).setVisible(true).setHTML(crossHTML+msg.len);
  var off0b = ui.createClientHandler()
    .validateEmail(bName)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y0).setVisible(false)
    .forTargets(x0).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off0c = ui.createClientHandler()
    .validateNumber(bName)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y0).setVisible(false)
    .forTargets(x0).setVisible(true).setHTML(crossHTML+msg.numb);
  
  // Beneficiary Email
  var on1 = ui.createClientHandler()
    .validateEmail(bMail)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x1).setVisible(false)
    .forTargets(y1).setVisible(true);
  var off1 = ui.createClientHandler()
    .validateNotEmail(bMail)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y1).setVisible(false)
    .forTargets(x1).setVisible(true).setHTML(crossHTML+msg.mail1);
  
  // Address L1
  var on2 = ui.createClientHandler()
    .validateLength(bAddr,minL,maxL)
    .validateNotEmail(bAddr)
    .validateNotNumber(bAddr)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x2).setVisible(false)
    .forTargets(y2).setVisible(true);
  var off2a = ui.createClientHandler() // 3 handlers to check negation
    .validateNotLength(bAddr,minL,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y2).setVisible(false)
    .forTargets(x2).setVisible(true).setHTML(crossHTML+msg.len);
  var off2b = ui.createClientHandler()
    .validateEmail(bAddr)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y2).setVisible(false)
    .forTargets(x2).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off2c = ui.createClientHandler()
    .validateNumber(bAddr)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y2).setVisible(false)
    .forTargets(x2).setVisible(true).setHTML(crossHTML+msg.numb);

  // Address L2
  var on3 = ui.createClientHandler()
    .validateLength(bAdd2,0,maxL)
//    .validateNotEmail(bAdd2)
    .validateNotNumber(bAdd2)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x3).setVisible(false)
    .forTargets(y3).setVisible(true);
  var off3a = ui.createClientHandler() // 3 handlers to check negation
    .validateNotLength(bAdd2,0,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y3).setVisible(false)
    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.len);
//  var off3b = ui.createClientHandler()
//    .validateEmail(bAdd2)
//    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
//    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
//    .forTargets(Btn.Load).setEnabled(true)
//    .forTargets(y3).setVisible(false)
//    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off3c = ui.createClientHandler()
    .validateNumber(bAdd2)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y3).setVisible(false)
    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.numb);

  // Address L3
  var on4 = ui.createClientHandler()
    .validateMatches(bLand,regex.EU,'i')
    .validateLength(bCode,4,8)
    .validateLength(bCity,minL,maxL)
    .validateNotEmail(bCity)
    .validateNotNumber(bCity)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x4).setVisible(false)
    .forTargets(y4).setVisible(true);
  var off4a = ui.createClientHandler()
    .validateNotMatches(bLand,regex.EU,'i')
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.land);
  var off4b = ui.createClientHandler()
    .validateNotLength(bCode,4,8)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.code);
  var off4c = ui.createClientHandler()
    .validateNotLength(bCity,minL,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.city);
  var off4d = ui.createClientHandler()
    .validateEmail(bCity)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off4e = ui.createClientHandler()
    .validateNumber(bCity)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.numb);

  // IBAN
  var off5 = ui.createClientHandler()
    .validateNotMatches(s5,regex.blank)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true);
//  var on5 = ui.createClientHandler() // Check correct length
//    .validateMatches(bIBAN,regex.IBAN,'i')
//    .forEventSource().setStyleAttributes(css.txtBx.Valid)
//    .forTargets(x5).setVisible(false)
//    .forTargets(y5).setVisible(true);
//  var off5a = ui.createClientHandler() // Check wrong length
//    .validateNotMatches(bIBAN,regex.IBAN,'i')
//    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
//    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
//    .forTargets(y5).setVisible(false)
//    .forTargets(x5).setVisible(true).setHTML(crossHTML+msg.IBAN);
//  var off5b = ui.createClientHandler() // Check for non-alphanumeric characters
//    .validateMatches(bIBAN,regex.IBAN2,'i')
//    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
//    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
//    .forTargets(y5).setVisible(false)
//    .forTargets(x5).setVisible(true).setHTML(crossHTML+msg.IBAN2);
  // BICS
  var on6 = ui.createClientHandler()
    .validateLength(bBICS,8,11)
//    .validateMatches(bBICS,regex.BICS,'i')
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x6).setVisible(false)
    .forTargets(y6).setVisible(true);
  var off6 = ui.createClientHandler()
    .validateNotLength(bBICS,8,11)
//    .validateNotMatches(bBICS,regex.BICS,'i')
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y6).setVisible(false)
    .forTargets(x6).setVisible(true).setHTML(crossHTML+msg.BICS);
  // Bank Name
  var on7 = ui.createClientHandler()
    .validateLength(bBANK,minL,maxL)
    .validateNotEmail(bBANK)
    .validateNotNumber(bBANK)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x7).setVisible(false)
    .forTargets(y7).setVisible(true);
  var off7a = ui.createClientHandler() // 3 handlers to check negation
    .validateNotLength(bBANK,minL,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y7).setVisible(false)
    .forTargets(x7).setVisible(true).setHTML(crossHTML+msg.len);
  var off7b = ui.createClientHandler()
    .validateEmail(bBANK)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y7).setVisible(false)
    .forTargets(x7).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off7c = ui.createClientHandler()
    .validateNumber(bBANK)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y7).setVisible(false)
    .forTargets(x7).setVisible(true).setHTML(crossHTML+msg.numb);
  // Bank Address
  var on8 = ui.createClientHandler()
    .validateLength(bBADR,minL,maxL)
    .validateNotEmail(bBADR)
    .validateNotNumber(bBADR)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(x8).setVisible(false)
    .forTargets(y8).setVisible(true);
  var off8a = ui.createClientHandler() // 3 handlers to check negation
    .validateNotLength(bBADR,minL,maxL)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y8).setVisible(false)
    .forTargets(x8).setVisible(true).setHTML(crossHTML+msg.len);
  var off8b = ui.createClientHandler()
    .validateEmail(bBADR)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y8).setVisible(false)
    .forTargets(x8).setVisible(true).setHTML(crossHTML+msg.mail0);
  var off8c = ui.createClientHandler()
    .validateNumber(bBADR)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Save).setEnabled(false)
    .forTargets(Btn.Load).setEnabled(true)
    .forTargets(y8).setVisible(false)
    .forTargets(x8).setVisible(true).setHTML(crossHTML+msg.numb);

  
  // Submission handler
  var on = ui.createClientHandler()
    .validateMatches(ui.getElementById('TInumb'),regex.numb)// .validateInteger(ui.getElementById('TInumb')).validateRange(ui.getElementById('TInumb'),minA,maxA)
    .validateMatches(ui.getElementById('TIclub'),regex.club)// .validateInteger(ui.getElementById('TIclub')).validateRange(ui.getElementById('TIclub'),minB,maxB)
  // Beneficiary Name
    .validateLength(bName,minL,maxL)
    .validateNotEmail(bName)
    .validateNotNumber(bName)
  // Beneficiary Email
    .validateEmail(bMail)
  // Address L1
    .validateLength(bAddr,minL,maxL)
    .validateNotEmail(bAddr)
    .validateNotNumber(bAddr)
  // Address L2
    .validateLength(bAdd2,0,maxL)
//    .validateNotEmail(bAdd2)
    .validateNotNumber(bAdd2)
  // Address L3
    .validateMatches(bLand,regex.EU,'i')
    .validateLength(bCode,4,8)
    .validateLength(bCity,minL,maxL)
    .validateNotEmail(bCity)
    .validateNotNumber(bCity)
  // IBAN & BICS
    .validateMatches(s5,regex.blank)
//    .validateMatches(bIBAN,regex.IBAN,'i')
    .validateLength(bBICS,8,11)
//    .validateMatches(bBICS,regex.BICS,'i')
  // Bank Name & Address
    .validateLength(bBANK,minL,maxL)
    .validateLength(bBADR,minL,maxL)
  //
    .forTargets(Btn.Next,Btn.Save).setEnabled(true);
  
  bName.addValueChangeHandler(on).addValueChangeHandler(on0).addValueChangeHandler(off0a).addValueChangeHandler(off0b).addValueChangeHandler(off0c);
  bMail.addValueChangeHandler(on).addValueChangeHandler(on1).addValueChangeHandler(off1);
  bAddr.addValueChangeHandler(on).addValueChangeHandler(on2).addValueChangeHandler(off2a).addValueChangeHandler(off2b).addValueChangeHandler(off2c);
  bAdd2.addValueChangeHandler(on).addValueChangeHandler(on3).addValueChangeHandler(off3a).addValueChangeHandler(off3c);
  //    .addValueChangeHandler(off3b)
  bLand.addValueChangeHandler(on).addValueChangeHandler(on4).addValueChangeHandler(off4a);
  bCode.addValueChangeHandler(on).addValueChangeHandler(on4).addValueChangeHandler(off4b);
  bCity.addValueChangeHandler(on).addValueChangeHandler(on4).addValueChangeHandler(off4c).addValueChangeHandler(off4d).addValueChangeHandler(off4e);
//bIBAN.addValueChangeHandler(on).addValueChangeHandler(on5).addValueChangeHandler(off5a).addValueChangeHandler(off5b);
  bIBAN.addValueChangeHandler(on).addValueChangeHandler(sh_onChangeF1_);
  s5.addValueChangeHandler(on).addValueChangeHandler(off5);
  bBICS.addValueChangeHandler(on).addValueChangeHandler(on6).addValueChangeHandler(off6);
  bBANK.addValueChangeHandler(on).addValueChangeHandler(on7).addValueChangeHandler(off7a).addValueChangeHandler(off7b).addValueChangeHandler(off7c);
  bBADR.addValueChangeHandler(on).addValueChangeHandler(on8).addValueChangeHandler(off8a).addValueChangeHandler(off8b).addValueChangeHandler(off8c);
  
  if(eventInfo.parameter.optDt != 'save') {
    // Preload default values
    bName.setValue((row[5]+' '+row[4]),true).setStyleAttributes(css.txtBx.Valid);
    bMail.setValue(row[14],true).setStyleAttributes(css.txtBx.Valid);
    bAddr.setValue(row[6],true).setStyleAttributes(css.txtBx.Valid);
    bAdd2.setValue(row[7],true).setStyleAttributes(css.txtBx.Valid);
    bCity.setValue(row[8],true).setStyleAttributes(css.txtBx.Valid);
    bCode.setValue(row[9],true).setStyleAttributes(css.txtBx.Valid);
    bLand.setValue(row[11],true).setStyleAttributes(css.txtBx.Valid);
    bIBAN.setValue(row[17],true).setStyleAttributes(row[17]==msg.required? {} : css.txtBx.Valid);
    bBICS.setValue(row[18],true).setStyleAttributes(row[18]==msg.required? {} : css.txtBx.Valid);
    bBANK.setValue(row[19],true).setStyleAttributes(row[19]==msg.required? {} : css.txtBx.Valid);
    bBADR.setValue(row[20],true).setStyleAttributes(row[20]==msg.required? {} : css.txtBx.Valid);
  } else if(eventInfo.parameter.optDt == 'save') {
    // Preload posted values
    bName.setValue(eventInfo.parameter.bName,true).setStyleAttributes(css.txtBx.Valid);
    bMail.setValue(eventInfo.parameter.bMail,true).setStyleAttributes(css.txtBx.Valid);
    bAddr.setValue(eventInfo.parameter.bAddr,true).setStyleAttributes(css.txtBx.Valid);
    bAdd2.setValue(eventInfo.parameter.bAdd2,true).setStyleAttributes(css.txtBx.Valid);
    bCity.setValue(eventInfo.parameter.bCity,true).setStyleAttributes(css.txtBx.Valid);
    bCode.setValue(eventInfo.parameter.bCode,true).setStyleAttributes(css.txtBx.Valid);
    bLand.setValue(eventInfo.parameter.bLand,true).setStyleAttributes(css.txtBx.Valid);
    bIBAN.setValue(eventInfo.parameter.bIBAN,true).setStyleAttributes(css.txtBx.Valid);
    bBICS.setValue(eventInfo.parameter.bBICS,true).setStyleAttributes(css.txtBx.Valid);
    bBANK.setValue(eventInfo.parameter.bBANK,true).setStyleAttributes(css.txtBx.Valid);
    bBADR.setValue(eventInfo.parameter.bBADR,true).setStyleAttributes(css.txtBx.Valid);
    
    // Save posted values as new default values
    saveDefault(eventInfo);
  }
  
  return Form;
}

function saveDefault(eventInfo) {
//  var ui = UiApp.getActiveApplication();
  var idx = eventInfo.parameter.idxCli; // Index of client in the worksheet (values in column A)
  Logger.log("saveDefault: Client index = %s, row %s", idx, parseInt(idx)+1);
  
  var sheet = SpreadsheetApp.openById(Drv.script.get('docId')).getSheetByName(Wbk.tabNames[0])

  // Remember that while a range index starts at 1, 1, the JavaScript array will be indexed from [0][0]
  var range = sheet.getRange(parseInt(idx,10)+1,2,1,sheet.getLastColumn()-1); // Clients!B:U
  var rowObj = range.getValues(); // gets a single row object[][]
  var row = rowObj[0];
  
  row[5] = eventInfo.parameter.bAddr;  // Column G (array index relative to column B, no A!)
  row[6] = eventInfo.parameter.bAdd2;  // Column H
  row[7] = eventInfo.parameter.bCity;  // Column I
  row[8] = eventInfo.parameter.bCode;  // Column J
  row[10] = eventInfo.parameter.bLand;  // Column L
  row[16] = eventInfo.parameter.bIBAN;  // Column R
  row[17] = eventInfo.parameter.bBICS;  // Column S
  row[18] = eventInfo.parameter.bBANK;  // Column T
  row[19] = eventInfo.parameter.bBADR;  // Column U
  
  range.setValues(rowObj);
}
