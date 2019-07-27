describe('ACCEPTANCE - Pay Multiple Beneficiaries Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var payMultipleBeneficiariesPage = require('../../pages/payMultipleBeneficiariesPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var paymentNotificationPreferencesModal = require('../../pages/paymentNotificationPreferencesModal.js');

    var __credentialsOfLoggedInUser__;

    describe('when there are linked beneficiaries', function () {
        beforeEach(function () {
            var credentials = browser.params.credentials;
            if (__credentialsOfLoggedInUser__ !== credentials) {
                loginPage.loginWith(credentials);
                __credentialsOfLoggedInUser__ = credentials;
            }
            landingPage.baseActions.navigateToTransact();
            helpers.scrollThenClick(transactionPage.payMultipleButton());
        });

        it('should validate payment fields with special characters', function () {
            payMultipleBeneficiariesPage.amountField(0).sendKeys(browser.params.paymentInformation.amount.specialChar);
            expect(payMultipleBeneficiariesPage.nextButton().getAttribute('disabled')).toBeTruthy();

            payMultipleBeneficiariesPage.amountField(0).clear();
            payMultipleBeneficiariesPage.amountField(0).sendKeys(1.11);
            expect(payMultipleBeneficiariesPage.nextButton().getAttribute('disabled')).toBeFalsy();

            payMultipleBeneficiariesPage.yourReference(0).sendKeys('$');
            payMultipleBeneficiariesPage.yourReference(0).sendKeys(' '); // IE9 fix
            expect(payMultipleBeneficiariesPage.getFirstErrorFor('myReference')).toEqual('Please enter a valid reference');

            payMultipleBeneficiariesPage.beneficiaryReference(0).sendKeys('$');
            payMultipleBeneficiariesPage.beneficiaryReference(0).sendKeys(' '); // IE9 fix

            expect(payMultipleBeneficiariesPage.getFirstErrorFor('beneficiaryReference')).toEqual('Please enter a valid beneficiary reference');

            expect(payMultipleBeneficiariesPage.nextButton().getAttribute('disabled')).toBeTruthy();
        });

        it('should change available limit when payment from account changes', function () {
            expect(payMultipleBeneficiariesPage.account()).toEqual('ACCESSACC - 10-00-035-814-0');
            expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");

            payMultipleBeneficiariesPage.account('SAVINGS - 42-14-42-14');

            expect(payMultipleBeneficiariesPage.account()).toEqual('SAVINGS - 42-14-42-14');
            expect(payMultipleBeneficiariesPage.availableBalance().getText()).not.toEqual("R 8 756.41");
        });

        it('should return an error message when  payment has succeeded and payment notification has failed', function () {
            payMultipleBeneficiariesPage.amountField(0).sendKeys(0.01);
            payMultipleBeneficiariesPage.amountField(3).sendKeys(0.01);
            payMultipleBeneficiariesPage.notificationPreferenceLink(3).click();
            paymentNotificationPreferencesModal.emailCheckbox().click();
            paymentNotificationPreferencesModal.preferredName('Abc');
            paymentNotificationPreferencesModal.preferredAddress('invalidEmail@some.company');
            paymentNotificationPreferencesModal.continue();
            payMultipleBeneficiariesPage.next();
            helpers.scrollThenClick(payMultipleBeneficiariesPage.confirmButton());
            expect(payMultipleBeneficiariesPage.notification(0).getText()).toEqual("Successful");
            expect(payMultipleBeneficiariesPage.notification(1).getText()).toEqual("Successful");
            expect(payMultipleBeneficiariesPage.paymentNotificationOnResult(1).getText()).toEqual('Invalid email entered');
        });
    });
});
