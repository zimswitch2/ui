describe('AccountsService', function () {
    'use strict';

    beforeEach(module('refresh.accountsService', 'refresh.test'));

    var accountsService, test, userService;

    beforeEach(inject(function (_AccountsService_, _ServiceTest_, _User_) {
        accountsService = _AccountsService_;
        userService = _User_;

        //spyOn(RcpOfferService, ['accept']).and.returnValue(mock.resolve(offerConfirmationDetails));

        var currentPrincipalMock = {
            systemPrincipalIdentifier: {
                systemPrincipalId: 4321,
                systemPrincipalKey: 'SED'
            }
        };

        spyOn(userService, ['principalForCurrentDashboard']).and.returnValue(currentPrincipalMock);

        test = _ServiceTest_;
        test.spyOnEndpoint('listAccounts');
        test.spyOnEndpoint('getEAPLimit');
    }));



    describe('list', function () {
        it('should invoke the list accounts accountsService', function () {
            test.stubResponse('listAccounts', 200);
            accountsService.list({number: 'number', personalFinanceManagementId: 'personalFinanceManagementId'});
            expect(test.endpoint('listAccounts')).toHaveBeenCalled();
        });

        it('should call list accounts endpoint with given card and current dashboard system principal Id', function () {
            test.stubResponse('listAccounts', 200);
            accountsService.list({number: '1234', personalFinanceManagementId: 'personalFinanceManagementId'});

            expect(test.endpoint('listAccounts')).toHaveBeenCalledWith({card: {number: '1234'}, systemPrincipalId: 4321 });

        });



    });

    describe('hasCurrentAccount', function () {
        it('should call list accounts endpoint with given card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}]});
            accountsService.hasCurrentAccount({number: '1234', personalFinanceManagementId: 9});
            expect(test.endpoint('listAccounts')).toHaveBeenCalledWith({card: {number: '1234'}, systemPrincipalId: 4321 });
        });

        it('should return true if card has current account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}]});
            expect(accountsService.hasCurrentAccount({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return false if card does not have current account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'HOME LOAN'}]});
            expect(accountsService.hasCurrentAccount({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(false);
            test.resolvePromise();
        });

        it('should reject error response', function () {
            test.stubResponse('listAccounts', 204, {}, {'x-sbg-response-type': 'ERROR'});
            expect(accountsService.hasCurrentAccount({number: '1234', personalFinanceManagementId: 9})).toBeRejectedWith({
                status: 204,
                data: {},
                headers: jasmine.any(Function)
            });
            test.resolvePromise();
        });
    });

    describe('hasFormalStatementAccounts', function () {
        it('should call list accounts endpoint with given card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}, {accountType: 'HOME_LOAN'}]});
            accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9});
            expect(test.endpoint('listAccounts')).toHaveBeenCalledWith({card: {number: '1234'}, systemPrincipalId: 4321});
        });

        it('should return true if card has current account and home loan', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}, {accountType: 'HOME_LOAN'}]});
            expect(accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return true if card has home loan account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'HOME_LOAN'}]});
            expect(accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return true if card has current account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}]});
            expect(accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return true if card has credit card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CREDIT_CARD'}]});
            expect(accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return false if card does not have current account or home loan', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'TERM_LOAN'}]});
            expect(accountsService.hasFormalStatementAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(false);
            test.resolvePromise();
        });
    });

    describe('hasPrivateBankingAccount', function () {
        it('should call list accounts endpoint with given card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT', name: "PRIVATE B"}]});
            accountsService.hasPrivateBankingAccount({number: '1234', personalFinanceManagementId: 9});
            expect(test.endpoint('listAccounts')).toHaveBeenCalledWith({card: {number: '1234'}, systemPrincipalId: 4321});
        });

        it('should return true if card has private banking account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT', name: "PRIVATE B"}]});
            expect(accountsService.hasPrivateBankingAccount({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(true);
            test.resolvePromise();
        });

        it('should return false if card does not have private banking account', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'CURRENT'}]});
            expect(accountsService.hasPrivateBankingAccount({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith(false);
            test.resolvePromise();
        });

        it('should reject error response', function () {
            test.stubResponse('listAccounts', 204, {}, {'x-sbg-response-type': 'ERROR'});
            expect(accountsService.hasPrivateBankingAccount({number: '1234', personalFinanceManagementId: 9})).toBeRejectedWith({
                status: 204,
                data: {},
                headers: jasmine.any(Function)
            });
            test.resolvePromise();
        });

    });

    describe('available balances', function () {
        it('should return the available balance for a specific account', function () {
            var accountList = [
                {
                    availableBalance: {amount: 0.00},
                    number: "DOESN'T MATTER"
                },
                {
                    availableBalance: {amount: 123.45},
                    number: "7654"
                }
            ];
            var availableBalance = accountsService.availableBalanceFor(accountList, "7654");
            expect(availableBalance).toEqual(123.45);
        });
    });

    describe('valid from payment accounts', function () {
        it('should return only accounts that are valid pay from accounts', function () {
            var accounts = [
                {
                    "accountFeature": [
                        {
                            "feature": "PAYMENTFROM",
                            "value": true
                        }],
                    "formattedNumber": "12-34-567-890-0",
                    "availableBalance": 9000.0,
                    accountType: "CURRENT"
                },
                {
                    "accountFeature": [
                        {
                            "feature": "PAYMENTFROM",
                            "value": true
                        }],
                    "formattedNumber": "1234-1234-1234-1234",
                    "availableBalance": 10000.0,
                    accountType: "CREDIT_CARD"
                },
                {
                    "accountFeature": [
                        {
                            "feature": "PAYMENTFROM",
                            "value": false
                        }],
                    "formattedNumber": "1234-1234-1234-1234",
                    "availableBalance": 10000.0,
                    accountType: "HOME_LOAN"
                }
            ];
            expect(accountsService.validFromPaymentAccounts(accounts)).toEqual([accounts[0], accounts[1]]);
        });
    });

    describe('list cache', function () {
        var accountList = [
            {
                availableBalance: {amount: 0.00},
                number: "DOESN'T MATTER"
            },
            {
                availableBalance: {amount: 123.45},
                number: "7654"
            }
        ];

        it('should return the list of accounts', function () {
            test.stubResponse('listAccounts', 200, {accounts: accountList});
            expect(accountsService.list({number: '12345'})).toBeResolvedWith({accounts: accountList});
            test.resolvePromise();
        });

        it ('should return an empty list of accounts if the card number is null', function() {
            expect(accountsService.list({number: null})).toBeResolvedWith({accounts: []});
            test.resolvePromise();
        });

        it('should not resolve with the list of accounts if the call fails', function () {
            test.stubResponse('listAccounts', 500, {accounts: accountList});
            expect(accountsService.list({number: '12345'})).toBeRejected();
            test.resolvePromise();
        });

        it('should reject with an error if call returns error headers', function () {
            test.stubResponse('listAccounts', 200, {}, {'x-sbg-response-type': 'ERROR'});
            expect(accountsService.list({number: '12345'})).toBeRejected();
            test.resolvePromise();
        });

        it('should load data from the cache if we have it', function () {
            test.stubResponse('listAccounts', 200, {accounts: accountList});
            accountsService.list({number: '12345', personalFinanceManagementId: 9});
            test.resolvePromise();

            expect(accountsService.list({number: '12345'})).toBeResolvedWith({accounts: accountList});
            test.resolvePromise();

            expect(test.endpoint('listAccounts').calls.count()).toEqual(1);
        });

        it('should load data from the accountsService if we have cleared the cache', function () {
            test.stubResponse('listAccounts', 200, {accounts: accountList});

            accountsService.list({number: '12345', personalFinanceManagementId: 9});
            test.resolvePromise();

            accountsService.clear();
            accountsService.list({number: '12345', personalFinanceManagementId: 9});
            test.resolvePromise();

            expect(test.endpoint('listAccounts').calls.count()).toEqual(2);
        });
    });

    describe('view eap limit', function () {
        it('should invoke the get eap limit', function () {
            test.stubResponse('getEAPLimit', 200);
            accountsService.getEAPLimit('number');
            expect(test.endpoint('getEAPLimit')).toHaveBeenCalledWith({"card": {number: 'number'}});
        });

        it('should return the response upon success', function () {
            test.stubResponse('getEAPLimit', 200, {"data": "here is the response"}, {"x-sbg-response-code": "0000"});
            expect(accountsService.getEAPLimit({"card": {number: 'number', personalFinanceManagementId: 9}})).toBeResolvedWith({"data": "here is the response"});
            test.resolvePromise();
        });

        it('should not return the response upon failure', function () {
            var card = {"card": {number: 'number'}};
            test.stubResponse('getEAPLimit', 204, {}, {"x-sbg-response-code": "9999"});
            expect(accountsService.getEAPLimit(card)).toBeRejectedWith({
                'message': 'An error has occurred',
                'model': card,
                "code": undefined
            });
            test.resolvePromise();
        });

        it('should not return the response upon generic failure', function () {
            var card = {"card": {number: 'number'}};
            test.stubResponse('getEAPLimit', 500, {}, {"x-sbg-response-code": "9999"});
            expect(accountsService.getEAPLimit(card)).toBeRejectedWith({
                'message': 'An error has occurred',
                'model': card,
                "code": undefined
            });
            test.resolvePromise();
        });

    });

    describe('hasPayFromFeature', function () {
        it('should return true if account has pay from feature', function () {
            var account = {
                accountFeature: [
                    {
                        feature: 'PAYMENTFROM',
                        value: true
                    }
                ]
            };

            expect(accountsService.hasPayFromFeature(account)).toBeTruthy();
        });

        it('should return false if account does not have pay from feature', function () {
            var account = {
                accountFeature: [
                    {
                        feature: 'SOME_OTHER_FEATURE'
                    }
                ]
            };

            expect(accountsService.hasPayFromFeature(account)).toBeFalsy();
        });

        it('should return false if account does have pay from feature, but set to false', function () {
            var account = {
                accountFeature: [
                    {
                        feature: 'PAYMENTFROM',
                        value: false
                    }
                ]
            };

            expect(accountsService.hasPayFromFeature(account)).toBeFalsy();
        });
    });

    describe('currentAndSavingsAccounts', function () {
        it('should call list accounts endpoint with given card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'SAVINGS'}, {accountType: 'CURRENT'}]});
            accountsService.currentAndSavingsAccounts({number: '1234', personalFinanceManagementId: 9});
            expect(test.endpoint('listAccounts')).toHaveBeenCalledWith({card: {number: '1234'}, systemPrincipalId: 4321 });
        });

        it('should return only savings and current accounts for card', function () {
            test.stubResponse('listAccounts', 200, {accounts: [{accountType: 'SAVINGS'}, {accountType: 'CURRENT'}, {accountType: 'RCP'}]});
            expect(accountsService.currentAndSavingsAccounts({number: '1234', personalFinanceManagementId: 9})).toBeResolvedWith([{accountType: 'SAVINGS'}, {accountType: 'CURRENT'}]);
            test.resolvePromise();
        });

        it('should reject error response', function () {
            test.stubResponse('listAccounts', 204, {}, {'x-sbg-response-type': 'ERROR'});
            expect(accountsService.currentAndSavingsAccounts({number: '1234', personalFinanceManagementId: 9})).toBeRejectedWith({
                status: 204,
                data: {},
                headers: jasmine.any(Function)
            });
            test.resolvePromise();
        });
    });

    describe('accountTypeName', function() {
        it('should return Current Account for CURRENT', function() {
            expect(accountsService.accountTypeName('CURRENT')).toEqual('Current Account');
        });

        it('should return Credit Card for CREDIT_CARD', function() {
            expect(accountsService.accountTypeName('CREDIT_CARD')).toEqual('Credit Card');
        });

        it('should return Home Loan for HOME_LOAN', function() {
            expect(accountsService.accountTypeName('HOME_LOAN')).toEqual('Home Loan');
        });

        it('should return Term Loan for TERM_LOAN', function() {
            expect(accountsService.accountTypeName('TERM_LOAN')).toEqual('Term Loan');
        });

        it('should return Revolving Credit Plan for RCP', function() {
            expect(accountsService.accountTypeName('RCP')).toEqual('Revolving Credit Plan');
        });

        it('should return Savings Account for SAVINGS', function() {
            expect(accountsService.accountTypeName('SAVINGS')).toEqual('Savings Account');
        });

        it('should return Investment Account for NOTICE', function() {
            expect(accountsService.accountTypeName('NOTICE')).toEqual('Investment Account');
        });

        it('should return Fixed Term Investment for FIXED_TERM_INVESTMENT', function() {
            expect(accountsService.accountTypeName('FIXED_TERM_INVESTMENT')).toEqual('Fixed Term Investment');
        });

        it('should return Business Current Account for BUSINESS_CURRENT_ACCOUNT', function() {
            expect(accountsService.accountTypeName('BUSINESS_CURRENT_ACCOUNT')).toEqual('Business Current Account');
        });

        it('should return empty string for UNKNOWN', function() {
            expect(accountsService.accountTypeName('UNKNOWN')).toEqual('');
        });
    });
});
