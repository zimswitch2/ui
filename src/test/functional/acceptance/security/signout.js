describe('ACCEPTANCE - Sign Out Functionality', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');

    beforeEach(function () {
        loginPage.load();
        loginPage.enterUserCredentials(browser.params.credentials.username, browser.params.credentials.password);
        landingPage.signout();
        loginPage.baseActions.waitForSignOut();
    });

    it('should redirect to the login page when the user signs out', function () {
        expect(loginPage.baseActions.getCurrentUrl()).toContain("/login");
    });

});
