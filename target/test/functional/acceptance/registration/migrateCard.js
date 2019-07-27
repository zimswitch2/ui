var overviewFeature = false;


var newRegisteredPageFeature = false;
{
    newRegisteredPageFeature = true;
}

describe('ACCEPTANCE - Migration Functionality', function () {
    'use strict';

    var registerPage = require('../../pages/registerPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var linkCardPage = require('../../pages/linkCardPage.js');
    var migrateCardPage = require('../../pages/migrateCardPage.js');
    var newRegisteredPage = require('../../pages/newRegisteredPage.js');


    var correctOtp = browser.params.oneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;
    var loginPage = require('../../pages/loginPage.js');
    var userMigrationDetails = browser.params.migrationInformation.userDetails;
    var incorrectUserMigrationDetails = browser.params.migrationInformation.wrongUserDetails;
    var incorrectCSPUserMigrationDetails = browser.params.migrationInformation.incorrectCSPUserDetails;
    var serviceTemporarilyUnavailableMigrationDetails = browser.params.migrationInformation.serviceTemporarilyUnavailableDetails;
    var inactivateOTPMigrateUser = browser.params.migrationInformation.inactivateOTPMigrateUserDetails;


    beforeEach(function () {
        loginPage.load();
        loginPage.clickRegister();
        registerPage.completeForm(userDetails);
        expect(registerPage.baseActions.getCurrentUrl()).toContain('otp/verify');
        otpPage.submitOtp(correctOtp);
    });

    describe('Migration Page', function () {
        beforeEach(function () {
            if (newRegisteredPageFeature) {
                newRegisteredPage.copyYourProfile.click();
            } else {
                newRegisteredPage.actions.clickYes();
                newRegisteredPage.startBanking.click();
            }
        });

        if (newRegisteredPageFeature) {
            it('should go back to new registered page when click on back button', function () {
                migrateCardPage.back();
                expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/new-registered');
                newRegisteredPage.copyYourProfile.click();
                expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            });
        }

        it('should not enable the migrate button when the form is filled with incorrect data', function () {
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            migrateCardPage.enterCardDetails(incorrectUserMigrationDetails);
            expect(migrateCardPage.proceedButtonDisabled()).toBeTruthy();
        });

        it('should only be enabled when the card number is valid', function () {
            migrateCardPage.enterCardDetails(userMigrationDetails);
            expect(migrateCardPage.proceedButtonDisabled()).toBeFalsy();

            migrateCardPage.enterCardNumberWithSpecificCardLength(5);
            expect(migrateCardPage.proceedButtonDisabled()).toBeTruthy();

            migrateCardPage.enterCardNumberWithSpecificCardLength(userMigrationDetails, 9);
            expect(migrateCardPage.proceedButtonDisabled()).toBeTruthy();

            migrateCardPage.enterCardNumberWithSpecificCardLength(userMigrationDetails, 16);
            expect(migrateCardPage.proceedButtonDisabled()).toBeTruthy();

            migrateCardPage.enterCardNumberWithSpecificCardLength(userMigrationDetails, 18);
            expect(migrateCardPage.proceedButtonDisabled()).toBeTruthy();
        });

        it('should go to the account summary page when correct details are entered', function () {
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            migrateCardPage.enterCardDetails(userMigrationDetails);
            migrateCardPage.continue();
            var homeUrl = overviewFeature ? '/overview' : '/account-summary';
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain(homeUrl);
        });

        it('should stay on the migrate screen when there was a service error', function () {
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            migrateCardPage.migrate(incorrectCSPUserMigrationDetails);
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            expect(migrateCardPage.baseActions.getErrorMessage()).toEqual('Incorrect password or CSP');
        });

        it('should show the user that internet banking is temporarily unavailable when there is a 6001 service error', function () {
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            migrateCardPage.migrate(serviceTemporarilyUnavailableMigrationDetails);
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            expect(migrateCardPage.baseActions.getErrorMessage()).toEqual('This service is not available at the moment. Please try again in a few minutes');
        });

        it('should not migrate a user with an OTP needed for activation', function () {
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            migrateCardPage.migrate(inactivateOTPMigrateUser);
            expect(migrateCardPage.baseActions.getCurrentUrl()).toContain('/migrate');
            expect(migrateCardPage.baseActions.getErrorMessage()).toEqual('There is a problem with your profile. Please call Customer Care on 0860 123 000 or visit your nearest branch');
        });
    });

});