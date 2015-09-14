// CSS - Contextual Style Sheet
//
// Inspired by:
// (1) http://www.harryonline.net/scripts/stylesheets-in-google-apps-script-uiapp/494
// (2) http://www.googleappsscript.org/user-interface/text-box

// Define an array of style objects
var css = {};

// Funtion to apply the style on an element
function setStyleAttributes(element,style){
  for (var key in style){
    element.setStyleAttribute(key, style[key]); 
  }
}

css.app = {
  background: 'transparent',
// https://code.google.com/p/google-apps-script-issues/issues/detail?id=2059
// https://code.google.com/p/google-apps-script-issues/issues/detail?id=1905
  backgroundImage:    "url('http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/2F3459E40401427988CDAAF6AF67D3AC.ashx')",
//  backgroundImage:    "url('https://drive.google.com/file/d/0B9SCVTbDyVswQWc5S0hINVRqVE0/view?usp=sharing')",
//  backgroundImage:    "url('http://www.toastmasters.org/MBBanner')",
  backgroundRepeat:  'no-repeat',
};
// "url('http://www.district59.org/wp-content/uploads/2014/03/cropped-toastmasters_district59_banner-990x180.jpg')"

css.h1 = {
//  fontFamily: 'Monaco,Consolas',
  fontFamily: 'Arial,sans-serif',
  color:'#004F6D',
  fontSize:'21px',
  fontWeight:'bold'
};

css.lbl = {
  fontFamily: 'Arial,sans-serif',
  color:'#333', //'#585858',
  fontSize:'14px',
  fontWeight:'Normal'
};

css.lblA = {
  fontFamily: 'Arial,sans-serif',
  color:'#000', //'#585858',
  fontSize:'14px',
  fontWeight:'Normal',
  borderRadius:'10px',
  backgroundColor:'#53b83c',
  border:   '1px solid #008b27',
//  backgroundColor: Maps.StaticMap.Color.GREEN,
//  border:   '1px solid ' + Maps.StaticMap.Color.BLACK,
  padding:'1px',
};

css.mapImage = {
  zIndex: 1,
};

css.dl6 = {};
css.dl6.A = {
  background: 'no-repeat url("//maps.gstatic.com/mapfiles/dir/dl6.png") 0 -141px',
  width: '15px',
  height: '12px',
};
css.dl6.drive = { // .dir-tm-d
  background: 'no-repeat url("//maps.gstatic.com/mapfiles/dir/dl6.png") 0 -96px',
  width: '15px',
  height: '12px',
};
css.dl6.rail = { // .dir-tm-r
  background: 'no-repeat url("//maps.gstatic.com/mapfiles/dir/dl6.png") 0 -426px',
  width: '13px',
  height: '15px',
};
css.dl6.walk = { // .dir-tm-w
  background: 'no-repeat url("//maps.gstatic.com/mapfiles/dir/dl6.png") 0 -489px',
  width: '10px',
  height: '16px',
};


css.bodyText = {
//  width:'300px', 
  margin:'20px auto',
  border: '1px solid #ccc',
  padding:'10px',
  fontFamily: 'Arial,sans-serif',
  color:'#333', //'#585858',
  fontSize:'14px',
  fontWeight:'Normal',
//  borderStyle:'ridge',
//  borderWidth:'15PX',
//  borderColor:'#eecc99',
};
css.btn = {
//  backgroundColor:"none",
//  background:"none",
//  width:"80px",
  height:"20px",
//  border:"None",
//  fontFamily:"hobo std",
//  fontSize:"0.9em",
//  color:"3f3f3f",
//  opacity:"1",
  fontFamily: 'Arial,sans-serif',
//  color:'#333', //'#585858',
  fontSize:'14px',
  fontWeight:'Normal',
};

css.lstBx = {};
css.lstBx.Valid = {fontSize: '11px', color: 'black'};
css.lstBx.Wrong = {fontSize: '11px', color: 'red',   backgroundColor: 'transparent',};
css.lstBx.Wrong = {fontSize: '11px', color: 'red', };

