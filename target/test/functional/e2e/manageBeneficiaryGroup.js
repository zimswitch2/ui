'use strict';

describe('E2E - Manage Beneficiary Group', function () {

    var helpers = require('../pages/helpers.js');
    var loginPage = require('../pages/loginPage.js');
    var landingPage = require('../pages/landingPage.js');
    var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
    var listBeneficiaryGroupPage = require('../pages/listBeneficiaryGroupsPage.js');
    var addBeneficiaryGroupPage = require('../pages/addBeneficiariesGroupPage.js');
    var otpPage = require('../pages/otpPage.js');
    var paymentPage = require('../pages/paymentPage.js');
    var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
    var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
    var viewGroupDetailsPage = require('../pages/viewGroupDetailsPage.js');
    var beneficiariesSteps = require('./../steps/beneficiariesSteps.js');
    var groupSteps = require('./../steps/groupSteps.js');
    var Chance = require('../../lib/chance');

    var chance = new Chance();
    var correctBeneficiaryDetails = browser.params.beneficiaryInformation.sbsaBank;
    var groupNewName = chance.word();
    var __credentialsOfLoggedInUser__;


    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    });

    describe('Positive Scenarios', function () {

        beforeEach(function () {
            this.groupName = chance.word();
            beneficiariesSteps.addBeneficiary(correctBeneficiaryDetails);
            groupSteps.addGroup(this.groupName);
        });

        afterEach(function () {
            groupSteps.deleteGroup(this.groupName);
            beneficiariesSteps.deleteBeneficiary(correctBeneficiaryDetails.name);
        });

        it('should add a beneficiary to a group', function () {
            groupSteps.addBeneficiaryToGroup();
            helpers.scrollThenClick(addBeneficiaryGroupPage.getBeneficiaryGroups().first());
            expect(addBeneficiaryGroupPage.baseActions.getSuccessVisibility()).toBeTruthy();
            expect(addBeneficiaryGroupPage.baseActions.getVisibleSuccessMessage()).toContain('Beneficiary has been successfully added to group.');
            expect(addBeneficiaryGroupPage.getBeneficiaryGroups().first().getText()).toContain('1 member');
        });

        it('should rename a group', function () {
            helpers.scrollThenClick(addBeneficiaryGroupPage.getBackToGroupsButton());
            helpers.scrollThenClick(listBeneficiaryGroupPage.getGroup(this.groupName));
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());

            viewGroupDetailsPage.renameGroupTo(groupNewName);
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('renameGroup'));
            expect(viewGroupDetailsPage.getInputField().isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getGroupName().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getGroupName().getText()).toEqual(groupNewName);
            expect(viewGroupDetailsPage.baseActions.getVisibleSuccessMessage()).toEqual('Group has been successfully renamed.');

            viewGroupDetailsPage.clickBackToGroups();
            expect(listBeneficiaryGroupPage.getGroup(groupNewName).getText()).toContain(groupNewName);
            this.groupName = groupNewName;
            helpers.scrollThenClick(listBeneficiaryGroupPage.getAddGroupButton());
        });

        it('should remove a beneficiary from a group', function () {
            groupSteps.addBeneficiaryToGroup();
            helpers.scrollThenClick(addBeneficiaryGroupPage.getBackToGroupsButton());
            helpers.scrollThenClick(listBeneficiaryGroupPage.getGroup(this.groupName));

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('removeMembers'));
            helpers.scrollThenClick(viewGroupDetailsPage.getCheckBox());
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('remove'));

            expect(viewGroupDetailsPage.baseActions.getSuccessVisibility()).toBeTruthy();
            expect(viewGroupDetailsPage.baseActions.getVisibleSuccessMessage()).toEqual('Member(s) have been successfully removed from group.');
            expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(0);

            helpers.scrollThenClick(addBeneficiaryGroupPage.getButton('backToBeneficiaryGroups'));
            helpers.scrollThenClick(listBeneficiaryGroupPage.getAddGroupButton());
        });

    });

    describe('Negative Scenarios', function () {

        beforeEach(function () {
            this.groupName = chance.word();
            groupSteps.addGroup(this.groupName);
        });

        afterEach(function () {
            groupSteps.deleteGroup(this.groupName);
        });

        it('should not add group when its a duplicate', function () {
            addBeneficiaryGroupPage.addNewGroup(this.groupName);
            expect(addBeneficiaryGroupPage.baseActions.getErrorVisibility()).toBeTruthy();
            expect(addBeneficiaryGroupPage.baseActions.getErrorMessage()).toContain('You already have a beneficiary group with this name.');
        });

    });

});
