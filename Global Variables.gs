var thisRelease = 'v0.9e';
var showGmap = false;
//var props = PropertiesService.getUserProperties();
//var cache = CacheService.getPrivateCache();

var enm = {};
enm.valign = UiApp.VerticalAlignment.MIDDLE;
enm.datefm = UiApp.DateTimeFormat.DATE_SHORT;

var lbl = {};
lbl.TImail = 'Email:';
lbl.TInumb = 'Password:';
lbl.TIclub = 'Club #:';

var sw = {};
sw.state = false;

var h1 = {};
h1.exit = 'Session terminated';
h1.expiredSession = 'Session expired';
h1.form0 = 'District User Login';
h1.form1 = 'Beneficiary Information';
h1.form2 = 'Expense Line Item';
h1.form3a = 'Submission Successful';
h1.form3b = 'Submission Failed';
h1.form3c = 'Confirmation Sent';
h1.formX = 'Form X';

var id = {};
id.btn = {};
id.btn.back2 = 'back2';
id.btn.stay2 = 'stay2';
id.btn.next2 = 'next2';

id.event = {};
id.event.date = 'event.date';
id.event.type = 'event.type';
id.event.loca = 'event.loca';

id.invoice = {};
id.invoice.date = 'invoice.date';
id.invoice.curr = 'invoice.curr';
id.invoice.valu = 'invoice.valu';
id.invoice.ttax = 'invoice.ttax';

id.expense = {};
id.expense.desc = 'expense.desc';
id.expense.type = 'expense.type';
id.expense.blob1 = 'expense.blob1';
id.expense.blob2 = 'expense.blob2';
id.expense.blob3 = 'expense.blob3';
id.expense.url1 = 'expense.url1';
id.expense.url2 = 'expense.url2';
id.expense.url3 = 'expense.url3';


id.travel = {};
id.travel.mode = 'travel.mode';
id.travel.dist = 'travel.dist';
id.travel.gmap = 'travel.gmap';

id.onFormSubmit = 'onFormSubmit';


id.popup = {};
id.popup.pane = 'popup.pane';
id.popup.body = 'popup.body';
id.popup.from = 'popup.from';
id.popup.dest = 'popup.dest';
id.popup.smap = 'popup.smap';

id.popup.paneA = 'popup.paneA';
id.popup.bodyA = 'popup.bodyA';
id.popup.fromA = 'popup.fromA';
id.popup.destA = 'popup.destA';
id.popup.smapA = 'popup.smapA';

id.popup.paneB = 'popup.paneB';
id.popup.bodyB = 'popup.bodyB';
id.popup.fromB = 'popup.fromB';
id.popup.destB = 'popup.destB';
id.popup.smapB = 'popup.smapB';
id.popup.image = 'popup.image';
id.popup.backB = 'popup.backB';
id.popup.nextB = 'popup.nextB';
id.popup.chkb1 = 'popup.chkb1';
id.popup.chkb2 = 'popup.chkb2';



var txt = {};
txt.popup = {};
txt.popup.backB = 'Cancel';
txt.popup.backBtoolTip = 'Cancel map tool';
txt.popup.nextB = 'Continue';
txt.popup.nextBtoolTip = 'Accept this route';

txt.load1 = 'Load default';
txt.save1 = 'Save as default';
txt.loadToolTip = 'Click to pre-load the default beneficiary address and banking information';
txt.saveToolTip = 'Click to save beneficiary address and banking information (excludes name and Email)';

txt.AddL = {};
txt.AddL.label2 = 'Add Line';
txt.AddL.enabled2 = 'Click to add another line item to this submission';
txt.AddL.blocked2 = 'Form is not completely filled';

txt.Back = {};
txt.Back.label0 = 'Login';
txt.Back.label1 = 'Continue';
txt.Back.label2 = 'Beneficiary';
txt.Back.label3 = 'Add another line';
txt.Back.enabled2 = 'Go back to revise beneficiary data';

