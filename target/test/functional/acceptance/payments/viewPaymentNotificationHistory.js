var viewTransactionsFeature = false;
{
    viewTransactionsFeature = true;
}

var menigaTransactionsHistoryFeature = false;


if (!viewTransactionsFeature) {
    if (!menigaTransactionsHistoryFeature) {
        describe('ACCEPTANCE - View Payment Confirmation History', function () {
            'use strict';
            var anyPage = require('../../pages/anyPage.js');
            var loginPage = require('../../pages/loginPage.js');
            var statementPage = require('../../pages/statementPage.js');
            var viewPaymentNotificationPage = require('../../pages/viewPaymentNotificationPage.js');
            var landingPage = require('../../pages/landingPage.js');
            var accountSummaryPage = require('../../pages/accountSummaryPage.js');

            var __credentialsOfLoggedInUser__;

            beforeEach(function () {
                var credentials = browser.params.credentials;
                if (__credentialsOfLoggedInUser__ !== credentials) {
                    loginPage.loginWith(credentials);
                    __credentialsOfLoggedInUser__ = credentials;
                }
                landingPage.baseActions.clickOnTab('Account Summary');
                accountSummaryPage.viewFirstTransactionAccountStatement();
                statementPage.viewPaymentNotificationHistory();
            });

            it('should ensure payment confirmation page is loaded', function () {
                expect(anyPage.getTitle()).toEqual('Payment Notification History');
            });

            it('should ensure correct number of payments are displayed', function () {
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(2);
            });

            it('should ensure correct data is displayed for each payment', function () {
                viewPaymentNotificationPage.getPayments().then(function (payments) {
                    expect(payments[0]).toEqual({
                        paymentDate: '25 June 2014',
                        beneficiaryName: '911 TRUCK RENTALS',
                        beneficiaryReference: 'TEST',
                        recipientName: 'Wen',
                        sentTo: 'Www@qwy.co.za',
                        amount: 'R 12.00'
                    });
                });
            });

            it('should ensure the filtering works as expected', function () {
                anyPage.setFilterQuery('TES');
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(1);

                anyPage.setFilterQuery('911');
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(1);

                anyPage.setFilterQuery('Non-existent payment');
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(0);
                expect(viewPaymentNotificationPage.getWarningMessage()).toEqual("No matches found.");
            });

            it('should ensure can select a different account', function () {
                viewPaymentNotificationPage.selectAccount('HOME LOAN - 5592-0070-1204-1579');
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(3);
            });

            it('should ensure appropriate message is shown when an account has no notification history', function () {
                viewPaymentNotificationPage.selectAccount('CREDIT CARD - 5592-0070-1204-1578');
                expect(viewPaymentNotificationPage.getNumberOfPayments()).toEqual(0);
                expect(viewPaymentNotificationPage.getWarningMessage()).toEqual('There is no payment confirmation history for this account.');
            });

            describe('on resend notification', function () {
                beforeEach(function () {
                    viewPaymentNotificationPage.clickOnResendButton();
                });
                it('should confirm and resend payment notification', function () {
                    expect(viewPaymentNotificationPage.resendConfirmButton()).toBeTruthy();
                    expect(viewPaymentNotificationPage.getResendMessage()).toContain('Resend payment notification? Note that you will be charged a fee of R 0.70 for this Email');
                    viewPaymentNotificationPage.resendConfirmButton().click();
                    expect(viewPaymentNotificationPage.baseActions.getVisibleSuccessMessage()).toContain('Notification resent to Wen');
                });

                it('should cancel payment notification and return to payment list', function () {
                    expect(viewPaymentNotificationPage.resendCancelButton()).toBeTruthy();
                    viewPaymentNotificationPage.resendCancelButton().click();
                    viewPaymentNotificationPage.getPayments().then(function (payments) {
                        expect(payments[0]).toEqual({
                            paymentDate: '25 June 2014',
                            beneficiaryName: '911 TRUCK RENTALS',
                            beneficiaryReference: 'TEST',
                            recipientName: 'Wen',
                            sentTo: 'Www@qwy.co.za',
                            amount: 'R 12.00'
                        });
                    });
                });
            });

        });
    }
}