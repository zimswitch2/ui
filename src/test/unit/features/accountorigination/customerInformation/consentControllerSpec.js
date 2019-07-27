describe('Consent', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.consent'));

    var scope, location, routeParams, controller, CustomerInformationData, mock,
        NotificationService, getInvalidSectionsSpy;

    describe('routes', function () {
        var route, location;

        beforeEach(inject(function ($route, $rootScope, $controller, $location) {
            route = $route;
            location = $location;
            route.current = { params: {product: 'current-account'} };
        }));

        it('should get the correct consent template', function () {
            expect(route.routes['/apply/:product/submit'].templateUrl).toBe('features/accountorigination/customerInformation/partials/consent.html');
        });

        it('should get the correct consent controller', function () {
            expect(route.routes['/apply/:product/submit'].controller).toBe('ConsentController');
        });

        describe('on resolving', function () {
            var CustomerInformationData;

            beforeEach(inject(function (_CustomerInformationData_) {
                CustomerInformationData = _CustomerInformationData_;
                spyOn(CustomerInformationData, ['stash']);
            }));

            describe('when the customer has no marketing consents', function () {
                it('should redirect to edit consents page', function () {
                    route.routes['/apply/:product/submit'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(CustomerInformationData.stash).toHaveBeenCalled();
                    expect(location.path()).toEqual('/apply/current-account/submit/edit');
                });
            });

            describe('when the customer has marketing consents', function () {
                it('should not redirect to edit consent page', function () {
                    spyOn(CustomerInformationData.current(), ['hasMarketingConsent']).and.returnValue(true);

                    route.routes['/apply/:product/submit'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(CustomerInformationData.stash).not.toHaveBeenCalled();
                    expect(location.path()).not.toEqual('/apply/current-account/submit/edit');
                });
            });
        });
    });

    describe('controller - current account', function () {
        function initController() {
            controller('ConsentController', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                NotificationService: NotificationService
            });
        }

        beforeEach(inject(function ($rootScope, $controller, $location, $routeParams, _mock_, _CustomerInformationData_,
                                    _CustomerInfoValidation_, AccountOriginationProvider) {
            scope = $rootScope.$new();
            location = $location;
            routeParams = $routeParams;
            controller = $controller;
            mock = _mock_;

            routeParams.product = 'current-account';
            CustomerInformationData = _CustomerInformationData_;

            NotificationService = jasmine.createSpyObj('NotificationService', ['displayGenericServiceError']);

            var offer = {
                applicationNumber: 'SATMSYST 20140820141510001',
                timestamp: '20140820141510001',
                productFamily: 'ELITE',
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

            var offerService = AccountOriginationProvider.for('current-account').service;
            spyOn(offerService, ['getOffers']).and.returnValue(mock.resolve(offer));

            getInvalidSectionsSpy = spyOn(_CustomerInfoValidation_, ['getInvalidSections']);

            CustomerInformationData.initialize({customerSurname: 'testUser'});
            initController();

            scope.$digest();
        }));

        describe('on initialize', function () {
            it('should expose the current customer to the scope', function () {
                expect(scope.customerInformationData).toEqual(jasmine.objectContaining({customerSurname: 'testUser'}));
            });

            it('should expose $routeParams product to the scope', function () {
                expect(scope.product).toEqual('current-account');
            });

            it('should set getOfferButtonText on the scope', function () {
                expect(scope.getOfferButtonText).toEqual('Get offer');
            });
        });

        describe('edit()', function () {
            it('should stash current customer', function () {
                spyOn(CustomerInformationData, ['stash']);
                scope.edit();
                expect(CustomerInformationData.stash).toHaveBeenCalled();
            });

            it('should redirect to edit consent page', function () {
                scope.edit();
                expect(location.path()).toEqual('/apply/' + routeParams.product + '/submit/edit');
            });
        });

        describe('toggleValidationModal()', function () {
            it('should toggle the value of showValidationModal', function () {
                scope.showValidationModal = false;
                scope.toggleValidationModal(true);
                expect(scope.showValidationModal).toBeTruthy();
            });
        });

        describe('validationModalYes()', function () {
            var invalidRoute = 'employment';

            beforeEach(function(){
                getInvalidSectionsSpy.and.returnValue([{name:'employment', route: invalidRoute, validationMessage: 'error'}]);
                scope.showValidationModal = true;
                scope.submit();
            });

            it('should set the value of showValidationModal to false', function () {
                scope.validationModalYes();
                expect(scope.showValidationModal).toBeFalsy();
            });

            it('should navigate to the customer information section that is invalid', function () {
                scope.validationModalYes();
                expect(location.path()).toEqual('/apply/' + routeParams.product + '/' + invalidRoute + '/edit');
            });
        });

        describe('submit()', function () {
            var provider;

            beforeEach(inject(function (AccountOriginationProvider) {
                scope.customerInformationData.incomeExpenseItems = [
                    {
                        itemTypeCode: '01',
                        itemExpenditureIndicator: 'I',
                        itemAmount: 60000.0
                    },
                    {
                        itemTypeCode: '17',
                        itemExpenditureIndicator: 'E',
                        itemAmount: 60000.0
                    }
                ];

                scope.customerInformationData.hasCurrentResidentialAddress = function () {
                    return true;
                };
                scope.customerInformationData.hasEmploymentDetails = function () {
                    return true;
                };

                provider = AccountOriginationProvider.for('current-account');
            }));

            describe('successful offer', function () {
                var Flow;

                beforeEach(inject(function (_Flow_) {
                    Flow = _Flow_;
                    spyOn(Flow, ['next']);
                }));

                it('should change location to offers page', function () {
                    scope.submit();
                    scope.$digest();
                    expect(location.path()).toEqual('/apply/current-account/offer');
                });

                it('should go to flow next page', function () {
                    scope.submit();
                    scope.$digest();
                    expect(Flow.next).toHaveBeenCalled();
                });
            });

            describe('unsupported product offer', function () {
                var unsupportedOffer = {reason: 'UNSUPPORTED'};

                it('should redirect to the unsupported offer page', function () {
                    provider.service.getOffers.and.returnValue(mock.reject(unsupportedOffer));
                    scope.submit();
                    scope.$digest();

                    expect(location.path()).toEqual('/apply/current-account/unsupported');
                });
            });

            describe('offer declined', function () {
                var declinedOffer = {reason: 'DECLINED'};

                it('should redirect to the declined offer page', function () {
                    provider.service.getOffers.and.returnValue(mock.reject(declinedOffer));
                    scope.submit();
                    scope.$digest();

                    expect(location.path()).toEqual('/apply/current-account/declined');
                });
            });

            describe('service error', function () {
                it('should call the notification service', function () {
                    var serviceError = {code: 500};
                    provider.service.getOffers.and.returnValue(mock.reject(serviceError));
                    scope.submit();
                    scope.$digest();

                    expect(NotificationService.displayGenericServiceError).toHaveBeenCalledWith(serviceError);
                });
            });
        });
    });

    using(['pure-save', 'market-link', 'tax-free-call-account'], function (product) {
        describe('controller - ' + product, function () {
            function initController() {
                controller('ConsentController', {
                    $scope: scope,
                    $location: location,
                    $routeParams: routeParams,
                    NotificationService: NotificationService
                });
                scope.$digest();
            }

            beforeEach(inject(function ($rootScope, $controller, $location, $routeParams, _mock_,
                                        _CustomerInformationData_, _CustomerInfoValidation_,
                                        AccountOriginationProvider) {
                scope = $rootScope.$new();
                location = $location;
                routeParams = $routeParams;
                controller = $controller;
                mock = _mock_;

                routeParams.product = product;
                CustomerInformationData = _CustomerInformationData_;

                var service = AccountOriginationProvider.for(product).service;
                spyOn(service, 'getOffers').and.returnValue(mock.resolve({offerId: '1234567890'}));

                NotificationService = jasmine.createSpyObj('notificationService', ['displayGenericServiceError']);

                getInvalidSectionsSpy = spyOn(_CustomerInfoValidation_, ['getInvalidSections']);

                CustomerInformationData.initialize({customerSurname: 'testUser'});

                initController();

                scope.$digest();
            }));

            describe('submit()', function () {

                beforeEach(function () {
                    scope.customerInformationData.incomeExpenseItems = [
                        {
                            itemTypeCode: '01',
                            itemExpenditureIndicator: 'I',
                            itemAmount: 60000.0
                        },
                        {
                            itemTypeCode: '17',
                            itemExpenditureIndicator: 'E',
                            itemAmount: 60000.0
                        }
                    ];

                    scope.customerInformationData.hasCurrentResidentialAddress = function () {
                        return true;
                    };
                    scope.customerInformationData.hasEmploymentDetails = function () {
                        return true;
                    };
                });

                describe('successful offer', function () {
                    var Flow;

                    beforeEach(inject(function (_Flow_) {
                        Flow = _Flow_;
                        spyOn(Flow, ['next']);

                    }));

                    it('should go to flow next page', function () {
                        scope.submit();
                        scope.$digest();
                        expect(Flow.next).toHaveBeenCalled();
                    });

                    it('should change location to the path from the account offer service transfer page', function () {
                        scope.submit();
                        scope.$digest();
                        expect(location.path()).toEqual('/apply/' + product + '/transfer');
                    });
                });
            });
        });
    });
});