txt.Stay = {};
txt.Stay.label0 =
txt.Stay.label1 =
txt.Stay.label2 =
txt.Stay.label3 = 'Send Email receipt';

txt.Exit = {};
txt.Exit.label0 =
txt.Exit.label1 =
txt.Exit.label2 =
txt.Exit.label3 = 'Terminate session';
txt.Exit.enabled0 =
txt.Exit.enabled1 =
txt.Exit.enabled2 =
txt.Exit.enabled3 = 'Click to exit this form submission';

txt.Sbmt = {};
txt.Sbmt.label0 = 'Login';
txt.Sbmt.label1 = 'Continue';
txt.Sbmt.label2 = 'Submit';
txt.Sbmt.enabled0 = 'Click authenticate your identity';
txt.Sbmt.enabled1 = 'Click to begin submission of expense line items';
txt.Sbmt.enabled2 = 'Click submit the assembled line item(s)';
txt.Sbmt.blocked2 = txt.AddL.blocked2;

// to be deleted
txt.addl2toolTip = txt.AddL.enabled;
txt.back2 = txt.Back.label2;
txt.back2toolTip = txt.Back.enabled2;
txt.submit0 = txt.Sbmt.label0;
txt.submit1 = txt.Sbmt.label1;
txt.sbmt2 = txt.Sbmt.label2;
txt.submitToolTip0 = txt.Sbmt.enabled0;
txt.submitToolTip1 = txt.Sbmt.enabled1;
txt.sbmt2ToolTip   = txt.Sbmt.enabled;


txt.TImail = 'Enter your primary email registered at Toasmasters International';
txt.TInumb = 'Enter your client number registered at Toasmasters International';
txt.TIclub = 'Enter your home club number registered at Toasmasters International';
txt.bName = 'Your name or the name of the beneficiary if you are submitting a request for another person';
txt.bMail = 'Your mail or the mail of the beneficiary if you are submitting a request for another person';
txt.bAddr = 'Enter your address or that of the beneficiary if you are submitting a request for another person';
txt.bAdd2 =
txt.bAdd3 = txt.bAddr;
txt.bIBAN = 'Enter your IBAN or that of the benefciary if different from yours';
txt.bBICS = 'Enter your IBAN or that of the benefciary if different from yours';
txt.bBANK = 'Enter your bank name or that of the benefciary if different from yours';
txt.bBADR = 'Enter your bank address or that of the benefciary if different from yours';

txt.event = {};
txt.event.date = 'Event date formatted YYYY-MM-DD\nPlease do not enter a range of dates.';
txt.event.type = 'Type of event';
//txt.event.loca = 'Location of event or expense';

txt.invoice = {};
txt.invoice.date = 'Receipt date formatted YYYY-MM-DD\nPlease do not enter a range of dates.';
txt.invoice.curr = 'Currency of receipt';
txt.invoice.valu = 'Total amount of invoice or receipt. For mileage expense, the rate is 0.17 Euro per kilometer.';
//txt.invoice.ttax = 'Total tax included in invoice or receipt';

txt.expense = {};
txt.expense.desc = 'Details of the event and the nature of expense';
txt.expense.type = 'Type of event or expense';
txt.expense.blob1 = 'Always include a summary page itemizing the receipts and your accounting.\n\nIf you bundle several receipts, they must be from the same event as well as of the same nature (i.e. accounting category).\n\nMileage reimbursements require documentation consisting of the travel dates, distance and travel purpose. For club visits, include club name and number. ';
txt.expense.blob2 = 'Use the additional uploads to include eg. pre-authorizations of expenses.\n\nFor reimbursements involving FX, include eg. a credit card statement to document the exchange rate you experienced.';
txt.expense.blob3 = 'See CamScanner.com for a smart phone app to take clipped photos of receipts.\n\nSee SmallPDF.com/merge-pdf to combine images and PDFs into mult-page PDFs (free online service).';

txt.travel = {};
txt.travel.mode = 'Mode of travel';
txt.travel.dist = 'Distance travelled from your home to the event location; use Google Maps to get value';
txt.travel.gmap = 'Shortened URL link to Google map showing distance calculation';



