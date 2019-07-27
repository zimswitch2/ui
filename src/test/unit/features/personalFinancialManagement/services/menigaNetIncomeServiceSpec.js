describe('Meniga Net Income Service', function () {
    'use strict';

    var menigaNetIncomeService, test, mock;
    var accounts = [
        {
            "accountType": "CURRENT",
            "name": "Joe Smith",
            "number": "10000358140"
        },
        {
            "accountType": "CURRENT",
            "name": "ACCESSACC",
            "number": "10005304182"
        },
        {
            "accountType": "CREDIT_CARD",
            "name": "CREDIT CARD",
            "number": "5592007012041578"
        },
        {
            "accountType": "HOME_LOAN",
            "name": "HOME LOAN",
            "number": "5592007012041579"
        },
        {
            "accountType": "TERM_LOAN",
            "name": "TERM LOAN",
            "number": "5592007012041580"
        },
        {
            "accountType": "RCP",
            "name": "REVOLVING CREDIT PLAN",
            "number": "5592007012041590"
        },
        {
            "accountType": "SAVINGS",
            "name": "SAVINGS",
            "number": "42144214"
        },
        {
            "accountType": "NOTICE",
            "name": "NOTICE",
            "number": "5592007012041560"
        },
        {
            "accountType": "FIXED_TERM_INVESTMENT",
            "name": "FIXED TERM",
            "number": "5592007012041511"
        },
        {
            "accountType": "SAVINGS",
            "name": "MONEYMARKET",
            "number": "268450625"
        },
        {
            "accountType": "SAVINGS",
            "name": "MONEYMARKET",
            "number": "268450625"
        },
        {
            "accountType": "SAVINGS",
            "name": "MONEYMARKET",
            "number": "268450625"
        }
    ];
    var personalFinanceManagementId = 9;

    beforeEach(module('refresh.meniga.netIncomeService'));

    beforeEach(inject(function (_MenigaNetIncomeService_, _ServiceTest_, _mock_) {
        menigaNetIncomeService = _MenigaNetIncomeService_;
        test = _ServiceTest_;
        test.spyOnEndpoint('getAccountsNetIncome');
        test.spyOnEndpoint('getAccountsCashflows');
        mock = _mock_;
    }));

    describe('getAccountsNetIncome', function () {
        var stubResponseData = {"netIncome":  [{
            "Expenses": -16594.15,
            "Income": 18000,
            "Month": {
                "MonthOfYear": 4,
                "Year": 2015
            }
        }, {
            "Expenses": -15035.20,
            "Income": 18000,
            "Month": {
                "MonthOfYear": 5,
                "Year": 2015
            }
        }]};

        it('should call getAccountsNetIncome endpoint with given current and credit card account\'s numbers and types', function () {
            test.stubResponse('getAccountsNetIncome', 200);

            menigaNetIncomeService.getAccountsNetIncome(personalFinanceManagementId, accounts);
            test.resolvePromise();

            expect(test.endpoint('getAccountsNetIncome')).toHaveBeenCalledWith({
                personalFinanceManagementId: personalFinanceManagementId,
                accounts: _.map(_.filter(accounts, function (account) {
                    return account.accountType === "CURRENT" ||
                        account.accountType === "CREDIT_CARD";
                }), function (account) {
                    return {
                        accountType: account.accountType,
                        number: account.number
                    };
                })
            }, {omitServiceErrorNotification:true});
        });

        it('should return the response upon success', function () {
            test.stubResponse('getAccountsNetIncome', 200, stubResponseData);

            test.resolvePromise();

            expect(menigaNetIncomeService.getAccountsNetIncome(personalFinanceManagementId, accounts)).toBeResolvedWith(stubResponseData);
        });

        it('should return a generic rejection upon generic failure', function () {
            test.stubResponse('getAccountsNetIncome', 204, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsNetIncome(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'An error has occurred.'
            }));

            test.resolvePromise();
        });

        it('should return a specific rejection upon specific failure', function () {
            test.stubResponse('getAccountsNetIncome', 204, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "1234", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsNetIncome(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'This error message came from the gateway'
            }));

            test.resolvePromise();
        });

        it('should return a generic rejection upon server failure', function () {
            test.stubResponse('getAccountsNetIncome', 500, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsNetIncome(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'An error has occurred.'
            }));

            test.resolvePromise();
        });
    });

    describe('getAccountsCashflows', function () {
        var stubResponseData = {accountCashFlow : [{
            accountType: "CURRENT",
            name: "ACCESSACC",
            netIncome: []
        }, {
            accountType: "CURRENT",
            name: "ELITE",
            netIncome: [{
                Expenses: -10443.05,
                Income: 18000,
                Month: {
                    MonthOfYear: 4,
                    Year: 2015
                }
            }, {
                Expenses: -10067.35,
                Income: 18000,
                Month: {
                    MonthOfYear: 5,
                    Year: 2015
                }
            }]
        }, {
            accountType: "CREDIT_CARD",
            name: "CREDIT CARD",
            netIncome: [{
                Expenses: -6151.10,
                Income: 0,
                Month: {
                    MonthOfYear: 4,
                    Year: 2015
                }
            }, {
                Expenses: -4967.85,
                Income: 0,
                Month: {
                    MonthOfYear: 5,
                    Year: 2015
                }
            }]
        }]};

        it('should call getAccountsCashflows endpoint with given current and credit card account\'s', function () {
            test.stubResponse('getAccountsCashflows', 200);

            menigaNetIncomeService.getAccountsCashflows(personalFinanceManagementId, accounts);
            test.resolvePromise();

            expect(test.endpoint('getAccountsCashflows')).toHaveBeenCalledWith({
                personalFinanceManagementId: personalFinanceManagementId,
                accounts: _.map(_.filter(accounts, function (account) {
                    return account.accountType === "CURRENT" ||
                        account.accountType === "CREDIT_CARD";
                }), function (account) {
                    return {
                        accountType: account.accountType,
                        number: account.number,
                        name: account.name
                    };
                })
            }, {omitServiceErrorNotification:true});
        });

        it('should return the response upon success', function () {
            test.stubResponse('getAccountsCashflows', 200, stubResponseData);

            test.resolvePromise();

            expect(menigaNetIncomeService.getAccountsCashflows(personalFinanceManagementId, accounts)).toBeResolvedWith(stubResponseData);
        });

        it('should return a generic rejection upon generic failure', function () {
            test.stubResponse('getAccountsCashflows', 204, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsCashflows(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'An error has occurred.'
            }));

            test.resolvePromise();
        });

        it('should return a specific rejection upon specific failure', function () {
            test.stubResponse('getAccountsCashflows', 204, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "1234", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsCashflows(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'This error message came from the gateway'
            }));

            test.resolvePromise();
        });

        it('should return a generic rejection upon server failure', function () {
            test.stubResponse('getAccountsCashflows', 500, {}, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

            expect(menigaNetIncomeService.getAccountsCashflows(personalFinanceManagementId, accounts)).toBeRejectedWith(jasmine.objectContaining({
                'message': 'An error has occurred.'
            }));

            test.resolvePromise();
        });
    });
});
