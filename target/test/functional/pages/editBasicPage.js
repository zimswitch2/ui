var editBasicPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var getValueSpanElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).last();
    };

    var getInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-input div span span input')).last();
    };

    var getFieldInfoValueElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data div.info-label')).last();
    };

    var getDropDownElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data div select')).last();
    };

    var getTypeAheadInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data div sb-typeahead div div div input[ng-model="itemText"]')).last();
    };

    var getFirstTypeAheadFilteredItems = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data div sb-typeahead div ul.items li.item')).first();
    };

    var getDatePickerInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker-input input')).last();
    };

    this.infoNotification = function () {
        return element.all(by.css('.notification.info')).last();
    };
    this.titleElement = function () {
        return getValueSpanElement("Title");
    };
    this.surnameElement = function () {
        return getValueSpanElement("Surname");
    };
    this.firstNamesElement = function () {
        return getValueSpanElement("First names");
    };
    this.initialsElement = function () {
        return getValueSpanElement("Initials");
    };
    this.genderElement = function () {
        return getValueSpanElement("Gender");
    };
    this.idNumberElement = function () {
        return getValueSpanElement("ID number");
    };
    this.passportElement = function () {
        return getValueSpanElement("Passport");
    };
    this.passportOriginElement = function () {
        return getValueSpanElement("Passport origin");
    };
    this.dateOfBirthElement = function () {
        return getValueSpanElement("Date of birth");
    };
    this.nationalityInput = function () {
        return getTypeAheadInputElement("Nationality *");
    };
    this.countryOfBirthInput = function () {
        return getTypeAheadInputElement("Country of birth *");
    };
    this.countryOfCitizenshipInput = function () {
        return getTypeAheadInputElement("Country of citizenship *");
    };
    this.permitTypeDropdown = function () {
        return getDropDownElement("Permit type *");
    };
    this.permitNumberInput = function () {
        return getInputElement("Permit number *");
    };
    this.permitIssueDateInput = function () {
        return getDatePickerInputElement("Permit issue date *");
    };
    this.permitExpiryDateInput = function () {
        return getDatePickerInputElement("Permit expiry date *");
    };
    this.permitExpiryInfoValue = function () {
        return getFieldInfoValueElement("Permit expiry date *");
    };
    this.maritalStatusElement = function () {
        return getValueSpanElement("Marital status");
    };
    this.yourBranchElement = function () {
        return getValueSpanElement("Your branch");
    };
    this.nationalityReadonlyElement = function () {
        return getValueSpanElement("Nationality");
    };
    this.countryOfBirthReadonlyElement = function () {
        return getValueSpanElement("Country of birth");
    };
    this.countryOfCitizenshipReadonlyElement = function () {
        return getValueSpanElement("Country of citizenship");
    };
    this.permitTypeReadonlyElement = function () {
        return getValueSpanElement("Permit type");
    };
    this.permitNumberReadonlyElement = function () {
        return getValueSpanElement("Permit number");
    };
    this.permitIssueDateReadonlyElement = function () {
        return getValueSpanElement("Permit issue date");
    };
    this.permitExpiryDateReadonlyElement = function () {
        return getValueSpanElement("Permit expiry date");
    };
    this.cellPhoneReadonlyElement = function() {
        return getValueSpanElement("Cell phone");
    };
    this.firstEmailAddressReadonlyElement = function() {
        return element.all(by.css('li[label="E-mail address"].row-field div.information div.field-value div.cell-data span.ng-binding')).first();
    };
    this.lastEmailAddressReadonlyElement = function() {
        return element.all(by.css('li[label="E-mail address"].row-field div.information div.field-value div.cell-data span.ng-binding')).last();
    };
    this.preferredCommunicationLanguageReadonlyElement = function() {
        return getValueSpanElement("Preferred communication language");
    };
    this.modifyContactInformationButton = function() {
        return element(by.id('edit-contact-button'));
    };
    this.actions = {
        selectItemInTypeAhead: function (label, value) {
            var inputElement = getTypeAheadInputElement(label);
            inputElement.clear();
            inputElement.sendKeys(value);
            var selectItem = getFirstTypeAheadFilteredItems(label);
            helpers.scrollThenClick(selectItem);
        },
        selectItemInDropDown: function (label, value) {
            var selectElement = getDropDownElement(label);
            helpers.scrollThenClick(selectElement);
            helpers.scrollThenClick(selectElement.element(by.css("option[value='" + value + "']")));
        },
        enterTextIntoInput: function (label, value) {
            var inputElement = getInputElement(label);
            helpers.scrollThenClick(inputElement);
            inputElement.sendKeys(value);
        },
        selectFirstDayInPreviousMonthInDatePicker: function (label) {
            var inputElement = getDatePickerInputElement(label);
            helpers.scrollThenClick(inputElement);
            var previousMonth = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker div.header i.icon-angle-left')).last();
            helpers.scrollThenClick(previousMonth);
            var firstDayItem = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker ul.dates li:not(.different-month)')).first();
            helpers.scrollThenClick(firstDayItem);
        },
        selectFirstDayInNextMonthInDatePicker: function (label) {
            var inputElement = getDatePickerInputElement(label);
            helpers.scrollThenClick(inputElement);
            var nextMonth = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker div.header i.icon-angle-right')).last();
            helpers.scrollThenClick(nextMonth);
            var firstDayItem = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker ul.dates li:not(.different-month)')).first();
            helpers.scrollThenClick(firstDayItem);
        },
        selectFirstDayInFourMonthsTimeInDatePicker: function (label) {
            var inputElement = getDatePickerInputElement(label);
            helpers.scrollThenClick(inputElement);
            var nextMonth = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker div.header i.icon-angle-right')).last();
            helpers.scrollThenClick(nextMonth);
            helpers.scrollThenClick(nextMonth);
            helpers.scrollThenClick(nextMonth);
            helpers.scrollThenClick(nextMonth);
            var firstDayItem = element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker ul.dates li:not(.different-month)')).first();
            helpers.scrollThenClick(firstDayItem);
        },
        saveBasicInformation: function () {
            helpers.scrollThenClick(this.save());
        }.bind(this),
        confirmBasicInformation: function () {
         return element.all(by.css('#confirm-save-modal #modal-confirm')).click();
        }.bind(this),
        cancelBasicInformation: function () {
            helpers.scrollThenClick(this.cancel());
        }.bind(this)
    };

    this.selectDropDown = function (ngModel, item) {
        element(by.css('select[ng-model="' + ngModel + '"]')).element(by.cssContainingText('option', item)).click();
    };

    this.fillTextBox = function (ngModel, value) {
        var inputField = helpers.wait(element(by.css('sb-input[ng-model="' + ngModel + '"] input')));
        inputField.sendKeys(value);
    };

    this.save = function () {
        return element(by.id('save-basic'));
    };

    this.cancel = function() {
        return element(by.id('cancel-basic'));
    };

    this.confirmbut = function() {
    };

    // this.confirmationbut = function() {
    // };
};

module.exports = new editBasicPage();