var msg = {};
msg.blank = '';
msg.required = '*';
msg.TImail = 'Email not registered';
msg.TInumb = 'Password incorrect';
msg.TIclub = 'Home club incorrect';
msg.len = 'Text too short/long';
msg.mail0 = 'May not be Email';
msg.mail1 = 'Must be valid Email';
msg.numb = 'May not be numeric';
msg.land = 'Two-letter country code';
msg.code = 'Postal code invalid';
msg.city = 'City too short/long';
msg.IBAN = 'IBAN checksum incorrect';
msg.IBAN2 = 'Remove non-alphanumeric text';
msg.BICS = '8 or 11 character code';
msg.event = {};
msg.event.date = 'Event month';
msg.event.type = 'Event type';
msg.invoice = {};
msg.invoice.date = 'Invoice/Receipt date';
msg.invoice.valu = 'Total Amount';
msg.invoice.curr = 'Currency code';
msg.expense = {};
msg.expense.blob1 =
msg.expense.blob2 =
msg.expense.blob3 = 'Image/PDF to upload';
msg.expense.type = 'Expense category';
msg.travel = {};
msg.travel.dist = 'kilometers';
msg.travel.mode = 'mode of transport';

var caption1 = 'Beneficiary Information';

//var minA = 354177;  // Odile Petrus
//var A = 3752528; // Pilar Riveros
//var minB = 491;     // Green Heart Club - Balint Juhasz
//var B = 3263044; // Taguspark Toastmasters
var minL = 3;  // minimum length of name or address line
var maxL = 36; // maximum length of name or address line
var maxD = 128;

var maxHm = 350;
var maxWm = 500;
var maxHn = 500;
var maxWn = 700;


var regex = {};
regex.blank = '^$';
regex.club = '^\\d{3,7}$'; // Club numbers 3-7 digits
//regex.numb = "^\\d{6,7}$"; // Client numbers 6-7 digits
regex.numb = "^\\w{6,16}$"
// http://stackoverflow.com/questions/18629560/regex-for-floating-point-numbers?rq=1
// ^(?:[-+]?\d*?(?<=\d)([,.](?>\d*)([eE][-+]?\d+)?)?|\.\d+)$
regex.float = '^(?:[-+]?\\d*?(?<=\\d)([,.](?>\\d*)([eE][-+]?\\d+)?)?|\\.\\d+)$';

regex.VAL = '^[0-9]{0,3}[\.,]?[0-9]{1,3}[\.,]?[0-9]{0,2}$';
regex.VAL = '/|^[1-9]{1,3}[\.]?[0-9]{1,3}[,]?[0-9]{0,2}$|^[1-9]{1,3}[,]?[0-9]{1,3}[\.]?[0-9]{0,2}$|/';

// regex.VAL = '/|^[1-9]{1,1}[\.]?[0-9]{1,3}[,](?=[0-9]{1,2})$|^[1-9]{1,3}[,](?=[0-9]{1,2})$|^[1-9]{1,1}[,]?[0-9]{1,3}[\.](?=[0-9]{1,2})$|^[1-9]{1,3}[\.](?=[0-9]{1,2})$|/';
// RegEx look ahead (?=x) does not work so do it manually as logical branches
//regex.VAL = '/|^[1-9]{1,2}[\.]?[0-9]{1,3}[,]{1}[0-9]{0,2}$|^[1-9]{1,3}[,]{1}[0-9]{0,2}$|^[1-9]{1,2}[\.]?[0-9]{1,3}$|^[1-9]{1,3}$|^[1-9]{1,2}[,]?[0-9]{1,3}[\.]{1}[0-9]{0,2}$|^[1-9]{1,3}[\.]{1}[0-9]{0,2}$|^[1-9]{1,2}[,]?[0-9]{1,3}$|/';
regex.VAL = '/|^[1-9]{1,2}[\.]?[0-9]{1,3}[,]{1}[0-9]{0,2}$|^[1-9]{1,3}[,]{1}[0-9]{0,2}$|^[1-9]{1,2}[\.]?[0-9]{1,3}$|^[1-9]{1,2}[,]?[0-9]{1,3}[\.]{1}[0-9]{0,2}$|^[1-9]{1,3}[\.]{1}[0-9]{0,2}$|^[1-9]{1,2}[,]?[0-9]{1,3}$|/';

