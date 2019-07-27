//*** Load form Analysis
var frmConfig = {'formout': 'otpForm,resetPasswordForm,rechargePrepaidForm,voucherform,transferBetweenAccountsForm,addBeneficiaryForm', 'formin': '', 'myInputErrClassName': ''};
_satellite.track('loadFormAnalysis');

//*** Auto Call back function the form analysis will call once ready
function frmTrkFormReady(){
  formtracker = new formAnalysis(frmConfig);
}

//*** Form started - Called from the form analysis
function frmTrkcbFormStart(formName){
  var dtm_formName = formName.replace(/\-|\_/ig,' ');
  dtm_formName = dtm_formName.toLowerCase();
  dataLayer.formisSubmitted = false;
  dataLayer.formStatus = '';
  dataLayer.formName = dtm_formName;
  // console.log('FORM STARTED HERE***');
  _satellite.track('globalFormStart');
}
//*** Script to monitor the form abandonment
window.onbeforeunload = function () {
  // console.log('VARS === > ' + _satellite.getVar('formisSubmitted'));
  if(!_satellite.getVar('formisSubmitted') && typeof formtracker !== 'undefined' && formtracker.currentform.started){
    _satellite.track('globalFormAbandon');
    dataLayer.formisSubmitted = false;
  }
  return;
}
//*-* Allow form refresh to happen via a global function
var refreshRunState = false;
function doFormAnalysisRefresh(){
  // console.log(typeof formAnalysis + ' -=-  ' + typeof formtracker + ' -- '+ refreshRunState);
  if(!refreshRunState && typeof formAnalysis === 'function') {
    refreshRunState = true;
    var $testFormValid = $('form');
    var maxTest = 0;
    //*-* Do i  have form but no fields yet have been added
    if($testFormValid.length > 0 && $testFormValid.eq(0).find('input,select').length === 0) {
      $testFormValid = $testFormValid.eq(0);
      var lookForFullyRenderedFormTimer = setInterval(function(){
        maxTest ++;
        if($testFormValid.find('input,select').length > 0) {
          if(typeof formtracker === 'object'){
            formtracker.refresh();
          }
          clearInterval(lookForFullyRenderedFormTimer);
        }
        if(maxTest === 5) {
          clearInterval(lookForFullyRenderedFormTimer);
        }
      },100);
    } else {
      // console.log('***2 Form refresh kicks in ' + typeof formtracker);
      if(typeof formtracker === 'object'){
        formtracker.refresh();
      }
    }
    refreshRunState = false;
  }
}
/*
* Set s object found in the event based rule
* This is to fix the user interaction and allow the correct location data to go with the correct tag
*/
function setSobjectForEventBasedRules(evtBaseRuleName, s){
  var ClonedDataLayer = _satellite.getVar('ClonedDataLayer');
  var dtmEventBasedRules = _satellite.rules;
  var dtmCurentEvtBasedRuleSetVars;
  var resetSetVar;
  var filldatawith;
  for(var eidx=0, elen= dtmEventBasedRules.length; eidx < elen; eidx++){
    if(dtmEventBasedRules[eidx].name === evtBaseRuleName){
      dtmCurentEvtBasedRuleSetVars = dtmEventBasedRules[eidx].trigger[0].arguments[0].setVars;
      for(var varidx in dtmCurentEvtBasedRuleSetVars) {
        resetSetVar = dtmCurentEvtBasedRuleSetVars[varidx].match(/\%\b[a-z0-9\s]+\b\%/gi);
        if(resetSetVar !== null && typeof resetSetVar =='object'){
          var tempSerVar = dtmCurentEvtBasedRuleSetVars[varidx];
          for(var midx in resetSetVar){
            filldatawith = ClonedDataLayer.get(resetSetVar[midx].replace(/\%/g,''));
            //set the s object here
            tempSerVar = tempSerVar.replace(resetSetVar[midx],filldatawith);
            s[varidx] = tempSerVar;
          }
        }
      }
      break;
    }
  }
}
/*
* Ensure to only keep the s vars set to for with this spefcified rule
*/
function onlyKeepMyCurrentRuleSVars(s, type, ruleName){
  var sVarsObj = s.c;
  var myRuleConfig = _satellite.rules;
  var myRuleVarsSetup = "";
  if(type === 'eventrule') {
    myRuleConfig = _satellite.rules;
  } else if(type === 'directcall'){
    myRuleConfig = _satellite.directCallRules;
  }
  //*-* Go find my Rule
  for(var idx=0, ilen=myRuleConfig.length; idx<ilen; idx++){
    if(myRuleConfig[idx].name == ruleName){
      myRuleVarsSetup = myRuleConfig[idx].trigger[0].arguments[0].setVars;
      break;
    }
  }
  if(myRuleVarsSetup){
    //*-* Cycle through the s object variables and clear those which arent matching what that specific rule has
    for(var idx=0, ilen=sVarsObj.length; idx<ilen; idx++){
      if((sVarsObj[idx].indexOf("eVar") === 0 || sVarsObj[idx].indexOf("prop") === 0 || sVarsObj[idx].indexOf("hier") === 0 || sVarsObj[idx].indexOf("list") === 0) && typeof s[sVarsObj[idx]] !== "undefined" && s[sVarsObj[idx]] != "" && !myRuleVarsSetup.hasOwnProperty(sVarsObj[idx])){
        // console.log("CLEAR =-----*** " + ruleName + ' -=- '+ sVarsObj[idx]);
        s[sVarsObj[idx]] = "";
      }
    }
  }
}
