describe('ACCEPTANCE - My dashboards', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var myDashboardPage = require('../../pages/myDashboardPage.js');

    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToProfileAndSettings();
    }

    beforeEach(function () {
        navigateUsing(browser.params.credentials);
    });

    describe('add new dashboard', function () {

        it('should navigate to "Add Dashboard" page by clicking "Add Dashboard" button', function () {
            expect(myDashboardPage.addDashboardButton().isDisplayed()).toBeTruthy();
            myDashboardPage.helpers.scrollThenClick(myDashboardPage.addDashboardButton());
            expect(myDashboardPage.baseActions.getCurrentUrl()).toContain('addDashboard');
        });
    });

    describe('view dashboard', function () {

        it('should navigate to the activate otp on clicking the activate otp link', function () {
            myDashboardPage.helpers.scrollThenClick(myDashboardPage.activateOtpLink());
            expect(myDashboardPage.baseActions.getCurrentUrl()).toContain('/otp/activate/43659');
        });
    });

});
