describe('ACCEPTANCE - Security Settings', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var securitySettingsPage = require('../../pages/securitySettingsPage.js');

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

    describe('security settings', function () {

        beforeEach(function () {
            securitySettingsPage.clickOnSecuritySettings();
        });

        it('it should display Internet Banking Sub Menus', function () {
            securitySettingsPage.clickOnInternetBanking();
            expect(securitySettingsPage.getSubHeader()).toBe('Internet banking');
            expect(securitySettingsPage.getOTPPreferences()).toBe('Email (s*me@e***l.co.za)');
        });


    });

});

