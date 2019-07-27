describe('Available Products', function () {

    beforeEach(module('refresh.accountOrigination.common.screens.availableProducts'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when selecting Apply for Account tab', function () {
            it('should use the correct template', function () {
                expect(route.routes['/apply'].templateUrl).toEqual('features/accountorigination/common/screens/availableproducts/partials/availableProducts.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply'].controller).toEqual('AvailableProductsController');
            });
        });
    });

    describe('AvailableProductsController', function () {

        var controller, scope, mock, RcpApplication, ApplicationLoader, QuotationsService, NotificationService, CurrentAccountOffersService, CurrentAccountApplication, Flow, Card;

        function invokeController() {
            controller('AvailableProductsController', {
                $scope: scope,
                ApplicationLoader: ApplicationLoader,
                QuotationsService: QuotationsService,
                NotificationService: NotificationService,
                CurrentAccountOffersService: CurrentAccountOffersService,
                Card: Card
            });

            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, $q, _RcpApplication_, _CurrentAccountApplication_,
                                    _mock_, _Flow_, _Card_) {
            scope = $rootScope.$new();
            controller = $controller;
            RcpApplication = _RcpApplication_;
            CurrentAccountApplication = _CurrentAccountApplication_;
            Flow = _Flow_;
            Card = _Card_;
            mock = _mock_;

            ApplicationLoader = jasmine.createSpyObj('ApplicationLoader', ['loadAll']);
            ApplicationLoader.loadAll.and.returnValue($q.defer().promise);

            QuotationsService = jasmine.createSpyObj('QuotationsService', ['getRCPQuotationDetails']);
            CurrentAccountOffersService = jasmine.createSpyObj('CurrentAccountOffersService', ['getQuotationDetails']);

            NotificationService = jasmine.createSpyObj('NotificationService', ['displayGenericServiceError']);

            invokeController();
        }));

        describe('current account', function () {

            describe('without Current Account', function () {
                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'NEW'
                        },
                        current: {
                            status: 'NEW'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));
                    invokeController();
                });

                it('currentAccount should be undefined', function () {
                    expect(scope.currentAccount).toBeUndefined();
                });

                it('currentAccountTitle should be Current account', function(){
                    expect(scope.currentAccountTitle).toBe('Current account');
                });
            });

            describe('with Current Account', function () {
                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'NEW'
                        },
                        current: {
                            status: 'EXISTING',
                            reference: '2245-34-567',
                            productName: 'ELITE CURRENT ACCOUNT'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));
                    invokeController();

                });

                it('should be defined', function () {
                    expect(scope.applications.current.reference).toEqual('2245-34-567');
                });

                it('currentAccountTitle should be Current account', function(){
                    expect(scope.currentAccountTitle).toBe('Elite');
                });
            });

            describe('With a pending Current Account application', function () {
                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'PENDING',
                            reference: '123456789'
                        },
                        current: {
                            status: 'NEW',
                            reference: 'SATMSYST 20140820141510001'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));

                    spyOn(RcpApplication, 'continue');

                    invokeController();
                });

                describe('continueCurrentAccount', function () {
                    beforeEach(function () {
                        spyOn(CurrentAccountApplication, 'continue');
                    });
                    var resolvedOffer = {
                        applicationNumber: 'SATMSYST 20140820141510001',
                        offerDetails: {
                            approved: true,
                            productFamily: "STAFF ACHIEVER",
                            overdraft: {
                                limit: 0,
                                interestRate: 22.5
                            }
                        }
                    };

                    it('currentAccountTitle should be Current account', function(){
                        expect(scope.currentAccountTitle).toBe('Current account');
                    });

                    describe('successfull response', function () {
                        beforeEach(function () {
                            CurrentAccountOffersService.getQuotationDetails.and.returnValue(mock.resolve(resolvedOffer));
                            scope.continueCurrentAccount();
                            scope.$digest();
                        });

                        it('should invoke the CurrentAccountOffersService service with the given application number', function () {
                            expect(CurrentAccountOffersService.getQuotationDetails).toHaveBeenCalledWith('SATMSYST 20140820141510001');
                        });

                        it('should continue the Current Account application with the offer that was returned', function () {
                            expect(CurrentAccountApplication.continue).toHaveBeenCalledWith({
                                applicationNumber: 'SATMSYST 20140820141510001',
                                offer: resolvedOffer
                            });
                        });

                        it('should navigate to the current account pre-screen page', inject(function ($location) {
                            expect($location.path()).toEqual('/apply/current-account/pre-screen');
                        }));

                        it('should create the Flow', function () {
                            expect(Flow.steps().map(function (step) {
                                return step.name;
                            })).toEqual(['Details', 'Offer', 'Confirm', 'Finish']);
                        });


                        it('should continue to the next step of flow', function () {
                            expect(Flow.currentStep().name).toEqual('Offer');
                        });
                    });
                });
            });


        });

        describe('RCP account', function () {

            describe('with RCP account', function () {

                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'EXISTING',
                            reference: '4245-34-567'
                        },
                        current: {
                            status: 'NEW'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));
                    invokeController();
                });

                it('rcpAccount should exist', function () {
                    expect(scope.applications.rcp.reference).toEqual('4245-34-567');
                });

            });

            describe('without RCP account', function () {

                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'NEW'
                        },
                        current: {
                            status: 'NEW'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));
                    invokeController();

                });
                it('rcpAccount should be undefined', function () {
                    expect(scope.rcpAccount).toBeUndefined();
                });

                it('should be a new application', function () {
                    expect(RcpApplication.hasRcpAccount()).toBeFalsy();
                });
            });

            describe('With a pending RCP application', function () {
                beforeEach(function () {
                    var response = {
                        rcp: {
                            status: 'PENDING',
                            reference: '123456789'
                        },
                        current: {
                            status: 'NEW'
                        }
                    };
                    ApplicationLoader.loadAll.and.returnValue(mock.resolve(response));

                    spyOn(RcpApplication, 'continue');

                    invokeController();
                });

                describe('rcpViewOffer', function () {
                    var resolvedOffer = {
                        applicationNumber: 'SATMSYST 20140820141510001',
                        offerDetails: {
                            approved: true,
                            maximumLoanAmount: 100000,
                            interestRate: 22.5,
                            repaymentFactor: 20.0,
                            productName: 'RCP',
                            productNumber: 8
                        }
                    };

                    describe('happy path', function () {
                        beforeEach(function () {
                            QuotationsService.getRCPQuotationDetails.and.returnValue(mock.resolve(resolvedOffer));
                            scope.rcpViewOffer();
                            scope.$digest();
                        });

                        it('should invoke the quotation service with the given application number', function () {
                            expect(QuotationsService.getRCPQuotationDetails).toHaveBeenCalledWith('123456789');
                        });

                        it('should continue the rcp application with the offer that was returned', function () {
                            expect(RcpApplication.continue).toHaveBeenCalledWith(resolvedOffer);
                        });

                        it('should navigate to the rcp offer page', inject(function ($location) {
                            expect($location.url()).toEqual('/apply/rcp/offer');
                        }));
                    });

                    describe('service error', function () {
                        var error = {
                            message: 'FAIL!'
                        };

                        beforeEach(function () {
                            QuotationsService.getRCPQuotationDetails.and.returnValue(mock.reject(error));
                            scope.rcpViewOffer();
                            scope.$digest();
                        });
                    });

                });
            });

            describe('service error', function () {
                var error = {message: "ERROR"};

                beforeEach(function () {
                    ApplicationLoader.loadAll.and.returnValue(mock.reject(error));
                    invokeController();
                });

                it('Should invoke the notification service', function () {
                    expect(NotificationService.displayGenericServiceError).toHaveBeenCalledWith(error);

                });
            });
        });

        describe('Savings and Investment Options', function() {
            it('Should show the Savings and Investment Options product tile when the user has a card number', function () {
                spyOn(Card, 'current').and.returnValue({ number: '1234567890' });
                invokeController();
                expect(scope.showSavingsAndInvestmentOptions).toBeTruthy();
            });

            it('Should NOT show the Savings and Investment Options product tile when the user has no card number', function () {
                spyOn(Card, 'current').and.returnValue({});
                invokeController();
                expect(scope.showSavingsAndInvestmentOptions).toBeFalsy();
            });
        });
    });
});