//regex.date = '[0-9\-]+';
//regex.date = '[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}';
//regex.date = '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$';
//regex.date = '[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]';
//regex.date1 = '[0-9]{4}[.\-][0-1][0-9][.\-][0-3][0-9]';
//regex.date2 = '[0-9]{4}.[0-1][0-9].[0-3][0-9]';
//regex.date1 = '[0-9]{4}[.\-][0-1]?[0-9][.\-][0-3]?[0-9]';
//regex.date2 = '[0-9]{4}.[0-1]?[0-9].[0-3]?[0-9]';
regex.date1 = '[0-9\-]+[^ &][0-9\-]+';
regex.date2 = '[0-9\-]+[^ &]?[0-9\-]+';  // Conclusion: RegEx just does not work with the DateBox!



regex.dist = '^[0-9]{1,5} ?(?=km)$';
regex.dist = '^[0-9]{1,5}.*$';
regex.dist = '^[0-9]{1,4}[ km]*$';
regex.dist = '/|^[0-9]{1,4}[ km]*$|^[0-9]{1,4}[\.,]{1}[0-9]{0,1}[ km]*$|/';
regex.dist = '/|^[1-9]{1,2}[\.]?[0-9]{1,3}[,]{1}[0-9]{0,2}[ kmi]*$|^[1-9]{1,3}[,]{1}[0-9]{0,2}[ kmi]*$|^[1-9]{1,2}[\.]?[0-9]{1,3}[ kmi]*$|^[1-9]{1,3}[ kmi]*$|^[1-9]{1,2}[,]?[0-9]{1,3}[\.]{1}[0-9]{0,2}[ kmi]*$|^[1-9]{1,3}[\.]{1}[0-9]{0,2}[ kmi]*$|^[1-9]{1,2}[,]?[0-9]{1,3}[ kmi]*$|/';

// http://www.labnol.org/internet/regular-expressions-forms/28380/
regex.money = '\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?';

//regex.EU = '/BE|CH|ES|FR|IT|LU|NL|PT|DE|PL|FI|SE|DK|NO/';
//regex.EU = '/|AL|AD|AT|BE|BA|BG|HR|CY|CZ|DK|EE|FI|FR|GE|DE|GI|GR|HU|IS|IE|IL|IT|LV|LI|LT|LU|MK|MT|MC|ME|NL|NO|PL|PT|RO|RS|SK|SI|ES|SE|CH|TR|GK|GB|/';
regex.EU = '/|AD|AL|AT|AU|BE|BA|BG|CH|CY|CZ|DK|EE|ES|FI|FR|GE|DE|GB|GI|GK|GR|HU|HR|IS|IE|IL|IT|LI|LT|LU|LV|MK|MC|ME|MT|NA|NL|NO|PL|PT|RO|RS|SE|SI|SK|SL|TR|UK|US|/';
// http://www.oanda.com/help/currency-iso-code-country
//regex.FX = '/|EUR|CHF|DKK|SEK|NOK|MYR|PLN|ZAR|USD|GBP|AED|SIT|SKK|SGD|QAR|LTL|LBP|LVL|KWD|JOD|JPY|ILS|ISK|INR|IDR|HUF|HKD|GIP|EEK|EGP|CZK|HRK|CVE|CAD|BGN|ADF|ADP|AUD|/';
regex.FX = '/|ADF|ADP|AED|ATS|AUD|BGL|BGN|BHD|BYR|CAD|CHF|CVE|CZK|DKK|EEK|EGP|EUR|GBP|GIP|HKD|HRK|HUF|IDR|ILS|INR|ISK|JOD|JPY|KWD|LBP|LTL|LVL|MYR|NOK|PLN|QAR|ROL|RON|SEK|SGD|SIT|SKK|USD|ZAR|/';

