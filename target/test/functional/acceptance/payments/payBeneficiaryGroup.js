describe('ACCEPTANCE - Pay Beneficiary Group Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var payMultipleBeneficiariesPage = require('../../pages/payMultipleBeneficiariesPage.js');
    var listBeneficiaryGroupsPage = require('../../pages/listBeneficiaryGroupsPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var paymentNotificationPreferencesModal = require('../../pages/paymentNotificationPreferencesModal.js');

    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
        helpers.scrollThenClick(listBeneficiaryGroupsPage.getPayIcon().first());
    });

    var expectInitialState = function () {
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.00");
        expect(payMultipleBeneficiariesPage.nextButton().getAttribute('disabled')).toBeTruthy();
        expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
        expect(payMultipleBeneficiariesPage.availableLimit().getText()).toEqual("R 6 000.00");
    };

    it('should pay multiple beneficiaries', function () {
        expectInitialState();

        payMultipleBeneficiariesPage.amountField(0).sendKeys(0.11);
        payMultipleBeneficiariesPage.amountField(1).sendKeys(0.11);
        payMultipleBeneficiariesPage.amountField(1).sendKeys(' '); // because IE9 sometimes fails to recalculate the total after the last keypress

        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");

        helpers.scrollThenClick(payMultipleBeneficiariesPage.nextButton());
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");

        helpers.scrollThenClick(payMultipleBeneficiariesPage.confirmButton());
        expect(payMultipleBeneficiariesPage.notification(0).getText()).toEqual("Successful");
        expect(payMultipleBeneficiariesPage.notification(1).getText()).toEqual("Insufficient funds");
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");
    });

    function ensureTotalAmountAddsUp() {
        payMultipleBeneficiariesPage.amountField(0).sendKeys(0.11);
        payMultipleBeneficiariesPage.amountField(1).sendKeys(0.11);
        payMultipleBeneficiariesPage.amountField(1).sendKeys(' '); // because IE9 sometimes fails to recalculate the total after the last keypress
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");
    }

    function changeReferenceFields() {
        payMultipleBeneficiariesPage.yourReference(1).sendKeys(protractor.Key.END, 'NEW');
        payMultipleBeneficiariesPage.beneficiaryReference(1).sendKeys(protractor.Key.END, 'NEW');
    }

    function ensureReferenceFieldsAreChanged() {
        expect(payMultipleBeneficiariesPage.yourReferenceOnConfirm(1).getText()).toEqual('NeighbourNEW');
        expect(payMultipleBeneficiariesPage.beneficiaryReferenceOnConfirm(1).getText()).toEqual('Car accidentNEW');
    }

    function ensureAmountsArePersisted() {
        expect(payMultipleBeneficiariesPage.amount(0).getText()).toEqual('R 0.11');
        expect(payMultipleBeneficiariesPage.amount(1).getText()).toEqual('R 0.11');
        expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");
    }

    function ensureUserInputIsKept() {
        expect(payMultipleBeneficiariesPage.yourReferenceIsReady()).toBeTruthy();
        expect(payMultipleBeneficiariesPage.yourReference(1).getAttribute('value')).toEqual('NeighbourNEW');
        expect(payMultipleBeneficiariesPage.beneficiaryReference(1).getAttribute('value')).toEqual('Car accidentNEW');

        expect(payMultipleBeneficiariesPage.amountField(0).getAttribute('value')).toEqual('0.11');
        expect(payMultipleBeneficiariesPage.amountField(1).getAttribute('value')).toEqual('0.11');
        expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.22");
        expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
    }

    it('should maintain state from confirmation page when modifying content', function () {
        changeReferenceFields();
        ensureTotalAmountAddsUp();

        payMultipleBeneficiariesPage.next();

        ensureReferenceFieldsAreChanged();
        ensureAmountsArePersisted();

        payMultipleBeneficiariesPage.modify();

        ensureUserInputIsKept();
    });
});
