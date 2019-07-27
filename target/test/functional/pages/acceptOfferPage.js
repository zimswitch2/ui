var acceptOfferPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.actions = {
        confirm: element(by.id('confirm')),
        back: element(by.buttonText('Back')),
        downloadAgreement: element(by.id('download-agreement'))
    };

    this.productName = element(by.id('acceptedProductName'));

    this.acceptTermsAndConditions = function () {
        element(by.id('termsAndConditions')).click();
    };

    this.confirmButtonEnabled = function () {
      return element(by.id('proceed')).isDisplayed();
    };  

    this.clickCheckBox = function () {
        var e = element(by.id('termsAndConditions'));
        browser.wait(function () {
            return e.isPresent();
        }, 10000);
        e.click();
    };

    this.next = function () {
        return element(by.css('#proceed'));
    };

    this.proceed = function () {
        helpers.scrollThenClick(this.next());
    };

    this.getAcceptTermsAndConditionsCheckbox = function () {
        return element(by.id('termsAndConditions')).isSelected();
    };  

    this.getApplicationSuccessPage = function () {
        return element(by.css('.notification'));
    };  

    this.getOpeningAccountLabel = function () {
        return element(by.id('openingAccountLable'));
    };  

    this.getOpeningAccountNo = function () {
        return element(by.id('openingAccountNo'));
    };  

    this.getAmountLabel = function () {
        return element(by.css('#Amountlable'));
    };  
    this.getSelectedAmount = function () {
        return element(by.css('#selectedAmount'));
    };

    this.clickBackBtn = function () {
        return this.actions.back.click();
    }; 
 
    this.clickCancelBtn = function () {
        return element(by.id('cancel')).click();
    }; 

    this.overdraftLimit = element(by.id('overdraft-limit'));
    this.overdraftRate = element(by.id('overdraft-rate'));
};

module.exports = new acceptOfferPage();