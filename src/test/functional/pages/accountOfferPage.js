var accountOfferPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.actions = {
        accept: element(by.id('accept')),
        selectOverdraft: element(by.id('currentAccountSelectOverdraft')),
        selectConsent: element(by.id('currentAccountGiveConsent')),
        overdraftAmount: element.all(by.css('section.overdraft input[name="amount"]')).first()
    };

    this.classnames = {
        overdraft: '.overdraft',
        consent: '.overdraft-consent',
        'product family': '.offer',
        offer: '.accept-offer',
        'account information': '.account-information',
        'available product': '.option-box-title'
    };

    var currentAccountOverdraftOfferDetails = {
        cssPropertyMap: {
            "Amount": '#amount',
            "Maximum overdraft limit": '#currentAccountOverdraftLimit',
            "Interest rate": '#currentAccountOverdraftRate'
        },
        rowSelector: '.overdraft-properties-group'
    };

    this.getCurrentAccountOverdraftOfferDetails = function () {
        return currentAccountOverdraftOfferDetails;
    };

    this.productFamilyName = function () {
        return element(by.id('productFamilyName')).getText();
    };

    this.productNames = function () {
        return element.all(by.css('.option-box-title h3')).map(function (productTitle) {
            return productTitle.getText();
        });
    };

    this.chooseProduct = function (index) {
        return element.all(by.css('.option-box button')).get(index).click();
    };

    this.overdraftSection = function () {
        return element(by.id('currentAccountOverdraft')).getText();
    };

    this.overdraftLimit = element(by.id('currentAccountOverdraftLimit'));
    this.overdraftRate = element(by.id('currentAccountOverdraftRate'));
    this.accountNumber = element(by.id('accountNumber'));
};

module.exports = new accountOfferPage();
