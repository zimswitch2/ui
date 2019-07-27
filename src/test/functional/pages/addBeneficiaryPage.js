var addBeneficiaryPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var listedBeneficiarySearchBox = element(by.css('#listedBeneficiary-input'));
    var listedBeneficiaryResults = element(by.css('#listedBeneficiary .items'));
    var beneficiaryName = element(by.css('input#name'));
    var bankSelect = element(by.css('#bank-input'));
    var bankResults = element(by.css('#bank .items'));
    var branchSelect = element(by.css('#branch-input'));
    var branchResults = element(by.css('#branch .items'));
    var groupSelect = element(by.css('#group'));
    var beneficiaryAccountNumber = element(by.css('input#accountNumber'));
    var beneficiaryMyReference = element(by.css('#myReference'));
    var beneficiaryReference = element(by.css('#beneficiaryReference'));
    var beneficiaryPreferredName = element(by.css('#preferredName'));
    var beneficiaryPreferredAddress = element(by.css('#preferredAddress'));

    var modifyButton = element(by.id('modify'));
    var cancelButton = element(by.id('cancel'));
    var confirmCancelButton = element(by.id('confirmCancel'));

    var editForm = element(by.name('addBeneficiaryForm'));
    var viewDetails = element(by.id('beneficiaryDetails'));

    this.enterListedBeneficiaryDetails = function (listedBeneficiaryName, myReferenceValue, beneficiaryReferenceValue) {
        this.setListedBeneficiary(listedBeneficiaryName);
        this.enterReferenceDetails(myReferenceValue, beneficiaryReferenceValue);
        this.setSetupPaymentConfirmation(false);
    };

    this.enterBeneficiaryDetails = function (listedBeneficiaryName, myReferenceValue, beneficiaryReferenceValue) {
        selectFromTypeAhead(listedBeneficiaryName, listedBeneficiarySearchBox, listedBeneficiaryResults);
        this.enterReferenceDetails(myReferenceValue, beneficiaryReferenceValue);
        this.setSetupPaymentConfirmation(false);
    };

    this.enterReferenceDetails = function (myReferenceValue, beneficiaryReferenceValue) {
        this.baseActions.textForInput(beneficiaryMyReference, myReferenceValue);
        this.baseActions.textForInput(beneficiaryReference, beneficiaryReferenceValue);
    };

    var selectItemFromDropdown = function (resultList) {
        helpers.scrollThenClick(resultList.all(by.css('li.item')).first());
    };

    var selectFromTypeAhead = function (value, input, results) {
        input.clear();
        input.sendKeys(value);
        selectItemFromDropdown(results);
    };

    this.setAutocomplete = function (select, results, value, action) {
        select.clear();
        select.sendKeys(value);
        select.sendKeys(' '); // IE9: make Angular update

        if (action === 'enter') {
            select.sendKeys('\n');
        } else {
            selectItemFromDropdown(results);
        }
    };

    this.group = function (groupName) {
        return this.baseActions.textForDropdown(groupSelect, groupName);
    };

    this.setBank = function (bank, action) {
        this.setAutocomplete(bankSelect, bankResults, bank, action);
    };

    this.setBranch = function (branch, action) {
        this.setAutocomplete(branchSelect, branchResults, branch, action);
    };

    this.setListedBeneficiary = function (listedBeneficiaryName) {
        this.setAutocomplete(listedBeneficiarySearchBox, undefined, listedBeneficiaryName, 'enter');
    };

    this.enterPrivateBeneficiaryDetails = function (userInformation) {
        this.enterPrivateBeneficiaryDetailsWithEnter(userInformation);
    };

    this.enterPrivateBeneficiaryDetailsWithEnter = function (userInformation) {
        this.setName(userInformation.name);
        this.setBank(userInformation.bank, "enter");
        this.setBranch(userInformation.branchCode, "enter");
        this.setAccountNumber(userInformation.accountNumber);
        this.baseActions.textForInput(beneficiaryMyReference, userInformation.myReference);
        this.baseActions.textForInput(beneficiaryReference, userInformation.beneficiaryReference);
        this.setSetupPaymentConfirmation(false);
    };

    this.cleanBeneficiaryDetails = function () {
        if (listedBeneficiarySearchBox.isDisplayed()) {
            listedBeneficiarySearchBox.clear();
        }
        if (bankSelect.isDisplayed()) {
            bankSelect.clear();
            branchSelect.clear();
            beneficiaryName.clear();
            beneficiaryAccountNumber.clear();
        }
        this.cleanReferenceDetails();
        this.setSetupPaymentConfirmation(false);
    };

    this.cleanReferenceDetails = function () {
        beneficiaryMyReference.clear();
        beneficiaryReference.clear();
        this.setSetupPaymentConfirmation(false);
    };

    this.setName = function (name) {
        this.baseActions.textForInput(beneficiaryName, name);
    };

    this.setAccountNumber = function (accountNumber) {
        this.baseActions.textForInput(beneficiaryAccountNumber, accountNumber);
    };

    this.setSetupPaymentConfirmation = function (paymentConfirmation) {
        var cssSelector = paymentConfirmation ? '#yes' : '#no';
        helpers.scrollThenClick(element(by.css(cssSelector)));
    };

    this.setPaymentConfirmationMethod = function (confirmationMethod) {
        this.setSetupPaymentConfirmation(true);
        if (confirmationMethod === "Email") {
            helpers.scrollThenClick(element(by.css('#emailpayment-confirmation')));
        } else if (confirmationMethod === "SMS") {
            helpers.scrollThenClick(element(by.css('#smspayment-confirmation')));
        } else if (confirmationMethod === "Fax") {
            helpers.scrollThenClick(element(by.css('#faxpayment-confirmation')));
        }
    };

    this.setPaymentConfirmation = function (confirmationMethod, confirmationDetails) {
        this.setPaymentConfirmationMethod(confirmationMethod);
        this.baseActions.textForInput(beneficiaryPreferredName, confirmationDetails.recipientName);
        this.baseActions.textForInput(beneficiaryPreferredAddress, confirmationDetails.address);
    };

    this.getEditForm = function () {
        return editForm;
    };

    this.getViewDetails = function () {
        return viewDetails;
    };

    this.proceed = function () {
        return helpers.scrollThenClick(element(by.css('#proceed')));
    };

    this.clickModify = function () {
        return helpers.scrollThenClick(modifyButton);
    };

    this.clickCancel = function () {
        return helpers.scrollThenClick(cancelButton);
    };

    this.clickConfirmCancel = function () {
        return helpers.scrollThenClick(confirmCancelButton);
    };

    this.cancelPaymentConfirmationMethod = function () {
        helpers.scrollThenClick(element(by.css('#no')));
    };

    this.getDirectorySearchBox = function () {
        return element(by.css('#listedBeneficiary'));
    };

    this.getWellBreak = function () {
        return element(by.css('.panel-break'));
    };

    this.canProvideBankInformation = function () {
        return element.all(by.css('#bank')).length > 0;
    };

    this.canProvideBranchInformation = function () {
        return element.all(by.css('#branch')).length > 0;
    };

    this.getAccountNumberBox = function () {
        return beneficiaryAccountNumber;
    };

    var beneficiarySection = function () {
        return element(by.id('beneficiarySection'));
    };

    this.getBeneficiaryName = function () {
        return element(by.css('#beneficiaryName')).getText();
    };

    this.getBeneficiaryNameBox = function () {
        return beneficiaryName;
    };

    this.selectedRadioButton = function (radioGroupName) {
        return element(by.css("input:checked[name='" + radioGroupName + "']")).getAttribute('value');
    };

};

module.exports = new addBeneficiaryPage();
