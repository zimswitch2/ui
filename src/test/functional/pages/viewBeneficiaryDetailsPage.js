var viewBeneficiaryDetails = function(){

    this.baseActions = require('./baseActions.js');

    var futurePaymentsList = element.all(by.repeater('futurePayment in futurePaymentsList'));

    this.payBeneficiary = function () {
        return element(by.id('pay-beneficiary-button'));
    };

    this.editBeneficiary = function () {
        return element(by.id('edit-beneficiary-button'));
    };

    this.deleteBeneficiary = function () {
        return element(by.id('delete-beneficiary-button'));
    };

    this.backToBeneficiaries = function () {
        return element(by.buttonText('Back'));
    };

    this.getContentFromList = function (id) {
        return element(by.css('#' + id + ' span:nth-child(2):not(.ng-hide)'));
    };

    this.getContentFromFuturePaymentsList = function(tdID){
        return element(by.css('td#' + tdID)).getText();
    };

    this.beneficiaryName = function () {
        return this.getContentFromList('beneficiaryName').getText();
    };

    this.bank = function () {
        return this.getContentFromList('bank').getText();
    };

    this.hasBank = function () {
        return this.getContentFromList('bank').isPresent();
    };

    this.branch = function () {
        return this.getContentFromList('branch').getText();
    };

    this.hasBranch = function () {
        return this.getContentFromList('branch').isPresent();
    };

    this.accountNumber = function () {
        return this.getContentFromList('accountNumber').getText();
    };

    this.hasAccountNumber = function () {
        return this.getContentFromList('accountNumber').isPresent();
    };

    this.myReference = function () {
        return this.getContentFromList('myReference').getText();
    };

    this.beneficiaryReference = function () {
        return this.getContentFromList('beneficiaryReference').getText();
    };

    this.paymentConfirmationType = function () {
        return this.getContentFromList('paymentConfirmationType').getText();
    };

    this.hasPaymentConfirmationType = function () {
        return this.getContentFromList('paymentConfirmationType').isPresent();
    };

    this.beneficiaryGroup = function () {
        return this.getContentFromList('beneficiaryGroup').getText();
    };

    this.hasBeneficiaryGroup = function () {
        return this.getContentFromList('beneficiaryGroup').isPresent();
    };

    this.getBeneficiaryDetails = function() {
        return element(by.css('.summary'));
    };

    this.confirmDelete = element(by.css('.modal-container .danger-confirm'));

    this.deletedError = element(by.css('.modal-container .deleted-error'));

    this.removeDeletionErrorButton = element(by.css('.modal-container .deleted-error button'));

    this.futurePaymentDate = function(){
        return this.getContentFromFuturePaymentsList('nextPaymentDate');
    };

    this.futurePaymentAmount = function(){
        return this.getContentFromFuturePaymentsList('amount');
    };

    this.futurePaymentsTable = function () {
      return element(by.id('futureDatedPaymentsTable'));
    };

    this.NumberOfFuturePayments = function () {
        return futurePaymentsList.count();
    };
};
module.exports = new viewBeneficiaryDetails();
