describe('Cheque card', function () {
    'use strict';
    /*global debitOrderSwitchingFeature:true */
    beforeEach(module('refresh.accountOrigination.currentAccount.screens.chequeCard'));

    afterEach(function () {
        debitOrderSwitchingFeature = true;
    });

    describe('debit order switching enabled routes', function () {
        var route;

        beforeEach(function () {
            debitOrderSwitchingFeature = true;
        });

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should only allow entry from debit order switching page', function () {
            _.forEach(route.routes['/apply/current-account/accept/card'].allowedFrom, function (route) {
                expect(route['path']).toEqual('/apply/current-account/debit-order-switching');
            });
        });
    });

    describe('routes', function () {
        var route;
        beforeEach(function () {
            debitOrderSwitchingFeature = false;
        });

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when an offer is received', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account/accept/card'].controller).toEqual('ChequeCardController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account/accept/card'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/chequecard/partials/chequeCard.html');
            });

            it('should only allow entry from confirm page', function () {
                _.forEach(route.routes['/apply/current-account/accept/card'].allowedFrom, function (route) {
                    expect(route['path']).toEqual('/apply/current-account/accept');
                });
            });


            it('should safely redirect any denied entry to account origination page', function () {
                expect(route.routes['/apply/current-account/accept/card'].safeReturn).toEqual('/apply');
            });
        });

        describe('path configuration', function () {
            var application;

            beforeEach(function () {
                application = jasmine.createSpyObj('CurrentAccountApplication', ['isInProgress']);
            });

            it('should allow new current account application', function () {
                application.isInProgress.and.returnValue(true);

                _.forEach(route.routes['/apply/current-account/accept/card'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeTruthy();
                });
            });

            it('should not allow a current account application if it is not in progress', function () {
                application.isInProgress.and.returnValue(false);

                _.forEach(route.routes['/apply/current-account/accept/card'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeFalsy();
                });
            });

        });
    });

    describe('ChequeCardController', function () {

        var scope, controller, controllerParams, AcceptCardCrossSellService, Flow, currentAccountApplication;

        beforeEach(inject(function ($controller, $rootScope, CurrentAccountApplication) {
            scope = $rootScope.$new();
            controller = $controller;
            currentAccountApplication = CurrentAccountApplication;

            AcceptCardCrossSellService = jasmine.createSpyObj('AcceptCardCrossSellService', ['accept']);
            Flow = jasmine.createSpyObj('Flow', ['next']);

            controllerParams = {
                $scope: scope,
                AcceptCardCrossSellService: AcceptCardCrossSellService,
                Flow: Flow
            };
        }));

        describe('more than one cheque card offered', function () {
            beforeEach(function () {
                var selection = {
                    branch: {code: '2508'}
                };
                var offer = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    productFamily: {
                        id: 'elite'
                    }
                };
                var acceptResponse = {
                    crossSell: {
                        offerDetails: [
                            {
                                productDetails: [
                                    {
                                        number: 1489
                                    },
                                    {
                                        number: 4295
                                    }
                                ],
                                productImage: 'assets/images/Elite_MasterCard_Visa'
                            }
                        ]
                    }
                };

                spyOn(currentAccountApplication, 'offer').and.returnValue(offer);
                spyOn(currentAccountApplication, 'selection').and.returnValue(selection);
                spyOn(currentAccountApplication, 'acceptOfferResponse').and.returnValue(acceptResponse);

                controller('ChequeCardController', controllerParams);
            });

            it('should set cheque card options on the scope', function () {
                expect(scope.chequeCardOptions).toEqual([
                    {
                        number: 1489
                    },
                    {
                        number: 4295
                    }
                ]);
            });

            it('should set cheque card image on the scope', function () {
                expect(scope.chequeCardImage).toEqual('assets/images/Elite_MasterCard_Visa');
            });

            it('should set moreThanOne to true', function () {
                expect(scope.moreThanOne).toBeTruthy();
            });

            it('should not set default card selection', function () {
                expect(scope.selection.chequeCard).toBeUndefined();
            });

            it('should set the product family offered', function () {
                expect(scope.productFamily).toEqual('elite');
            });
        });

        describe('only one cheque card offered', function () {
            beforeEach(function () {
                var selection = {
                    branch: {code: '2508'}
                };
                var offer = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    productFamily: {
                        id: 'elite'
                    }
                };
                var acceptResponse = {
                    crossSell: {
                        offerDetails: [
                            {
                                productDetails: [
                                    {
                                        number: 4295
                                    }
                                ]
                            }
                        ]
                    }
                };

                spyOn(currentAccountApplication, 'offer').and.returnValue(offer);
                spyOn(currentAccountApplication, 'selection').and.returnValue(selection);
                spyOn(currentAccountApplication, 'acceptOfferResponse').and.returnValue(acceptResponse);

                controller('ChequeCardController', controllerParams);
            });

            it('should set cheque card option on the scope', function () {
                expect(scope.chequeCardOptions).toEqual([
                    {
                        number: 4295
                    }
                ]);
            });

            it('should set moreThanOne to false', function () {
                expect(scope.moreThanOne).toBeFalsy();
            });

            it('should set default card selection', function () {
                expect(scope.selection.chequeCard).toEqual({
                        number: 4295
                    }
                );
            });
        });

        describe('next', function () {
            beforeEach(function () {
                var selection = {

                    branch: {code: '2508'}

                };
                var offer = {
                    applicationNumber: 'SATMSYST 20140820141510001',
                    productFamily: {
                        id: 'elite'
                    }
                };
                var acceptResponse = {
                    crossSell: {
                        offerDetails: [
                            {
                                productDetails: [
                                    {
                                        number: 4295
                                    }
                                ]
                            }
                        ]
                    }
                };

                spyOn(currentAccountApplication, 'offer').and.returnValue(offer);
                spyOn(currentAccountApplication, 'acceptOfferResponse').and.returnValue(acceptResponse);
                currentAccountApplication.select(selection);

                controller('ChequeCardController', controllerParams);
            });

            describe('on success', function () {
                beforeEach(inject(function (mock) {
                    AcceptCardCrossSellService.accept.and.returnValue(mock.resolve({
                        timestamp: '2014-08-13T09:08:40.424+02:00',
                        accountNumber: 0
                    }));
                }));

                it('should call the service with the selected cheque card', function () {
                    scope.next();
                    expect(AcceptCardCrossSellService.accept).toHaveBeenCalledWith('SATMSYST 20140820141510001', 4295, 2508);
                });

                it('should set next on the flow', function () {
                    scope.next();
                    scope.$digest();

                    expect(Flow.next).toHaveBeenCalled();
                });

                it('should redirect to the finish page', inject(function ($location) {
                    scope.next();
                    scope.$digest();

                    expect($location.path()).toEqual('/apply/current-account/finish');
                }));

                it('should set selected cheque card on the view model', function () {
                    scope.next();
                    scope.$digest();

                    expect(currentAccountApplication.selection()).toEqual(jasmine.objectContaining({
                        branch: {code: '2508'},
                        chequeCard: {number: 4295}
                    }));
                });
            });

            describe('on failure', function () {
                beforeEach(inject(function (mock) {
                    AcceptCardCrossSellService.accept.and.returnValue(mock.reject());
                }));

                it('should navigate to application results', inject(function ($location) {
                    scope.next();
                    scope.$digest();

                    expect($location.path()).toEqual('/apply/current-account/finish');
                }));

                it('should not set selected cheque card', function () {
                    scope.next();
                    scope.$digest();

                    expect(currentAccountApplication.selection()).toEqual(jasmine.objectContaining({
                        branch: {code: '2508'}
                    }));
                });

                it('should set error flag for cheque card', function () {
                    scope.next();
                    scope.$digest();

                    expect(currentAccountApplication.chequeCardError()).toBeTruthy();
                });
            });
        });
    });
});