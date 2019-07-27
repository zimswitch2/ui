var overviewFeature = false;
if (feature.overviewPage) {
    overviewFeature = true;
}

describe('SMOKE - Login', function () {
    'use strict';

    var loginPage = require('../pages/loginPage.js');
    var anyPage = require('../pages/anyPage.js');
    var landingPage = require('../pages/landingPage.js');
    var accountSummaryPage = require('../pages/accountSummaryPage.js');

    it('page should be available', function () {
        loginPage.load();
        var url = loginPage.baseActions.getCurrentUrl();
        expect(url).toContain('/login');
    });

    describe('when page is loaded, the user', function(){
        it('should be able to login', function(){
            var credentials = browser.params.credentials;
            loginPage.enterUserCredentials(credentials.username, credentials.password);
            var homeUrl = overviewFeature ? '/overview' : '/account-summary';
            expect(loginPage.baseActions.getCurrentUrl()).toContain(homeUrl);
        });

        it('should have at least one current account', function(){
            landingPage.baseActions.clickOnTab('Account Summary');
            var accounts = accountSummaryPage.getAccountInfo('transaction');
            expect(accounts).toContain("Current Account");
        });
    });
});
