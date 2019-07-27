describe('ACCEPTANCE - Pay Multiple Beneficiaries Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var payMultipleBeneficiariesPage = require('../../pages/payMultipleBeneficiariesPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var paymentNotificationPreferencesModal = require('../../pages/paymentNotificationPreferencesModal.js');

    var __credentialsOfLoggedInUser__;

    describe('when no beneficiaries are linked', function () {

        beforeEach(function () {
            var credentials = browser.params.credentialsWithZeroBeneficiaries;
            if (__credentialsOfLoggedInUser__ !== credentials) {
                loginPage.loginWith(credentials);
                __credentialsOfLoggedInUser__ = credentials;
            }
            landingPage.baseActions.navigateToTransact();
            helpers.scrollThenClick(transactionPage.payMultipleButton());
        });

        it('should display a message when no beneficiaries have been linked', function () {
            expect(payMultipleBeneficiariesPage.baseActions.getWarningMessage()).toBe("There are no beneficiaries linked to your profile.");
        });
    });

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

        var expectInitialState = function () {
            expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.00");
            expect(payMultipleBeneficiariesPage.nextButton().getAttribute('disabled')).toBeTruthy();
            expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
            expect(payMultipleBeneficiariesPage.availableLimit().getText()).toEqual("R 6 000.00");
        };

        it('should show results of payments after confirmation', function () {
            payMultipleBeneficiariesPage.amountField(0).sendKeys(0.11);
            payMultipleBeneficiariesPage.amountField(1).sendKeys(0.11);
            payMultipleBeneficiariesPage.amountField(2).sendKeys(0.11);

            helpers.scrollThenClick(payMultipleBeneficiariesPage.nextButton());
            helpers.scrollThenClick(payMultipleBeneficiariesPage.confirmButton());

            expect(payMultipleBeneficiariesPage.notification(0).getText()).toEqual("Successful");
            expect(payMultipleBeneficiariesPage.notification(1).getText()).toEqual("Successful");
            expect(payMultipleBeneficiariesPage.notification(2).getText()).toEqual("Insufficient funds");
            expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.33");
        });

        it('should search using a valid beneficiary', function () {
            payMultipleBeneficiariesPage.filter("Danielle");
            var beneficiaryList = payMultipleBeneficiariesPage.getBeneficiaryList();
            beneficiaryList.then(function (beneficiaries) {
                expect(beneficiaries[0].getText()).toContain("Danielle");
            });
        });

        it('should return message when search is invalid', function () {
            payMultipleBeneficiariesPage.filter("No results");
            expect(payMultipleBeneficiariesPage.baseActions.getWarningMessage()).toEqual("No matches found.");
        });

        function ensureReferenceFieldsAreEditable() {
            expect(payMultipleBeneficiariesPage.yourReference(0).getAttribute('value')).toEqual('Sister');
            expect(payMultipleBeneficiariesPage.beneficiaryReference(0).getAttribute('value')).toEqual('Liam Harper');
        }

        function ensureTotalAmountAddsUp() {
            payMultipleBeneficiariesPage.amountField(0).sendKeys(0.11);
            payMultipleBeneficiariesPage.amountField(1).sendKeys(0.11);
            payMultipleBeneficiariesPage.amountField(2).sendKeys(0.11);
            payMultipleBeneficiariesPage.amountField(3).clear(); // because IE9 sometimes fails to recalculate the total after the last keypress
            expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.33");
        }
        function changeReferenceFields() {
            payMultipleBeneficiariesPage.yourReference(0).sendKeys(protractor.Key.END, 'NEW');
            payMultipleBeneficiariesPage.beneficiaryReference(0).sendKeys(protractor.Key.END, 'NEW');
        }

        function ensureReferenceFieldsAreChanged() {
            expect(payMultipleBeneficiariesPage.yourReferenceOnConfirm(0).getText()).toEqual('SisterNEW');
            expect(payMultipleBeneficiariesPage.beneficiaryReferenceOnConfirm(0).getText()).toEqual('Liam HarperNEW');
        }

        function ensureAmountsArePersisted() {
            expect(payMultipleBeneficiariesPage.amount(0).getText()).toEqual('R 0.11');
            expect(payMultipleBeneficiariesPage.amount(1).getText()).toEqual('R 0.11');
            expect(payMultipleBeneficiariesPage.amount(2).getText()).toEqual('R 0.11');
            expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
            expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.33");
        }

        function ensureUserInputIsKept() {
            expect(payMultipleBeneficiariesPage.yourReferenceIsReady()).toBeTruthy();
            expect(payMultipleBeneficiariesPage.yourReference(0).getAttribute('value')).toEqual('SisterNEW');
            expect(payMultipleBeneficiariesPage.beneficiaryReference(0).getAttribute('value')).toEqual('Liam HarperNEW');

            expect(payMultipleBeneficiariesPage.amountField(0).getAttribute('value')).toEqual('0.11');
            expect(payMultipleBeneficiariesPage.amountField(1).getAttribute('value')).toEqual('0.11');
            expect(payMultipleBeneficiariesPage.amountField(2).getAttribute('value')).toEqual('0.11');
            expect(payMultipleBeneficiariesPage.totalAmount().getText()).toContain("R 0.33");
            expect(payMultipleBeneficiariesPage.availableBalance().getText()).toEqual("R 8 756.41");
        }

        function ensurePreferenceModalWindowExists() {
            expect(payMultipleBeneficiariesPage.notificationPreferenceLink(0).getText()).toEqual('None');
            payMultipleBeneficiariesPage.notificationPreferenceLink(0).click();

            expect(payMultipleBeneficiariesPage.baseActions.getInfoMessage()).toEqual('Selected notification method will apply to this payment only');
            expect(paymentNotificationPreferencesModal.noCheckbox().getAttribute('checked')).toBeTruthy();
        }

        function ensurePreferenceModalValidation(address) {
            paymentNotificationPreferencesModal.yesCheckbox().click();
            expect(paymentNotificationPreferencesModal.emailCheckbox().getAttribute('checked')).toBeTruthy();
            expect(paymentNotificationPreferencesModal.continueButton().getAttribute('disabled')).toBeTruthy();

            paymentNotificationPreferencesModal.preferredName('$$');
            expect(paymentNotificationPreferencesModal.baseActions.getErrorFor('Recipient_Name')).toEqual('Please enter a valid recipient name');

            paymentNotificationPreferencesModal.preferredAddress('aa');
            expect(paymentNotificationPreferencesModal.baseActions.getErrorFor('Recipient_Email')).toEqual('Please enter a valid email address');

            paymentNotificationPreferencesModal.preferredName('Abc');
            paymentNotificationPreferencesModal.preferredAddress(address);
            paymentNotificationPreferencesModal.continue();
        }

        function ensurePaymentPreferencesArePersisted() {
            expect(payMultipleBeneficiariesPage.recipientNameOnConfirm(0).getText()).toEqual('Abc');
            expect(payMultipleBeneficiariesPage.paymentNotificationOnConfirm(0).getText()).toEqual('add@add.com');
        }

        function ensurePaymentPreferencesAreKept() {
            expect(payMultipleBeneficiariesPage.notificationPreferenceLink(0).getText()).toEqual('Email');
            payMultipleBeneficiariesPage.notificationPreferenceLink(0).click();

            expect(payMultipleBeneficiariesPage.baseActions.getInfoMessage()).toEqual('Selected notification method will apply to this payment only');
            expect(paymentNotificationPreferencesModal.yesCheckbox().getAttribute('checked')).toBeTruthy();

            expect(paymentNotificationPreferencesModal.preferredName()).toEqual('Abc');
            expect(paymentNotificationPreferencesModal.preferredAddress()).toEqual('add@add.com');
        }

        function ensurePreferenceModalCancelButton() {
            payMultipleBeneficiariesPage.notificationPreferenceLink(0).click();
            paymentNotificationPreferencesModal.preferredName('$$');
            paymentNotificationPreferencesModal.cancel();

            payMultipleBeneficiariesPage.notificationPreferenceLink(0).click();
            expect(paymentNotificationPreferencesModal.preferredName()).toEqual('Abc');
            paymentNotificationPreferencesModal.cancel();
        }

        function ensurePreferenceModalChangeToNo() {
            expect(payMultipleBeneficiariesPage.notificationPreferenceLink(2).getText()).toEqual('SMS');

            payMultipleBeneficiariesPage.notificationPreferenceLink(2).click();
            expect(paymentNotificationPreferencesModal.yesCheckbox().getAttribute('checked')).toBeTruthy();

            paymentNotificationPreferencesModal.noCheckbox().click();
            paymentNotificationPreferencesModal.continue();
            expect(payMultipleBeneficiariesPage.notificationPreferenceLink(2).getText()).toEqual('None');
        }

        it('should maintain state from confirmation page when modifying content', function () {
            expectInitialState();

            ensureReferenceFieldsAreEditable();
            changeReferenceFields();
            ensureTotalAmountAddsUp();

            ensurePreferenceModalWindowExists();
            ensurePreferenceModalValidation('add@add.com');
            ensurePreferenceModalCancelButton();
            ensurePreferenceModalChangeToNo();

            payMultipleBeneficiariesPage.next();

            ensureReferenceFieldsAreChanged();
            ensureAmountsArePersisted();
            ensurePaymentPreferencesArePersisted();

            payMultipleBeneficiariesPage.modify();

            ensureUserInputIsKept();
            ensurePaymentPreferencesAreKept();
        });

    });
});
