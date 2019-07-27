var currentAccountDetailsPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var that = this;
    var currentAccountApplyButton =  element(by.id('current-account-apply-now'));

    this.actions = {
        view: function () {
            return helpers.scrollThenClick(that.getVisibleViewButton());
        },
        applyForCurrentAccount: function () {
            return helpers.scrollThenClick(currentAccountApplyButton);
        }
    };

    this.getOverdraft = function () {
        return element(by.id('overdraft')).getText();
    };

    this.getAcceptedOfferAcceptedDate = function () {
        return element(by.id('acceptedApplicationDate')).getText();
    };

    this.getPendingOfferApplicationDate = function () {
        return element(by.id('pendingApplicationDate')).getText();
    };

    this.getAccountNumber = function () {
        return element(by.id('acceptedApplicationAccountNumber')).getText();
    };

    this.getVisibleViewButton = function () {
        return element(by.id('viewOffersButton'));
    };

    this.getCurrentAccountApplyNow = function () {
        return currentAccountApplyButton;
    };

};

module.exports = new currentAccountDetailsPage();
