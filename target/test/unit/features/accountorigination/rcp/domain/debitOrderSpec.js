describe('Debit Order', function () {
    'use strict';

    var debitOrder;

    beforeEach(module('refresh.accountOrigination.rcp.domain.debitOrder'));

    beforeEach(inject(function (DebitOrder) {
        debitOrder = DebitOrder;
    }));

    describe('From standard bank account', function () {

        it('should create debit order', function () {
            var account = {
                formattedNumber: '12-34-567-890-1',
                number: '12345678901',
                isStandardBank: true,
                branch: {
                    code: 5055,
                    name: 'BRAAMFONTEIN'
                }
            };
            var repayment = {
                day: 3,
                amount: 2500
            };
            var fromStandardBankAccount = debitOrder.fromStandardBankAccount(account, repayment);
            expect(fromStandardBankAccount).toEqual(jasmine.objectContaining({
                account: {
                    formattedNumber: '12-34-567-890-1',
                    number: '12345678901',
                    isStandardBank: true,
                    branch: {
                        code: 5055,
                        name: 'BRAAMFONTEIN'
                    }
                },
                repayment: {
                    day: 3,
                    amount: 2500
                },
                electronicConsent: false
            }));

            expect(fromStandardBankAccount.transformToServiceDebitOrder()).toEqual(
                {
                    debitOrderRepaymentAmount: 2500,
                    debitOrderAccountNumber: '12345678901',
                    debitOrderCycleCode: 103,
                    debitOrderElectronicConsentReceived: false,
                    debitOrderIbtNumber: 5055,
                    debitOrderAccountIsStandardBank: true
                });

        });
    });


    describe('From non standard bank account', function () {
        it('should create debit order with consent', function () {
            var account = {
                number: '12345678901',
                isStandardBank: false,
                formattedNumber: '12345678901',
                branch: {
                    code: 5055,
                    name: 'BRAAMFONTEIN'
                }
            };
            var repayment = {
                day: 7,
                amount: 4000
            };
            var electronicConsent = true;
            var fromOtherBanksAccount = debitOrder.fromOtherBanksAccount(account, repayment,
                electronicConsent);
            expect(fromOtherBanksAccount).toEqual(jasmine.objectContaining({
                account: {
                    isStandardBank: false,
                    formattedNumber: '12345678901',
                    number: '12345678901',
                    branch: {code: 5055, name: 'BRAAMFONTEIN'}
                },
                repayment: {
                    day: 7,
                    amount: 4000
                },
                electronicConsent: true
            }));

            expect(fromOtherBanksAccount.transformToServiceDebitOrder()).toEqual(
                {
                    debitOrderRepaymentAmount: 4000,
                    debitOrderAccountNumber: '12345678901',
                    debitOrderCycleCode: 107,
                    debitOrderElectronicConsentReceived: true,
                    debitOrderIbtNumber: 5055,
                    debitOrderAccountIsStandardBank: false
                });


        });

        it('should create debit order without consent', function () {
            var account = {
                number: '12345678901',
                isStandardBank: false,
                formattedNumber: '12345678901',
                branch: {
                    code: 5055,
                    name: 'BRAAMFONTEIN'
                }
            };
            var repayment = {
                day: 7,
                amount: 4000
            };
            var electronicConsent = false;

            var fromOtherBanksAccount = debitOrder.fromOtherBanksAccount(account, repayment,
                electronicConsent);

            expect(fromOtherBanksAccount).toEqual(jasmine.objectContaining({
                account: {
                    isStandardBank: false,
                    formattedNumber: '12345678901',
                    number: '12345678901',
                    branch: {code: 5055, name: 'BRAAMFONTEIN'}
                },
                repayment: {
                    day: 7,
                    amount: 4000
                },
                electronicConsent: false
            }));

            expect(fromOtherBanksAccount.transformToServiceDebitOrder()).toEqual(
                {
                    debitOrderRepaymentAmount: 4000,
                    debitOrderAccountNumber: '12345678901',
                    debitOrderCycleCode: 107,
                    debitOrderElectronicConsentReceived: false,
                    debitOrderIbtNumber: 5055,
                    debitOrderAccountIsStandardBank: false
                });

        });
    });

});

