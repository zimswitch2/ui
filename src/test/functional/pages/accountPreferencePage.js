var AccountPreferencePage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var accountPreferences = element(by.id('preferences'));
    this.saveButton = element(by.id('save-button'));
    this.cancelButton = element(by.id('cancel-button'));


    this.clickOnAccountPreferences = function () {
        var accessAccount = element(by.css("a[href='#/account-preferences/10005304182']"));
        accessAccount.isPresent().then(function (value) {
            if (value){
                accessAccount.isDisplayed().then(function (display) {
                    if (!display){
                        helpers.scrollThenClick(helpers.wait(accountPreferences));
                    }
                });
            }
        });
    };

    this.getHeader = function () {
        return element(by.id('product-preferences-header')).getText();
    };

    this.clickOnEmailAccount = function () {
        var firstAcc = element(by.css("a[href='#/account-preferences/10000358140']"));
        helpers.scrollThenClick(helpers.wait(firstAcc));
    };

    this.trackEveryClickOnAccount = function () {
        var firstAcc = element(by.css("a[href='#/account-preferences/10000358140']"));
        return firstAcc.getAttribute('track-click').then(function (item) {
            return item === 'Profile.Product preference.Formal statement.View';
        });
    };

    this.clickOnPostAccount = function () {
        var acc = element(by.css("a[href='#/account-preferences/10005304182']"));
        helpers.scrollThenClick(acc);
    };

    this.clickOnNoPreferenceAccount = function () {
        var acc = element(by.css("a[href='#/account-preferences/5592007012041578']"));
        helpers.scrollThenClick(acc);
    };

    this.clickOnEditButton = function () {
        var editButton = element(by.id('edit-account-preferences-btn'));
        helpers.scrollThenClick(helpers.wait(editButton));
    };

    this.getAccountDetails = function () {
        return element(by.id('account-details')).getText();
    };

    this.getSubHeader = function () {
        return element(by.css('.account-preferences .section h3')).getText();
    };

    this.getCurrentDeliveryDescriptionText = function () {
        return this.getCurrentDeliveryDescription().getText();
    };

    this.getCurrentDeliveryDescription = function() {
        return element(by.id('product-preferences-delivery-description'));
    };

    this.getDeliveryMethodSection = function () {
        return element(by.id('deliveryMethodSection'));
    };

    this.getCurrentDeliveryText = function () {
        return this.getCurrentDelivery().getText();
    };

    this.getCurrentDelivery = function () {
        return element(by.id('product-preferences-delivery-method'));
    };

    this.selectedRadioButton = function (radioGroupName) {
        return element(by.css("input:checked[name='" + radioGroupName + "']")).getAttribute('value');
    };

    this.deliveryAddress = function () {
        return this.baseActions.textForInput(element(by.id('deliveryAddress')));
    };

    this.save = function () {
        helpers.scrollThenClick(this.saveButton);
    };

    this.getNoPreferenceMessage = function () {
        return element(by.css('div.info')).getText();
    };

    this.getPostal = function () {
        return element(by.id('postal'));
    };

    this.clickOnEmailRadioButton = function(){
      helpers.scrollThenClick(element(by.id('email')));
    };

    this.getSuccessMessage = function () {
        return element(by.css('.success.notification'));
    };

    this.getErrorMessage = function () {
        return element(by.css('.error.notification'));
    };


};

module.exports = new AccountPreferencePage();
