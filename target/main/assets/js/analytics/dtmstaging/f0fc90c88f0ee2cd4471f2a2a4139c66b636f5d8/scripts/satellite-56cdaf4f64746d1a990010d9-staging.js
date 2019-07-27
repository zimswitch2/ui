_satellite.pushAsyncScript(function(event, target, $variables){
  //*-* As we opening a new page, make sure we try retrieved newly added form(s)
if(typeof doFormAnalysisRefresh === 'function') {
  doFormAnalysisRefresh();
}
});
