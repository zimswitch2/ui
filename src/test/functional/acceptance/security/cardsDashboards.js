describe('ACCEPTANCE - Profile and Settings Functionality', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var viewCardProfile = require('../../pages/viewUserProfilePage.js');

    beforeEach(function () {
        loginPage.load();
    });

    it('should redirect to the profile and settings page when the user profile and settings', function () {
        loginPage.enterUserCredentials(browser.params.credentials.username, browser.params.credentials.password);
        landingPage.goToProfileAndSettings();
        expect(loginPage.baseActions.getCurrentUrl()).toContain("/dashboards");
        expect(viewCardProfile.currentDashboardName()).toEqual('Glynn');
        expect(viewCardProfile.currentDashboardCardNumber()).toEqual('4451221116405778');
        expect(viewCardProfile.currentDashboardStatus()).toEqual('Active');
    });
});
