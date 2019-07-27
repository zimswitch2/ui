var employmentPage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.saveButton = element(by.id('save-employer'));

    this.actions = {
        setEmploymentToYes: function () {
            this.setStatus(true);
        }.bind(this),
        setEmploymentToNo: function () {
            this.setStatus(false);
        }.bind(this),
        selectEmployerName: function (item) {
            this.fillTextBox('currentEmployment().employerName', item);
        }.bind(this),
        selectPreviousEmployerName: function (item) {
            this.fillTextBox('previousEmployment().employerName', item);
        }.bind(this),
        selectUnemploymentReason: function (item) {
            this.selectDropDown('unemploymentReason.code', item);
        }.bind(this),
        selectStartDate: function () {
            this.fillDate('currentEmployment().startDate', 0);
        }.bind(this),
        selectPreviousEmploymentEndDate: function () {
            this.fillDate('previousEmployment().endDate', 2);
        }.bind(this),
        selectOccupationIndustry: function (item) {
            this.selectDropDown('currentEmployment().occupationIndustryCode', item);
        }.bind(this),
        selectPreviousOccupationIndustry: function (item) {
            this.selectDropDown('previousEmployment().occupationIndustryCode', item);
        }.bind(this),
        selectOccupationLevel: function (item) {
            this.selectDropDown('currentEmployment().occupationLevelCode', item);
        }.bind(this),
        selectPreviousOccupationLevel: function (item) {
            this.selectDropDown('previousEmployment().occupationLevelCode', item);
        }.bind(this),
        selectStatus: function (item) {
            this.selectDropDown('currentEmployment().employmentStatusCode', item);
        }.bind(this),
        selectPreviousStatus: function (item) {
            this.selectDropDown('previousEmployment().employmentStatusCode', item);
        }.bind(this),
        selectLevelOfEducation: function (item) {
            this.selectDropDown('studyType', item);
        }.bind(this),
        selectSpecialization: function (item) {
            this.selectDropDown('customerInformationData.tertiaryQualificationCode', item);
        }.bind(this),
        saveEmployment: function () {
            this.helpers.scrollThenClick(this.save());
        }.bind(this),
        clickAddButton: function () {
            this.helpers.scrollThenClick(element(by.id('add-employer-link')));
            browser.sleep(500);
        }.bind(this)
    };

    this.selectDropDown = function (ngModel, item) {
        element(by.css('select[ng-model="' + ngModel + '"]')).element(by.cssContainingText('option', item)).click();
    };

    this.fillTextBox = function (ngModel, value) {
        var inputField = this.helpers.wait(element(by.css('sb-input[ng-model="' + ngModel + '"] input')));
        inputField.clear();
        inputField.sendKeys(value);
    };

    this.fillDate = function (ngModel, pickerIndex) {
        element(by.css('sb-datepicker[ng-model="' + ngModel + '"]')).element(by.tagName('input')).click();
        element.all(by.css('.datepicker i.left')).get(pickerIndex).click();
        this.helpers.findVisible(by.css('.datepicker ul.dates li')).then(function (element) {
            return element[0].click();
        });
    };

    this.save = function () {
        return element(by.id('save-employer'));
    };
    this.cancel = function () {
        return element(by.id('cancel-employer'));
    };

    var getValueSpanElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).first();
    };
    var getRadioButtonElement = function (label, value) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data input[value="' + value + '"]')).last();
    };
    var getDropDownElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data div select')).last();
    };
    var getInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-input div span span input')).last();
    };
    var getDatePickerInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-datepicker div.datepicker-input input')).last();
    };

    this.employedReadonlyValueElement = function () {
        return getValueSpanElement("Employed");
    };
    this.employerNameReadonlyValueElement = function () {
        return getValueSpanElement('Employer name');
    };
    this.startDateReadonlyValueElement = function () {
        return getValueSpanElement('Start date');
    };
    this.industryReadonlyValueElement = function () {
        return getValueSpanElement('Industry');
    };
    this.occupationLevelReadonlyValueElement = function () {
        return getValueSpanElement('Occupation level');
    };
    this.statusReadonlyValueElement = function () {
        return getValueSpanElement('Status');
    };
    this.reasonForUnemploymentReadonlyValueElement = function () {
        return getValueSpanElement('Reason for unemployment');
    };
    this.addEmployerLinkElement = function () {
        return element(by.id("add-employer-link"));
    };
    this.levelOfEducationReadonlyValueElement = function () {
        return getValueSpanElement('Level of education');
    };
    this.employmentModifyButton = function () {
        return element(by.id('edit-employer-button'));
    };

    this.currentlyEmployedYesSelection = function () {
        return getRadioButtonElement("Are you currently employed?", "true");
    };
    this.currentlyEmployedNoSelection = function () {
        return getRadioButtonElement("Are you currently employed?", "false");
    };
    this.employerNameInput = function () {
        return getInputElement("Employer name *");
    };
    this.startDateInput = function () {
        return getDatePickerInputElement("Start date *");
    };
    this.industryDropDown = function () {
        return getDropDownElement("Industry *");
    };
    this.occupationLevelDropDown = function () {
        return getDropDownElement("Occupation level *");
    };
    this.statusDropDown = function () {
        return getDropDownElement("Status *");
    };

    this.reasonForUnemploymentDropdown = function () {
        return getDropDownElement("Reason for unemployment *");
    };

    this.qualificationLevelDropDown = function () {
        return getDropDownElement("Qualification level");
    };
    this.qualificationTypeDropDown = function () {
        return getDropDownElement("Qualification type");
    };

    this.setStatus = function (employmentStatus) {
        this.baseActions.selectRadioOption(employmentStatus);
    };

    this.employmentModifyButtonClick = function () {
        return element(by.id('edit-employer-button')).click();
    };
};

module.exports = new employmentPage();

