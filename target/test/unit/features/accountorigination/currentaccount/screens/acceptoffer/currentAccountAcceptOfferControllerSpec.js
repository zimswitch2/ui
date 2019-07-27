describe('Accept offer', function () {
    'use strict';
    /*global debitOrderSwitchingFeature:true */
    /*global generateCostOfCreditFeature:true */
    beforeEach(module('refresh.accountOrigination.currentAccount.screens.acceptOffer'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when an offer is received', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account/accept'].controller).toEqual('AcceptOfferController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account/accept'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/acceptoffer/partials/acceptOffer.html');
            });
        });

        describe('path configurations', function () {
            var application;

            beforeEach(function () {
                application = jasmine.createSpyObj('CurrentAccountApplication', ['isInProgress']);
            });

            it('should allow an in-progress current account application', function () {
                application.isInProgress.and.returnValue(true);

                _.forEach(route.routes['/apply/current-account/accept'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeTruthy();
                });
            });

            it('should not allow a current account application if it is not in progress', function () {
                application.isInProgress.and.returnValue(false);

                _.forEach(route.routes['/apply/current-account/accept'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeFalsy();
                });
            });
        });
    });

    describe('AcceptOfferController', function () {
        var scope, products, Flow, CurrentAccountOffersService, offer, acceptResponse, noCrossSellResponse, User, mock, selection, currentAccountApplication;
        var offerSpy, productSelectionSpy, controller;

        function initController() {
            controller('AcceptOfferController', {
                $scope: scope,
                Flow: Flow,
                CurrentAccountOffersService: CurrentAccountOffersService,
                User: User
            });
        }

        beforeEach(inject(function ($rootScope, $controller, _mock_, CurrentAccountApplication) {
            scope = $rootScope.$new();
            mock = _mock_;
            currentAccountApplication = CurrentAccountApplication;

            products = [
                {name: 'product 1', number: 123},
                {name: 'product 2', number: 456}
            ];

            Flow = jasmine.createSpyObj('Flow', ['previous', 'next']);

            User = jasmine.createSpyObj('User', ['principal']);
            User.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: "1100",
                    systemPrincipalKey: "SBSA"
                }
            });

            CurrentAccountOffersService = jasmine.createSpyObj('CurrentAccountOffersService', ['accept']);

            offer = {
                productFamily: {name: 'ELITE'},
                products: products,
                applicationNumber: 'SATMSYST 20140820141510001',
                overdraft: {
                    selected: true,
                    amount: 5000,
                    limit: 6000,
                    interestRate: 22.5,
                    statementsConsent: {
                        selected: false
                    }
                }
            };
            selection = {
                product: {name: 'product 1', number: 123},
                branch: {code: '2508', name: 'BETHLEHEM'}
            };

            offerSpy = spyOn(currentAccountApplication, 'offer');
            offerSpy.and.returnValue(offer);
            productSelectionSpy = spyOn(currentAccountApplication, 'selection');
            productSelectionSpy.and.returnValue(selection);

            controller = $controller;

            initController();
        }));

        describe('should set all default values', function () {

            it('should set the offer in the scope from the view model', function () {
                expect(scope.product).toEqual(products[0]);
            });

            it('should set the preferred branch name in the scope from the view model', function () {
                expect(scope.preferredBranchName).toEqual('BETHLEHEM');
            });

            it('should set overdraft on scope', function () {
                expect(scope.overdraft.amount).toEqual(5000);
                expect(scope.overdraft.interestRate).toEqual(22.5);
            });

            it('should set system principal on scope', function () {
                expect(scope.principal.systemPrincipalId).toEqual("1100");
                expect(scope.principal.systemPrincipalKey).toEqual("SBSA");
            });
        });

        describe('overdraftSelected', function () {
            it('should be truthy when overdraft offer is accepted', function () {
                expect(scope.overdraftSelected()).toBeTruthy();
            });

            it('should be falsy when overdraft offer is not accepted', function () {
                scope.overdraft = {selected: false};

                expect(scope.overdraftSelected()).toBeFalsy();
            });
        });

        describe('hasDownloadedAgreement', function () {

            it('should be false by default', function () {
                expect(scope.hasDownloadedAgreement).toBeFalsy();
            });

            it('should be true once agreement has been downloaded', function () {
                scope.downloadAgreement();

                expect(scope.hasDownloadedAgreement).toBeTruthy();
            });
        });

        describe('canSubmit', function () {

            beforeEach(inject(function () {
                scope.overdraft = {selected: false};
            }));

            it('should be false if there is an error', function () {
                scope.error = 'stop, error time';

                expect(scope.canSubmit()).toBeFalsy();
            });

            it('should be false if the agreement is accepted but there is an error', function () {
                scope.agreed = true;
                scope.error = 'stop, error time';

                expect(scope.canSubmit()).toBeFalsy();
            });


            describe('with generateCostOfCredit feature turned on', function () {
                it('should be true if agreement is accepted and there are no errors', function () {
                    scope.agreed = true;
                    generateCostOfCreditFeature = true;

                    expect(scope.canSubmit()).toBeTruthy();
                });
            });

            describe('with generateCostOfCredit feature turned off', function () {
                beforeEach(function () {
                    generateCostOfCreditFeature = false;
                });

                it('should be false if agreement is accepted and overdraft is selected and agreement is not downloaded', function () {
                    scope.agreed = true;
                    scope.overdraft.selected = true;
                    scope.hasDownloadedAgreement = false;

                    expect(scope.canSubmit()).toBeFalsy();
                });

                it('should be false if agreement is not accepted and overdraft is selected and agreement is not downloaded',
                    function () {
                        scope.agreed = false;
                        scope.overdraft.selected = true;
                        scope.hasDownloadedAgreement = false;

                        expect(scope.canSubmit()).toBeFalsy();
                    });

                it('should be true if agreement is accepted and overdraft is selected and agreement is downloaded',
                    function () {
                        scope.agreed = true;
                        scope.overdraft.selected = true;
                        scope.hasDownloadedAgreement = true;

                        expect(scope.canSubmit()).toBeTruthy();
                    });
            });

        });

        describe('back', function () {
            it('should set previous on the flow', function () {
                scope.back();
                expect(Flow.previous).toHaveBeenCalled();
            });

            it('should set the location to offers', inject(function ($location) {
                scope.back();
                expect($location.path()).toEqual('/apply/current-account/offer');
            }));
        });

        describe('submit', function () {
            describe('success', function () {
                beforeEach(inject(function (mock) {
                    acceptResponse = {
                        timestamp: '2014-08-13T09:08:40.424+02:00',
                        accountNumber: 32569017000,
                        crossSell: {
                            applicationNumber: 'SATMSYST 20141024124610002',
                            offerDetails: [
                                {
                                    approved: true,
                                    productFamily: 'DEBIT CARD',
                                    productDetails: [
                                        {
                                            name: 'STD BANK MASTERCARD GOLD CHEQUE CARD',
                                            number: 1489
                                        },
                                        {
                                            name: 'STANDARD BANK VISA GOLD CHEQUE',
                                            number: 4295
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    noCrossSellResponse = {
                        timestamp: '2014-08-13T09:08:40.424+02:00',
                        accountNumber: 32569017000,
                        crossSell: {
                            applicationNumber: 'SATMSYST 20141024124610002',
                            offerDetails: []
                        }
                    };
                    CurrentAccountOffersService.accept.and.returnValue(mock.resolve(acceptResponse));
                }));

                it('should save the service response', function () {
                    scope.submit();
                    scope.$digest();

                    expect(currentAccountApplication.acceptOfferResponse()).toEqual(acceptResponse);
                });

                describe('with debitOrderSwitching feature turned on', function () {
                    beforeEach(function () {
                        debitOrderSwitchingFeature = true;
                    });

                    it('should redirect to the debit order switching page', inject(function ($location) {
                        scope.submit();
                        scope.$digest();

                        expect($location.path()).toEqual('/apply/current-account/debit-order-switching');
                    }));
                });

                describe('with debitOrderSwitching feature turned off', function () {
                    beforeEach(function () {
                        debitOrderSwitchingFeature = false;
                    });

                    it('should redirect to the cheque card page', inject(function ($location) {
                        scope.submit();
                        scope.$digest();

                        expect($location.path()).toEqual('/apply/current-account/accept/card');
                    }));

                    it('should redirect to success page when response has no cross sell', inject(function ($location) {
                        CurrentAccountOffersService.accept.and.returnValue(mock.resolve(noCrossSellResponse));
                        scope.submit();
                        scope.$digest();
                        expect($location.path()).toEqual('/apply/current-account/finish');
                    }));
                });

                it('should call the accept offer service with the application, product number and preferredBranch',
                    function () {
                        scope.overdraft.selected = false;
                        scope.submit();
                        scope.$digest();

                        expect(CurrentAccountOffersService.accept).toHaveBeenCalledWith('SATMSYST 20140820141510001', 123,
                            2508, undefined, {statementsConsentSelected: false});
                    });

                it('should submit overdraft when selected', function () {
                    scope.overdraft.selected = true;
                    scope.submit();
                    scope.$digest();

                    expect(CurrentAccountOffersService.accept).toHaveBeenCalledWith('SATMSYST 20140820141510001', 123, 2508,
                        5000, {statementsConsentSelected: false});
                });

                describe('overdraft selected', function () {
                    it('should submit overdraft', function () {
                        scope.overdraft.selected = true;
                        scope.submit();
                        scope.$digest();

                        expect(CurrentAccountOffersService.accept).toHaveBeenCalledWith('SATMSYST 20140820141510001', 123, 2508,
                            5000, {statementsConsentSelected: false});
                    });

                    it('it should set electronic statement consents properties', function () {
                        scope.overdraft.statementsConsent = {
                            selected: true, branch: {code: '234'}, accountNumber: '2345',
                            accountType: {name: 'current'}
                        };
                        scope.submit();
                        scope.$digest();

                        expect(CurrentAccountOffersService.accept).toHaveBeenCalledWith('SATMSYST 20140820141510001', 123, 2508,
                            5000, {
                                statementsConsentSelected: true, statementsConsentBranchCode: '234',
                                statementsConsentAccountNumber: '2345', statementsConsentAccountType: 'current'
                            });
                    });
                });
            });
        });

        describe('with private banking product', function () {
            beforeEach(inject(function () {
                offer = {
                    productFamily: {name: 'Private Banking'},
                    products: products,
                    applicationNumber: 'SATMSYST 20140820141510001',
                    overdraft: {
                        selected: true,
                        amount: 5000,
                        limit: 6000,
                        interestRate: 22.5
                    }
                };
                selection = {
                    selectedProductIndex: 0,
                    branch: undefined
                };

                offerSpy.and.returnValue(offer);
                productSelectionSpy.and.returnValue(selection);

                scope.isPrivateBankingProduct = true;
                scope.preferredBranchName = undefined;

                initController();
            }));

            it('should know when the offer is a private banking product', function () {
                expect(scope.isPrivateBankingProduct).toBeTruthy();
            });

            it('should not set the preferred branch name in the scope from the view model', function () {
                expect(scope.preferredBranchName).toBeUndefined();
            });
        });
    });
});
