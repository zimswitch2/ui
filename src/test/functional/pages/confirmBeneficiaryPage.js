var confirmBeneficiaryPage = function () {
    var helpers = require('./helpers.js');

    var beneficiaryDetails = element(by.css('#beneficiaryDetails'));

    this.clickConfirm = function() {
        helpers.scrollThenClick(element(by.css('button#confirm')));
    };

    this.clickModify = function() {
        helpers.scrollThenClick(this.getModifyButton());
    };

    this.getBeneficiaryDetails = function() {
        return beneficiaryDetails.getText();
    };

    this.getModifyButton = function() {
        return element(by.css('.secondary#modify'));
    };

};

module.exports = new confirmBeneficiaryPage();
