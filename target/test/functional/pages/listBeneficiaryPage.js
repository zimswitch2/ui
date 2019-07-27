var BeneficiaryListPage = function() {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    by.beneficiaries = function(){
        return this.repeater('beneficiary in beneficiaries');
    };

    this.getSelectableBeneficiaryList = function () {
        return element.all(by.css('.selectable-beneficiary'));
    };

    this.getNotSelectableBeneficiaryList = function() {
        return element.all(by.css('.not-selectable-beneficiary'));
    };

    this.getBeneficiaryList = function () {
        return element.all(by.beneficiaries());
    };

    this.getBeneficiaryName = function() {
        return element(by.css('ul.header li div:nth-child(1)'));
    };

    this.getPaymentDate = function() {
        return element(by.css('ul.header li div:nth-child(4)'));
    };

    this.clickAddBeneficiary = function () {
        helpers.scrollThenClick(element(by.linkText('Add beneficiary')));
    };

    this.clickBackButton = function () {
        helpers.scrollThenClick(element(by.buttonText('Back')));
    };

    this.waitForList = function () {
        helpers.wait(element(by.buttonText('Back')));
    };

    this.setFilterQuery = function(beneficiaryName) {
        helpers.scrollThenType(element(by.model('query')), beneficiaryName);
    };

    this.getBeneficiaryLatestPayment = function(){
        return element(by.css('.cell-data'));
    };

    this.getEditIcon = function(){
        return element.all(by.css('[title=modify]')).first();
    };

    this.confirm = function () {
        helpers.scrollThenClick(element(by.css('.confirm')));
    };

    this.delete = function () {
        helpers.scrollThenClick(element(by.css('.delete')));
    };

    this.getCancelButton = function () {
        return element(by.css('.secondary.btn'));
    };

    this.getPaymentIcon = function () {
        return element.all(by.css('[title=pay]')).first();
    };

    this.clickOnPay = function() {
        helpers.scrollThenClick(this.getPaymentIcon());
    };

    this.getCancelButton = function(){
        return element(by.css('.secondary.btn'));
    };
};

module.exports = new BeneficiaryListPage();
