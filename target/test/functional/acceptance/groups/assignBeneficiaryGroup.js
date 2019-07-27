describe('ACCEPTANCE - Assign Beneficiary to a Group Functionality', function () {
    'use strict';
    
    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var listBeneficiariesPage = require('../../pages/listBeneficiaryPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var listBeneficiaryGroupsPage = require('../../pages/listBeneficiaryGroupsPage.js');
    var addBeneficiariesGroupPage = require('../../pages/addBeneficiariesGroupPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
        helpers.scrollThenClick(listBeneficiaryGroupsPage.getAddGroupButton());
    }

    describe('when no beneficiaries are linked to the profile', function () {
        it('should display a message saying no beneficiaries have been linked', function () {
            navigateUsing(browser.params.credentialsWithZeroBeneficiaries);
            expect(addBeneficiariesGroupPage.baseActions.getWarningMessage()).toEqual("There are no beneficiaries linked to your profile.");
        });
    });

    describe('when there are beneficiaries linked to the profile', function () {
        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        describe('when loading page', function () {

            it('should display add beneficiary group page URL', function () {
                expect(addBeneficiariesGroupPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/groups/add");
            });

            it('should not have beneficiary listed on beneficiary group', function () {
                expect(addBeneficiariesGroupPage.getGroupStatusVisibility()).toBeFalsy();
            });

            it('should allow search on beneficiary list', function () {
                anyPage.setFilterQuery(browser.params.beneficiaryInformation.sbsaBank.name);
                expect(listBeneficiariesPage.getNotSelectableBeneficiaryList().first().getText()).toContain(browser.params.beneficiaryInformation.sbsaBank.name);
            });

            it('should show a warning message when no beneficiaries are found for the search criteria provided', function () {
                anyPage.setFilterQuery("No results");
                expect(addBeneficiariesGroupPage.baseActions.getWarningMessage()).toEqual("No matches found.");
            });

        });

        describe('when beneficiaries are selected', function () {

            beforeEach(function () {
                var beneficiaryList = listBeneficiariesPage.getSelectableBeneficiaryList();
                helpers.scrollThenClick(beneficiaryList.get(0));
            });

            it('should display that a beneficiary is selected', function () {
                var groupStatus = addBeneficiariesGroupPage.getGroupStatus();
                expect(groupStatus).toContain('1 beneficiary selected');
            });

            it('should display that multiple beneficiaries are selected', function () {
                var beneficiaryList = listBeneficiariesPage.getSelectableBeneficiaryList();
                helpers.scrollThenClick(beneficiaryList.get(1));
                var groupStatus = addBeneficiariesGroupPage.getGroupStatus();
                expect(groupStatus).toContain('2 beneficiaries selected');
            });

            it('should display right number of beneficiaries', function () {
                expect(addBeneficiariesGroupPage.getBeneficiaryGroups().first().getText()).toContain('2 members');
            });

            it('should display zero beneficiaries when no members in group', function () {
                expect(addBeneficiariesGroupPage.getBeneficiaryGroups().get(2).getText()).toContain('0 member');
            });
        });

        describe('when adding a new beneficiary group', function () {

            it('should create a group', function () {
                addBeneficiariesGroupPage.addNewGroup("New Group");
                expect(addBeneficiariesGroupPage.groupNames()).toContain('New Group');
            });

            it('should display message when group name is duplicate', function () {
                addBeneficiariesGroupPage.addNewGroup("duplicate");
                expect(addBeneficiariesGroupPage.baseActions.getErrorVisibility()).toBeTruthy();
                expect(addBeneficiariesGroupPage.baseActions.getErrorMessage()).toContain('You already have a beneficiary group with this name.');
            });

            it('should display message when maximum number of beneficiaries is reached', function () {
                addBeneficiariesGroupPage.addNewGroup("maximum");
                expect(addBeneficiariesGroupPage.baseActions.getErrorVisibility()).toBeTruthy();
                expect(addBeneficiariesGroupPage.baseActions.getErrorMessage()).toContain('Group cannot be added as you are already at your maximum number of 30 groups.');
            });

            it('should display message when an error occurs', function () {
                addBeneficiariesGroupPage.addNewGroup("genericError");
                expect(addBeneficiariesGroupPage.baseActions.getErrorVisibility()).toBeTruthy();
                expect(addBeneficiariesGroupPage.baseActions.getErrorMessage()).toContain('An error has occurred');
            });

        });

        describe("when adding beneficiaries to a group", function () {

            it('should display success message and update number of members in the group', function () {
                var beneficiaryList = listBeneficiariesPage.getSelectableBeneficiaryList();
                helpers.scrollThenClick(beneficiaryList.get(0));
                helpers.scrollThenClick(beneficiaryList.get(1));

                var group = addBeneficiariesGroupPage.getBeneficiaryGroups().first();
                helpers.scrollThenClick(group);
                expect(addBeneficiariesGroupPage.baseActions.getSuccessVisibility()).toBeTruthy();
                expect(addBeneficiariesGroupPage.baseActions.getVisibleSuccessMessage()).toContain('Beneficiary has been successfully added to group.');
                expect(addBeneficiariesGroupPage.getGroupMembers(group)).toEqual('4 members');
            });
        });
    });
});
