var preScreeningPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.actions = {
        goToNextPage: function () {
            helpers.scrollThenClick(this.getConsentCheckBox());
            helpers.scrollThenClick(this.getNextButton());
        }.bind(this),

        clickNextButton: function () {
            helpers.scrollThenClick(this.getNextButton());
        }.bind(this)
    };

    this.getConsentCheckBox = function () {
        return element(by.css('input#creditAndFraudCheckConsent'));
    };

    this.getNextButton = function () {
        return element(by.css('button#confirm'));
    };

    this.getPreScreenHeader = function () {
        return element(by.id('prescreen-heading')).getText();
    };

};

module.exports = new preScreeningPage();
