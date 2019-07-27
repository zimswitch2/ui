var rcpEnabled = false;
{
    rcpEnabled = true;
}

var customerManagementV4Feature = false;
{
    customerManagementV4Feature = true;
}

describe('ACCEPTANCE - Edit customer information', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var currentAccountDetailsPage = require('../../pages/currentAccountDetailsPage.js');
    var availableProductsPage = require('../../pages/availableProductsPage.js');
    var preScreeningPage = require('../../pages/preScreeningPage.js');
    var customerInformationPage = require('../../pages/customerInformationPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var editAddressPage = require('../../pages/editAddressPage.js');
    var employmentPage = require('../../pages/employmentPage.js');
    var incomeAndExpensePage = require('../../pages/incomeAndExpensePage.js');
    var editIncomeExpensesPage = require('../../pages/editIncomeExpensesPage.js');
    var consentPage = require('../../pages/consentPage.js');

    function setup(loginDetails) {
        var login = function (loginDetails) {
            loginPage.loginWith(loginDetails);
            loginPage.baseActions.clickOnTab('Apply for Account');
        };

        login(loginDetails);
        if (rcpEnabled) {
            availableProductsPage.actions.currentAccountDetails();
        }
        currentAccountDetailsPage.getCurrentAccountApplyNow().click();
        preScreeningPage.actions.goToNextPage();
    }

    describe('when adding new customer information', function () {
        beforeEach(function () {
            setup(browser.params.Current.onlyHasBasicInfo);
        });

        describe('when adding new employment information', function () {

            it('should successfully add if customer is not employed', function () {
                customerInformationPage.actions.goToEmploymentPage();

                employmentPage.helpers.wait(employmentPage.saveButton);
                employmentPage.actions.setEmploymentToNo();

                if (customerManagementV4Feature) {
                    employmentPage.actions.selectUnemploymentReason("Unemployed");
                } else {
                    employmentPage.actions.selectLevelOfEducation('Bachelor');
                    employmentPage.actions.selectSpecialization('B compt');
                }
                employmentPage.actions.saveEmployment();
                otpPage.submitOtp('12345');
                expect(employmentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/employment');
            });


            it('should successfully add if customer is employed', function () {
                customerInformationPage.actions.goToEmploymentPage();

                employmentPage.helpers.wait(employmentPage.saveButton);
                employmentPage.actions.setEmploymentToYes();
                employmentPage.actions.selectEmployerName('My Employer');
                employmentPage.actions.selectStartDate();
                employmentPage.actions.selectOccupationIndustry('Agriculture');
                employmentPage.actions.selectOccupationLevel('Director');
                employmentPage.actions.selectStatus('Full time');
                employmentPage.actions.saveEmployment();
                otpPage.submitOtp('12345');
                expect(employmentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/employment');
            });

            it('should successfully add if customer is employed and has education', function () {
                customerInformationPage.actions.goToEmploymentPage();

                employmentPage.helpers.wait(employmentPage.saveButton);
                employmentPage.actions.setEmploymentToYes();
                employmentPage.actions.selectEmployerName('My Employer');
                employmentPage.actions.selectStartDate();
                employmentPage.actions.selectOccupationIndustry('Agriculture');
                employmentPage.actions.selectOccupationLevel('Director');
                employmentPage.actions.selectStatus('Full time');
                employmentPage.actions.selectLevelOfEducation('Bachelor');
                employmentPage.actions.selectSpecialization('B compt');
                employmentPage.actions.saveEmployment();
                otpPage.submitOtp('12345');
                expect(employmentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/employment');
            });
        });

        describe('when adding new marketing consent information', function () {

            it('should successfully add all(default) consent information', function () {
                customerInformationPage.actions.goToConsentPage();

                consentPage.helpers.wait(consentPage.saveButton);
                consentPage.actions.saveConsent();
                otpPage.submitOtp('12345');
                expect(consentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/submit');

            });

            it('should successfully add some consent information', function () {
                customerInformationPage.actions.goToConsentPage();

                consentPage.helpers.wait(consentPage.saveButton);
                consentPage.actions.selectReceiveMarketing();
                consentPage.actions.saveConsent();
                otpPage.submitOtp('12345');
                expect(consentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/submit');
            });

            it('should successfully add no consent information', function () {
                customerInformationPage.actions.goToConsentPage();

                consentPage.helpers.wait(consentPage.saveButton);
                consentPage.actions.uncheckAllConsent();
                consentPage.actions.saveConsent();
                otpPage.submitOtp('12345');
                expect(consentPage.baseActions.getCurrentUrl()).toContain('apply/current-account/submit');
            });
        });
    });
});
