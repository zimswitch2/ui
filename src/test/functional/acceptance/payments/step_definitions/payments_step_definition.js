var myStepDefinitionsWrapper = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');

    this.Then(/^the following beneficiaries should be displayed:$/, function (expectedContent) {
        var tableRowsSelector = '.beneficiaries-table .beneficiary';
        var propertyToCssMap = {
            "Beneficiary name": '[data-header*="Beneficiary Name"] > div',
            "Your reference": '[data-header*="Your Reference"] > div',
            "Group": '[data-header*="Group"] > div',
            "Last payment date": '[data-header*="Last Payment Date"] > div',
            "Last amount paid": '[data-header*="Last Amount Paid"] > div'
        };

        return tableHelper.expectContentToMatch(tableRowsSelector, propertyToCssMap, expectedContent);
    });

    this.Then(/^I should see "([^"]*)" as the Available Balance$/, function (expectedBalance) {
        return expect(element(by.id("From_AccountAvailableBalance")).getText()).to.eventually.equal(expectedBalance);
    });

    function addAccountDetailsToCssPropertyMap(cssPropertyMap) {
        cssPropertyMap["Bank"] = '#bank';
        cssPropertyMap["Branch"] = "#branch";
        cssPropertyMap["Account number"] = "#accountNumber";
    }

    function getBaseCssPropertyMap() {
        return {
            "From account": '#fromAccount',
            "Available balance": '#availableBalance',
            "Beneficiary name": '#beneficiaryName',
            "Beneficiary reference": '#beneficiaryReference',
            "Your reference": '#yourReference',
            "Payment date": '#paymentDate',
            "Amount": '.amount'
        };
    }

    function addConfirmationAddressToCssMap(expectedCols, cssPropertyMap) {
        var colForConfirmationAddress = _.find(expectedCols, function (col) {
            return col.indexOf('will receive payment notifications by') > -1;
        });
        if (colForConfirmationAddress) {
            cssPropertyMap[colForConfirmationAddress] = '#confirmationAddress';
        }
    }

    function getSaveBeneficiaryCol(expectedCols) {
        return _.find(expectedCols, function (col) {
            return col.indexOf('will be saved as a beneficiary') > -1;
        });
    }

    function addSaveBeneficiaryToCssMap(saveBeneficiaryCol, cssPropertyMap) {
        if (saveBeneficiaryCol) {
            cssPropertyMap[saveBeneficiaryCol] = '#saveBeneficiary';
        }
    }

    function verifySaveBeneficiaryRow(saveBeneficiaryCol, targetRows, expectedRows) {
        expect(targetRows[0][saveBeneficiaryCol]).to.equal(saveBeneficiaryCol);
        delete expectedRows[0][saveBeneficiaryCol];
        delete targetRows[0][saveBeneficiaryCol];
    }

    function getSavedBeneficiaryCol(expectedCols) {
        return _.find(expectedCols, function (col) {
            return col.indexOf('was saved as a beneficiary') > -1;
        });
    }

    function addSavedBeneficiaryToCssMap(savedBeneficiaryCol, cssPropertyMap) {
        if (savedBeneficiaryCol) {
            cssPropertyMap[savedBeneficiaryCol] = '#savedBeneficiary';
        }
    }

    function verifySavedBeneficiaryRow(savedBeneficiaryCol, targetRows, expectedRows) {
        expect(targetRows[0][savedBeneficiaryCol]).to.equal(savedBeneficiaryCol);
        delete expectedRows[0][savedBeneficiaryCol];
        delete targetRows[0][savedBeneficiaryCol];
    }

    this.Then(/^I should see the following payment confirmation details:$/, function (expectedConfirmationDetails) {
        var cssPropertyMap = getBaseCssPropertyMap();
        var expectedRows = [expectedConfirmationDetails.rowsHash()];
        var expectedCols = Object.keys(expectedRows[0]);

        addConfirmationAddressToCssMap(expectedCols, cssPropertyMap);
        if (_.contains(expectedCols, 'Bank')) {
            addAccountDetailsToCssPropertyMap(cssPropertyMap);
        }
        var saveBeneficiaryCol = getSaveBeneficiaryCol(expectedCols);
        addSaveBeneficiaryToCssMap(saveBeneficiaryCol, cssPropertyMap);

        expectedRows[0]['Payment date'] = tableHelper.dateFormat(new Date(), 'D MMMM YYYY');

        return tableHelper.getTableRows('.summary', cssPropertyMap).then(function (targetRows) {
            verifySaveBeneficiaryRow(saveBeneficiaryCol, targetRows, expectedRows);
            expectedRows.forEach(function (expectedRow, i) {
                tableHelper.expectRowToMatch(targetRows[i], expectedRow);
            });
        });
    });

    this.Then(/^I should see "([^"]*)" error message at the Bank input field$/, function (errorMessage) {
        return expect(element(by.css('#bank .form-error:not(.ng-hide)')).getText()).to.eventually.equal(errorMessage);
    });

    this.Then(/^I should see "([^"]*)" error message at the Branch input field$/, function (errorMessage) {
        return expect(element(by.css('#branch .form-error:not(.ng-hide)')).getText()).to.eventually.equal(errorMessage);
    });

    this.Then(/^I should see "([^"]*)" as the Monthly Payment Limit$/, function (expectedLimit) {
        return expect(element(by.id("monthlyLimit")).getText()).to.eventually.equal(expectedLimit);
    });

    this.Then(/^I should see "([^"]*)" as the Used limit$/, function (usedLimit) {
        return expect(element(by.id("usedEAPLimit")).getText()).to.eventually.equal(usedLimit);
    });

    this.Then(/^I should see "([^"]*)" as the Available limit$/, function (availableLimit) {
        return expect(element(by.id("availableLimit")).getText()).to.eventually.equal(availableLimit);
    });

    this.Then(/^I should see the following payment details:$/, function (table) {
        var cssPropertyMap = getBaseCssPropertyMap();
        var expectedRows = [table.rowsHash()];
        var expectedCols = Object.keys(expectedRows[0]);

        addAccountDetailsToCssPropertyMap(cssPropertyMap);
        addConfirmationAddressToCssMap(expectedCols, cssPropertyMap);
        var savedBeneficiaryCol = getSavedBeneficiaryCol(expectedCols);
        addSavedBeneficiaryToCssMap(savedBeneficiaryCol, cssPropertyMap);

        expectedRows[0]['Payment date'] = tableHelper.dateFormat(new Date(), 'D MMMM YYYY');

        return tableHelper.getTableRows('.summary', cssPropertyMap).then(function (targetRows) {
            verifySavedBeneficiaryRow(savedBeneficiaryCol, targetRows, expectedRows);
            expectedRows.forEach(function (expectedRow, i) {
                tableHelper.expectRowToMatch(targetRows[i], expectedRow);
            });
        });
    });

    this.Then(/^I should see the following payment confirmation details for the listed beneficiary:$/, function (expectedConfirmationDetails) {
        var cssPropertyMap = getBaseCssPropertyMap();
        
        var expectedRows = [expectedConfirmationDetails.rowsHash()];
        expectedRows[0]['Payment date'] = tableHelper.dateFormat(new Date(), 'D MMMM YYYY');

        var expectedCols = Object.keys(expectedRows[0]);
        
        addConfirmationAddressToCssMap(expectedCols, cssPropertyMap);
        if (_.contains(expectedCols, 'Bank')) {
            addAccountDetailsToCssPropertyMap(cssPropertyMap);
        }

        cssPropertyMap['Beneficiary name'] = '#listedBeneficiaryName';

        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: cssPropertyMap
        }, expectedRows);
    });

    this.Then(/^I should see payment notification cost to be "([^"]*)"$/, function (expectedCost) {
        return expect(element(by.id('notification-cost')).getText()).to.eventually.equal(expectedCost);
    });

    this.Then(/^I should see the following payment details for the listed beneficiary:$/, function (expectedPaymentDetails) {
        var cssPropertyMap = getBaseCssPropertyMap();
        cssPropertyMap['Beneficiary name'] = '#listedBeneficiaryName';

        var expectedRows = [expectedPaymentDetails.rowsHash()];
        expectedRows[0]['Payment date'] = tableHelper.dateFormat(new Date(), 'D MMMM YYYY');

        var expectedCols = Object.keys(expectedRows[0]);

        addConfirmationAddressToCssMap(expectedCols, cssPropertyMap);
        if (_.contains(expectedCols, 'Bank')) {
            addAccountDetailsToCssPropertyMap(cssPropertyMap);
        }

        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: cssPropertyMap
        }, expectedRows);
    });
};
module.exports = myStepDefinitionsWrapper;