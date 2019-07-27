var successInstantMoneyPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

   this.valueForField = function(label) {
       return element(by.cssContainingText('span',label)).element(by.xpath('following-sibling::span')).getText();
   };
};

module.exports = new successInstantMoneyPage();