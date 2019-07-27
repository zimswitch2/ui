_satellite.pushAsyncScript(function(event, target, $variables){
  //*** Check form formanalysis refresh as we moving to a different page
if(typeof doFormAnalysisRefresh === 'function') {
  doFormAnalysisRefresh();
}
});
