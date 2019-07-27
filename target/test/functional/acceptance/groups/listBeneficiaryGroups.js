describe('ACCEPTANCE - List Beneficiary Groups Functionality', function () {
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var listBeneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var listBeneficiaryGroupsPage = require('../../pages/listBeneficiaryGroupsPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var viewGroupDetailsPage = require('../../pages/viewGroupDetailsPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
    }

    describe('beneficiary groups page', function () {
        describe('with beneficiary groups present', function () {
            beforeEach(function () {
                navigateUsing(browser.params.credentials);
            });

            function expectCannotPayGroupWithNoMembers() {
                expect(listBeneficiaryGroupsPage.getPayIcon().get(2).getAttribute('class')).toContain('disabled');
                listBeneficiaryGroupsPage.getPayIcon().get(2).click();
                expect(viewGroupDetailsPage.baseActions.getCurrentUrl()).toContain('/beneficiaries/groups/list');
            }

            it('should display groups information, be sortable and allow user to navigate back', function () {
                expect(listBeneficiaryGroupsPage.baseActions.getCurrentUrl()).toContain('/beneficiaries/groups/list');
                expect(listBeneficiaryGroupsPage.getHeaderText()).toEqual('List of Beneficiary Groups');
                expect(listBeneficiaryGroupsPage.getGroupsList().count()).toEqual(browser.params.numberOfBeneficiaryGroups);
                expect(listBeneficiaryGroupsPage.getGroupsList().first().getText()).toContain('2 members');
                expect(listBeneficiaryGroupsPage.getGroupsList().last().getText()).toContain('1 member');

                expectCannotPayGroupWithNoMembers();

                listBeneficiaryGroupsPage.clickSortByName();
                expect(listBeneficiaryGroupsPage.getGroupsList().first().getText()).toContain('Test 3');

                listBeneficiaryGroupsPage.clickBackButton();
                transactionPage.waitForTransactPage();
                expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain('/transaction/dashboard');
            });

            it('should redirect to the pay group page', function () {
                listBeneficiaryGroupsPage.getPayIcon().first().click();
                expect(listBeneficiaryGroupsPage.baseActions.getCurrentUrl()).toContain('/beneficiaries/pay-group/Alegtest');
            });

            describe('delete button', function () {
                beforeEach(function () {
                    helpers.scrollThenClick(listBeneficiaryGroupsPage.getTrashIcon());
                });

                it('it should display message when clicked', function () {
                    expect(listBeneficiaryGroupsPage.getGroupsList().first().getText()).toContain('Delete');
                });

                it('should clear the message when cancel is clicked', function () {
                    helpers.scrollThenClick(listBeneficiaryGroupsPage.getCancelButton());
                    expect(listBeneficiaryGroupsPage.getGroupsList().first().getText()).not.toContain('Delete');
                    expect(listBeneficiaryGroupsPage.getGroupsList().count()).toEqual(browser.params.numberOfBeneficiaryGroups);
                });

                it('it should delete group when delete is clicked', function () {
                    listBeneficiaryGroupsPage.confirm();
                    expect(listBeneficiaryGroupsPage.getGroupsList().count()).toEqual(browser.params.numberOfBeneficiaryGroups - 1);
                });

            });

        });

      describe('with no beneficiary groups present', function () {
        it('should display a message informing you that you have no groups', function () {
          navigateUsing(browser.params.credentialsWithZeroBeneficiaries);
          expect(listBeneficiaryGroupsPage.getNoGroupsInformationText()).toEqual('There are no beneficiary groups linked to your profile.');
        });
      });

    });
});
