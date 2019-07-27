describe('ACCEPTANCE - Dashboard', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var switchDashboardPage = require('../../pages/switchDashboardPage.js');
    var addDashboardPage = require('../../pages/addDashboardPage.js');
    var linkCardPage = require('../../pages/linkCardPage.js');
    var myDashboardPage = require('../../pages/myDashboardPage.js');
    var otpPage = require('../../pages/otpPage.js');

    var validCardDetails = browser.params.cardInformation.validDetails;
    var invalidCardDetails = browser.params.cardInformation.invalidDetails;
    var credentials = browser.params.credentials;
    var hotCardedCredentials = browser.params.hotCarded;

    describe('Adding a dashboard', function () {
        beforeEach(function () {
            loginPage.load();
            loginPage.loginWith(credentials);

            landingPage.baseActions.navigateToProfileAndSettings();

            browser.wait(function () {
                return myDashboardPage.addDashboardButton().isDisplayed();
            }, 10000);

            myDashboardPage.addDashboardButton().click();
        });
        describe('using invalid card details', function () {
            it('should display error message', function () {
                linkCardPage.enterCardDetails(invalidCardDetails);
                addDashboardPage.helpers.scrollThenClick(addDashboardPage.nextButton());
                expect(landingPage.baseActions.getCurrentUrl()).not.toContain('/otp');
                expect(addDashboardPage.getErrorMessage().isDisplayed()).toBeTruthy();
            });
        });

        describe('using valid card', function () {
            it('should navigate to "enter dashboard name" after successful dashboard creation', function () {
                expect(addDashboardPage.getFlowCurrentStep()).toBe('Enter details');
                linkCardPage.enterCardDetails(validCardDetails);
                addDashboardPage.helpers.scrollThenClick(addDashboardPage.nextButton());

                expect(addDashboardPage.getFlowCurrentStep()).toBe('Enter OTP');
                otpPage.submitOtp('12345');
                expect(addDashboardPage.getDashboardName()).toBe('My Personal Dashboard');
                expect(addDashboardPage.baseActions.getCurrentUrl()).toContain('/addDashboard/save');

                expect(addDashboardPage.getFlowCurrentStep()).toBe('Dashboard name');

                addDashboardPage.enterDashboardName('');
                expect(addDashboardPage.saveDashboardButton().getAttribute('disabled')).toBeTruthy();

                addDashboardPage.enterDashboardName('new dashboard name');
                expect(addDashboardPage.saveDashboardButton().getAttribute('disabled')).toBeFalsy();

                addDashboardPage.helpers.scrollThenClick(addDashboardPage.saveDashboardButton());
                expect(landingPage.baseActions.getCurrentUrl()).toContain('/dashboards');
                expect(addDashboardPage.getDashboards().getText()).toContain('new dashboard name');
            });
        });
    });

    describe('Adding a dashboard using hotCarded user', function () {
        beforeEach(function () {
            loginPage.load();
            loginPage.loginWith(hotCardedCredentials);

            switchDashboardPage.helpers.scrollThenClick(switchDashboardPage.getLinkButton());
        });

        it('should navigate back to choose-dashboard when cancel button is clicked', function () {
            addDashboardPage.clickOnCancelButton();
        });

        it('should successfully add a new dashboard and redirected to account-summary', function () {
            linkCardPage.enterCardDetails(validCardDetails);
            addDashboardPage.helpers.scrollThenClick(addDashboardPage.nextButton());
            otpPage.submitOtp('12345');
            expect(addDashboardPage.getDashboardName()).toBe('My Personal Dashboard');
            expect(addDashboardPage.baseActions.getCurrentUrl()).toContain('/addDashboard/save');
            addDashboardPage.enterDashboardName('new dashboard name');
            expect(addDashboardPage.saveDashboardButton().getAttribute('disabled')).toBeFalsy();

            addDashboardPage.helpers.scrollThenClick(addDashboardPage.saveDashboardButton());
            expect(landingPage.baseActions.getCurrentUrl()).toContain('/account-summary');
        });
    });
});

