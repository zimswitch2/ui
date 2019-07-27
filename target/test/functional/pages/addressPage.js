var addressPage = function () {
    this.baseActions = require('./baseActions.js');
    this.saveButton = element(by.id('save-address'));

    var helpers = require('./helpers.js');

    var getValueSpanElement = function (section, label) {
        return element.all(by.css('#' + section + ' li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).last();
    };

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

        clickEditButton: function () {
            this.helpers.scrollThenClick(element(by.id('edit-residence-button')));
            browser.sleep(500); //to make sure the page has stopped scrolling
        }.bind(this),

        setPostalSameAsResidential: function(){
            this.baseActions.selectRadioOption(true);
        }.bind(this)
    };

    this.infoNotification = function () {
        return element.all(by.css('.notification.info')).last();
    };

    this.homeModifyButton = function () {
        return element(by.id("edit-residence-button"));
    };
    this.homeStreetElement = function () {
        return getValueSpanElement("homeAddress", "Street");
    };
    this.homeSuburbElement = function () {
        return getValueSpanElement("homeAddress", "Suburb");
    };
    this.homeCityElement = function () {
        return getValueSpanElement("homeAddress", "City/town");
    };
    this.homePostCodeElement = function () {
        return getValueSpanElement("homeAddress", "Postal code");
    };
    this.homeResidentialStatusElement = function () {
        return getValueSpanElement("homeAddress", "Residential Status");
    };
    this.postalModifyButton = function () {
        return element(by.id("edit-postal-button"));
    };
    this.postalStreetElement = function () {
        return getValueSpanElement("postalAddress", "Street/PO Box");
    };
    this.postalSuburbElement = function () {
        return getValueSpanElement("postalAddress", "Suburb");
    };
    this.postalCityElement = function () {
        return getValueSpanElement("postalAddress", "City/town");
    };
    this.postalPostCodeElement = function () {
        return getValueSpanElement("postalAddress", "Postal code");
    };
};

module.exports = new addressPage();