// http://stackoverflow.com/questions/23471591/regex-for-iban-allowing-for-white-spaces-and-checking-for-exact-length

// http://snipplr.com/view/15322/iban-regex-all-ibans/
// regex.IBAN = '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$';

// http://snipplr.com/view/15320/bic-bank-identifier-code-regex/
//regex.BICS = 'ˆ([a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?)$';

// http://en.wikipedia.org/wiki/ISO_9362
regex.BICS = '/^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/';

// http://serprest.pt/jquery/ht5ifv/extensions/tools/IBAN/
// /^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LI\d{7}[0-9A-Z]{12}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^GB\d{2}[A-Z]{4}\d{14}$/

// Specification of Length but not structure yields a shorter RegEx
regex.IBAN = '/^[0-9A-Z]{15,16}$|^[0-9A-Z]{18}$|^[0-9A-Z]{20,25}$|^[0-9A-Z]{27,28}$|^[0-9A-Z]{31}$/';
regex.IBAN2 = '[ .-]+'; // Stuff to exclude
// Specification of structure but not length yields a longer RegEx which does not work!
//regex.IBAN = '/^NL[0-9]{2}[A-Z]{4}[0-9]{10}$|^PT[0-9]{23}$/';
//regex.IBAN = '/^NL[0-9A-Z]{16}$|^PT[0-9]{23}$/';
//regex.IBAN = '/^NL\w{16}$|^PT\w{23}$/';
//regex.IBAN = '^(?=[0-9A-Z]{18}$)NL\d{2}[A-Z]{4}\d{10}$';
//regex.IBAN = '^NL\d{2}[A-Z]{4}\d{10}$';
//regex.IBAN = '/^NL.{16}$|^PT.{23}$/';

// https://code.google.com/p/google-apps-script-issues/issues/detail?id=2411
// Summary: setText() and setValue() set both the text and the value
// 
// Textboxes do not have a separate text and value, they are the same thing. There are two different
// methods for historical reasons. Unfortunately UiApp does not support the "placeholder" attribute
// for showing default text, but if you use HtmlService instead you can utilize that.


// http://stackoverflow.com/questions/712132/in-html-i-can-make-a-checkmark-with-x2713-is-there-a-corresponding-x-mark
// http://www.danshort.com/HTMLentities/index.php?w=dingb
//var checkHTML =  "<span style='font-family:Wingdings;color:green'>&thorn;</span >";
//var crossHTML =  "<span style='font-family:Wingdings;color:red  '>&yacute;</span>";
var html = {};
//html.check =  "<span style='font-family:\"Zapf Dingbats\";color:green'>&nbsp;&#10004;&nbsp;</span>"; // &#10003;&#x2713;
//html.cross =  "<span style='font-family:\"Zapf Dingbats\";color:red'  >&nbsp;&#10008;&nbsp;</span>"; // &#10007;&#x2717;
html.check =  "<span style='font-family:\"Zapf Dingbats\";color:#004F6D'>&nbsp;&#10004;&nbsp;</span>"; // &#10003;&#x2713;
html.cross =  "<span style='font-family:\"Zapf Dingbats\";color:#ff4b33'  >&nbsp;&#10008;&nbsp;</span>"; // &#10007;&#x2717;
html.pleaseWait = "&nbsp;<i><span style='color:#ff4b33'>Please wait...</span></i>";
html.onFormSubmit2 = "&nbsp;<i><span style='color:#004F6D'>File upload in progress.</span> <span style='color:#ff4b33'>Please wait...</span></i>";
html.onFormSubmit3 = "&nbsp;<i><span style='color:#004F6D'>Sending message.        </span> <span style='color:#ff4b33'>Please wait...</span></i>";
var checkHTML = html.check;
var crossHTML = html.cross;
