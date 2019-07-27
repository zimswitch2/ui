var addressPage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.saveButton = element(by.id('save-address'));

    this.actions = {
        selectStreetPOBox: function (item) {
            this.fillTextBox('residentialAddress.streetPOBox', item);
        }.bind(this),

        selectSuburb: function (item) {
            this.fillTextBox('residentialAddress.suburb', item);
        }.bind(this),

        selectCityTown: function (item) {
            this.fillTextBox('residentialAddress.cityTown', item);
        }.bind(this),

        selectPostalCode: function (item) {
            this.fillTextBox('residentialAddress.postalCode', item);
        }.bind(this),

        selectResidentialStatus: function (item) {
            this.selectDropDown('customerInformationData.accommodationTypeCode', item);
        }.bind(this),

        saveAddress: function () {
            this.helpers.scrollThenClick(this.saveButton);
        }.bind(this),

        clickCancelButton: function () {
            this.helpers.scrollThenClick(element(by.id('cancel-address')));
        }.bind(this),

        clickEditButton: function () {
            this.helpers.scrollThenClick(element(by.id('edit-residence-button')));
            browser.sleep(500); //to make sure the page has stopped scrolling
        }.bind(this),
        setPostalSameAsResidential: function(){
            this.baseActions.selectRadioOption(true);
        }.bind(this)
    };

    this.fillTextBox = function (ngModel, value) {
        var inputField = this.helpers.wait(element(by.css('sb-input[ng-model="' + ngModel + '"] input')));
        inputField.clear();
        inputField.sendKeys(value);
    };

    this.selectDropDown = function (ngModel, item) {
        element(by.css('select[ng-model="' + ngModel + '"]')).element(by.cssContainingText('option', item)).click();
    };
};

module.exports = new addressPage();
