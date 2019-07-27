var beneficiary_step_definitions = function() {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');
    var loginPage = require('../../../pages/loginPage.js');

    function validateTableData(expectedRows,propertyToCssMap){
        var tableRows = tableHelper.getTableRows('.summary', propertyToCssMap);
        return tableRows.then(function (targetRows) {
            expectedRows.forEach(function (expectedRow, i) {
                tableHelper.expectRowToMatch(targetRows[i], expectedRow);
            });
        });
    }

    this.When(/^I enter "([^"]*)" as the listed beneficiary/, function(listedBeneficiary) {
        return element(by.css('#listedBeneficiary-input')).clear().sendKeys(listedBeneficiary);
    });

    this.Then(/^I should see the Add Beneficiary confirmation page with the following private beneficiary details$/, function(table) {
        var propertyToCssMap = {
            "Beneficiary name": '#summaryBeneficiaryName',
            "Bank": '#bankSummary',
            'Branch': '#branchSummary',
            'Account number': '#accountNumberSummary',
            'Your reference': '#customerReference',
            'Beneficiary reference': '#beneficiaryReference'
        };

        return validateTableData([table.rowsHash()], propertyToCssMap);
    });

    this.Then(/^I should see the Add Beneficiary confirmation page with the following listed beneficiary details$/, function(table) {
        var propertyToCssMap = {
            "Beneficiary name": '#summaryBeneficiaryName',
            'Your reference': '#customerReference',
            'Beneficiary reference': '#beneficiaryReference'
        };

        return validateTableData([table.rowsHash()], propertyToCssMap);
    });

    this.Then(/^the add beneficiary notification confirmation method should be "([^"]*)"$/, function(confirmationMethod) {
        return expect(element(by.css('span.summary-confirmation-method')).getText()).to.eventually.contain(confirmationMethod);
    });

    this.Then(/^the add beneficiary notification confirmation (fax|email) should be "([^"]*)"$/, function(method, confirmationDetail) {
        return expect(element(by.css('span.summary-confirmation-detail')).getText()).to.eventually.contain(confirmationDetail);
    });

    this.When(/^I complete the searchbox with "([^"]*)"/, function(text) {
        return element(by.model('query')).clear().sendKeys(text);
    });

    this.Then(/^The searchbox should be disabled/, function() {
        return expect(element(by.css('#listedBeneficiary')).isDisplayed()).to.eventually.equal(false);
    });

    
    this.Then(/^I should see that "([^"]*)" is displayed under "([^"]*)" heading$/, function (benDateText,columnName) {
        //click on menu button to expand the menu
        
        var dataColumn = element(by.css('ul.data > li:nth-child(n) > div.information > div[data-header="' + columnName +'"]'));
        return expect(dataColumn.getText()).to.eventually.contain(benDateText);
    });

 
    this.Then(/^I should see that the list of beneficiaries contains (\d+) elements$/,function (number) {

    return expect(element.all(by.repeater('beneficiary in beneficiaries')).count()).to.eventually.equal(Number(number));
    });
};

module.exports = beneficiary_step_definitions;