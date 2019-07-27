var TransferConfirmPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.availableFromBalance = function () {
        return element(by.css('div[name=summary]:not(.ng-hide) #available-from-balance')).getText();
    };

    this.availableToBalance = function () {
        return element(by.css('div[name=summary]:not(.ng-hide) #available-to-balance')).getText();
    };

    this.getDetails = function(){
        return element.all(by.css('#confirmation-details')).first().getText();
    };

    this.getSteps = function(){
        return element(by.css('.steps'));
    };

    this.proceed = function () {
        helpers.scrollThenClick(element(by.css('#transfer')));
    };

    this.modify = function() {
        helpers.scrollThenClick(element(by.css('#modify')));
    };

    this.visibleButtons = function() {
        return element.all(by.css('div[name=summary]:not(.ng-hide) .button'));
    };

};

module.exports = new TransferConfirmPage();
