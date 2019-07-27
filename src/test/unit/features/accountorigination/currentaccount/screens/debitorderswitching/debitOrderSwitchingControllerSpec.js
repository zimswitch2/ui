describe('DebitOrderSwitchingController', function () {
    /*global debitOrderSwitchingFeature:true */

    'use strict';

    beforeEach(function () {
        debitOrderSwitchingFeature = true;
        module('refresh.accountOrigination.currentAccount.screens.debitOrderSwitching');
    });


    describe('routes with debit order switching', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should only allow entry from accept offer page', function () {
            var expectedRoute = '/apply/current-account/accept';
            _.forEach(route.routes['/apply/current-account/debit-order-switching'].allowedFrom, function (allowedRoute) {
                expect(allowedRoute.path).toEqual(expectedRoute);
            });
        });
    });

    describe('path configurations', function () {
        var application, route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        beforeEach(function () {
            debitOrderSwitchingFeature = true;
            application = jasmine.createSpyObj('CurrentAccountApplication', ['isInProgress']);
        });

        it('should allow an in-progress current account application', function () {
            application.isInProgress.and.returnValue(true);

            _.forEach(route.routes['/apply/current-account/debit-order-switching'].allowedFrom, function (allowedRoute) {
                expect(allowedRoute.condition(application)).toBeTruthy();
            });
        });

        it('should not allow a current account application if it is not in progress', function () {
            application.isInProgress.and.returnValue(false);

            _.forEach(route.routes['/apply/current-account/debit-order-switching'].allowedFrom, function (allowedRoute) {
                expect(allowedRoute.condition(application)).toBeFalsy();
            });
        });
    });

    describe('routes', function () {

        beforeEach(function () {
            debitOrderSwitchingFeature = false;
        });

        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;

        }));

        it('should load the debit order switching controller', function () {
            expect(route.routes['/apply/current-account/debit-order-switching'].controller).toBe('DebitOrderSwitchingController');
        });

        it('should load the debit order switching template', function () {
            expect(route.routes['/apply/current-account/debit-order-switching'].templateUrl).toBe('features/accountorigination/currentaccount/screens/debitorderswitching/partials/debitOrderSwitching.html');
        });

        it('should not allow entry to debit order switching when debit order switching is off', function () {
            expect(route.routes['/apply/current-account/debit-order-switching'].allowedFrom).toEqual(['']);
        });

        it('should safely redirect any denied entry to account origination page', function () {
            expect(route.routes['/apply/current-account/debit-order-switching'].safeReturn).toEqual('/apply');
        });
    });

    describe('controller', function () {
        var scope, controller, location, CurrentAccountApplication, acceptedOfferResponseSpy, Flow, DebitOrderSwitchingService;
        var acceptCurrentAccountResponse, User, mock;
        var errorDebitOrderSwitchingResponse;
        var successfulDebitOrderSwitchingResponse;

        function initController() {
            controller('DebitOrderSwitchingController', {
                $scope: scope,
                Flow: Flow,
                DebitOrderSwitchingService: DebitOrderSwitchingService,
                User: User
            });


        }

        beforeEach(inject(function ($controller, $rootScope, $location, _CurrentAccountApplication_, _mock_) {
            errorDebitOrderSwitchingResponse = {
                status: 500
            };
            successfulDebitOrderSwitchingResponse = {
                status: 200
            };
            acceptCurrentAccountResponse = {
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

            scope = $rootScope.$new();
            mock = _mock_;
            controller = $controller;

            location = $location;
            location.path('/apply/current-account/debit-order-switching');

            CurrentAccountApplication = _CurrentAccountApplication_;

            User = jasmine.createSpyObj('User', ['principal']);
            User.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: "1100",
                    systemPrincipalKey: "SBSA"
                }
            });
            Flow = jasmine.createSpyObj('Flow', ['previous', 'next']);
            acceptedOfferResponseSpy = spyOn(CurrentAccountApplication, ['acceptOfferResponse']);
            DebitOrderSwitchingService = jasmine.createSpyObj('DebitOrderSwitchingService', ['acceptDebitOrderSwitching']);

            initController();
        }));

        describe('when user chooses to switch debit orders', function () {

            describe('and service response is successful', function () {
                it('should accept debit order switching', function () {
                    acceptedOfferResponseSpy.and.returnValue(acceptCurrentAccountResponse);
                    DebitOrderSwitchingService.acceptDebitOrderSwitching.and.returnValue(mock.resolve(successfulDebitOrderSwitchingResponse));
                    scope.switchDebitOrder();
                    expect(DebitOrderSwitchingService.acceptDebitOrderSwitching).toHaveBeenCalled();
                });

                it('should navigate on success', function () {
                    acceptedOfferResponseSpy.and.returnValue(acceptCurrentAccountResponse);
                    DebitOrderSwitchingService.acceptDebitOrderSwitching.and.returnValue(mock.resolve(successfulDebitOrderSwitchingResponse));
                    scope.switchDebitOrder();
                    scope.$digest();
                    expect(location.path()).not.toBe('/apply/current-account/debit-order-switching');
                });
            });

            it('should navigate on error', function () {
                acceptedOfferResponseSpy.and.returnValue(acceptCurrentAccountResponse);
                DebitOrderSwitchingService.acceptDebitOrderSwitching.and.returnValue(mock.reject(errorDebitOrderSwitchingResponse));
                scope.switchDebitOrder();
                scope.$digest();
                expect(location.path()).toBe('/apply/current-account/accept/card');
            });
        });

        describe('when user chooses not to switch debit orders', function () {
            it('should go to cross sell when customer has debit cards available', function () {
                acceptedOfferResponseSpy.and.returnValue(acceptCurrentAccountResponse);
                scope.doNotSwitchDebitOrder();
                expect(location.path()).toBe('/apply/current-account/accept/card');
            });

            describe('and there is no debit card to select', function () {
                var noCrossSellResponse;
                beforeEach(function () {
                    noCrossSellResponse = _.clone(acceptCurrentAccountResponse);
                    noCrossSellResponse.crossSell.offerDetails = [];
                    acceptedOfferResponseSpy.and.returnValue(noCrossSellResponse);
                });

                it('should go to finish when customer has no debit cards to select', function () {
                    scope.doNotSwitchDebitOrder();
                    expect(location.path()).toBe('/apply/current-account/finish');
                });

                it('should go to next step in the flow', function () {
                    scope.doNotSwitchDebitOrder();
                    expect(Flow.next).toHaveBeenCalled();
                });
            });
        });


    });

});