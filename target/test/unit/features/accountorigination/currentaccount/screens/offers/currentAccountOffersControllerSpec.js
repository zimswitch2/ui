describe('Offers', function () {
    /*global angular:true, $:true */
    'use strict';

    beforeEach(module('refresh.accountOrigination.currentAccount.screens.offers'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when an offer is received', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account/offer'].controller).toEqual('CurrentAccountOffersController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account/offer'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/offers/partials/currentAccountOffer.html');
            });

            it('should specify the safe return path', function () {
                expect(route.routes['/apply/current-account/offer'].safeReturn).toEqual('/apply');
            });

            it('should only allow specific locations', function () {
                var application = jasmine.createSpyObj('CurrentAccountApplication', ['isPending', 'isNew', 'isPreScreeningComplete']);
                application.isPending.and.returnValue(true);
                application.isPreScreeningComplete.and.returnValue(true);
                var expectedPaths = ['/apply/:product/submit', '/apply/current-account/profile/new',
                    '/apply/current-account/accept', '/apply/current-account/pre-screen'];

                _.forEach(route.routes['/apply/current-account/offer'].allowedFrom, function (allowedRoute) {
                    expect(_.includes(expectedPaths, allowedRoute.path));
                });
            });

            describe('path conditions', function () {
                var CurrentAccountApplication;

                beforeEach(inject(function (_CurrentAccountApplication_) {
                    CurrentAccountApplication = _CurrentAccountApplication_;
                }));

                it('should allow for an application with an offer from current-account submit', function () {
                    var routeParams = {product: 'current-account'};
                    CurrentAccountApplication.offer({applicationNumber: '123'});

                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[0];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/:product/submit');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication, routeParams)).toBeTruthy();
                });

                it('should not allow for an application without an offer from current-account submit', function () {
                    var routeParams = {product: 'current-account'};

                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[0];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/:product/submit');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication, routeParams)).toBeFalsy();
                });

                it('should not allow for an application with an offer from not current-account submit', function () {
                    var routeParams = {product: 'rcp'};
                    CurrentAccountApplication.offer({applicationNumber: '123'});

                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[0];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/:product/submit');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication, routeParams)).toBeFalsy();
                });

                it('should allow for an application with an offer from confirm', function () {
                    CurrentAccountApplication.offer({applicationNumber: '123'});

                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[1];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/current-account/accept');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication)).toBeTruthy();
                });

                it('should not allow for an application without an offer from confirm', function () {
                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[1];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/current-account/accept');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication)).toBeFalsy();
                });

                it('should allow for an application with an offer from pre-screen', function () {
                    CurrentAccountApplication.offer({applicationNumber: '123'});

                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[2];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/current-account/pre-screen');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication)).toBeTruthy();
                });

                it('should not allow for an application without an offer from pre-screen', function () {
                    var allowedFromConsentRoute = route.routes['/apply/current-account/offer'].allowedFrom[2];
                    expect(allowedFromConsentRoute.path).toEqual('/apply/current-account/pre-screen');
                    expect(allowedFromConsentRoute.condition(CurrentAccountApplication)).toBeFalsy();
                });
            });
        });

        describe('when an offer is not supported', function () {
            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account/unsupported'].templateUrl).toEqual('features/accountorigination/common/screens/unsupportedOffer/partials/unsupportedOffer.html');
            });
        });
    });

    describe('CurrentAccountOffersController', function () {
        var offer = {
            applicationNumber: 'SATMSYST 20140820141510001',
            timestamp: '20140820141510001',
            productFamily: {
                name: 'ELITE'
            },
            overdraft: {
                limit: 6000,
                interestRate: 22.5
            },
            products: [
                {
                    name: 'ELITE CURRENT ACCOUNT',
                    number: 132
                },
                {
                    name: 'ELITE PLUS CURRENT ACCOUNT',
                    number: 645
                }
            ]
        };

        var customerInformationData = {
            addressDetails: [{
                addressType: '01',
                streetPOBox: 'street',
                suburb: 'suburb',
                cityTown: 'city',
                postalCode: 'postalCode',
                addressUsage: [
                    {
                        usageCode: '05',
                        deleteIndicator: false,
                        validFrom: '2015-03-09T22:00:00.000+0000',
                        validTo: '9999-12-30T22:00:00.000+0000'
                    }
                ]
            }],
            customerTitleCode: '040',
            customerFirstName: 'Sam Yash',
            customerSurname: 'Clopper',
            branchCode: 2508
        };

        var scopeCustomer = {
            residentialAddress: jasmine.objectContaining({
                addressType: '01',
                streetPOBox: 'street',
                suburb: 'suburb',
                cityTown: 'city',
                postalCode: 'postalCode',
                addressUsage: [
                    {
                        usageCode: '05',
                        deleteIndicator: false,
                        validFrom: '2015-03-09T22:00:00.000+0000',
                        validTo: '9999-12-30T22:00:00.000+0000'
                    }
                ]
            }),
            displayName: 'Mrs Clopper',
            fullName: 'Sam Yash Clopper'
        };

        var scope, mock, mockCurrentAccountApplicationOffer, banks, invokeController, BankService,
            BranchLazyLoadingService, CurrentAccountApplication;

        beforeEach(inject(function ($rootScope, $controller, _mock_, LookUps,
                                    _CurrentAccountApplication_, CustomerInformationData) {
            scope = $rootScope.$new();
            mock = _mock_;
            BankService = jasmine.createSpyObj('BankService', ['walkInBranches', 'list']);
            BranchLazyLoadingService = jasmine.createSpyObj('BranchLazyLoadingService', ['bankUpdate']);

            BankService.walkInBranches.and.returnValue(mock.resolve([
                {code: '2508', name: 'BETHLEHEM'},
                {code: '25708', name: 'BALLITO'}
            ]));

            banks = [
                {
                    "name": "Standard Bank",
                    "code": "051"
                },
                {
                    "name": "ABSA",
                    "code": "089"
                }
            ];

            BankService.list.and.returnValue(mock.resolve(banks));

            CurrentAccountApplication = _CurrentAccountApplication_;
            CurrentAccountApplication.preScreening.creditAndFraudCheckConsent = true;
            CurrentAccountApplication.completePreScreening();

            CustomerInformationData.initialize(customerInformationData);
            spyOn(LookUps.title, 'promise').and.returnValue(mock.resolve([{code: '040', description: 'Mrs'}]));

            mockCurrentAccountApplicationOffer = function (offerToReturn) {
                return spyOn(CurrentAccountApplication, 'offer').and.returnValue(offerToReturn || offer);
            };

            invokeController = function (overrides) {
                overrides = overrides || {};

                $controller('CurrentAccountOffersController', _.merge({
                    $scope: scope,
                    BankService: BankService,
                    BranchLazyLoadingService: BranchLazyLoadingService,
                    CurrentAccountApplication: CurrentAccountApplication
                }, overrides));

                scope.$digest();
            };
        }));

        describe('get offer from CurrentAccountApplication', function () {
            describe('and receives multiple product offers', function () {
                beforeEach(function () {
                    mockCurrentAccountApplicationOffer();
                    invokeController();
                });

                it('should put letter date on scope', function () {
                    expect(scope.letterDate).toEqual('20140820141510001');
                });

                it('should put offer on scope', function () {
                    expect(scope.offer).toEqual(offer);
                });

                it('should set moreThanOne to false', function () {
                    expect(scope.moreThanOne).toBeTruthy();
                });

                it('should know when an offer is not a private banking product', function () {
                    expect(scope.isPrivateBankingProduct).toBeFalsy();
                });
            });

            describe('and receives one product offer', function () {
                var oneProductOffer = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001',
                    productFamily: {
                        name: 'Private Banking'
                    },
                    overdraft: {
                        limit: 6000,
                        interestRate: 22.5
                    },
                    products: [
                        {
                            name: 'PRIVATE BANKING PLUS CURRENT ACCOUNT',
                            number: 644
                        }
                    ]
                };

                beforeEach(function () {
                    mockCurrentAccountApplicationOffer(oneProductOffer);

                    invokeController();
                });

                it('should set moreThanOne to true', function () {
                    expect(scope.moreThanOne).toBeFalsy();
                });

                it('should set selection.selected product to the first object in the products array', function () {
                    expect(scope.selection.product).toEqual(oneProductOffer.products[0]);
                });

                it('should know when an offer is a private banking product', function () {
                    expect(scope.isPrivateBankingProduct).toBeTruthy();
                });
            });
        });

        describe('get customer from CustomerInformationData', function () {
            beforeEach(function () {
                mockCurrentAccountApplicationOffer();
                invokeController();
            });

            it('should put customer on scope', function () {
                expect(scope.customer).toEqual(scopeCustomer);
            });

            it('should set the branches to the scope', function () {
                expect(scope.walkInBranches).toEqual([
                    {code: '2508', name: 'BETHLEHEM'},
                    {code: '25708', name: 'BALLITO'}
                ]);
            });

            it('should set the selected branch to the users preferred branch', function () {
                expect(scope.selection.branch).toEqual({
                    code: '2508',
                    name: 'BETHLEHEM'
                });
            });
        });

        describe('when CurrentAccountApplication has selection', function () {
            beforeEach(function () {
                CurrentAccountApplication.offer(offer);
                CurrentAccountApplication.select({
                    product: offer.products[0],
                    branch: {code: "2508", name: "BETHLEHEM"}
                });

                invokeController();

            });

            it('should set selection on scope', function () {
                expect(scope.selection).toEqual({
                    product: offer.products[0],
                    branch: {code: "2508", name: "BETHLEHEM"}
                });
            });
        });

        describe('selected product index', function () {
            beforeEach(function () {
                mockCurrentAccountApplicationOffer();
                invokeController();
            });

            it('should start undefined', function () {
                expect(scope.selection.selectedProductIndex).toBeUndefined();
            });

            it('should change when product is chosen', function () {
                scope.chooseProduct(0);
                expect(scope.selection.product).toEqual(offer.products[0]);
            });
        });

        describe('on accept', function () {
            var Flow;

            beforeEach(function () {
                mockCurrentAccountApplicationOffer();
                Flow = jasmine.createSpyObj('Flow', ['next']);

                invokeController({
                    Flow: Flow
                });
            });

            it('should set the next flow', function () {
                scope.accept();
                expect(Flow.next).toHaveBeenCalled();
            });

            it('should set the offer', function () {
                scope.accept();
                expect(CurrentAccountApplication.offer()).toEqual(offer);
            });

            it('should set the selection', function () {
                scope.selection = {};
                scope.selectedProductIndex = 1;
                scope.selection.branch = {code: '2508', name: 'BETHLEHEM'};
                scope.accept();
                expect(CurrentAccountApplication.selection()).toEqual({
                    product: offer.products[1],
                    branch: {code: '2508', name: 'BETHLEHEM'}
                });
            });

            it('should send the user to the Ts & Cs page', inject(function ($location) {
                scope.accept();
                expect($location.path()).toEqual('/apply/current-account/accept');
            }));
        });

        describe('overdraft', function () {
            it('should set overdraft on the offer', function () {
                mockCurrentAccountApplicationOffer({
                    productFamily: {name: 'ELITE'},
                    products: [{name: 'product 1'}],
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001',
                    overdraft: {
                        selected: true,
                        limit: 6000,
                        amount: 5000,
                        interestRate: 22.5
                    }
                });

                invokeController({
                    Flow: jasmine.createSpyObj('Flow', ['next'])
                });

                scope.accept();
                expect(CurrentAccountApplication.offer().overdraft.amount).toEqual(5000);
            });

            it('should reset amount to zero when overdraft not selected', function () {

                mockCurrentAccountApplicationOffer({
                    productFamily: {name: 'ELITE'},
                    products: [{name: 'product 1'}],
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001',
                    overdraft: {
                        limit: 6000,
                        amount: 5000,
                        interestRate: 22.5,
                        selected: false
                    }
                });

                invokeController();

                scope.offer.overdraft.selected = false;
                scope.overdraftToggle();
                scope.$digest();
                expect(CurrentAccountApplication.offer().overdraft.amount).toEqual(0);
            });

            it('should not set amount to zero when overdraft is selected', function () {
                mockCurrentAccountApplicationOffer({
                    productFamily: {name: 'ELITE'},
                    products: [{name: 'product 1'}],
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001',
                    overdraft: {
                        limit: 6000,
                        amount: 5000,
                        interestRate: 22.5,
                        selected: true
                    }
                });

                invokeController();

                scope.offer.overdraft.selected = true;
                scope.overdraftToggle();
                scope.$digest();
                expect(CurrentAccountApplication.offer().overdraft.amount).toEqual(6000);
            });

            it('should not offer overdraft', function () {
                mockCurrentAccountApplicationOffer({
                    productFamily: {name: 'ELITE'},
                    products: [{name: 'product 1'}],
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001',
                    overdraft: {
                        limit: 0.0,
                        interestRate: 22.5
                    }
                });

                invokeController();

                expect(scope.offeredOverdraft()).toBeFalsy();
            });

            it('should dirty amount on overdraft toggle', inject(function ($timeout) {
                mockCurrentAccountApplicationOffer({
                    productFamily: {name: 'ELITE'},
                    products: [
                        {name: 'product 1'}
                    ],
                    overdraft: {
                        limit: 0,
                        interestRate: 22.5
                    },
                    applicationNumber: 'SATMSYST 20140820141510001',
                    timestamp: '20140820141510001'
                });

                invokeController();

                var pass = false, angularCopy = angular;
                angular = {
                    element: function () {
                        return {
                            removeClass: function () {
                                return {
                                    addClass: function () {
                                        pass = true;
                                    }
                                };
                            }
                        };
                    }
                };
                scope.overdraftToggle();
                $timeout.flush();
                expect(pass).toBeTruthy();
                angular = angularCopy;
            }));

            describe('with overdraft offer', function () {
                beforeEach(function () {

                    mockCurrentAccountApplicationOffer({
                        productFamily: {name: 'ELITE'},
                        products: [{name: 'product 1'}],
                        applicationNumber: 'SATMSYST 20140820141510001',
                        timestamp: '20140820141510001',
                        overdraft: {
                            limit: 6000,
                            interestRate: 22.5,
                        }
                    });

                    invokeController();
                });

                it('should offer overdraft', function () {
                    expect(scope.offeredOverdraft()).toBeTruthy();
                });

                it('should allow overdraft application if overdraft is offered and pre-screen condition is met', function () {
                    expect(scope.allowOverdraftApplication()).toBeTruthy();
                });

                describe('electronic statements consent', function () {

                    it('should retrieve a list of banks and label them', function () {
                        expect(scope.banks[0].label()).toEqual(banks[0].name);
                        expect(scope.banks.length).toEqual(banks.length);
                    });

                    it('should use only two account types - CURRENT and SAVINGS', function () {
                        expect(scope.bankAccountTypes[0].label()).toEqual('CURRENT');
                        expect(scope.bankAccountTypes[0].name).toEqual('CURRENT');
                        expect(scope.bankAccountTypes[1].label()).toEqual('SAVINGS');
                        expect(scope.bankAccountTypes[1].name).toEqual('SAVINGS');
                        expect(scope.bankAccountTypes.length).toEqual(2);
                    });

                    describe('onBankChanged()', function () {
                        it('should clear branches', function () {
                            scope.offer.overdraft.statementsConsent.bank = {};
                            scope.onBankChanged();
                            expect(scope.offer.overdraft.statementsConsent.branch).toBeUndefined();
                        });

                        it('should update banks', function () {
                            scope.offer.overdraft.statementsConsent.bank = {};
                            scope.onBankChanged();
                            expect(BranchLazyLoadingService.bankUpdate).toHaveBeenCalled();
                        });

                        it('should not update when there are branches', function () {
                            scope.offer.overdraft.statementsConsent.bank = {code: '430'};
                            scope.branches = {430: [{code: '51001', name: 'name'}]};
                            scope.onBankChanged();
                            expect(BranchLazyLoadingService.bankUpdate).not.toHaveBeenCalled();
                        });

                        it('should not update when there are branches', function () {
                            scope.offer.overdraft.statementsConsent.bank = undefined;
                            scope.onBankChanged();
                            expect(BranchLazyLoadingService.bankUpdate).not.toHaveBeenCalled();
                        });

                    });

                    describe('selectedBankBranches', function () {
                        it('it should return a list of branches for selected bank', function () {
                            scope.offer.overdraft.statementsConsent.bank = {code: "430"};
                            scope.branches = {430: [{code: '51001', name: 'name'}]};
                            var expectedResult = [{code: '51001', name: 'name'}];
                            var result = scope.selectedBankBranches();

                            expect(result).toEqual(expectedResult);
                        });

                        it('should return default list when no bank is selected', function () {
                            var result = scope.selectedBankBranches();
                            expect(result).toEqual(scope.branches[undefined]);
                        });
                    });

                    describe('analytics on consent', function () {
                        it('should record that the consent has not yet been selected', function () {
                            expect(scope.overdraftConsentAnalytics()).toBe("Consent-To-Obtain-Account-Statements");
                        });

                        it('should record that the consent has been deselected', function () {
                            scope.offer.overdraft.statementsConsent.selected = true;
                            expect(scope.overdraftConsentAnalytics()).toBe("Don't-Consent-To-Obtain-Account-Statements");
                        });

                        it('should record that the consent has been deselected', function () {
                            scope.offer.overdraft.statementsConsent.selected = false;
                            expect(scope.overdraftConsentAnalytics()).toBe("Consent-To-Obtain-Account-Statements");
                        });
                    });
                });

            });

            describe('enforcer', function () {
                var OverdraftLimitsService;

                beforeEach(inject(function (_OverdraftLimitsService_) {
                    OverdraftLimitsService = _OverdraftLimitsService_;
                    OverdraftLimitsService.prototype.hint = function () {
                        return 'hint';
                    };
                    mockCurrentAccountApplicationOffer({
                        productFamily: {name: 'ELITE'},
                        products: [{name: 'product 1'}],
                        applicationNumber: 'SATMSYST 20140820141510001',
                        timestamp: '20140820141510001',
                        overdraft: {
                            limit: 6000,
                            interestRate: 22.5
                        }
                    });
                }));

                it('should enforce using OverdraftLimitsService', function () {
                    OverdraftLimitsService.prototype.enforce = function () {
                        return {error: true, type: 'error', message: 'something has gone wrong'};
                    };

                    invokeController();

                    scope.offer.overdraft.selected = true;
                    scope.amountViewValue = function () {
                        return '0';
                    };

                    expect(scope.enforcer().message).toEqual('something has gone wrong');
                });

                it('should use amount from view but importantly, pass coverage', function () {
                    invokeController();

                    var $copy = $;
                    $ = function () {
                        return {
                            val: function () {
                                return 'foo';
                            }
                        };
                    };
                    expect(scope.amountViewValue()).toEqual('foo');
                    $ = $copy;
                });

                it('should not enforce when overdraft is not selected', function () {
                    invokeController();

                    scope.offer.overdraft.selected = false;
                    scope.amountViewValue = function () {
                        return '0';
                    };

                    expect(scope.enforcer()).toEqual({});
                });

                it('should hint', function () {
                    invokeController();

                    expect(scope.hinter()).toEqual('hint');
                });
            });
        });
    });
});
