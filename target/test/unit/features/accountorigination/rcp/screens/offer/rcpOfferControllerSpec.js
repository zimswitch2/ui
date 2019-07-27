describe('RCP Offers', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.rcp.screens.offer'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('/apply/rcp/unsupported route', function () {
            it('should use the correct partial', function () {
                expect(route.routes['/apply/rcp/unsupported'].templateUrl).toEqual('features/accountorigination/common/screens/unsupportedOffer/partials/unsupportedOffer.html');
            });
        });

        describe('/apply/rcp/offer route', function () {
            it('should use the correct template', function () {
                expect(route.routes['/apply/rcp/offer'].templateUrl).toEqual('features/accountorigination/rcp/screens/offer/partials/rcpOffer.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/rcp/offer'].controller).toEqual('RcpOfferController');
            });

            it('should specify the safe return path', function () {
                expect(route.routes['/apply/rcp/offer'].safeReturn).toEqual('/apply');
            });

            describe('Apply allowed paths', function () {
                var allowedFrom;
                beforeEach(function () {
                    allowedFrom = route.routes['/apply/rcp/offer'].allowedFrom;

                });

                it('should only allow from apply rcp submit and confirm', function () {
                    expect(allowedFrom.length).toBe(3);
                    expect(allowedFrom[0].path).toEqual('/apply/:product/submit');
                    expect(allowedFrom[1].path).toEqual('/apply/rcp/confirm');
                    expect(allowedFrom[2].path).toEqual('/apply');

                });

                describe('conditions', function () {
                    var application;

                    beforeEach(inject(function () {
                        application = jasmine.createSpyObj('RCPApplication', ['isNew', 'isPending', 'isInProgress',
                                                                              'isPreScreeningComplete']);
                    }));

                    it('should be valid for a new application with pre-screening complete from /apply/rcp/submit', function () {
                        application.isNew.and.returnValue(true);
                        application.isPreScreeningComplete.and.returnValue(true);
                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[0];

                        expect(allowedRoute.path).toEqual('/apply/:product/submit');
                        expect(allowedRoute.condition(application, {product: 'rcp'})).toBeTruthy();
                    });

                    it('should not be valid if RcpApplication is not new with pre-screening complete from /apply/rcp/submit', function () {
                        application.isNew.and.returnValue(false);
                        application.isPreScreeningComplete.and.returnValue(true);

                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[0];

                        expect(allowedRoute.path).toEqual('/apply/:product/submit');
                        expect(allowedRoute.condition(application, {product: 'rcp'})).toBeFalsy();
                    });

                    it('should not be valid if RcpApplication is new with pre-screening complete from /apply/current-account/submit', function () {
                        application.isNew.and.returnValue(true);
                        application.isPreScreeningComplete.and.returnValue(true);

                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[0];

                        expect(allowedRoute.path).toEqual('/apply/:product/submit');
                        expect(allowedRoute.condition(application, {product: 'current-account'})).toBeFalsy();
                    });

                    it('should be valid if RcpApplication is inProgress for /apply/rcp/confirm', function () {
                        application.isInProgress.and.returnValue(true);
                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[1];

                        expect(allowedRoute.path).toEqual('/apply/rcp/confirm');
                        expect(allowedFrom[1].condition(application)).toBeTruthy();
                    });

                    it('should not be valid if RcpApplication is not inProgress for /apply/rcp/confirm', function () {
                        application.isInProgress.and.returnValue(false);
                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[1];

                        expect(allowedRoute.path).toEqual('/apply/rcp/confirm');
                        expect(allowedFrom[1].condition(application)).toBeFalsy();
                    });

                    it('should be valid for a pending application from /apply', function () {
                        application.isPending.and.returnValue(true);
                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[2];

                        expect(allowedRoute.path).toEqual('/apply');
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });

                    it('should be valid for a not pending application from /apply', function () {
                        application.isPending.and.returnValue(false);
                        var allowedRoute = route.routes['/apply/rcp/offer'].allowedFrom[2];

                        expect(allowedRoute.path).toEqual('/apply');
                        expect(allowedRoute.condition(application)).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('RcpOfferController', function () {
        var offer = {
            "applicationNumber": "SC725327 20150515170450001",
            "rcpOfferDetails": {
                "approved": true,
                "maximumLoanAmount": 120000,
                "minimumLoanAmount": 6000,
                "interestRate": 21.0,
                "initiationFeeMaximum": 1140,
                "initiationFeeMinimum": 0,
                "initiationFeeBase": 57,
                "initiationFeeRate": 11.4,
                "monthlyServiceFee": 57,
                "loanTermInMonths": 54,
                "productName": "REVOLVING CREDIT PLAN LOAN",
                "productNumber": 8
            }
        };

        var branches = [
            {name: 'Branch 113', code: '113'},
            {name: 'Branch 114', code: '114'},
            {name: 'Branch 115', code: '115'}
        ];

        var scope, Flow, RcpApplication, bankService, branchLazyLoadingService, AccountsService, rcpCalculator, mock, controller, card, LookUps, URL, user;

        var offerConfirmationDetails = {
            timestamp: '2014-08-13T09:08:40.424+02:00',
            accountNumber: 0,
            maximumDebitOrderRepaymentAmount: 3454.00
        };

        var mapToStandardBankAccount = function (account) {
            return _.merge({isStandardBank: true}, account);
        };

        var titles = [
            {code: '040', description: 'Mr'},
            {code: '4333', description: 'Mrs'}
        ];

        var banks = [
            {
                "name": "Standard Bank",
                "code": "051"
            },
            {
                "name": "ABSA",
                "code": "089"
            }
        ];

        var accounts = {
            currentAccount: {
                "formattedNumber": "12-34-567-890-0",
                "accountType": "CURRENT",
                "accountTypeName": "Current Account",
                "availableBalance": 9000.0,
                branch: {
                    code: 23444,
                    name: 'Sandton'
                },
                number: 12345678900,
                productName: 'ELITE'
            },
            prestigeCurrentAccount: {
                "formattedNumber": "12-34-567-890-1",
                "accountType": "CURRENT",
                "accountTypeName": "Prestige",
                "availableBalance": 18000.0,
                branch: {
                    code: 23444,
                    name: 'Sandton'
                },
                number: 12345678901,
                productName: 'Prestige'
            },
            creditCardAccount: {
                "formattedNumber": "11-76-543-210-0",
                "accountType": "CREDIT_CARD",
                "accountTypeName": "Credit Card",
                "availableBalance": -11.0

            },
            plusPlanSavingsAccount: {
                "formattedNumber": "12-34-567-890-0",
                "accountType": "SAVINGS",
                "productName": "PLUS PLAN",
                "availableBalance": 9000.0,
                branch: {
                    code: 23444,
                    name: 'Sandton'
                },
                number: 12345678900
            }
        };

        LookUps = {
            title: {
                promise: function () {
                    return mock.resolve(titles);
                }
            }
        };

        function invokeController() {

            controller('RcpOfferController',
                {
                    $scope: scope,
                    BankService: bankService,
                    BranchLazyLoadingService: branchLazyLoadingService,
                    AccountsService: AccountsService,
                    RcpCalculator: rcpCalculator,
                    Card: card,
                    LookUps: LookUps,
                    User: user
                }
            );

            scope.$digest();
        }

        var accountsServiceShouldReturn = function (accountsArray) {
            AccountsService.list.and.returnValue(mock.resolve({
                    "accounts": accountsArray,
                    "cardProfile": {
                        "monthlyEAPLimit": 10000,
                        "monthlyWithdrawalLimit": 10000,
                        "usedEAPLimit": 2000
                    }
                }
            ));
        };

        beforeEach(inject(function ($rootScope, _RcpApplication_, $controller, RcpOfferService,
                                    _Flow_, _mock_, RcpCalculator) {
            scope = $rootScope.$new();
            RcpApplication = _RcpApplication_;
            mock = _mock_;
            controller = $controller;
            rcpCalculator = RcpCalculator;

            AccountsService = jasmine.createSpyObj('AccountsService', ['list']);
            accountsServiceShouldReturn([accounts.currentAccount, accounts.creditCardAccount]);

            Flow = _Flow_;
            Flow.create(['step1', 'step2', 'step3']);

            RcpApplication.start();
            RcpApplication.offer(offer);

            bankService = jasmine.createSpyObj('BankService', ['list', 'searchBranches']);
            bankService.list.and.returnValue(mock.resolve(banks));
            bankService.searchBranches.and.returnValue(mock.resolve(branches));

            branchLazyLoadingService = jasmine.createSpyObj('BranchLazyLoadingService', ['bankUpdate']);

            card = jasmine.createSpyObj('Card', ['anySelected', 'current']);
            card.anySelected.and.returnValue(true);
            card.current.and.returnValue({number: 'number'});

            user = jasmine.createSpyObj('User', ['principal', 'hasDashboards']);

            user.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: "1100",
                    systemPrincipalKey: "SBSA"
                }
            });

            spyOn(RcpOfferService, ['accept']).and.returnValue(mock.resolve(offerConfirmationDetails));

            spyOn(rcpCalculator, 'getMinimumRepaymentAmountForOffer').and.callThrough();

            scope.rcpOfferForm = {
                $error: {}
            };

            invokeController();
        }));

        describe('when rcpApplication is in progress', function () {
            var debitOrder, selectedBranch, requestedLimit;

            beforeEach(function () {
                selectedBranch = {
                    code: 5,
                    name: 'Bollisa'
                };

                debitOrder = {
                    account: {
                        "branch": {name: 'Branch 113', code: '113'},
                        isStandardBank: false,
                        number: "12345"
                    },

                    repayment: {
                        day: 6,
                        amount: 1000

                    }
                };

                requestedLimit = 13500;

                RcpApplication.select({
                    selectedBranch: selectedBranch,
                    debitOrder: debitOrder,
                    requestedLimit: requestedLimit
                });
            });

            it('should restore the state of the debitOrder', function () {
                invokeController();
                expect(scope.debitOrder).toEqual(debitOrder);
            });

            it('should restore the state of the requestedLimit', function () {
                invokeController();
                expect(scope.selectedOffer.requestedLimit).toEqual(requestedLimit);
            });

            it('should restore the state of minimumRepayment', function () {
                expect(scope.minimumRepayment).toEqual(3543.02);
            });

            describe('for standard bank customer', function () {
                it('should not restore branch list', function () {
                    scope.branches = undefined;
                    invokeController();
                    expect(branchLazyLoadingService.bankUpdate).not.toHaveBeenCalled();
                });
            });

            describe(' non standard bank user', function () {

                beforeEach(function () {

                    debitOrder.account.bank = {name: 'ABSA', code: '1234'};

                    AccountsService = jasmine.createSpyObj('AccountsService', ['list']);
                    AccountsService.list.and.returnValue(mock.resolve({accounts: []}));

                    RcpApplication.select({
                        selectedBranch: selectedBranch,
                        debitOrder: debitOrder,
                        requestedLimit: requestedLimit
                    });
                });

                it('should restore branch list if the bank has been selected and there are no branches in scope',
                    function () {
                        scope.branches = undefined;
                        invokeController();
                        expect(branchLazyLoadingService.bankUpdate).toHaveBeenCalled();
                    });

                it('should return no accounts', function () {

                    card.anySelected.and.returnValue(false);
                    scope.branches = undefined;
                    invokeController();
                    expect(scope.standardBankAccounts).toEqual([]);
                });
            });
        });


        describe('on requested Loan Amount Changed', function () {

            var timeout;

            beforeEach(inject(function ($timeout) {
                timeout = $timeout;

                scope.offerDetails.initiationFeeMinimum = 0;
                scope.offerDetails.initiationFeeBase = 57;
                scope.offerDetails.initiationFeeMaximum = 1140;
                scope.offerDetails.initiationFeeRate = 11;
                scope.offerDetails.monthlyServiceFee = 110;

                scope.selectedOffer = {
                    requestedLimit: 32000
                };
            }));

            it('should not set the minimum repayment if the timeout has not elapsed', function () {
                scope.minimumRepayment = 520;

                scope.requestedLoanAmountChanged();

                expect(scope.minimumRepayment).toEqual(520);
            });

            it('should only set the minimum repayment once if multiple calls are made within the timeout threshold',
                function () {
                    var originalSelectedAmount = scope.selectedOffer.requestedLimit;

                    scope.selectedOffer.requestedLimit = 4000;
                    scope.requestedLoanAmountChanged();

                    scope.selectedOffer.requestedLimit = originalSelectedAmount;
                    scope.requestedLoanAmountChanged();

                    timeout.flush();

                    expect(scope.minimumRepayment).toEqual(1063.67);
                });

            it('should set the correct minimum repayment', function () {
                scope.requestedLoanAmountChanged();

                timeout.flush();
                expect(scope.minimumRepayment).toEqual(1063.67);
            });

            it('should set the minimum repayment to undefined if the loan amount is not valid', function () {
                scope.rcpOfferForm.$error = {
                    loanamount: true
                };

                scope.requestedLoanAmountChanged();

                timeout.flush();
                expect(scope.debitOrder.repaymentAmount).toBeUndefined();
            });

            it('should call rcp calculator', function () {
                scope.requestedLoanAmountChanged();

                timeout.flush();
                expect(rcpCalculator.getMinimumRepaymentAmountForOffer).toHaveBeenCalledWith(offer, 32000);
            });

            it('should update the repayment amount for the debit order', function () {
                scope.requestedLoanAmountChanged();

                timeout.flush();
                expect(scope.debitOrder.repayment.amount).toEqual(1063.67);
            });

            describe('enforcer', function () {
                var RcpRequestLimitsService;
                beforeEach(inject(function (_RcpRequestLimitsService_) {
                    RcpRequestLimitsService = _RcpRequestLimitsService_;

                    scope.selectedOffer = {
                        requestedLimit: 50000
                    };

                    scope.offerDetails = {
                        maximumLoanAmount: 120000,
                        minimumLoanAmount: 6000
                    };

                }));

                it('should enforce using RcpDebitOrderLimitsService', function () {
                    RcpRequestLimitsService.prototype.enforce = function () {
                        return {error: true, type: 'error', message: 'something has gone wrong'};
                    };

                    invokeController();
                    expect(scope.requestedLimitEnforcer().message).toEqual('something has gone wrong');
                });
            });

            describe('hinter', function () {

                it('should return a hint if the loan amount field is in error', function () {
                    scope.rcpOfferForm.$error.loanamount = false;

                    expect(scope.requestedLimitHinter()).toEqual('Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R ' +
                        offer.rcpOfferDetails.maximumLoanAmount + '</span>');
                });

                it('should return nothing if the loan amount field is valid', function () {
                    scope.rcpOfferForm.$error.loanamount = true;

                    expect(scope.requestedLimitHinter()).toBeUndefined();
                });
            });
        });

        describe('controller is initialized', function () {
            it('should set the offer on the scope', function () {
                expect(scope.offerDetails).toEqual(offer.rcpOfferDetails);
            });

            it('should set the download pre-agreement URL on the scope', function () {
                expect(scope.downloadRcpPreAgreementURL).toEqual('/sbg-ib/rest/AccountOriginationService/DownloadRcpPreAgreement');
            });

            it('should set the application number on the scope', function () {
                expect(scope.applicationNumber).toEqual('SC725327 20150515170450001');
            });

            it('should set system principal on scope', function () {
                expect(scope.principal.systemPrincipalId).toEqual("1100");
                expect(scope.principal.systemPrincipalKey).toEqual("SBSA");
            });

            it('should set the selected offer requested limit to the offer maximum amount', function () {
                expect(scope.selectedOffer.requestedLimit).toEqual(offer.rcpOfferDetails.maximumLoanAmount);
            });

            it('should set debitOrder.isStandardBankAccount on scope to false if no transactional account',
                function () {
                    accountsServiceShouldReturn([accounts.creditCardAccount]);
                    invokeController();

                    expect(scope.debitOrder.isStandardBankAccount).toBeFalsy();
                });

            it('should set newToBank to false if customer has no cards', function () {
                card.anySelected.and.returnValue(false);
                invokeController();

                expect(scope.newToBank).toBeTruthy();
            });

            it('should retrieve a list of banks and label them', function () {
                invokeController();
                expect(scope.banks[0].label()).toEqual(banks[0].name);
            });

            it('should not retrieve branches because of lazy loading', function () {
                invokeController();
                expect(scope.branches).toEqual({undefined: []});
            });

            it('should load the users Standard Bank current accounts', function () {
                accountsServiceShouldReturn([accounts.currentAccount, accounts.creditCardAccount]);
                invokeController();

                expect(scope.standardBankAccounts.length).toEqual(1);
                expect(scope.standardBankAccounts).toEqual([mapToStandardBankAccount(accounts.currentAccount)]);
            });

            it('should select current account if there is a current account', function () {
                accountsServiceShouldReturn([accounts.currentAccount, accounts.creditCardAccount]);

                invokeController();

                expect(scope.debitOrder.account).toEqual(mapToStandardBankAccount(accounts.currentAccount));
            });

            it("should load Standard Bank Plus Plan account", function () {

                accountsServiceShouldReturn([accounts.creditCardAccount, accounts.plusPlanSavingsAccount]);
                invokeController();

                expect(scope.standardBankAccounts.length).toEqual(1);
                expect(scope.standardBankAccounts).toEqual([mapToStandardBankAccount(accounts.plusPlanSavingsAccount)]);
            });

            it('should select plus plan account if there is not current account', function () {
                accountsServiceShouldReturn([accounts.plusPlanSavingsAccount, accounts.creditCardAccount]);

                invokeController();

                expect(scope.debitOrder.account).toEqual(mapToStandardBankAccount(accounts.plusPlanSavingsAccount));
            });

            it('should load both plus plan and current account if user has both', function () {
                accountsServiceShouldReturn([accounts.currentAccount, accounts.plusPlanSavingsAccount,
                    accounts.creditCardAccount]);

                invokeController();
                expect(scope.standardBankAccounts).toEqual([mapToStandardBankAccount(accounts.currentAccount),
                    mapToStandardBankAccount(accounts.plusPlanSavingsAccount)]);
            });

            it('should select the first current account over a plus plan account', function () {
                accountsServiceShouldReturn([accounts.plusPlanSavingsAccount, accounts.currentAccount,
                    accounts.prestigeCurrentAccount]);

                invokeController();

                expect(scope.debitOrder.account).toEqual(mapToStandardBankAccount(accounts.currentAccount));
            });

            it('should default the debit order amount to the minimum repayment amount', function () {
                rcpCalculator.getMinimumRepaymentAmountForOffer.and.returnValue(1000);

                invokeController();

                expect(scope.debitOrder.repayment.amount).toEqual(1000);
            });

            it('should default the repayment day to day 1', function () {

                invokeController();
                expect(scope.debitOrder.repayment.day).toEqual(1);
            });

            it('should default electronic consent to true', function () {

                invokeController();
                expect(scope.debitOrder.electronicConsent).toBeTruthy();
            });
        });

        describe('showPreAgreement', function () {
            var rcpOfferService;

            beforeEach(inject(function (RcpOfferService) {
                rcpOfferService = RcpOfferService;
                spyOn(rcpOfferService,
                    ['getPreAgreementHtml']).and.returnValue(mock.resolve('<html>Pre Agreement</html>'));
            }));

            it('should set showQuote to true', function () {
                scope.showPreAgreement();
                scope.$digest();
                expect(scope.showQuote).toBeTruthy();
            });

            it('should populate preagreementHtml', function () {
                scope.showPreAgreement();
                scope.$digest();
                expect(scope.preagreementHtml).toEqual('<html>Pre Agreement</html>');
            });

            it('should get pre agreement with offer details', function () {
                scope.selectedOffer.requestedLimit = 6998;

                scope.showPreAgreement();
                expect(rcpOfferService.getPreAgreementHtml).toHaveBeenCalledWith({
                    applicationNumber: offer.applicationNumber,
                    productNumber: offer.rcpOfferDetails.productNumber,
                    requestedLimit: scope.selectedOffer.requestedLimit
                });
            });
        });

        describe('hasStandardBankAccount', function () {
            beforeEach(function () {
                invokeController();
            });

            it('should return true if user has standard bank accounts', function () {
                scope.standardBankAccounts = [accounts.currentAccount];
                expect(scope.hasStandardBankAccount()).toBeTruthy();
            });

            it('should return false if user does not have standard bank accounts', function () {
                scope.standardBankAccounts = [];
                expect(scope.hasStandardBankAccount()).toBeFalsy();
            });
        });

        describe('debit order', function () {
            describe('enforcer', function () {
                var RcpDebitOrderLimitsService;
                beforeEach(inject(function (_RcpDebitOrderLimitsService_) {
                    RcpDebitOrderLimitsService = _RcpDebitOrderLimitsService_;

                    scope.debitOrder = {
                        repaymentAmount: 5000,
                        bank: {
                            "name": "ABSA",
                            "code": "089",
                            "branch": {name: 'Branch 113', code: '113'}
                        }
                    };

                }));

                it('should enforce using RcpDebitOrderLimitsService', function () {
                    RcpDebitOrderLimitsService.prototype.enforce = function () {
                        return {error: true, type: 'error', message: 'something has gone wrong'};
                    };

                    invokeController();
                    expect(scope.enforcer().message).toEqual('something has gone wrong');
                });

                it('should show hint if repayment amount is greater than minimum repayment amount', function () {
                    RcpDebitOrderLimitsService.prototype.hint = function () {
                        return 'hint';
                    };

                    rcpCalculator.getMinimumRepaymentAmountForOffer.and.returnValue(1000);

                    invokeController();

                    scope.debitOrder.repayment.amount = 7000;

                    expect(scope.hinter()).toEqual('hint');
                });

                it('should not show hint if repayment amount is greater than minimum repayment amount', function () {
                    RcpDebitOrderLimitsService.prototype.hint = function () {
                        return 'hint';
                    };

                    rcpCalculator.getMinimumRepaymentAmountForOffer.and.returnValue(5000);

                    invokeController();

                    scope.debitOrder = {repayment: {amount: 3000}};

                    expect(scope.hinter()).toBeUndefined();
                });
            });

            describe('onBankChanged', function () {
                beforeEach(function () {
                    scope.selection = {
                        selectedBranch: {
                            code: 5,
                            name: 'Bollisa'
                        }
                    };

                    scope.debitOrder = {
                        account: {
                            bank: {
                                "name": "ABSA",
                                "code": "089"
                            },
                            isStandardBank: false,
                            number: "12345",
                            branch: {name: 'Branch 113', code: '113'}

                        },
                        repayment: {day: 6, Amount: 1000}
                    };

                });

                describe('if branches have not been loaded for bank', function () {
                    beforeEach(function () {
                        scope.debitOrder = {
                            account: {
                                bank: {
                                    "name": "ABSA",
                                    "code": "089",
                                    "branch": {name: 'Branch 113', code: '113'}
                                }
                            }
                        };
                    });

                    it('should call branch lazy loading service', function () {
                        scope.onBankChanged();
                        expect(branchLazyLoadingService.bankUpdate).toHaveBeenCalled();
                    });
                });

                describe('if branches have been loaded for bank', function () {
                    beforeEach(function () {
                        scope.debitOrder = {
                            account: {
                                bank: {
                                    "name": "ABSA",
                                    "code": "089",
                                    "branch": {name: 'Branch 113', code: '113'}
                                }
                            }
                        };

                        scope.branches = {
                            "089": []
                        };
                    });

                    it('should not call branch lazy loading service', function () {
                        scope.onBankChanged();
                        expect(branchLazyLoadingService.bankUpdate).not.toHaveBeenCalled();
                    });
                });

                describe('if no bank is selected', function () {
                    beforeEach(function () {
                        scope.debitOrder =
                        {
                            account: {
                                bank: undefined
                            }

                        };
                    });

                    it('should not call branch lazy loading service', function () {
                        scope.onBankChanged();
                        expect(branchLazyLoadingService.bankUpdate).not.toHaveBeenCalled();
                    });
                });

                describe('if branches have been loaded for bank', function () {


                    it('should call branch lazy loading service', function () {
                        var expectedResult = [];
                        scope.branches = {
                            "089": expectedResult
                        };

                        var result = scope.selectedDebitOrderBankBranches();

                        expect(result).toEqual(expectedResult);
                    });
                });

            });

            describe('selectedDebitOrderBankBranches', function () {
                beforeEach(function () {
                    scope.selection = {
                        selectedBranch: {
                            code: 5,
                            name: 'Bollisa'
                        }
                    };

                    scope.debitOrder = {
                        account: {
                            bank: {
                                "name": "ABSA",
                                "code": "089"

                            },
                            "branch": {name: 'Branch 113', code: '113'},
                            isStandardBank: false,
                            number: "12345"
                        },
                        repayment: {
                            day: 6,
                            amount: 1000
                        }
                    };

                });

                describe('no bank selected', function () {

                    beforeEach(function () {
                        scope.debitOrder = {account: {bank: undefined}};
                    });

                    it('should return default list', function () {
                        var result = scope.selectedDebitOrderBankBranches();

                        expect(result).toEqual(scope.branches[undefined]);
                    });
                });

                describe('if branches have been loaded for bank', function () {
                    beforeEach(function () {
                        scope.debitOrder = {
                            account: {
                                bank: {
                                    "name": "ABSA",
                                    "code": "089"

                                },
                                branch: {name: 'Branch 113', code: '113'}
                            }
                        };
                    });

                    it('should return the correct list of branches', function () {
                        var expectedResult = [];
                        scope.branches = {
                            "089": expectedResult
                        };

                        var result = scope.selectedDebitOrderBankBranches();

                        expect(result).toEqual(expectedResult);
                    });
                });
            });

            describe('clear branch', function () {

                beforeEach(function () {
                    scope.debitOrder = {
                        account: {
                            bank: {
                                "name": "ABSA",
                                "code": "089"
                            }
                        },
                        branch: {name: 'Branch 113', code: '113'}
                    };
                });

                it('should clear the branch selection for debit order', function () {
                    scope.clearBranch();
                    expect(scope.debitOrder.account.branch).not.toBeDefined();
                });
            });
        });

        describe('accept Rcp offer', function () {

            beforeEach(function () {
                scope.selection = {
                    selectedBranch: {
                        code: 5,
                        name: 'Bollisa'
                    }
                };

                scope.debitOrder = {
                    bank: {
                        "name": "ABSA",
                        "code": "089"
                    },
                    account: {
                        "branch": {name: 'Branch 113', code: '113'},
                        isStandardBank: false,
                        number: "12345"
                    },
                    repayment: {
                        day: 6,
                        amount: 1000

                    }
                };

                scope.selectedOffer = {
                    requestedLimit: 13500
                };
            });

            it('should send the user to the confirm rcp offer page', inject(function ($location) {
                scope.accept();
                expect($location.path()).toEqual('/apply/rcp/confirm');
            }));

            it('should go to next flow step', function () {
                scope.accept();
                expect(Flow.currentStep().name).toEqual('step2');
            });

            it('should set selected branch and debit order details on RcpApplication for other bank account',
                function () {
                    scope.debitOrder.electronicConsent = false;

                    scope.accept();
                    expect(RcpApplication.selection().selectedBranch).toEqual({
                        code: 5, name: 'Bollisa'
                    });
                    expect(RcpApplication.selection().debitOrder).toEqual(jasmine.objectContaining({
                        account: {
                            formattedNumber: '12345',
                            branch: {code: '113', name: 'Branch 113'},
                            isStandardBank: false,
                            number: '12345'
                        },
                        repayment: {
                            day: 6,
                            amount: 1000
                        },
                        electronicConsent: false
                    }));
                    expect(RcpApplication.selection().debitOrder.repayment.amount).toEqual(1000);
                });

            it('should set selected branch and debit order details on RcpApplication for Standard Bank account',
                function () {
                    scope.debitOrder = {
                        account: {
                            isStandardBank: true,
                            number: '12345',
                            formattedNumber: '12-345',
                            branch: {name: 'Branch 113', code: '113'}
                        },
                        repayment: {
                            day: 6,
                            amount: 1000
                        }

                    };

                    scope.accept();

                    expect(RcpApplication.selection().selectedBranch).toEqual({
                        code: 5, name: 'Bollisa'
                    });
                    expect(RcpApplication.selection().debitOrder).toEqual(jasmine.objectContaining({
                        account: {
                            isStandardBank: true,
                            number: '12345',
                            formattedNumber: '12-345',
                            branch: {code: '113', name: 'Branch 113'}
                        },
                        repayment: {
                            day: 6,
                            amount: 1000
                        },
                        electronicConsent: false
                    }));
                    expect(RcpApplication.selection().debitOrder.repayment.amount).toEqual(1000);
                });
        });
    });
});
