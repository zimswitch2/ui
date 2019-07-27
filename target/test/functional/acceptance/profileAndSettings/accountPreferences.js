var editFormalStatementPreferencesFeature = false;
{
    editFormalStatementPreferencesFeature = true;
}

{
    describe('ACCEPTANCE - Account Preference', function () {
        'use strict';

        var loginPage = require('../../pages/loginPage.js');
        var landingPage = require('../../pages/landingPage.js');
        var accountPreferencePage = require('../../pages/accountPreferencePage.js');
        var otpPage = require('../../pages/otpPage.js');

        var correctOtp = browser.params.oneTimePassword;
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


        describe('view formal statement', function () {
            beforeEach(function () {
                accountPreferencePage.clickOnAccountPreferences();
            });

            it('should display the current formal statement delivery options', function () {
                accountPreferencePage.clickOnEmailAccount();
                expect(accountPreferencePage.getAccountDetails()).toBe('ACCESSACC - 10-00-035-814-0');
                expect(accountPreferencePage.getSubHeader()).toBe('Formal statement delivery');
                expect(accountPreferencePage.getCurrentDeliveryDescriptionText()).toBe('Formal statements are being delivered to your');
                expect(accountPreferencePage.getCurrentDeliveryText()).toBe('Email address (s*me@e***l.co.za)');
            });

            it('should display postal address if user does not have email as their preference', function () {
                accountPreferencePage.clickOnPostAccount();
                expect(accountPreferencePage.getCurrentDeliveryText()).toEqual('Postal Address');
            });

            it('should display no preference to display notification when there\'s no preference', function () {
                accountPreferencePage.clickOnNoPreferenceAccount();
                expect(accountPreferencePage.getNoPreferenceMessage()).toBe('No account preferences to display for this account');
                expect(accountPreferencePage.getAccountDetails()).toBe('CREDIT CARD - 5592-0070-1204-1578');
            });

            it('should track click', function () {
                expect(accountPreferencePage.trackEveryClickOnAccount()).toBeTruthy();
            });

            it('should not display success message initially', function () {
                accountPreferencePage.clickOnEmailAccount();
                expect(accountPreferencePage.getSuccessMessage().isDisplayed()).toBeFalsy();
            });
        });

        if (editFormalStatementPreferencesFeature) {

            describe('edit email formal statement', function () {
                beforeEach(function () {
                    accountPreferencePage.clickOnAccountPreferences();
                    accountPreferencePage.clickOnEmailAccount();
                    accountPreferencePage.clickOnEditButton();
                });

                describe('success', function () {

                    it('should save an email delivery option', function () {
                        expect(accountPreferencePage.baseActions.getCurrentUrl()).toContain('/edit-account-preferences/');
                        expect(accountPreferencePage.selectedRadioButton('deliveryMethod')).toBe('email');
                        expect(accountPreferencePage.baseActions.textForInput(element(by.id('deliveryAddress')))).toBe('s*me@e***l.co.za');
                        expect(accountPreferencePage.saveButton.getAttribute('disabled')).toBeTruthy();
                        expect(accountPreferencePage.baseActions.getTextNotification()).toMatch(
                            'Please visit your nearest branch if you want your statements delivered by post, or to update your postal address');
                        expect(accountPreferencePage.getPostal().isPresent()).toBeFalsy();

                        expect(accountPreferencePage.getCurrentDeliveryDescriptionText()).toBe('Formal statements are being delivered to your');
                        expect(accountPreferencePage.getCurrentDeliveryText()).toBe('Email address (s*me@e***l.co.za)');

                        expect(accountPreferencePage.getDeliveryMethodSection().isDisplayed()).toBeFalsy();

                        accountPreferencePage.baseActions.textForInput(element(by.id('deliveryAddress')), 'changed@email.com');
                        expect(accountPreferencePage.saveButton.getAttribute('disabled')).toBeFalsy();
                        accountPreferencePage.saveButton.click();
                        otpPage.submitOtp(correctOtp);
                        expect(accountPreferencePage.baseActions.getCurrentUrl()).toContain('/account-preferences/');
                        expect(accountPreferencePage.getSuccessMessage().isDisplayed()).toBeTruthy();
                        expect(accountPreferencePage.getSuccessMessage().getText()).toBe('Preference successfully updated');
                        expect(accountPreferencePage.getErrorMessage().isDisplayed()).toBeFalsy();
                    });

                });

                describe('failure', function () {

                    it('should try save an email address and fail', function () {
                        accountPreferencePage.baseActions.textForInput(element(by.id('deliveryAddress')), 'whenErrorUpdatingEmail@error.com');
                        accountPreferencePage.saveButton.click();
                        expect(accountPreferencePage.baseActions.getCurrentUrl()).toContain('/account-preferences/');
                        expect(accountPreferencePage.getSuccessMessage().isDisplayed()).toBeFalsy();
                        expect(accountPreferencePage.getErrorMessage().isDisplayed()).toBeTruthy();
                        expect(accountPreferencePage.getErrorMessage().getText()).toBe('An error has occurred');
                    });

                });

                it('should go back to view when cancel is clicked', function () {
                    expect(accountPreferencePage.baseActions.getCurrentUrl()).toContain('/edit-account-preferences/');
                    accountPreferencePage.cancelButton.click();
                    expect(accountPreferencePage.baseActions.getCurrentUrl()).toContain('/account-preferences/');
                });
            });

            describe('edit postal formal statement', function () {

                beforeEach(function () {
                    accountPreferencePage.clickOnAccountPreferences();
                    accountPreferencePage.clickOnPostAccount();
                    accountPreferencePage.clickOnEditButton();
                });

                it('should not show email address section', function () {
                    accountPreferencePage.clickOnEmailRadioButton();
                    expect(accountPreferencePage.getDeliveryMethodSection().isDisplayed()).toBeTruthy();
                    expect(accountPreferencePage.getCurrentDeliveryDescription().isDisplayed()).toBeFalsy();
                    expect(accountPreferencePage.getCurrentDelivery().isDisplayed()).toBeFalsy();
                });
            });
        }
    });
}
