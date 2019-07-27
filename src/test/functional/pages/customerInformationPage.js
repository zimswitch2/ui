var customerInformationPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var goToPage = function (pageElement, cssToWaitFor) {
        return pageElement.click().then(function () {
            browser.wait(function () {
                return element(by.css(cssToWaitFor)).isDisplayed();
            }, 3000);
        });
    };

    this.actions = {
        goToAddressPage: function () {
            return goToPage(this.addressTab(), '.address');
        }.bind(this),
        goToEmploymentPage: function () {
            return goToPage(this.employmentTab(), '.employment');
        }.bind(this),
        goToIncomeAndExpensesPage: function () {
            return goToPage(this.incomeAndExpensesTab(), '.income');
        }.bind(this),
        goToConsentPage: function () {
            return goToPage(this.consentTab(), '.consent');
        }.bind(this),
        navigateToNextPageByScrolling: function (id) {
            return element(by.id(id)).click();
        }.bind(this)
    };

    this.addressTab = function () {
        return element(by.id('address-nav'));
    };

    this.employmentTab = function () {
        return element(by.id('employment-nav'));
    };

    this.incomeAndExpensesTab = function () {
        return element(by.id('income-and-expenses-nav'));
    };
    this.consentTab = function () {
        return element(by.id('consent-nav'));
    };

    this.edit = function () {
        return element(by.id('edit-contact-button'));
    };

    this.customerInformationHeading = function (text) {
        return helpers.wait(element(by.cssContainingText('.customer-info-scroll h3', text)));
    };

    this.customerInformationCurrentPage = function () {
        return element(by.css('.customer-info-nav .active')).getText();
    };
};

module.exports = new customerInformationPage();
