var overviewPageFeature = false;



describe('ACCEPTANCE - Switch Dashboard Functionality', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var switchDashboardPage = require('../../pages/switchDashboardPage.js');
    var viewCardProfile = require('../../pages/viewUserProfilePage.js');

    beforeEach(function () {
        loginPage.load();
    });

    it('should redirect to the profile and settings page when the user profile and settings', function () {
        loginPage.enterUserCredentials(browser.params.credentials.username, browser.params.credentials.password);
        landingPage.dashboardsLink.click();

        expect(loginPage.baseActions.getCurrentUrl()).toContain("/choose-dashboard");
        expect(switchDashboardPage.getLinkButton().isPresent()).toBeFalsy();
        switchDashboardPage.getDashboardByName('My Personal Dashboard').click();
        if (overviewPageFeature) {
            expect(loginPage.baseActions.getCurrentUrl()).toContain("/overview");
        } else {
            expect(loginPage.baseActions.getCurrentUrl()).toContain("account-summary");
        }
        expect(landingPage.dashboardsLink.getText()).toEqual('My Personal Dashboard');
        landingPage.goToProfileAndSettings();
        expect(viewCardProfile.currentDashboardName()).toEqual('My Personal Dashboard');
        expect(viewCardProfile.currentDashboardCardNumber()).toEqual('1111222233334444');
        expect(viewCardProfile.currentDashboardStatus()).toEqual('Active');
    });

    it('should login and navigate to choose-dashboard with hotcarded user and redirect to addDashboard', function () {
        loginPage.enterUserCredentials(browser.params.hotCarded.username, browser.params.hotCarded.password);

        expect(loginPage.baseActions.getCurrentUrl()).toContain("/choose-dashboard");
        expect(switchDashboardPage.getLinkButton().isPresent()).toBeTruthy();

        switchDashboardPage.helpers.scrollThenClick(switchDashboardPage.getLinkButton());
        expect(loginPage.baseActions.getCurrentUrl()).toContain("/addDashboard");
    });
});
