var overviewPageFeature = false;


describe('Trusteer User ID Collection', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var accountSummary = require('../../pages/accountSummaryPage.js');

    it('can obtain the user ID by calling the User ID collection function', function () {
        loginPage.loginWith(browser.params.credentials);
        if (overviewPageFeature) {
            expect(landingPage.hasTransactionalPanel()).toBeTruthy();
        } else {
            expect(accountSummary.viewFirstTransactionAccountStatement());
        }
        expect(browser.executeScript('return window.xvbGGNadCs().p;')).toBe('ibrefresh@standardbank.co.za');
        landingPage.signout();
        browser.sleep(500);
        expect(browser.executeScript('return window.xvbGGNadCs().p;')).toBeNull();
    });
});
