function getLineItems(eventInfo,n) {
  var ui = UiApp.getActiveApplication();
  var Body = ui.createVerticalPanel();
  var Form = ui.createFormPanel().setId((n>0?'doPost[':'doGet[')+n+']').setStyleAttributes(css.form2).add(Body);

  // Increment the ID stored in a hidden text-box
  var state = ui.createTextBox().setId('state').setName('state').setValue(1+n).setVisible(sw.state).setEnabled(false);
  var nSubm = ui.createTextBox().setId('nSubm').setName('nSubm').setValue(eventInfo.parameter.nSubm).setEnabled(true);
 
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
  hidden.add(nSubm);
  
  var H1 = ui.createHTML(h1.form2).setStyleAttributes(css.h1);
  var grid = ui.createGrid(8, 3);

  // Define widgets for line item
  var Event = {};
  Event.date = ui.createDateBox().setId(id.event.date).setName(id.event.date).setTitle(txt.event.date).setStyleAttributes(css.event.date).setVisible(true).setFormat(UiApp.DateTimeFormat.YEAR_MONTH).setFireEventsForInvalid(true);
//Event.date = ui.createDateBox().setId(id.event.date).setName(id.event.date).setTitle(txt.event.date).setStyleAttributes(css.event.date).setVisible(true).setFormat(UiApp.DateTimeFormat.DATE_SHORT).setFireEventsForInvalid(true);
  Event.type = ui.createListBox().setId(id.event.type).setName(id.event.type).setTitle(txt.event.type).setStyleAttributes(css.event.type).setVisible(true);
//Event.loca = ui.createTextBox().setId(id.event.loca).setName(id.event.loca).setTitle(txt.event.loca).setStyleAttributes(css.event.loca).setVisible(true);
  Event.types = ['Specify type of event',
                 'DECM',
                 'Club visit',
                 'Club coaching',
                 'Speech contest',
                 'Conference',
                 'COT (Club Officer Training)',
                 'TLI (Toastmaster Leadership Institute)',
                 'Other (Please describe)' ];
  for(var i in Event.types){Event.type.addItem(Event.types[i])};

  var Invoice = {};
  Invoice.date = ui.createDateBox().setId(id.invoice.date).setName(id.invoice.date).setTitle(txt.invoice.date).setStyleAttributes(css.invoice.date).setVisible(true).setFormat(UiApp.DateTimeFormat.DATE_SHORT).setFireEventsForInvalid(true);
  Invoice.curr = ui.createTextBox().setId(id.invoice.curr).setName(id.invoice.curr).setTitle(txt.invoice.curr).setStyleAttributes(css.invoice.curr).setVisible(true).setValue('EUR');
  Invoice.valu = ui.createTextBox().setId(id.invoice.valu).setName(id.invoice.valu).setTitle(txt.invoice.valu).setStyleAttributes(css.invoice.valu).setVisible(true);
//Invoice.ttax = ui.createTextBox().setId(id.invoice.ttax).setName(id.invoice.ttax).setTitle(txt.invoice.ttax).setStyleAttributes(css.invoice.ttax).setVisible(true);

  var Expense = {};
  Expense.desc  = ui.createTextBox(   ).setId(id.expense.desc).setName(id.expense.desc).setTitle(txt.expense.desc).setStyleAttributes(css.expense.desc).setVisible(true);
  Expense.type  = ui.createListBox(   ).setId(id.expense.type).setName(id.expense.type).setTitle(txt.expense.type).setStyleAttributes(css.expense.type).setVisible(true);
  Expense.blob1 = ui.createFileUpload().setId(id.expense.blob1).setName(id.expense.blob1).setTitle(txt.expense.blob1).setStyleAttributes(css.expense.blob1).setVisible(true);
  Expense.blob2 = ui.createFileUpload().setId(id.expense.blob2).setName(id.expense.blob2).setTitle(txt.expense.blob2).setStyleAttributes(css.expense.blob2).setVisible(true).setEnabled(true);
  Expense.blob3 = ui.createFileUpload().setId(id.expense.blob3).setName(id.expense.blob3).setTitle(txt.expense.blob3).setStyleAttributes(css.expense.blob3).setVisible(true).setEnabled(true);
//  Expense.blob2 = ui.createFileUpload().setId(id.expense.blob2).setName(id.expense.blob2).setTitle(txt.expense.blob2).setStyleAttributes(css.expense.blob2).setVisible(true).setEnabled(false);
//  Expense.blob3 = ui.createFileUpload().setId(id.expense.blob3).setName(id.expense.blob3).setTitle(txt.expense.blob3).setStyleAttributes(css.expense.blob3).setVisible(true).setEnabled(false);
  Expense.types = ['Select category',
                 'Advertising',
                 'Communication',
                 'Marketing',
                 'Educational Material',
                 'Conference',
                 'Lodging',
                 'Travel',
                 'Awards',
                 'Refreshments',
                 'Venue rental',
                 'Other (Please describe)' ];
  Expense.X = Expense.types.indexOf('Travel'); 
  for(var i in Expense.types){Expense.type.addItem(Expense.types[i])};    

  var Travel = {};
  Travel.mode = ui.createListBox().setId(id.travel.mode).setName(id.travel.mode).setTitle(txt.travel.mode).setStyleAttributes(css.travel.mode).setVisible(true).setEnabled(false);
  Travel.dist = ui.createTextBox().setId(id.travel.dist).setName(id.travel.dist).setTitle(txt.travel.dist).setStyleAttributes(css.travel.dist).setVisible(true).setEnabled(false).setText(msg.blank);
  Travel.gmap = ui.createTextBox().setId(id.travel.gmap).setName(id.travel.gmap).setTitle(txt.travel.gmap).setStyleAttributes(css.travel.gmap).setVisible(true).setEnabled(false).setVisible(showGmap);
  Travel.modes = ['For travel, specify mode of transport',
                  'Air',
                  'Boat',
                  'Bus',
                  'Car',
//                 'Taxi',
                  'Train',
                  'Other (Please describe)' ];
  for(var i in Travel.modes){Travel.mode.addItem(Travel.modes[i])};
  
  var y0 = ui.createHTML(checkHTML).setVisible(false).setId('y0');
  var x0 = ui.createHTML(crossHTML).setVisible(false).setId('x0');
  var s0a= ui.createTextBox().setVisible(false).setId('s0a').setName('s0b').setValue(msg.blank);
  var s0b= ui.createTextBox().setVisible(false).setId('s0b').setName('s0b').setValue(msg.blank);
  var p0 = ui.createHorizontalPanel()
    .add(s0a) // Add a hidden switch to hold event date status
    .add(s0b) // Add a hidden switch to hold event type status
    .add(y0).setCellVerticalAlignment(y0,enm.valign)
    .add(x0).setCellVerticalAlignment(x0,enm.valign);
  Event.date.addValueChangeHandler(ui.createClientHandler().validateMatches(   Event.date,regex.date1).forTargets(s0a).setText("1"));
  Event.date.addValueChangeHandler(ui.createClientHandler().validateNotMatches(Event.date,regex.date1).forTargets(s0a).setText(msg.blank));
  Event.type.addChangeHandler(ui.createClientHandler().validateNotOptions(Event.type,[Event.types[0]]).forTargets(s0b).setText("1"));
  Event.type.addChangeHandler(ui.createClientHandler().validateOptions(   Event.type,[Event.types[0]]).forTargets(s0b).setText(msg.blank));

  var y1 = ui.createHTML(checkHTML).setVisible(false).setId('y1');
  var x1 = ui.createHTML(crossHTML).setVisible(false).setId('x1');
  var s1a = ui.createTextBox().setVisible(false).setId('s1a').setName('s1a').setValue(msg.blank);
  var s1b = ui.createTextBox().setVisible(false).setId('s1b').setName('s1b').setValue(msg.blank);
  var s1c = ui.createTextBox().setVisible(false).setId('s1c').setName('s1c').setValue("1");
  var p1 = ui.createHorizontalPanel()
    .add(s1a) // Add a hidden switch to hold receipt date status
    .add(s1b) // Add a hidden switch to hold receipt valu status
    .add(s1c) // Add a hidden switch to hold receipt curr status
    .add(y1).setCellVerticalAlignment(y1,enm.valign)
    .add(x1).setCellVerticalAlignment(x1,enm.valign);
  Invoice.date.addValueChangeHandler(ui.createClientHandler().validateMatches(   Invoice.date,regex.date2).forTargets(s1a).setText("1"));
  Invoice.date.addValueChangeHandler(ui.createClientHandler().validateNotMatches(Invoice.date,regex.date2).forTargets(s1a).setText(msg.blank));
//  Invoice.valu.addValueChangeHandler(ui.createClientHandler().validateNumber(   Invoice.valu).forTargets(s1b).setText("1").forEventSource().setStyleAttributes(css.txtBx.Valid));
//  Invoice.valu.addValueChangeHandler(ui.createClientHandler().validateNotNumber(Invoice.valu).forTargets(s1b).setText(msg.blank).forEventSource().setStyleAttributes(css.txtBx.Wrong));
  Invoice.valu.addValueChangeHandler(ui.createClientHandler().validateMatches(   Invoice.valu,regex.VAL,'i').forTargets(s1b).setText("1").forEventSource().setStyleAttributes(css.txtBx.Valid));
  Invoice.valu.addValueChangeHandler(ui.createClientHandler().validateNotMatches(Invoice.valu,regex.VAL,'i').forTargets(s1b).setText(msg.blank).forEventSource().setStyleAttributes(css.txtBx.Wrong));
  Invoice.curr.addValueChangeHandler(ui.createClientHandler().validateMatches(   Invoice.curr,regex.FX,'i').forTargets(s1c).setText("1").forEventSource().setStyleAttributes(css.txtBx.Valid));
  Invoice.curr.addValueChangeHandler(ui.createClientHandler().validateNotMatches(Invoice.curr,regex.FX,'i').forTargets(s1c).setText(msg.blank).forEventSource().setStyleAttributes(css.txtBx.Wrong));

  var y2 = ui.createHTML(checkHTML).setVisible(false).setId('y2');
  var x2 = ui.createHTML(crossHTML).setVisible(false).setId('x2');
  var t2 = ui.createHTML(''       ).setVisible(false).setId('t2');
  var p2 = ui.createHorizontalPanel()
    .add(y2).setCellVerticalAlignment(y2,enm.valign)
    .add(x2).setCellVerticalAlignment(x2,enm.valign)
    .add(t2).setCellVerticalAlignment(t2,enm.valign);
  Expense.desc.addKeyUpHandler(ui.createServerHandler().addCallbackElement(Expense.desc).addCallbackElement(p2).setCallbackFunction('sh_onKeyUpF2_'));
  Expense.desc.addValueChangeHandler(ui.createServerHandler().addCallbackElement(Expense.desc).addCallbackElement(p2).setCallbackFunction('sh_onKeyUpF2_'));

  
  var y3 = ui.createHTML(checkHTML).setVisible(false).setId('y3');
  var x3 = ui.createHTML(crossHTML).setVisible(false).setId('x3');
  var s3a= ui.createTextBox().setVisible(false).setId('s3a').setName('s3b').setValue("0");
  var s3b= ui.createTextBox().setVisible(false).setId('s3b').setName('s3b').setValue("0");
  var s3c= ui.createTextBox().setVisible(false).setId('s3c').setName('s3c').setValue("0");
  var p3 = ui.createHorizontalPanel()
    .add(s3a) // Add a hidden switch to hold expense type status
    .add(s3b) // Add a hidden switch to hold travel mode status
    .add(s3c) // Add a hidden switch to hold travel dist status
    .add(y3).setCellVerticalAlignment(y3,enm.valign)
    .add(x3).setCellVerticalAlignment(x3,enm.valign);
  
  Expense.type.addChangeHandler(ui.createClientHandler().validateOptions(   Expense.type,[Expense.types[Expense.X]]).forTargets(Travel.mode,Travel.dist,Travel.gmap).setEnabled(true).forTargets(s3a).setText("1").forTargets(s3b,s3c).setText("0").forTargets(Travel.mode).setStyleAttributes(css.lstBx.Wrong).forTargets(Travel.dist).setText("* km").setStyleAttributes(css.txtBx.Wrong));
  Expense.type.addChangeHandler(ui.createClientHandler().validateNotOptions(Expense.type,[Expense.types[Expense.X]]).forTargets(Travel.mode,Travel.dist,Travel.gmap).setEnabled(false).forTargets(Travel.dist).setText("").forTargets(s3b,s3c).setText("0").forTargets(Travel.mode).setStyleAttributes(css.lstBx.Valid));
  Expense.type.addChangeHandler(ui.createClientHandler().validateNotOptions(Expense.type,[Expense.types[0],Expense.types[Expense.X]]).forTargets(s3a).setText("3"));
  Expense.type.addChangeHandler(ui.createClientHandler().validateOptions(   Expense.type,[Expense.types[0]]).forTargets(s3a).setText("0"));
  Travel.mode.addChangeHandler(ui.createClientHandler().validateNotOptions(Travel.mode,[Travel.modes[0]]).forTargets(s3b).setText("1"));
  Travel.mode.addChangeHandler(ui.createClientHandler().validateOptions(   Travel.mode,[Travel.modes[0]]).forTargets(s3b).setText("0"));
  Travel.dist.addValueChangeHandler(ui.createClientHandler().validateMatches(   Travel.dist,regex.dist,'i').forTargets(s3c).setText("1").forEventSource().setStyleAttributes(css.txtBx.Valid).forTargets(x3,y3).setVisible(false));
  Travel.dist.addValueChangeHandler(ui.createClientHandler().validateNotMatches(Travel.dist,regex.dist,'i').forTargets(s3c).setText("0").forEventSource().setStyleAttributes(css.txtBx.Wrong));

  var y4 = ui.createHTML(checkHTML).setVisible(false);
  var x4 = ui.createHTML(crossHTML).setVisible(false);
  var p4 = ui.createHorizontalPanel().setVisible(showGmap)
    .add(y4).setCellVerticalAlignment(y4,enm.valign)
    .add(x4).setCellVerticalAlignment(x4,enm.valign);

  var y5 = ui.createHTML(checkHTML).setVisible(false).setId('y5');
  var x5 = ui.createHTML(crossHTML).setVisible(false).setId('x5');
  var s5 = ui.createTextBox().setVisible(false).setId('s5').setName('s5').setValue(msg.blank);
  var p5 = ui.createHorizontalPanel()
    .add(s5) // Add a hidden switch to hold the FileUpload status
    .add(y5).setCellVerticalAlignment(y5,enm.valign)
    .add(x5).setCellVerticalAlignment(x5,enm.valign);
  // There is no way to distinguish betweeen a valid selection and the cancel event; validate on doPost()
  Expense.blob1.addChangeHandler(ui.createClientHandler().validateNotInteger(s5).forTargets(s5).setText("1").forTargets(Expense.blob2).setEnabled(true));
  Expense.blob2.addChangeHandler(ui.createClientHandler().forTargets(Expense.blob3).setEnabled(true));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateRange(s5,3,3 ).forTargets(s5,Expense.desc).setText("4"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateRange(s5,2,2 ).forTargets(s5,Expense.desc).setText("3"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateRange(s5,1,1 ).forTargets(s5,Expense.desc).setText("2"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateNotInteger(s5).forTargets(s5,Expense.desc).setText("1"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateMatches(   Expense.blob1,'/No file chosen/',i).forTargets(Expense.desc).setText("File Upload set"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateNotMatches(Expense.blob1,'/No file chosen/',i).forTargets(Expense.desc).setText("File Upload not set"))
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateNotMatches(Expense.blob1,'No file chosen',i).forTargets(Expense.desc).setText("File Upload: not matches no file chosen"));
//  Expense.blob1.addChangeHandler(ui.createClientHandler().validateMatches(   Expense.blob1,'No file chosen',i).forTargets(Expense.desc).setText("File Upload: matches no file chosen"))

  // Set the labels in grid's first column
  grid.setWidget(0, 0, ui.createLabel('Event Month & Type:').setStyleAttributes(css.lbl).setTitle(txt.event.date));
  grid.setWidget(1, 0, ui.createLabel('Receipt Date & Value:').setStyleAttributes(css.lbl).setTitle(txt.invoice.date));
  grid.setWidget(2, 0, ui.createLabel('Expense description:').setStyleAttributes(css.lbl).setTitle(txt.expense.desc));
  grid.setWidget(3, 0, ui.createLabel('Expense detail:'    ).setStyleAttributes(css.lbl).setTitle(txt.expense.type));
  grid.setWidget(4, 0, ui.createLabel('Google map link:').setStyleAttributes(css.lbl).setTitle(txt.travel.gmap).setVisible(showGmap));
  grid.setWidget(5, 0, ui.createLabel('Receipt & Summary:').setStyleAttributes(css.lbl).setTitle(txt.expense.blob1));

  // Set the widgets in grid's second column
  grid.setWidget(0, 1, ui.createHorizontalPanel()
                 .add(Event.date).setCellVerticalAlignment(Event.date,enm.valign)
                 .add(Event.type).setCellVerticalAlignment(Event.type,enm.valign));
  grid.setWidget(1, 1, ui.createHorizontalPanel()
                 .add(Invoice.date).setCellVerticalAlignment(Invoice.date,enm.valign)
                 .add(Invoice.valu).setCellVerticalAlignment(Invoice.valu,enm.valign)
                 .add(Invoice.curr).setCellVerticalAlignment(Invoice.curr,enm.valign));
  grid.setWidget(2, 1, Expense.desc)
  grid.setWidget(3, 1, ui.createHorizontalPanel()
                 .add(Expense.type).setCellVerticalAlignment(Expense.type,enm.valign)
                 .add(Travel.mode).setCellVerticalAlignment(Travel.mode,enm.valign)
                 .add(Travel.dist).setCellVerticalAlignment(Travel.dist,enm.valign));
  grid.setWidget(4, 1, Travel.gmap);
  grid.setWidget(5, 1, Expense.blob1);
  grid.setWidget(6, 1, Expense.blob2);
  grid.setWidget(7, 1, Expense.blob3);

  // Add the validation widgets in grid's third column
  grid.setWidget(0, 2, p0)
  grid.setWidget(1, 2, p1);
  grid.setWidget(2, 2, p2);
  grid.setWidget(3, 2, p3);
  grid.setWidget(4, 2, p4);
  grid.setWidget(5, 2, p5);
  
  // Add four submit buttons to go forward, backward, to stay/validate and to exit the form
  var Btn = {};
  Btn.stat = ui.createTextBox().setVisible(false).setId('Btn.stat').setName('Btn.stat').setText(msg.blank).setEnabled(true);
  Btn.Next = ui.createSubmitButton(txt.Sbmt.label2).setId(id.btn.next2).setEnabled(false).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.Sbmt.blocked2);
  Btn.Back = ui.createSubmitButton(txt.Back.label2).setId(id.btn.back2).setEnabled(n>1).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.Back.enabled2);
  Btn.AddL = ui.createSubmitButton(txt.AddL.label2).setId(id.btn.stay2).setEnabled(false).setVisible(false).setStyleAttributes(css.btn).setTitle(txt.AddL.blocked2);
  Btn.Exit = ui.createSubmitButton(txt.Exit.label2).setEnabled(n>0).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.Exit.enabled2);
//Btn.Rset = ui.createResetButton("Reset").setEnabled(n>0).setVisible(true).setStyleAttributes(css.btn).setTitle(txt.exitToolTip);
  Btn.onFormSubmit= ui.createHTML().setId(id.onFormSubmit).setHTML(html.onFormSubmit2).setVisible(false);
  var Buttons = ui.createHorizontalPanel().add(Btn.Back).add(Btn.AddL).add(Btn.Next).add(Btn.Exit)
    .add(Btn.onFormSubmit).setCellVerticalAlignment(Btn.onFormSubmit,enm.valign)
    .add(Btn.stat)//.add(Btn.Rset);

//  Btn.stat.addChangeHandler(ui.createClientHandler().validateInteger(Btn.stat   ).forTargets(Travel.gmap).setText("buttons enabled"));
//  Btn.stat.addChangeHandler(ui.createClientHandler().validateNotInteger(Btn.stat).forTargets(Travel.gmap).setText("buttons blocked"));
////Btn.stat.addChangeHandler(ui.createClientHandler().validateRange(Btn.stat,1,1).forTargets(Travel.gmap).setText("buttons enabled"));

  Body.add(state)
      .add(hidden)
      .add(H1)
      .add(grid)
      .add(Buttons);
  if (main.cache.get('debug')=='parameters'){Body.add(main.getParameters(eventInfo))};
  
  // Define server handlers to onValueChange events for the DateBox, ListBox and FileUpload widgets 
  Expense.type.addChangeHandler(ui.createServerHandler().validateOptions(Expense.type,[Expense.types[Expense.X]]).addCallbackElement(Body).setCallbackFunction('sh_onChangeF2_'));
  Event.date.addValueChangeHandler(  ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onChangeF2_'));
  Invoice.date.addValueChangeHandler(ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onChangeF2_'));

  // Add client handlers using setText() to adjust state prior to form submission
  // NB: Use of the .setValue(val) and .setValue(val,bool) methods give runtime errors!
  Btn.AddL.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n))).forTargets(Btn.onFormSubmit).setHTML(html.pleaseWait));
  Btn.Back.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n)-1)).forTargets(Btn.onFormSubmit).setHTML(html.pleaseWait));
  Btn.Exit.addClickHandler(ui.createClientHandler().forTargets(state).setText('-1').forTargets(Btn.onFormSubmit).setHTML(html.pleaseWait));

  // Wire event handlers to be executed prior to form submission
  var ch_onSubmitF2_ = ui.createClientHandler()
  .forTargets(Btn.Next,Btn.Back,Btn.AddL,Btn.Exit).setEnabled(false)
  .forTargets(Btn.onFormSubmit).setVisible(true)
  .forTargets(state).setEnabled(true) // Enable so value gets included in post parameters
  .forTargets(Body).setStyleAttributes(css.onFormSubmit);    
  var sh_onSubmitF2_ = ui.createServerHandler().addCallbackElement(Body).setCallbackFunction('sh_onSubmitF2_');
  Form.addSubmitHandler(ch_onSubmitF2_).addSubmitHandler(sh_onSubmitF2_);

  // Define client handlers for validation of line items
  // L0 : Event Date and Type
  var on0 = ui.createClientHandler()
    .validateSum([s0a,s0b],2)//    .validateInteger(s0a)//    .validateInteger(s0b)
    .forTargets(x0).setVisible(false)
    .forTargets(y0).setVisible(true);
  var off0a = ui.createClientHandler()
    .validateNotInteger(s0a)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y0).setVisible(false)
    .forTargets(x0).setVisible(true).setHTML(crossHTML+msg.event.date);
  var off0b = ui.createClientHandler()
    .validateNotInteger(s0b)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y0).setVisible(false)
    .forTargets(x0).setVisible(true).setHTML(crossHTML+msg.event.type);

  // L1 : Invoice Date, Value and Currency
  var on1 = ui.createClientHandler()
    .validateSum([s1a,s1b,s1c],3)
    .forTargets(x1).setVisible(false)
    .forTargets(y1).setVisible(true);
  var off1a = ui.createClientHandler()
    .validateNotInteger(s1a)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y1).setVisible(false)
    .forTargets(x1).setVisible(true).setHTML(crossHTML+msg.invoice.date);
  var off1b = ui.createClientHandler()
    .validateNotInteger(s1b)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y1).setVisible(false)
    .forTargets(x1).setVisible(true).setHTML(crossHTML+msg.invoice.valu);
  var off1c = ui.createClientHandler()
    .validateNotInteger(s1c)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y1).setVisible(false)
    .forTargets(x1).setVisible(true).setHTML(crossHTML+msg.invoice.curr);
  
  // L2 : Expense description
  var on2 = ui.createClientHandler()
    .validateLength(Expense.desc,8,maxD)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(x2).setVisible(false)
    .forTargets(y2).setVisible(true);
  var off2 = ui.createClientHandler()
    .validateNotLength(Expense.desc,8,maxD)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y2).setVisible(false)
    .forTargets(t2).setVisible(false)
    .forTargets(x2).setVisible(true).setHTML(crossHTML);
