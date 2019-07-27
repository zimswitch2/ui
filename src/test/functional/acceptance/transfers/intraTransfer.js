describe('ACCEPTANCE - Transfer between accounts', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var transferPage = require('../../pages/transferPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var confirmPage = require('../../pages/transferConfirmPage.js');
    var __credentialsOfLoggedInUser__;
    var moment = require('moment');

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        transferPage.navigateTo();
    }

    describe('transfers page', function () {
        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        function ensureAccountValidationsArePresent() {
            transferPage.transferFrom('ACCESSACC - 10-00-035-814-0');
            transferPage.transferTo('ACCESSACC - 10-00-035-814-0');
            expect(transactionPage.getWarningMessage()).toEqual('Cannot transfer to the same account.');

            transferPage.transferFrom('MONEYMARKET - 26-845-062-5-3');
            transferPage.transferTo('MONEYMARKET - 26-845-062-5-4');
            expect(transferPage.getFromAvailableBalance()).toEqual('R 27 100.00');
            expect(transferPage.getToAvailableBalance()).toEqual('R 20 000.00');

            transferPage.transferFrom('HOME LOAN - 5592-0070-1204-1579');
            transferPage.transferTo('NOTICE - 5592-0070-1204-1560');
            expect(transferPage.getAmountErrorMessageElement().isPresent()).toBeFalsy();
            expect(transferPage.getAmountInfoMessageElement().getText()).toEqual('Enter amount in denominations of R 1000');
            expect(transferPage.next().getAttribute('disabled')).toEqual('true');

            transferPage.amount(200);
            expect(transferPage.getAmountErrorMessageElement().getText()).toEqual('Please enter a valid amount as per guidelines below');
            expect(transferPage.getAmountInfoMessageElement().getText()).toEqual('Enter amount in denominations of R 1000');

            transferPage.transferFrom('REVOLVING CREDIT PLAN - 5592-0070-1204-1590');
            expect(transferPage.getAmountErrorMessageElement().getText()).toEqual('Please enter a valid amount as per guidelines below');
            expect(transferPage.getAmountInfoMessageElement().getText()).toEqual('Enter an amount of at least R 300, in denominations of R 100');

            transferPage.transferTo('HOME LOAN - 5592-0070-1204-1579');
            expect(transferPage.getAmountErrorMessageElement().isPresent()).toBeFalsy();
            expect(transferPage.getAmountInfoMessageElement().getText()).toEqual('Enter amount in denominations of R 100');

            transferPage.amount(201);
            expect(transferPage.getAmountErrorMessageElement().getText()).toEqual('Please enter a valid amount as per guidelines below');
            expect(transferPage.getAmountInfoMessageElement().getText()).toEqual('Enter amount in denominations of R 100');

            transferPage.transferFrom('ACCESSACC - 10-00-035-814-0');
            expect(transferPage.getAmountErrorMessageElement().isPresent()).toBeFalsy();
            expect(transferPage.getAmountInfoMessageElement().isPresent()).toBeFalsy();
        }

        function ensureHittingCancelRedirectsUserToDashboard() {
            transferPage.cancel();
            expect(transactionPage.baseActions.getCurrentUrl()).toContain('/transaction/dashboard');
        }

        it('should validate all fields and page info', function () {
            expect(transferPage.baseActions.getCurrentUrl()).toContain('/transfers');
            expect(transferPage.getTransferDate()).toBeDefined();
            expect(anyPage.currentStep()).toEqual({position: "1/2", label: 'Capture details', complete: false});
            expect(transferPage.getInfoMessageText()).toEqual('Transfers from a Standard Bank account to a Credit Card account take up to 1 business day');
            expect(transferPage.getTransferFromList().count()).toEqual(12);
            expect(transferPage.getTransferToList().count()).toEqual(12);

            transferPage.transferFrom('ACCESSACC - 10-00-035-814-0');
            expect(transferPage.getFromAvailableBalance()).toEqual('R 8 756.41');

            transferPage.transferTo('SAVINGS - 42-14-42-14');
            expect(transferPage.getToAvailableBalance()).toEqual('R 100 000.00');

            ensureAccountValidationsArePresent();
            ensureHittingCancelRedirectsUserToDashboard();
        });

        it('should confirm transaction details on confirmation page with and without statement reference', function () {
            var currentDate = moment().format("D MMMM YYYY");
            var transfer = {
                from: 'ACCESSACC - 10-00-035-814-0',
                to: 'REVOLVING CREDIT PLAN - 5592-0070-1204-1590',
                reference: 'For the cat',
                amount: '1000.00'
            };

            transferPage.data(transfer);
            transferPage.proceed();

            expect(anyPage.currentStep()).toEqual({position: "2/2", label: 'Confirm details', complete: false});
            expect(confirmPage.getDetails()).toContain('From account\nACCESSACC - 10-00-035-814-0');
            expect(confirmPage.getDetails()).toContain('Available balance\nR 8 756.41');
            expect(confirmPage.getDetails()).toContain('To account\nREVOLVING CREDIT PLAN - 5592-0070-1204-1590');
            expect(confirmPage.getDetails()).toContain('Available balance\nR 2 300 000.00');
            expect(confirmPage.getDetails()).toContain('Statement reference\nFor the cat');
            expect(confirmPage.getDetails()).toContain('Transfer date\n' + currentDate);
            expect(confirmPage.getDetails()).toContain('Amount\nR 1 000.00');

            confirmPage.modify();
            expect(anyPage.currentStep()).toEqual({position: "1/2", label: 'Capture details', complete: false});

            transfer.reference = ' ';
            transferPage.data(transfer);
            transferPage.proceed();

            expect(anyPage.currentStep()).toEqual({position: "2/2", label: 'Confirm details', complete: false});
            expect(confirmPage.getDetails()).toContain('From account\nACCESSACC - 10-00-035-814-0');
            expect(confirmPage.getDetails()).toContain('Available balance\nR 8 756.41');
            expect(confirmPage.getDetails()).toContain('To account\nREVOLVING CREDIT PLAN - 5592-0070-1204-1590');
            expect(confirmPage.getDetails()).toContain('Available balance\nR 2 300 000.00');
            expect(confirmPage.getDetails()).not.toContain('Statement reference');
            expect(confirmPage.getDetails()).toContain('Transfer date\n' + currentDate);
            expect(confirmPage.getDetails()).toContain('Amount\nR 1 000.00');

            confirmPage.proceed();
            expect(confirmPage.baseActions.getVisibleSuccessMessage()).toContain("Transfer was successful");
            expect(confirmPage.getSteps().isDisplayed()).toBeFalsy();
            expect(confirmPage.visibleButtons().count()).toEqual(1);
            expect(confirmPage.visibleButtons().first().getText()).toContain('Back to transact');
        });

        it('should display an error message when transfer amount is less than minimum amount', function () {
            var transfer = {
                from: 'ACCESSACC - 10-00-035-814-0',
                to: 'CREDIT CARD - 5592-0070-1204-1578',
                amount: '1050'
            };

            transferPage.data(transfer);
            transferPage.proceed();
            expect(confirmPage.getDetails()).toContain('Amount\nR 1 050.00');
            confirmPage.proceed();
            expect(confirmPage.baseActions.getErrorMessage()).toContain('You cannot transfer that much.');

        });
    });

    describe('transfers using account with custom name', function () {

        it('should make a succeesful transfer', function () {
            navigateUsing(browser.params.customAccountName);
            transferPage.transferFrom('My Currentest Account - 10-00-035-814-0');
            transferPage.transferTo('MONEYMARKET - 26-845-062-5-4');
            transferPage.amount(201);
            transferPage.proceed();
            expect(confirmPage.getDetails()).toContain('From account\nMy Currentest Account - 10-00-035-814-0');
        });
    });
});
