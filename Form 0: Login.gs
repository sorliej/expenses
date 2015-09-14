function getLogin(eventInfo,n,flag) {
  var ui = UiApp.getActiveApplication();
  
  var vTImail = ((flag==0) ? msg.blank : eventInfo.parameter.TImail);
  var vTInumb = ((flag==0) ? msg.blank : eventInfo.parameter.TInumb);
  var vTIclub = ((flag==0) ? msg.blank : eventInfo.parameter.TIclub);
  
  var grid = ui.createGrid(3, 2);
  
  var TImail = ui.createTextBox()
    .setId('TImail')
    .setName('TImail')
    .setText(vTImail)
    .setStyleAttributes(css.txtBx.form0)
    .setStyleAttributes((flag==0 || flag==-3) ? css.txtBx.Wrong : css.txtBx.Valid)
    .setTitle(txt.TImail);
  var CheckM = ui.createHTML(checkHTML)
    .setVisible(flag!=-3 && flag!=0);
  var CrossM = ui.createHTML(crossHTML+(flag==-3?msg.TImail:msg.blank))
    .setVisible(flag==-3);
  var pTImail = ui.createHorizontalPanel()
    .add(TImail)
    .add(CheckM)
    .add(CrossM)
    .setCellVerticalAlignment(CheckM,enm.valign)
    .setCellVerticalAlignment(CrossM,enm.valign);
    
  var TInumb = ui.createPasswordTextBox()
    .setId('TInumb')
    .setName('TInumb')
    .setText(vTInumb)
    .setStyleAttributes(css.txtBx.form0)
    .setStyleAttributes((flag==0 || flag==-2) ? css.txtBx.Wrong : css.txtBx.Valid)
    .setTitle(txt.TInumb);
  var CheckN = ui.createHTML(checkHTML)
    .setVisible(flag==-1||flag==-3);
  var CrossN = ui.createHTML(crossHTML+(flag==-2?msg.TInumb:msg.blank))
    .setVisible(flag==-2);
  var pTInumb = ui.createHorizontalPanel()
    .add(TInumb)
    .add(CheckN)
    .add(CrossN)
    .setCellVerticalAlignment(CheckN,enm.valign)
    .setCellVerticalAlignment(CrossN,enm.valign);
    
  var TIclub = ui.createTextBox()
    .setId('TIclub')
    .setName('TIclub')
    .setText(vTIclub)
    .setStyleAttributes(css.txtBx.form0)
    .setStyleAttributes((flag==0 || flag==-1) ? css.txtBx.Wrong : css.txtBx.Valid)
    .setTitle(txt.TIclub);
  var CheckC = ui.createHTML(checkHTML)
    .setVisible(flag==-2||flag==-3);
  var CrossC = ui.createHTML(crossHTML+(flag==-1?msg.TIclub:msg.blank))
    .setVisible(flag==-1);
  var pTIclub = ui.createHorizontalPanel()
    .add(TIclub)
    .add(CheckC)
    .add(CrossC)
    .setCellVerticalAlignment(CheckC,enm.valign)
    .setCellVerticalAlignment(CrossC,enm.valign);
  
  grid.setWidget(0, 0, ui.createLabel(lbl.TImail).setStyleAttributes(css.lbl).setTitle(txt.TImail));
  grid.setWidget(1, 0, ui.createLabel(lbl.TInumb).setStyleAttributes(css.lbl).setTitle(txt.TInumb));
  grid.setWidget(2, 0, ui.createLabel(lbl.TIclub).setStyleAttributes(css.lbl).setTitle(txt.TIclub));
  grid.setWidget(0, 1, pTImail);
  grid.setWidget(1, 1, pTInumb);
  grid.setWidget(2, 1, pTIclub);

  var H1 = ui.createHTML(h1.form0)
    .setStyleAttributes(css.h1);
  
  // Increment the ID stored in a hidden text-box
  var state = ui.createTextBox().setId('state').setName('state').setValue(1+n).setVisible(sw.state).setEnabled(false);
  var nSubm = ui.createTextBox().setId('nSubm').setName('nSubm').setValue("1").setVisible(sw.state).setEnabled(true);
//  var H1 = ui.createHTML("<H1>Form "+n+"</H1>");
//  var H2 = ui.createHTML(
//    "<h2>"+(eventInfo.parameter.formId==void(0)?"":"Created by submission of form "+eventInfo.parameter.formId)+"</h2>");

  // Add three submit buttons to go forwards, backwards and to validate the form
  var Btn = {};
  Btn.Next = ui.createSubmitButton(txt.submit0).setStyleAttributes(css.btn).setEnabled(false).setVisible(n==0).setTitle(txt.submitToolTip0);
  Btn.Back = ui.createSubmitButton(txt.submit0).setStyleAttributes(css.btn).setEnabled(n>1).setVisible(false);
  Btn.Stay = ui.createSubmitButton(txt.submit0).setStyleAttributes(css.btn).setEnabled(n>0).setVisible(n==1).setTitle(txt.submitToolTip0);
  var Buttons = ui.createHorizontalPanel().add(Btn.Back).add(Btn.Stay).add(Btn.Next);

  var Body = ui.createVerticalPanel()
    .add(state)
    .add(nSubm)
    .add(H1)
//    .add(H2)
    .add(grid)
    .add(Buttons);
  Logger.log("debug: %s",main.cache.get('debugParameters'));
  if (main.cache.get('debug')=='parameters'){Body.add(main.getParameters(eventInfo))};
  var Form = ui.createFormPanel()
    .setId((n>0?'doPost[':'doGet[')+n+']')
    .setStyleAttributes(css.form0)
    .add(Body);

  // Add client handlers using setText() to adjust state prior to form submission
  // NB: Use of the .setValue(val) and .setValue(val,bool) methods give runtime errors!
  Btn.Stay.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n,10))));
  Btn.Back.addClickHandler(ui.createClientHandler().forTargets(state).setText(''+(parseInt(n,10)-1)));

  // Add an event handler executed prior to form submission
  var onFormSubmit = ui.createClientHandler()
  .forTargets(state).setEnabled(true) // Enable so value gets included in post parameters
  .forTargets(Body).setStyleAttributes(css.onFormSubmit);    
  Form.addSubmitHandler(onFormSubmit);

  var on = ui.createClientHandler()
    .validateEmail(TImail)
    .validateMatches(TInumb,regex.numb)//    .validateInteger(TInumb).validateRange(TInumb,minA,maxA)
    .validateMatches(TIclub,regex.club)//    .validateInteger(TIclub).validateRange(TIclub,minB,maxB)
    .forTargets(Btn.Next,Btn.Stay).setEnabled(true);

  var onM = ui.createClientHandler()
    .validateEmail(TImail)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(CrossM).setVisible(false)
    .forTargets(CheckM).setVisible(true);
  var onN = ui.createClientHandler()
    .validateMatches(TInumb,regex.numb)//    .validateInteger(TInumb).validateRange(TInumb,minA,maxA)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(CrossN).setVisible(false)
    .forTargets(CheckN).setVisible(true);
  var onC = ui.createClientHandler()
    .validateMatches(TIclub,regex.club)//    .validateInteger(TIclub).validateRange(TIclub,minB,maxB)
    .forEventSource().setStyleAttributes(css.txtBx.Valid)
    .forTargets(CrossC).setVisible(false)
    .forTargets(CheckC).setVisible(true);
    
  var offM = ui.createClientHandler()
    .validateNotEmail(TImail)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Stay).setEnabled(false)
    .forTargets(CheckM).setVisible(false)
    .forTargets(CrossM).setVisible(true);
  var offN = ui.createClientHandler()
    .validateNotMatches(TInumb,regex.numb)//    .validateNotRange(TInumb,minA,maxA)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(Btn.Next,Btn.Stay).setEnabled(false)
    .forTargets(CheckN).setVisible(false)
    .forTargets(CrossN).setVisible(true);
  var offC = ui.createClientHandler()
    .validateNotMatches(TIclub,regex.club)//    .validateNotRange(TIclub,minB,maxB)
    .forEventSource().setStyleAttributes(css.txtBx.Wrong)
    .forTargets(CheckC).setVisible(false)
    .forTargets(CrossC).setVisible(true);
    
  TImail.addValueChangeHandler(onM).addValueChangeHandler(offM).addValueChangeHandler(on);
  TInumb.addValueChangeHandler(onN).addValueChangeHandler(offN).addValueChangeHandler(on);
  TIclub.addValueChangeHandler(onC).addValueChangeHandler(offC).addValueChangeHandler(on);

  
  return Form;
}
