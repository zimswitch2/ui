var overviewPageFeature = false;

if (feature.overviewPage) {
    overviewPageFeature = true;
}

describe('ACCEPTANCE - Login Functionality', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');

    beforeEach(function () {
        loginPage.load();
    });

    it('should display login page and login with valid credentials', function () {
        expect(loginPage.baseActions.getCurrentUrl()).toContain("/login");
        expect(loginPage.getTitle()).toContain("Standard Bank Online Banking");

        loginPage.enterUserCredentials(browser.params.credentials.username, browser.params.credentials.password);

        if (overviewPageFeature) {
            expect(loginPage.baseActions.getCurrentUrl()).toContain("/overview");
        } else {
            expect(loginPage.baseActions.getCurrentUrl()).toContain("/account-summary");
        }
        expect(landingPage.getWelcomeMessage.getText()).toContain('Welcome, Internet Banking User');
    });

    it('should try to login with invalid credentials', function () {
        loginPage.enterUserCredentials(browser.params.badCredentials.username, browser.params.badCredentials.password);
        expect(loginPage.baseActions.getErrorMessage()).toEqual("Please check the sign-in details entered and try again");
    });

    it('should redirect user to choose dashboard page when card has been hotcarded', function () {
        loginPage.enterUserCredentials(browser.params.hotCarded.username, browser.params.hotCarded.password);
        expect(loginPage.baseActions.getCurrentUrl()).toContain('/choose-dashboard');
    });

    it('should try to login with no credentials at all', function () {
        loginPage.enterUserCredentials("", "");
        expect(loginPage.canLogin()).toEqual(false);
    });
});