css.txtBx = {};
css.txtBx.form0 = {width: '250px',};
css.txtBx.Valid = {color: 'black',};
css.txtBx.Wrong = {color: 'red',};

css.txtBx.bCode = {width: '75px'};
css.txtBx.bCity = {width: '200px'};
css.txtBx.bLand = {width: '25px'};
css.txtBx.popup =
css.txtBx.bName =
css.txtBx.bMail =
css.txtBx.bAddr =
css.txtBx.bAdd2 =
css.txtBx.bIBAN =
css.txtBx.bBICS =
css.txtBx.bBANK =
css.txtBx.bBADR = {width: '300px'};

css.title = {
  fontWeight: 'bold',
  color: "White",
  fontSize: "30PX"
};

css.form0 = {
//  background: '#eFeFeF',
  background: 'transparent',
  width:'auto', 
  margin:'auto 30px',
  border: '0px solid #000',
  padding:'10px',
}
css.form2 = css.form1 = css.form0;

//css.form0 = {
//  background: 'White',
//  padding:    '40px',
//  borderStyle:'ridge',
//  borderWidth:'15PX',
//  borderColor:'#eecc99',
//  width: xForm0+'px',
//  margin:'20px auto',
//}

css.body = { 
  width:'300px', 
  margin:'20px auto',
  border: '1px solid #ccc',
  padding:'10px'
};

css.onFormSubmit = { 
//  background: '#eFeFeF',
//  background: '#DDD',
};

css.button = {
  fontWeight: 'bold',
  borderRadius: '10px'
};

css.notification = {
  border: '2px solid #0c0',
  padding:'0.5em', 
  margin:'1em 0'
};

css.event = {};
css.event.date = {width:'100px',height:'21px'};
css.event.type = {width:'350px',height:'21px',};
//css.event.loca = {width:'175px',};
css.invoice = {};
css.invoice.date = {width:'100px',height:'21px',};
css.invoice.valu = {width:'300px',};
css.invoice.curr = {width:'50px',};
//css.invoice.ttax = {width:'75px',};
css.expense = {};
css.expense.desc = {width:'450px',};
css.expense.type = {width:'160px',height:'21px',};
css.expense.blob1 =
css.expense.blob2 =
css.expense.blob3 = {
  width:'450px',
  height:"21px",
//  fontFamily: 'Arial,sans-serif',
//  fontSize:'14px',
//  fontWeight:'Normal',
};
css.travel = {};
css.travel.mode = {width:'230px',height:'21px',};
css.travel.dist = {width:'60px',};
css.travel.gmap = {width:'450px',};

css.popupA = 
css.popupB = {
//  position: 'fixed', 
  padding:  '10px',
//  border:   '5px solid #EfEfEf',
  border:   '3px solid #004F6D',
//  border:   '0px solid white',
  top:      '120px',
  left:     '50px',
//  width:    '150px', 
//  height:   '150px',
//  width:    '85%', 
//  height:   '70%',
  zIndex:   '0',
  opacity:  '0.95',
  backgroundColor:'white',
//  background:"none",
  borderRadius: '15px',  
};

//  Douglas Crockford's talk: https://www.youtube.com/watch?v=hQVTIJBZook
var css1 = function () {
  var css = {};
  css.app = {
    background: 'transparent',
    backgroundImage:    "url('http://www.toastmasters.org/Leadership-Central/Logos-Images-and-Templates/~/media/2F3459E40401427988CDAAF6AF67D3AC.ashx')",
//  backgroundImage:    "url('https://drive.google.com/file/d/0B9SCVTbDyVswQWc5S0hINVRqVE0/view?usp=sharing')",
//  backgroundImage:    "url('http://www.toastmasters.org/MBBanner')",
    backgroundRepeat:  'no-repeat',
  };
  return function (n) {
    return css.n
  };
} ();
