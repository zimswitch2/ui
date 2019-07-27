describe('ACCEPTANCE - Groups Details Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var listBeneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var listBeneficiaryGroupsPage = require('../../pages/listBeneficiaryGroupsPage.js');
    var viewGroupDetailsPage = require('../../pages/viewGroupDetailsPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var payMultipleBeneficiariesPage = require('../../pages/payMultipleBeneficiariesPage.js');
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
    });

    it('should view different group details', function () {
        helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
        expect(viewGroupDetailsPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/groups/view");
        expect(viewGroupDetailsPage.getHeader("viewDetailsHeader").getText()).toEqual('Beneficiary Group Details');
        expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(2);

        viewGroupDetailsPage.clickBackToGroups();
        expect(listBeneficiaryGroupsPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/groups/list");

        helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().get(2));
        expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(0);
        expect(viewGroupDetailsPage.baseActions.getWarningMessage()).toEqual('There are no beneficiaries assigned to this group.');
    });

    describe('pay group page from details page', function () {
        it('it should pay group', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            helpers.scrollThenClick(viewGroupDetailsPage.getPayIcon());

            expect(payMultipleBeneficiariesPage.baseActions.getCurrentUrl()).toContain('/beneficiaries/pay-group/Alegtest');
            expect(payMultipleBeneficiariesPage.beneficiaryNameAt(0)).toEqual('Danielle Ward');
            expect(payMultipleBeneficiariesPage.beneficiaryNameAt(1)).toEqual('Paris McGlashan');
        });

        it('should not display pay icon when the group has no beneficiaries', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroup('Nomembers'));
            expect(viewGroupDetailsPage.getPayIcon().getAttribute('class')).toContain('ng-hide');
        });
    });

    describe('edit group name', function () {
        it('should show and hide buttons', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());

            expect(viewGroupDetailsPage.getEditIcon().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('renameGroup').isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getButton('cancelRename').isDisplayed()).toBeFalsy();

            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            expect(viewGroupDetailsPage.getEditIcon().isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getButton('renameGroup').isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('cancelRename').isDisplayed()).toBeTruthy();

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('cancelRename'));
            expect(viewGroupDetailsPage.getEditIcon().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('renameGroup').isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getButton('cancelRename').isDisplayed()).toBeFalsy();
        });

        it('should show and hide editable field with old group name', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            expect(viewGroupDetailsPage.getInputField().isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getGroupName().getText()).toEqual('Alegtest');
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());

            expect(viewGroupDetailsPage.getInputField().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getGroupName().isDisplayed()).toBeFalsy();

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('cancelRename'));
            expect(viewGroupDetailsPage.getInputField().isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getGroupName().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getGroupName().getText()).toEqual('Alegtest');
        });

        it('it should save new group name', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            viewGroupDetailsPage.renameGroupTo('new group name');
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('renameGroup'));

            expect(viewGroupDetailsPage.getInputField().isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getGroupName().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getGroupName().getText()).toEqual('new group name');
        });

        it('should display the corresponding message when group is renamed', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            viewGroupDetailsPage.renameGroupTo('duplicate');
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('renameGroup'));
            expect(viewGroupDetailsPage.baseActions.getErrorMessage()).toEqual('You already have a beneficiary group with this name.');

            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            expect(viewGroupDetailsPage.getSuccessContainer().isDisplayed()).toBeFalsy();
            viewGroupDetailsPage.renameGroupTo('new group name');
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('renameGroup'));
            expect(viewGroupDetailsPage.getSuccessContainer().getText()).toEqual('Group has been successfully renamed.');
        });

        it('should disable save button when group name is invalid', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            viewGroupDetailsPage.renameGroupTo('this is a super super super long name that should not be added');
            expect(viewGroupDetailsPage.getButton('renameGroup').isEnabled()).toBeFalsy();
            expect(viewGroupDetailsPage.getErrorMessage()).toEqual('Cannot be longer than 25 characters');
            viewGroupDetailsPage.renameGroupTo('#@$%&');

            expect(viewGroupDetailsPage.getButton('renameGroup').isEnabled()).toBeFalsy();
            expect(viewGroupDetailsPage.getErrorMessage()).toEqual('Please enter a group name without special characters');
        });
    });

    describe('delete the group', function () {
        it('should redirect to the list beneficiary groups page on success', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            viewGroupDetailsPage.clickDelete();
            viewGroupDetailsPage.clickConfirm();
            expect(viewGroupDetailsPage.baseActions.getCurrentUrl()).toContain('/beneficiaries/groups/list');
        });
    });

    describe('remove group members', function () {
        it('should show and hide buttons', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            expect(viewGroupDetailsPage.getButton('removeMembers').isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('remove').isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.getButton('cancelRemoval').isDisplayed()).toBeFalsy();

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('removeMembers'));
            expect(viewGroupDetailsPage.getButton('removeMembers').isDisplayed()).toBeFalsy();

            expect(viewGroupDetailsPage.getButton('remove').isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('cancelRemoval').isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('remove').isEnabled()).toBeFalsy();

            helpers.scrollThenClick(viewGroupDetailsPage.getCheckBox());
            expect(viewGroupDetailsPage.getButton('remove').isEnabled()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('cancelRemoval').isDisplayed()).toBeTruthy();

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('remove'));
        });


        it('should amend when remove is clicked', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(2);
            expect(viewGroupDetailsPage.getSuccessContainer().isDisplayed()).toBeFalsy();

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('removeMembers'));
            helpers.scrollThenClick(viewGroupDetailsPage.getCheckBox());
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('remove'));
            expect(viewGroupDetailsPage.getSuccessContainer().isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getButton('removeMembers').isDisplayed()).toBeTruthy();
            expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(1);
            expect(viewGroupDetailsPage.getSuccessContainer().getText()).toEqual('Member(s) have been successfully removed from group.');

            helpers.scrollThenClick(viewGroupDetailsPage.getButton('removeMembers'));
            helpers.scrollThenClick(viewGroupDetailsPage.getCheckBox());
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('remove'));
            expect(viewGroupDetailsPage.getBeneficiaryList().count()).toEqual(0);
            expect(viewGroupDetailsPage.getButton('removeMembers').isDisplayed()).toBeFalsy();
            expect(viewGroupDetailsPage.baseActions.getWarningMessage()).toEqual('There are no beneficiaries assigned to this group.');
        });

        it('it should successfully remove group members after editing group name', function () {
            helpers.scrollThenClick(listBeneficiaryGroupsPage.getGroupsList().first());
            helpers.scrollThenClick(viewGroupDetailsPage.getEditIcon());
            viewGroupDetailsPage.renameGroupTo('new group name');
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('renameGroup'));
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('removeMembers'));
            helpers.scrollThenClick(viewGroupDetailsPage.getCheckBox());
            helpers.scrollThenClick(viewGroupDetailsPage.getButton('remove'));
            expect(viewGroupDetailsPage.getSuccessContainer().getText()).toEqual('Member(s) have been successfully removed from group.');
        });
    });
});
