describe('ACCEPTANCE - List Beneficiaries Functionality', function () {
    'use strict';

    var _ = require("lodash");
    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var beneficiaryListPage = require('../../pages/listBeneficiaryPage.js');
    var listBeneficiaryGroupsPage = require('../../pages/listBeneficiaryGroupsPage.js');
    var listBeneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var addBeneficiariesGroupPage = require('../../pages/addBeneficiariesGroupPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
    }

    describe('when no beneficiaries are linked to the profile'+ '#Beneficiaries not linked to the card', function () {
        it('should display a message saying no beneficiaries have been linked', function () {
            navigateUsing(browser.params.credentialsWithZeroBeneficiaries);
            expect(beneficiaryListPage.baseActions.getWarningMessage()).toEqual("There are no beneficiaries linked to your profile. Please add a beneficiary in order to pay.");
        });
    });

    describe('when there are beneficiaries linked to the profile', function () {

        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        it('should show a list containing all the beneficiaries related to a given account' +'#Content in the beneficiaries screen already loaded to the card', function () {
            var beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            expect(beneficiariesList.count()).toEqual(browser.params.numberOfBeneficiaries);
        });

        it('should filter list of the beneficiaries according to a given beneficiary name', function () {
            beneficiaryListPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.name);
            var beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            beneficiariesList.then(function (beneficiaries) {
                expect(beneficiaries[0].getText()).toContain(browser.params.beneficiaryInformation.sbsaBank.name);
            });
        });

        it('should filter list of the beneficiaries according to a given beneficiary my reference' +'#Searching the beneficiary in the search box', function () {
            beneficiaryListPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.myReference);
            var beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            beneficiariesList.then(function (beneficiaries) {
                expect(beneficiaries[0].getText()).toContain(browser.params.beneficiaryInformation.sbsaBank.myReference);
            });
        });

        it('should filter list of the beneficiaries according to a group name', function () {
            beneficiaryListPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.recipientGroupName);
            var beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            beneficiariesList.then(function (beneficiaries) {
                expect(beneficiaries[0].getText()).toContain(browser.params.beneficiaryInformation.sbsaBank.recipientGroupName);
            });
        });

        it('should filter list of the beneficiaries according to a given beneficiary last payment date', function () {
            beneficiaryListPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.lastPaymentDate);
            var beneficiariesList = beneficiaryListPage.getBeneficiaryList();
            beneficiariesList.then(function (beneficiaries) {
                expect(beneficiaries[0].getText()).toContain(browser.params.beneficiaryInformation.sbsaBank.lastPaymentDate);
            });
        });

        it('should show a warning message when no beneficiaries are found for the search criteria provided' + '#Beneficiaries not matching the search criteria', function () {
            beneficiaryListPage.setFilterQuery("No results");
            expect(beneficiaryListPage.baseActions.getWarningMessage()).toEqual("No matches found.");
        });

        it('should have a back button', function () {
            listBeneficiaryGroupsPage.clickBackButton();
            listBeneficiaryGroupsPage.waitPageHeaderText('Transact');
            expect(browser.getLocationAbsUrl()).toContain('/transaction/dashboard');
        });
    });
});
