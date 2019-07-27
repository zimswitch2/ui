describe('ACCEPTANCE - Edit Private Beneficiary Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var editBeneficiaryPage = require('../../pages/addBeneficiaryPage.js');
    var listBeneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var confirmBeneficiaryPage = require('../../pages/confirmBeneficiaryPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var sbsaBank = browser.params.beneficiaryInformation.sbsaBank;
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentialsForNoFutureTransactions;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
    });

    function proceed() {
        editBeneficiaryPage.proceed();
        confirmBeneficiaryPage.clickConfirm();
        otpPage.submitOtp('12345');
    }

    describe('cancel button', function () {
        beforeEach(function () {
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
            listBeneficiaryPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.name);
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/edit");
        });

        it('should return to list of beneficiaries from edit page', function () {
            editBeneficiaryPage.clickCancel();
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });

        it('should return to list of beneficiaries from confirm page', function () {
            editBeneficiaryPage.proceed();
            editBeneficiaryPage.clickConfirmCancel();
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });
    });

    describe('modify button', function () {
        it('should show the details page', function () {
            listBeneficiaryPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.name);
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());

            expect(editBeneficiaryPage.getEditForm().isDisplayed()).toBeTruthy();
            expect(editBeneficiaryPage.getViewDetails().isDisplayed()).toBeFalsy();

            editBeneficiaryPage.proceed();

            expect(editBeneficiaryPage.getEditForm().isDisplayed()).toBeFalsy();
            expect(editBeneficiaryPage.getViewDetails().isDisplayed()).toBeTruthy();

            editBeneficiaryPage.clickModify();

            expect(editBeneficiaryPage.getEditForm().isDisplayed()).toBeTruthy();
            expect(editBeneficiaryPage.getViewDetails().isDisplayed()).toBeFalsy();

            editBeneficiaryPage.clickCancel();
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });
    });

    describe('when loading page', function () {
        beforeEach(function () {
            listBeneficiaryPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.name);
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
        });

        it('should display add beneficiary URL', function () {
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/edit");
        });

        it('should pre-populate fields with existing data', function () {
            expect(editBeneficiaryPage.getBeneficiaryNameBox().getAttribute('value')).toEqual('Danielle Ward');
            expect(editBeneficiaryPage.getAccountNumberBox().getAttribute('value')).toEqual('45640211');
            expect(editBeneficiaryPage.group()).toEqual('Alegtest');
        });
    });

    describe('when editing a private beneficiary', function () {
        beforeEach(function(){
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
        });

        it('proceed button should be enabled', function(){
            expect(anyPage.canProceed()).toEqual(true);
        });

        it('should not give the option of searching the directory', function () {
            expect(editBeneficiaryPage.getDirectorySearchBox().isDisplayed()).toBeFalsy();
            expect(editBeneficiaryPage.getWellBreak().isDisplayed()).toBeFalsy();
        });

        it('should edit beneficiary details', function () {
            editBeneficiaryPage.enterPrivateBeneficiaryDetails(sbsaBank);
            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/edit");

            proceed();
            expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");

        });
    });

    describe('when editing beneficiary with future transactions', function () {
        beforeEach(function () {
            var credentials = browser.params.credentials;
            if (__credentialsOfLoggedInUser__ !== credentials) {
                loginPage.loginWith(credentials);
                __credentialsOfLoggedInUser__ = credentials;
            }
            landingPage.baseActions.navigateToBeneficiaries();
            listBeneficiaryPage.setFilterQuery(browser.params.beneficiaryInformation.hasScheduledPayments.name);
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
        });

        it('should not enable the next button', function () {
            expect(editBeneficiaryPage.baseActions.getErrorMessage()).toEqual('Please delete any scheduled payment/s to this beneficiary before editing their details');
            expect(anyPage.canProceed()).toEqual(false);

        });
    });

    describe('when editing a listed beneficiary', function () {
        beforeEach(function(){
            listBeneficiaryPage.setFilterQuery(browser.params.beneficiaryInformation.listed.name);
            helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
        });

        it('proceed button should be enabled', function(){
            expect(anyPage.canProceed()).toEqual(true);
        });

        it('should not give the option of entering bank details', function () {
            expect(editBeneficiaryPage.canProvideBankInformation()).toBeFalsy();
            expect(editBeneficiaryPage.canProvideBranchInformation()).toBeFalsy();
        });

        it('should not give the option of searching the directory (i.e. changing the actual recipient', function () {
            expect(editBeneficiaryPage.getDirectorySearchBox().isDisplayed()).toBeFalsy();
            expect(editBeneficiaryPage.getWellBreak().isDisplayed()).toBeFalsy();
            expect(editBeneficiaryPage.getBeneficiaryName()).toEqual('Edgars');
        });

        it('should edit beneficiary references', function () {
            editBeneficiaryPage.cleanReferenceDetails();
            editBeneficiaryPage.enterReferenceDetails('NEW MY REF', 'NEW REC REF');

            expect(editBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/edit");
            proceed();
            expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });
    });
});
