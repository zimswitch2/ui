_satellite.pushAsyncScript(function(event, target, $variables){
  //*** Monitor Accordion as main script is within minified and other js
$(document).ready(function(){
  var cur_pageName = _satellite.getVar('pageName');
  var $mainAccordionParent = $('div.accordion-container');
  var accText = '';
  var accType = 'Product Box | ';
  if($mainAccordionParent.length > 0){
    $($mainAccordionParent).find('div.accordion-tab-title').each(function(){
      $(this).bind('click', function(){
        accText = $(this).find('h4').text();
        accText = accText.replace(/\n|\n\r|\s{2,}|^\s+|\s+$/ig,'');
        // console.log(accText, $mainAccordionParent);
        if($(this).next().is('div') && $(this).next().attr('class').indexOf('ng-hide') < 0){
          dataLayer.userInteraction = 'uit_Accordion-' + accType + accText;
  				_satellite.track('genericUserInteraction');
        }
      })
    })
  }
})
});
