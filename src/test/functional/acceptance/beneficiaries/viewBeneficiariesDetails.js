describe('ACCEPTANCE - View Beneficiary Details Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var beneficiaryListPage = require('../../pages/listBeneficiaryPage.js');
    var viewBeneficiaryDetailsPage = require('../../pages/viewBeneficiaryDetailsPage.js');
    var __credentialsOfLoggedInUser__;
    var beneficiariesList;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
    });

    it('should go to view beneficiary details page when beneficiary with complete data is clicked', function () {
        beneficiariesList = beneficiaryListPage.getBeneficiaryList();
        helpers.scrollThenClick(beneficiariesList.get(1));
        expect(beneficiaryListPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/view");
    });

    describe('when viewing beneficiary details of a private beneficiary', function () {
        beforeEach(function () {
            beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            helpers.scrollThenClick(beneficiariesList.get(1));
        });

        it('should display all details related to private beneficiaries', function () {
            expect(viewBeneficiaryDetailsPage.beneficiaryName()).toBe('Danielle Ward');
            expect(viewBeneficiaryDetailsPage.bank()).toBe('STANDARD BANK');
            expect(viewBeneficiaryDetailsPage.branch()).toBe('SINGL IBT SBSA (51001)');
            expect(viewBeneficiaryDetailsPage.accountNumber()).toBe('45640211');
            expect(viewBeneficiaryDetailsPage.myReference()).toBe('Sister');
            expect(viewBeneficiaryDetailsPage.beneficiaryReference()).toBe('Liam Harper');
            expect(viewBeneficiaryDetailsPage.hasPaymentConfirmationType()).toBeFalsy();
            expect(viewBeneficiaryDetailsPage.beneficiaryGroup()).toBe('Alegtest');
        });

        it('should go to the pay beneficiary screen when pay beneficiary button is clicked', function () {
            helpers.scrollThenClick(viewBeneficiaryDetailsPage.payBeneficiary());

            expect(beneficiaryListPage.baseActions.getCurrentUrl()).toContain("/payment/beneficiary");
        });

        it('should go to the edit beneficiary screen when edit beneficiary button is clicked', function () {
            helpers.scrollThenClick(viewBeneficiaryDetailsPage.editBeneficiary());
            expect(beneficiaryListPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/edit");
        });

        it('should go back to beneficiaries list when back to beneficiaries button is clicked', function () {
            helpers.scrollThenClick(viewBeneficiaryDetailsPage.backToBeneficiaries());
            beneficiaryListPage.waitForList();
            expect(beneficiaryListPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });

    });

    describe('when viewing beneficiary details of a listed beneficiary', function () {
        beforeEach(function () {
            beneficiaryListPage.setFilterQuery(browser.params.beneficiaryInformation.listed.name);
            beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            helpers.scrollThenClick(beneficiariesList.get(0));
        });

        it('should show only the name and references fields', function () {
            expect(viewBeneficiaryDetailsPage.beneficiaryName()).toEqual('Edgars');
            expect(viewBeneficiaryDetailsPage.myReference()).toEqual('Fancy shoes');
            expect(viewBeneficiaryDetailsPage.beneficiaryReference()).toEqual('My shoes');
            expect(viewBeneficiaryDetailsPage.hasBank()).toBeFalsy();
            expect(viewBeneficiaryDetailsPage.hasBranch()).toBeFalsy();
            expect(viewBeneficiaryDetailsPage.hasAccountNumber()).toBeFalsy();
            expect(viewBeneficiaryDetailsPage.hasPaymentConfirmationType()).toBeFalsy();
            expect(viewBeneficiaryDetailsPage.hasBeneficiaryGroup()).toBeFalsy();
        });
    });

    describe('when viewing beneficiary details of a beneficiary', function () {
        beforeEach(function () {
            beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            helpers.scrollThenClick(beneficiariesList.get(4));
        });

        it('should show beneficiary with payment confirmation details', function () {
            expect(viewBeneficiaryDetailsPage.beneficiaryName()).toEqual('Paris McGlashan');
            expect(viewBeneficiaryDetailsPage.bank()).toEqual('STANDARD BANK');
            expect(viewBeneficiaryDetailsPage.branch()).toEqual('SINGL IBT SBSA (51001)');
            expect(viewBeneficiaryDetailsPage.accountNumber()).toEqual('45640211');
            expect(viewBeneficiaryDetailsPage.myReference()).toEqual('Neighbour');
            expect(viewBeneficiaryDetailsPage.beneficiaryReference()).toEqual('Car accident');
            expect(viewBeneficiaryDetailsPage.paymentConfirmationType()).toEqual('Paris (0714443212)');
            expect(viewBeneficiaryDetailsPage.beneficiaryGroup()).toEqual('Alegtest');
        });
    });

    describe('when successfully deleting a beneficiary', function () {
        beforeEach(function () {
            beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            helpers.scrollThenClick(beneficiariesList.get(1));
        });

        it('should ask for confirmation and redirect to beneficiary list page', function () {
            helpers.scrollThenClick(viewBeneficiaryDetailsPage.deleteBeneficiary());

            expect(viewBeneficiaryDetailsPage.confirmDelete.isDisplayed()).toBeTruthy();

            viewBeneficiaryDetailsPage.confirmDelete.click();
            expect(beneficiaryListPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
        });
    });

    describe('when unsuccessfully deleting a beneficiary', function () {
        beforeEach(function () {
            beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            helpers.scrollThenClick(beneficiariesList.get(4));
        });

        it('should show error', function () {
            helpers.scrollThenClick(viewBeneficiaryDetailsPage.deleteBeneficiary());
            viewBeneficiaryDetailsPage.confirmDelete.click();

            expect(viewBeneficiaryDetailsPage.deletedError.isDisplayed()).toBeTruthy();

            viewBeneficiaryDetailsPage.removeDeletionErrorButton.click();

            helpers.scrollThenClick(viewBeneficiaryDetailsPage.deleteBeneficiary());
            expect(viewBeneficiaryDetailsPage.confirmDelete.isDisplayed()).toBeTruthy();
        });
    });
});



