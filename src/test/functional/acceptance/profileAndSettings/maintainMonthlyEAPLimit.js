describe('ACCEPTANCE - Maintain EAP Limit', function () {
    'use strict';

    var otpPage = require('../../pages/otpPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var monthlyPaymentLimitPage = require('../../pages/monthlyPaymentLimitPage.js');
    var transactionPage = require('../../pages/transactionPage.js');

    var correctOtp = browser.params.oneTimePassword;
    var __credentialsOfLoggedInUser__;

    function loginUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    }

    beforeEach(function () {
        loginUsing(browser.params.credentials);
    });

    describe('happy path', function () {
        beforeEach(function () {
            landingPage.baseActions.navigateToProfileAndSettings();
            var url = '/monthly-payment-limit';
            monthlyPaymentLimitPage.clickOnMonthlyPaymentLimit(url);
        });

        it('should display current payment limit amounts and allow decrease/increase of EAP', function () {
            expect(monthlyPaymentLimitPage.successMessage().getText()).toBe('');
            expect(monthlyPaymentLimitPage.successMessage().isDisplayed()).toBeFalsy();
            expect(monthlyPaymentLimitPage.errorMessage().getText()).toBe('');
            expect(monthlyPaymentLimitPage.errorMessage().isDisplayed()).toBeFalsy();

            expect(monthlyPaymentLimitPage.getMonthlyLimit()).toEqual('R 10 000.00');
            expect(monthlyPaymentLimitPage.getUsedEAPLimit()).toEqual('R 4 000.01');
            expect(monthlyPaymentLimitPage.getAvailableLimit()).toEqual('R 5 999.99');
            expect(monthlyPaymentLimitPage.isAmountVisible()).toBeFalsy();

            monthlyPaymentLimitPage.clickMaintainLimitButton();

            expect(monthlyPaymentLimitPage.isAmountVisible()).toBeTruthy();
            expect(monthlyPaymentLimitPage.getAmountText()).toEqual('');

            monthlyPaymentLimitPage.typeAmount('3000');
            expect(monthlyPaymentLimitPage.infoMessage().getText()).toBe('Decreasing your limit to below the used limit amount will result in you not being able to make any further online payments this month.');

            monthlyPaymentLimitPage.typeAmount('5000');
            expect(monthlyPaymentLimitPage.infoMessage().getText()).toBe('');
            monthlyPaymentLimitPage.clickSaveButton();

            expect(monthlyPaymentLimitPage.getMonthlyLimit()).toEqual('R 5 000.00');
            expect(monthlyPaymentLimitPage.getUsedEAPLimit()).toEqual('R 4 000.01');
            expect(monthlyPaymentLimitPage.getAvailableLimit()).toEqual('R 999.99');

            expect(monthlyPaymentLimitPage.successMessage().getText()).toBe('Monthly payment limit successfully updated');
            expect(monthlyPaymentLimitPage.errorMessage().isDisplayed()).toBeFalsy();

            monthlyPaymentLimitPage.clickMaintainLimitButton();
            monthlyPaymentLimitPage.typeAmount('11000');
            expect(monthlyPaymentLimitPage.infoMessage().getText()).toBe('');
            expect(monthlyPaymentLimitPage.saveButton().getAttribute('track-click')).toEqual('Change monthly payment limit');
            monthlyPaymentLimitPage.clickSaveButton();
            expect(monthlyPaymentLimitPage.baseActions.getCurrentUrl()).toContain('otp/verify');
            otpPage.submitOtp(correctOtp);

            expect(monthlyPaymentLimitPage.getMonthlyLimit()).toEqual('R 10 000.00');
            expect(monthlyPaymentLimitPage.getUsedEAPLimit()).toEqual('R 4 000.01');
            expect(monthlyPaymentLimitPage.getAvailableLimit()).toEqual('R 5 999.99');

            expect(monthlyPaymentLimitPage.successMessage().getText()).toBe('Monthly payment limit successfully updated');
            expect(monthlyPaymentLimitPage.errorMessage().isDisplayed()).toBeFalsy();
        });
    });

    describe('Navigation', function () {
            it('should navigate to monthly eap limit page', function () {
                landingPage.baseActions.clickOnTab('Transact');
                expect(transactionPage.monthlyEAPLimitMenuItem().getAttribute('track-click')).toEqual('transact-change-eap-limit');
                transactionPage.clickOnMonthlyEAPLimitMenuItem();
                expect(monthlyPaymentLimitPage.baseActions.getCurrentUrl()).toContain('monthly-payment-limit');
            });
    });
});