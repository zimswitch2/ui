var international_payment_step_definitions = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');
    var loginPage = require('../../../pages/loginPage.js');

    function validateTableData(expectedRows,propertyToCssMap){
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: propertyToCssMap
        }, expectedRows);
    }

    this.Then(/^I should see the following international payment personal details for the South African resident$/, function (table) {
        var propertyToCssMap = {
            "Contact first name": '#firstName',
            "Contact last name": '#lastName',
            "Gender": '#gender',
            "ID number": '#idNumber',
            "Date of Birth": '#dateOfBirth',
            "Contact": '#contact',
            "Home Address Street": '#residentialAddressOne',
            "Home Suburb": '#residentialSuburb',
            "Home City": '#residentialCity',
            "Home Province": '#residentialProvince',
            "Home Postal Code": '#residentialPostalCode',
            "Postal Box": '#postalAddressOne',
            "Postal Suburb": '#postalSuburb',
            "Postal City": '#postalCity',
            "Postal Province": '#postalProvince',
            "Postal Code": '#postalPostalCode'
        };

        return validateTableData([table.rowsHash()], propertyToCssMap);
    });

    this.Then(/^I should see the following international payment personal details for the foreign national with a work permit$/, function (table) {
        var propertyToCssMap = {
            "Contact first name": '#firstName',
            "Contact last name": '#lastName',
            "Gender": '#gender',
            "Work Permit Number": '#workPermitNumber',
            "Date of Birth": '#dateOfBirth',
            "Work Permit Expiry Date": '#workPermitExpiryDate',
            "Passport Number": '#passportNumber',
            "Country Of Issue": '#countryOfIssue',
            "Contact": '#contact',
            "Home Address Street": '#residentialAddressOne',
            "Home Suburb": '#residentialSuburb',
            "Home City": '#residentialCity',
            "Home Province": '#residentialProvince',
            "Home Postal Code": '#residentialPostalCode',
            "Postal Box": '#postalAddressOne',
            "Postal Suburb": '#postalSuburb',
            "Postal City": '#postalCity',
            "Postal Province": '#postalProvince',
            "Postal Code": '#postalPostalCode'
        };

        return validateTableData([table.rowsHash()], propertyToCssMap);
    });

    this.Then(/^I should see the following international payment personal details for the foreign national with a foreign id$/, function (table) {
        var propertyToCssMap = {
            "Contact first name": '#firstName',
            "Contact last name": '#lastName',
            "Gender": '#gender',
            "Date of Birth": '#dateOfBirth',
            "Foreign Id Number": '#foreignIdNumber',
            "Country Of Issue": '#countryOfIssue',
            "Contact": '#contact',
            "Home Address Street": '#residentialAddressOne',
            "Home Suburb": '#residentialSuburb',
            "Home City": '#residentialCity',
            "Home Province": '#residentialProvince',
            "Home Postal Code": '#residentialPostalCode',
            "Postal Box": '#postalAddressOne',
            "Postal Suburb": '#postalSuburb',
            "Postal City": '#postalCity',
            "Postal Province": '#postalProvince',
            "Postal Code": '#postalPostalCode'
        };

        return validateTableData([table.rowsHash()], propertyToCssMap);
    });

    this.Then(/^I should see the following international payment confirmation details$/, function (table) {
        var propertyToCssMap = {
            "From account": '#fromAccount',
            "Available balance": '#availableBalance',
            "Beneficiary name": '#beneficiaryName',
            "IBAN": '#iban',
            "SWIFT/BIC": '#swiftBIC',
            "Your reference": '#yourReference',
            "Their reference": '#theirReference',
            "Reason for payment (BoP code)": '#bopCode',
            "Payment fees": '#paymentFees',
            "Payment date": '#paymentDate',
            "Payment amount - foreign": '#paymentAmount',
            "Exchange rate": '#exchangeRate',
            "Payment amount - local": '#paymentAmountEquivalent',
            "Commission fee": '#commissionFee',
            "SWIFT fee": '#swiftFee',
            "Total amount": '#totalAmount'
        };

        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Payment date'] = tableHelper.dateFormat(new Date(),'D MMMM YYYY');

        return validateTableData(expectedRows, propertyToCssMap);
    });

    this.Then(/^I should see "([^"]*)" as the current step in the beneficiary tabs/, function (step) {
        return expect(element(by.css('.tabs li.active')).getText()).to.eventually.contain(step);
    });

    this.Then(/^I should see the "([^"]*)" contextual help/, function (property) {
        var propertyToCssMap = {
            "Country of Bank": '#cobContextualHelp',
            "IBAN": '#ibanContextualHelp',
            "SWIFT/BIC": '#swiftContextualHelp'
        };

        return expect(element(by.css(propertyToCssMap[property])).isDisplayed()).to.eventually.be.true;
    });

    this.When(/^I search for reason for payment with the search term "([^"]*)"/, function(value) {
        return element(by.css('input')).clear().sendKeys(value);
    });

    this.Then(/^I should see "([^"]*)" reason for payment (search results|bop groups|bop categories)/, function(count, type) {
        var typeClassMapping = {
            'search results': '.search-result-item',
            'bop groups': '.bop-group',
            'bop categories': '.bop-category-item'
        };

        var visibleItems = element.all(by.css(typeClassMapping[type])).filter(function(item) {
            return item.isDisplayed();
        });

        return expect(visibleItems.count()).to.eventually.equal(parseInt(count));
    });

    this.When(/^I click on the "([^"]*)" (search result|bop group|bop category)/, function(name, type) {
        var typeClassMapping = {
            'search result': '.search-result-item',
            'bop group': '.bop-group',
            'bop category': '.bop-category-item'
        };

        return element(by.cssContainingText(typeClassMapping[type], name)).click();
    });

    this.When(/^I click on the More tag to view more bop groups/, function() {
        return element(by.css("#viewMoreGroups")).click();
    });

    this.Then(/^I should see the "([^"]*)" (search result|bop group|bop category)/, function(name, type) {
        var typeClassMapping = {
            'search result': '.search-result-item',
            'bop group': '.bop-group',
            'bop category': '.bop-category-item'
        };

        return element(by.cssContainingText(typeClassMapping[type], name)).click();
    });

    this.Then(/^I should see the international payment reference code of "([^"]*)"/, function(referenceCode) {
        return expect(element.all(by.css('.reference-code')).getText()).to.eventually.contain(referenceCode);
    });
};

module.exports = international_payment_step_definitions;