//  .forTargets(x2).setVisible(true).setHTML(crossHTML+msg.len);
  
  // L3 : Expense category, Mode of transport & Distance
  var on3 = ui.createClientHandler()
    .validateSum([s3a,s3b,s3c],3)
    .forTargets(x3).setVisible(false)
    .forTargets(y3).setVisible(true);
  var off3a = ui.createClientHandler()
    .validateMatches(s3a,"0")
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y3).setVisible(false)
    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.expense.type);
  var off3b = ui.createClientHandler()
    .validateMatches(s3b,"0") //     .validateNotInteger(s3b)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y3).setVisible(false)
    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.travel.mode);
  var off3c = ui.createClientHandler()
    .validateMatches(s3c,"0") //    .validateNotInteger(s3c)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y3).setVisible(false)
    .forTargets(x3).setVisible(true).setHTML(crossHTML+msg.travel.dist);
  
  // L4 : Google map URL
  var on4 = ui.createClientHandler()
    .validateLength(Travel.gmap,0,(10*maxL))
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(x4).setVisible(false)
    .forTargets(y4).setVisible(true);
  var off4 = ui.createClientHandler()
    .validateNotLength(Travel.gmap,0,(10*maxL))
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y4).setVisible(false)
    .forTargets(x4).setVisible(true).setHTML(crossHTML+msg.len);
  
  // L5 : Receipt upload
  var on5 = ui.createClientHandler()
    .validateInteger(s5)
    .forTargets(x5).setVisible(false)
    .forTargets(y5).setVisible(true);
  var off5 = ui.createClientHandler()
    .validateNotInteger(s5)
    .forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank)
    .forTargets(y5).setVisible(false)
    .forTargets(x5).setVisible(true).setHTML(crossHTML+msg.expense.blob1);

  // Submission handler
  var on = ui.createClientHandler()
    .validateSum([s0a,s0b],2)//    .validateInteger(s0a)//    .validateInteger(s0b)
    .validateSum([s1a,s1b,s1c],3)//    .validateInteger(s1a)
    .validateLength(Expense.desc,8,(maxD))
    .validateSum([s3a,s3b,s3c],3)
    .validateLength(Travel.gmap,0,(10*maxL))
    .validateInteger(s5)
  .forTargets(Btn.AddL,Btn.Next).setEnabled(true)
