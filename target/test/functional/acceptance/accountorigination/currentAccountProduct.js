var rcpEnabled = false;
{
    rcpEnabled = true;
}

describe('ACCEPTANCE - Current Account Product', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var anyPage = require('../../pages/anyPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var availableProductsPage = require('../../pages/availableProductsPage.js');
    var currentAccountDetailsPage = require('../../pages/currentAccountDetailsPage.js');
    var customerInformationPage = require('../../pages/customerInformationPage.js');
    var preScreeningPage = require('../../pages/preScreeningPage.js');
    var accountOfferPage = require('../../pages/accountOfferPage.js');
    var acceptOfferPage = require('../../pages/acceptOfferPage.js');
    var debitOrderSwitchingPage = require('../../pages/debitOrderSwitchingPage.js');
    var chequeCardPage = require('../../pages/chequeCardPage.js');

    if (!rcpEnabled) {

        describe('Apply for Current Account', function () {

            function loadCurrentAccountPageWith(user) {
                loginPage.loginWith(user);
                loginPage.baseActions.clickOnTab('Apply for Account');
            }

            describe('Customer with existing current account', function () {

                it("available products page should display account number", function () {
                    loginPage.loginWith(browser.params.credentials);
                    loginPage.baseActions.clickOnTab('Apply for Account');
                });

                it('should not be able to apply for an account', function () {
                    loadCurrentAccountPageWith(browser.params.credentials);
                    expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('apply/current-account');
                    expect(anyPage.getInfoNotification().getText()).toContain('You already have a current account');
                });
            });

            describe('Customer with accepted offer', function () {
                it('should view application in progress', function () {
                    loadCurrentAccountPageWith(browser.params.Current.hasAcceptedOffer);
                    expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('apply/current-account');
                    expect(anyPage.getInfoNotificationExists()).toBeFalsy();
                    expect(currentAccountDetailsPage.getAccountNumber()).toMatch(/40-012-322-1/);
                    expect(currentAccountDetailsPage.getAcceptedOfferAcceptedDate()).toMatch(/11 September 2014/);
                    expect(currentAccountDetailsPage.getOverdraft()).toMatch(/R 2 500.00/);
                });
            });

            describe('Customer with pending offer not KYC', function () {
                it('should view pending offer', function () {
                    loadCurrentAccountPageWith(browser.params.Current.hasPendingOffer);
                    expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('apply/current-account');
                    expect(anyPage.getInfoNotificationExists()).toBeFalsy();

                    expect(currentAccountDetailsPage.getVisibleViewButton()).toBeDefined();
                    expect(currentAccountDetailsPage.getPendingOfferApplicationDate()).toMatch(/30 September 2014/);

                    currentAccountDetailsPage.actions.view();
                    preScreeningPage.actions.clickNextButton();

                    expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Offer');
                    expect(accountOfferPage.productFamilyName()).toEqual('We are pleased to offer you our Elite Banking solution');
                    expect(accountOfferPage.productNames()).toEqual(['Staff Elite', 'Staff Elite Plus']);
                });
            });

            describe('Customer without existing current account', function () {
                it('should get declined', function () {
                    loadCurrentAccountPageWith(browser.params.Current.aoReject);

                    currentAccountDetailsPage.actions.applyForCurrentAccount();
                    preScreeningPage.actions.goToNextPage();
                    customerInformationPage.actions.goToConsentPage();
                    customerInformationPage.actions.navigateToNextPageByScrolling('submit');

                    expect(anyPage.waitForTitle('Application Declined')).toEqual('Application Declined');
                });

                it('should take you to the account origination page when the button is clicked', function () {
                    loadCurrentAccountPageWith(browser.params.Current.canApply);

                    expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('apply/current-account');
                    expect(anyPage.getInfoNotification().getText()).toMatch('You can apply online');

                    currentAccountDetailsPage.actions.applyForCurrentAccount();
                    preScreeningPage.actions.goToNextPage();

                    expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Details');

                    expect(customerInformationPage.customerInformationHeading('Your Profile').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationCurrentPage()).toMatch(/Basic information/);

                    customerInformationPage.actions.navigateToNextPageByScrolling('addressPage');
                    expect(customerInformationPage.customerInformationHeading('Home Address').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationCurrentPage()).toMatch(/Address/);

                    customerInformationPage.actions.navigateToNextPageByScrolling('employmentPage');
                    expect(customerInformationPage.customerInformationHeading('Current Employment').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationCurrentPage()).toMatch(/Employment/);

                    customerInformationPage.actions.navigateToNextPageByScrolling('incomePage');
                    expect(customerInformationPage.customerInformationHeading('Monthly income').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationHeading('Monthly expenses').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationCurrentPage()).toMatch(/Income and expenses/);

                    customerInformationPage.actions.navigateToNextPageByScrolling('consentPage');
                    expect(customerInformationPage.customerInformationHeading('Submit Application').isDisplayed()).toBeTruthy();
                    expect(customerInformationPage.customerInformationCurrentPage()).toMatch(/Submit/);

                    customerInformationPage.actions.navigateToNextPageByScrolling('submit');

                    expect(accountOfferPage.baseActions.flow.currentStep()).toEqual('Offer');
                    expect(accountOfferPage.productFamilyName()).toEqual('We are pleased to offer you our Elite Banking solution');
                    expect(accountOfferPage.productNames()).toEqual(['Elite', 'Elite Plus']);

                    expect(accountOfferPage.overdraftSection().isDisplayed()).toBeTruthy();
                    expect(accountOfferPage.overdraftLimit.getText()).toEqual('R 6 000.00');
                    expect(accountOfferPage.overdraftRate.getText()).toEqual('22.5%');
                    accountOfferPage.actions.selectOverdraft.click();
                    accountOfferPage.actions.overdraftAmount.clear().sendKeys('5000');
                    accountOfferPage.actions.selectConsent.click();

                    expect(accountOfferPage.actions.accept.getAttribute('disabled')).toBeTruthy();
                    accountOfferPage.chooseProduct(0);
                    expect(accountOfferPage.actions.accept.getAttribute('disabled')).toBeFalsy();

                    accountOfferPage.actions.accept.click();

                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Accept');
                    expect(acceptOfferPage.productName.getText()).toEqual('Elite');

                    expect(acceptOfferPage.overdraftLimit.getText()).toEqual('R 5 000.00');
                    expect(acceptOfferPage.overdraftRate.getText()).toEqual('22.5%');

                    acceptOfferPage.actions.back.click();

                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Offer');
                    accountOfferPage.chooseProduct(1);
                    accountOfferPage.actions.accept.click();

                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Accept');
                    expect(acceptOfferPage.productName.getText()).toEqual('Elite Plus');
                    expect(acceptOfferPage.actions.confirm.getAttribute('disabled')).toBeTruthy();
                    acceptOfferPage.acceptTermsAndConditions();
                });
            });

            describe('When GetCustomer call fails after pre-screen page', function () {
                it('should show service error notification', function () {
                    loadCurrentAccountPageWith(browser.params.RCP.getCustomerError);

                    currentAccountDetailsPage.actions.applyForCurrentAccount();
                    preScreeningPage.actions.goToNextPage();

                    expect(preScreeningPage.baseActions.getErrorVisibility()).toBeTruthy();
                    expect(preScreeningPage.baseActions.getErrorMessage()).toEqual('This service is currently unavailable. Please try again later, while we investigate');
                });
            });
        });

    }
});



