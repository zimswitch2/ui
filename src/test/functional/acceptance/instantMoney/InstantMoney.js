//var instantMoneyFeature = false;
//
//if (feature.instantMoney) {
//    instantMoneyFeature = true;
//}
//
//if(instantMoneyFeature){
//    describe('ACCEPTANCE - Create Instant Money', function () {
//        'use strict';
//
//        var loginPage = require('../../pages/loginPage.js');
//        var transactionPage = require('../../pages/transactionPage.js');
//        var landingPage = require('../../pages/landingPage.js');
//        var createInstantMoneyPage = require('../../pages/instantMoneyPage.js');
//        var confirmInstantMoneyPage = require('../../pages/confirmInstantMoneyPage.js');
//        var successInstantMoneyPage = require('../../pages/successInstantMoneyPage.js');
//        var otpPage = require('../../pages/otpPage.js');
//        var __credentialsOfLoggedInUser__;
//
//        beforeEach(function () {
//            var credentials = browser.params.credentials;
//            if (__credentialsOfLoggedInUser__ !== credentials) {
//                loginPage.loginWith(credentials);
//                landingPage.baseActions.closeNotificationMessages();
//                __credentialsOfLoggedInUser__ = credentials;
//                landingPage.baseActions.clickOnTab('Transact');
//            }
//        });
//
//        describe('on transact', function () {
//            it('should click on create instant money', function () {
//                expect(transactionPage.getCreateInstantMoney().isDisplayed()).toBeTruthy();
//                transactionPage.clickOnCreateInstantMoney();
//                element(by.css('a[href="#/instant-money/details"]')).click();
//                expect(createInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/instant-money/details');
//            });
//        });
//
//        it('should complete the required information', function () {
//            expect(createInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/instant-money/details');
//            expect(createInstantMoneyPage.availableDailyLimit()).toBe('R 8 756.41');
//            expect(createInstantMoneyPage.fromAccount()).toBe('ACCESSACC - 10-00-035-814-0');
//
//            createInstantMoneyPage.contactNumber('0111111111');
//            createInstantMoneyPage.cashCollectionPin('2468');
//            createInstantMoneyPage.confirmCashCollectionPin('2468');
//            createInstantMoneyPage.amount(60);
//            createInstantMoneyPage.agreeToTermsAndConditions();
//            createInstantMoneyPage.proceed();
//            expect(confirmInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/instant-money/confirm');
//        });
//
//        it('should show confirmation page with correct details', function (){
//            expect(confirmInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/instant-money/confirm');
//            expect(confirmInstantMoneyPage.fromAccount()).toBe('ACCESSACC - 10-00-035-814-0');
//            expect(confirmInstantMoneyPage.availableBalance()).toBe('R 8 756.41');
//            expect(confirmInstantMoneyPage.cellPhoneNumber()).toBe('0111111111');
//            expect(confirmInstantMoneyPage.amount()).toBe('60');
//
//            confirmInstantMoneyPage.confirm();
//
//            expect(confirmInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/otp/verify');
//        });
//
//        it('should show the otp page', function () {
//            expect(confirmInstantMoneyPage.baseActions.getCurrentUrl()).toMatch('/otp/verify');
//            otpPage.submitOtp('12345');
//            expect(otpPage.baseActions.getCurrentUrl()).toMatch('/instant-money/success');
//        });
//
//        it('should show the success page with the correct details', function () {
//            expect(otpPage.baseActions.getCurrentUrl()).toMatch('/instant-money/success');
//            expect(successInstantMoneyPage.valueForField('From Account')).toBe('ACCESSACC - 10-00-035-814-0');
//            expect(successInstantMoneyPage.valueForField('Available Balance')).toBe('R 8 756.41');
//            expect(successInstantMoneyPage.valueForField('Cell phone number')).toBe('0111111111');
//            expect(successInstantMoneyPage.valueForField('Amount')).toBe('60');
//            expect(successInstantMoneyPage.valueForField('Reference number')).toBe('Reference');
//            expect(successInstantMoneyPage.valueForField('Voucher number')).toBe('1234567890');
//        });
//    });
//}
