describe('ACCEPTANCE - Schedule future dated payment Functionality', function () {
    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var paymentPage = require('../../pages/paymentPage.js');
    var beneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
        beneficiaryPage.clickOnPay();
    }

    describe('user with non zero EAP limit', function () {
        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        it('should not enable the next button when no amount', function () {
            paymentPage.selectLastDate();
            expect(anyPage.canProceed()).toEqual(false);
        });

        it('should schedule future dated payment', function () {
            paymentPage.selectLastDate();
            paymentPage.amount('100.00');
            paymentPage.proceed();
            paymentPage.clickConfirm();
            expect(paymentPage.baseActions.getVisibleSuccessMessage()).toEqual('Payment was successfully scheduled');
        });
    });

    describe('user with zero EAP limit', function () {
        beforeEach(function () {
            navigateUsing(browser.params.credentialsWithZeroEAPLimit);
        });

        it('should show notification to set EAP limit', function () {
            expect(paymentPage.baseActions.getErrorMessage()).toContain('Your electronic account payment (EAP) limit needs to be set');
        });
    });
});