//  .forTargets(Travel.gmap).setText("buttons enabled")
  .forTargets(Btn.stat).setText("1");
  
  Event.date.addValueChangeHandler(on).addValueChangeHandler(on0).addValueChangeHandler(off0a);
  Event.type.addChangeHandler(on).addChangeHandler(on0).addChangeHandler(off0b);
  Invoice.date.addValueChangeHandler(on).addValueChangeHandler(on1).addValueChangeHandler(off1a);
  Invoice.valu.addValueChangeHandler(on).addValueChangeHandler(on1).addValueChangeHandler(off1b);
  Invoice.curr.addValueChangeHandler(on).addValueChangeHandler(on1).addValueChangeHandler(off1c);
  Expense.desc.addValueChangeHandler(on).addValueChangeHandler(on2).addValueChangeHandler(off2);
  Expense.type.addChangeHandler(on).addChangeHandler(on3).addChangeHandler(off3a);
  Travel.mode.addChangeHandler(on).addChangeHandler(on3).addChangeHandler(off3b);
  Travel.dist.addValueChangeHandler(on).addValueChangeHandler(on3).addValueChangeHandler(off3c);
  Travel.gmap.addValueChangeHandler(on).addValueChangeHandler(on4).addValueChangeHandler(off4);
  Expense.blob1.addChangeHandler(on).addChangeHandler(on5).addChangeHandler(off5);
  Expense.type.addChangeHandler(ui.createClientHandler().validateOptions(Expense.type,[Expense.types[Expense.X]]).forTargets(Btn.AddL,Btn.Next).setEnabled(false).forTargets(Btn.stat).setText(msg.blank).forTargets(x3,y3).setVisible(false));

  // Preload posted hidden values; use TextBox.setValue(val,bool) method to trigger validation [not .setText()!]
  if(eventInfo.parameter[id.event.date] != void(0) && eventInfo.parameter[id.event.date] != null && eventInfo.parameter[id.event.date] != "") {
    // Parse date string formated as YYYY MMMMMM
    var str = '' + eventInfo.parameter[id.event.date] + '';
    var strArray = str.split(' ');
    var year = parseInt(strArray.shift());
    var programYear = main.programYear();
    var month = main.monthArr.indexOf(strArray.shift());  // cf. https://developers.google.com/apps-script/reference/base/month
    var input = new Date(year, month, 1);
    var lower = new Date(programYear,5,1);      // month ranges from 0-11 so 5=June; for invoices give May as lower limit just in case somebody already bought a ticket in advance
    var upper = new Date((programYear+1),10,30); // month ranges from 0-11 so 5=June, 10=Nov
    if ((lower.getTime() < input.getTime()) && (input.getTime() < upper.getTime())) {
      Event.date.setValue(input);    // DateBox does not have .setValue(val,bool) method
      s0a.setValue("1",true);
    };
  };
  if(eventInfo.parameter[id.event.type] != void(0) && eventInfo.parameter[id.event.type] != "") {
    // Use ListBox's .setItemSelected() method instead of .setValue() method 
    Event.type.setItemSelected(Event.types.indexOf(eventInfo.parameter[id.event.type]),true);
    s0b.setValue(Event.types.indexOf(eventInfo.parameter[id.event.type]) == 0 ? "0" : "1",true);
  }
  if(eventInfo.parameter[id.invoice.date] != void(0) && eventInfo.parameter[id.invoice.date] != "") {
    // Parse date string formated as YYYY-MM-DD
    var str = '' + eventInfo.parameter[id.invoice.date] + '';
    var strArray = str.split("-");
    var year = parseInt(strArray.shift());
    var programYear = main.programYear();
    var month = parseInt(strArray.shift()) - 1;
    var day = parseInt(strArray);  // dont shift here (?) seems like a bug
    var input = new Date(year, month, day);
    var lower = new Date(programYear,4,1);      // month ranges from 0-11 so 6=July; for invoices give May as lower limit just in case somebody already bought a ticket in advance
    var upper = main.sessionKey;                // current date is upper limit for invoices
    if ((lower.getTime() < input.getTime()) && (input.getTime() < upper.getTime())) {
      Invoice.date.setValue(input);    // DateBox does not have .setValue(val,bool) method
      s1a.setValue("1",true);
    };
  };
  if(eventInfo.parameter[id.invoice.valu] != void(0) && eventInfo.parameter[id.invoice.valu] != "") {
    Invoice.valu.setValue(eventInfo.parameter[id.invoice.valu],true)//.setStyleAttributes(css.txtBx.Valid);
  }
  if(eventInfo.parameter[id.invoice.curr] != void(0) && eventInfo.parameter[id.invoice.curr] != "") {
    Invoice.curr.setValue(eventInfo.parameter[id.invoice.curr],true)//.setStyleAttributes(css.txtBx.Valid);
  }
  if(eventInfo.parameter[id.expense.desc] != void(0) && eventInfo.parameter[id.expense.desc] != "") {
    Expense.desc.setValue(eventInfo.parameter[id.expense.desc],true)//.setStyleAttributes(css.txtBx.Valid);
  }
  if(eventInfo.parameter[id.expense.type] != void(0) && eventInfo.parameter[id.expense.type] != "" && eventInfo.parameter[id.expense.type] != "Travel") {
    Expense.type.setItemSelected(Expense.types.indexOf(eventInfo.parameter[id.expense.type]),true);
    s3a.setValue("3",true);
    if(eventInfo.parameter[id.expense.type] == Expense.types[Expense.X]) {
      Travel.mode.setEnabled(true);
      Travel.dist.setEnabled(true);
      Travel.gmap.setEnabled(true);
      s3a.setValue("1",true);
    } else if(Expense.types.indexOf(eventInfo.parameter[id.expense.type]) == 0) {
      s3a.setValue("0",true);
    }
    // Even if expense is NOT travel, set the other two elements in row[3] to trigger validation 
    s3b.setValue("0",true);
    s3c.setValue("0",true);
  }
//  if(eventInfo.parameter[id.travel.mode] != void(0) && eventInfo.parameter[id.travel.mode] != "") {
//    Travel.mode.setItemSelected(Travel.modes.indexOf(eventInfo.parameter[id.travel.mode]),true);
//    s3b.setValue(Travel.modes.indexOf(eventInfo.parameter[id.travel.mode]) == 0 ? "0" : "1",true);
//  }
//  if(eventInfo.parameter[id.travel.dist] != void(0) && eventInfo.parameter[id.travel.dist] != "") {
//    Travel.dist.setValue(eventInfo.parameter[id.travel.dist],true)//.setStyleAttributes(css.txtBx.Valid);
//  }
//  if(eventInfo.parameter[id.travel.gmap] != void(0) && eventInfo.parameter[id.travel.gmap] != "") {
//    Travel.gmap.setValue(eventInfo.parameter[id.travel.gmap],true)//.setStyleAttributes(css.txtBx.Valid);
//  }
  
  return Form;
}
