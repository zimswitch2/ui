describe('Savings Account Application Factory', function () {
    'use strict';

    var savingsAccountApplication;
    beforeEach(module('refresh.accountOrigination.savings.domain.savingsAccountApplication'));

    beforeEach(inject(function(SavingsAccountApplication) {
        savingsAccountApplication = SavingsAccountApplication;
    }));

    describe('initial state', function () {
        it('customer and decline and isNew do nothing', function () {
            savingsAccountApplication.decline();
            savingsAccountApplication.isNew();
        });

        it('should have an undefined offer ID by default', function() {
            expect(savingsAccountApplication.offerId()).not.toBeDefined();
        });

        it('should have an undefined case ID by default', function() {
            expect(savingsAccountApplication.caseId()).not.toBeDefined();
        });

        it('should have an undefined account number by default', function() {
            expect(savingsAccountApplication.accountNumber()).not.toBeDefined();
        });

        it('should have an undefined originationDate by default', function() {
            expect(savingsAccountApplication.originationDate()).not.toBeDefined();
        });

        it('should have an undefined transfer from account', function() {
            expect(savingsAccountApplication.transferFromAccount()).not.toBeDefined();
        });

        it('should have an undefined initial deposit amount', function() {
            expect(savingsAccountApplication.initialDepositAmount()).not.toBeDefined();
        });

        it('should have an undefined product name', function() {
            expect(savingsAccountApplication.productName()).not.toBeDefined();
        });

        it('should have an undefined product code', function() {
            expect(savingsAccountApplication.productCode()).not.toBeDefined();
        });

        it('should have a minimum initial deposit of R0', function() {
            expect(savingsAccountApplication.minimumInitialDeposit()).toEqual(0);
        });

        it('should not have a maximum initial deposit', function() {
            expect(savingsAccountApplication.initialDepositAmountHints()).not.toBeDefined();
        });

        it('should not have a maximum initial deposit', function() {
            expect(savingsAccountApplication.maximumInitialDeposit()).not.toBeDefined();
        });

        it('should not have a maximum initial deposit exceeded message', function() {
            expect(savingsAccountApplication.maximumInitialDepositExceededMessage()).not.toBeDefined();
        });

        it('should have an undefined product terms and conditions link', function() {
            expect(savingsAccountApplication.productTermsAndConditionsLink()).not.toBeDefined();
        });

        it('should have an undefined transfer page additional information message', function() {
            expect(savingsAccountApplication.transferPageAdditionalInformation()).not.toBeDefined();
        });

        it('should return false from applicationSuccessful', function() {
            expect(savingsAccountApplication.applicationSuccessful()).toBeFalsy();
        });

        it('contains a repository of the savings products\' information', function() {
            expect(savingsAccountApplication.availableProducts()).toEqual({
                'pure-save': {
                    ProductName: 'PureSave',
                    ProductCode: '9258',
                    ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/secure/applications/wcf/puresavetc.pdf',
                    TransferPageAdditionalInformation: '',
                    MinimumInitialDeposit: 50.00,
                    MaximumInitialDeposit: 4999999.99,
                    MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the maximum amount permitted for a transfer of R4 999 999.99. Please capture an amount in the permitted range'
                },
                'market-link': {
                    ProductName: 'MarketLink',
                    ProductCode: '9257',
                    ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/secure/applications/wcf/MarketLinktc.pdf',
                    TransferPageAdditionalInformation: '',
                    MinimumInitialDeposit: 5000.00,
                    MaximumInitialDeposit: 4999999.99,
                    MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the maximum amount permitted for a transfer of R4 999 999.99. Please capture an amount in the permitted range'
                },
                'tax-free-call-account': {
                    ProductName: 'Tax-Free Call',
                    ProductCode: '9273',
                    ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/standimg/South%20Africa/PDF/Terms%20and%20Conditions/Personal/Banking/Savings%20and%20Investments%20Accounts/Tax%20Free%20Call%20Deposit%20Terms%20and%20Conditions.pdf',
                    TransferPageAdditionalInformation: 'Maximum transfer: R 30 000.00 per year',
                    MinimumInitialDeposit: 250.00,
                    MaximumInitialDeposit: 30000.00,
                    MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the annual contribution permitted on this account of R30 000. Please capture an amount in the permitted range'
                }
            });
        });
    });

    describe('start', function () {
        it('should set the product name, lowerCaseProductName, productCode, minimumInitialDeposit, productTermsAndConditionsLink and transferPageAdditionalInformation', function () {
            savingsAccountApplication.start('pure-save');
            expect(savingsAccountApplication.productName()).toBe("PureSave");
            expect(savingsAccountApplication.productCode()).toBe("9258");
            expect(savingsAccountApplication.maximumInitialDeposit()).toEqual(4999999.99);
            expect(savingsAccountApplication.initialDepositAmountHints()).not.toBeDefined();
            expect(savingsAccountApplication.maximumInitialDepositExceededMessage()).toBe('Please note that you have specified an amount that exceeds the maximum amount permitted for a transfer of R4 999 999.99. Please capture an amount in the permitted range');
            expect(savingsAccountApplication.minimumInitialDeposit()).toEqual(50);
            expect(savingsAccountApplication.productTermsAndConditionsLink()).toBe("https://www.standardbank.co.za/secure/applications/wcf/puresavetc.pdf");
            expect(savingsAccountApplication.transferPageAdditionalInformation()).toBe("");
        });
    });

    describe('offer', function () {
        it('should set the offer and case ID if they are provided', function () {
            savingsAccountApplication.offer({offerId: "1234567890", caseId: "12345"});
            expect(savingsAccountApplication.offerId()).toBe("1234567890");
            expect(savingsAccountApplication.caseId()).toBe("12345");
        });

        it('should set the offer and case ID to undefined if they are NOT provided', function () {
            savingsAccountApplication.offer();
            expect(savingsAccountApplication.offerId()).not.toBeDefined();
            expect(savingsAccountApplication.caseId()).not.toBeDefined();
        });
    });

    describe('specify initial deposit amount and the account that the initial deposit will be transferred from', function () {
        beforeEach(function() {
            savingsAccountApplication.setInitialDeposit({
                transferFromAccount: {
                    "accountFeature": [
                        {
                            "feature": "PAYMENTFROM",
                            "value": true
                        }],
                    "formattedNumber": "12-34-567-890-0",
                    "availableBalance": 9000.0,
                    accountType: "CURRENT"
                },
                initialDepositAmount: 5000
            });
        });

        it('should have a transfer from account set', function() {
            expect(savingsAccountApplication.transferFromAccount()).toEqual({
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": 9000.0,
                accountType: "CURRENT"
            });
        });

        it('should have an initial deposit amount set', function() {
            expect(savingsAccountApplication.initialDepositAmount()).toEqual(5000);
        });
    });

    describe('accountOriginated', function () {
        var date;
        beforeEach(function () {
            date = new Date();
            savingsAccountApplication.accountOriginated({accountNumber: "1234567890", originationDate: date.toString()});
        });

        it('should set the account number of the new account', function () {
            expect(savingsAccountApplication.accountNumber()).toBe("1234567890");
        });

        it('should set the date opened of the new account', function () {
            expect(savingsAccountApplication.originationDate().toString()).toBe(date.toString());
            expect(Object.prototype.toString.call(savingsAccountApplication.originationDate())).toBe('[object Date]');
        });

        it('should applicationSuccessful to true', function () {
            expect(savingsAccountApplication.applicationSuccessful()).toBeTruthy();
        });
    });
});
