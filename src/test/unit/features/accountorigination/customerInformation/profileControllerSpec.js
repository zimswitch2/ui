describe('Controller', function () {
    'use strict';

    describe('with new capture customer information is toggled off', function () {
        var route, location;
        beforeEach(function () {
            newCaptureCustomerInformationFeature = false;
            module('refresh.accountOrigination.customerInformation.profile');//, 'refresh.accountOrigination.domain.customer');
        });

        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        describe('config', function () {
            it('should load the old profile template', function () {
                expect(route.routes['/apply/:product/profile'].templateUrl).toBe('features/accountorigination/customerInformation/partials/profile.html');
            });

            it('should load the profile controller', function () {
                expect(route.routes['/apply/:product/profile'].controller).toBe('ProfileController');
            });
            describe('on resolving', function () {
                var CustomerInformationData;

                beforeEach(inject(function (_CustomerInformationData_) {
                    route.current = {params: {product: 'current-account'}};
                    CustomerInformationData = _CustomerInformationData_;
                }));

                describe('with customer management v4 toggled off', function () {
                    it('should not redirect to edit basic information page', function () {
                        customerManagementV4Feature = false;
                        CustomerInformationData.initialize({});

                        route.routes['/apply/:product/profile'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(location.path()).not.toEqual('/apply/current-account/profile/edit');
                    });
                });

                describe('with customer management v4 toggled on', function () {
                    beforeEach(function () {
                        customerManagementV4Feature = true;
                    });

                    it('should not redirect  to edit basic info page if customer does not need additional basic info', function () {
                        CustomerInformationData.initialize({
                            citizenshipCountryCode: 'ZA',
                            nationalityCountryCode: 'ZA',
                            residenceCountryCode: 'ZA',
                            birthCountryCode: 'ZA'
                        });
                        route.routes['/apply/:product/profile'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(location.path()).not.toEqual('/apply/current-account/profile/edit');
                    });

                    it('should redirect to edit basic info page if customer needs additional basic info', function () {
                        CustomerInformationData.initialize({});

                        route.routes['/apply/:product/profile'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(location.path()).toEqual('/apply/current-account/profile/edit');
                    });

                    it('should not redirect to edit basic info page if customer needs additional basic info' +
                        ' but newCaptureCustomer information is on ', function () {
                        newCaptureCustomerInformationFeature = true;
                        CustomerInformationData.initialize({});
                    
                        route.routes['/apply/:product/profile'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(location.path()).not.toEqual('/apply/current-account/profile/edit');
                    });
                });

                it('should only allow from specific locations', function () {
                    var expectedPaths = ['/apply/current-account/pre-screen',
                        '/apply/:product/profile/new', '/apply/:product/profile/edit',
                        '/apply/:product/contact/edit', '/apply/:product/address',
                        '/apply/:product/address/edit', '/apply/:product/employment',
                        '/apply/:product/employment/edit', '/apply/:product/employment/add',
                        '/apply/:product/income', '/apply/:product/income/edit',
                        '/apply/:product/submit', '/apply/:product/submit/edit',
                        '/otp/verify', '/apply', '/apply/savings-and-investments',
                        '/apply/pure-save', '/apply/market-link', '/apply/tax-free-call-account',
                        '/apply/rcp/pre-screen', '/secure-message'];

                    _.forEach(route.routes['/apply/:product/profile'].allowedFrom, function (route) {
                        expect(route.condition()).toEqual(true);
                        expect(_.includes(expectedPaths, route.path)).toBeTruthy();
                    });
                });

                it('should specify the safe return path', function () {
                    expect(route.routes['/apply/:product/profile'].safeReturn).toEqual('/apply');
                });
            });

            describe('ProfileController', function () {
                var scope, location, controller, CustomerInformationData;
                var initialiseController = function () {
                    controller('ProfileController', {
                        $scope: scope,
                        $location: location,
                        $routeParams: {product: 'current-account'},
                        CustomerInformationData: CustomerInformationData
                    });
                    scope.$digest();
                };

                beforeEach(inject(function ($rootScope, $location, $controller, _CustomerInformationData_) {
                    scope = $rootScope.$new();
                    CustomerInformationData = _CustomerInformationData_;
                    CustomerInformationData.initialize({
                        citizenshipCountryCode: 'ZA',
                        residenceCountryCode: 'ZA',
                        nationalityCountryCode: 'ZA',
                        birthCountryCode: 'ZA',
                        identityDocuments: [{
                            identityTypeCode: '01',
                            identityNumber: '5309015231095',
                            countryCode: 'ZA'
                        }]
                    });
                    location = $location;

                    controller = $controller;

                    initialiseController();
                }));

                describe('on initialize', function () {
                    it('should fetch the current customer', function () {
                        expect(scope.customerInformationData).toBeTruthy();
                    });

                    it('should fetch the product info', function () {
                        expect(scope.product).toEqual('current-account');
                    });
                });

                describe('on edit', function () {
                    it('should navigate to edit contact if the edit contact button is pushed', function () {
                        scope.edit('contact');
                        expect(location.path()).toBe('/apply/current-account/contact/edit');
                    });
                });

                describe('on next', function () {
                    it('should navigate to the address page on next', function () {
                        scope.next();
                        expect(location.path()).toBe('/apply/current-account/address');
                    });
                });
            });
        });
    });
    describe('with new capture customer information is toggled on', function () {
        var route, location, CustomerInformationData;
        beforeEach(function () {
            newCaptureCustomerInformationFeature = true;
            module('refresh.accountOrigination.customerInformation.profile', 'refresh.accountOrigination.domain.customer');
        });

        beforeEach(inject(function ($route, $location, _CustomerInformationData_) {
            route = $route;
            location = $location;
            route.current = {params: {product: 'current-account'}};
            CustomerInformationData = _CustomerInformationData_;
            customerManagementV4Feature = true;
            CustomerInformationData.initialize({
                citizenshipCountryCode: 'ZA',
                residenceCountryCode: 'ZA',
                nationalityCountryCode: '',
                birthCountryCode: 'ZA',
                identityDocuments: [{
                    identityTypeCode: '01',
                    identityNumber: '5309015231095',
                    countryCode: 'ZA'
                }]
            });
        }));

        describe('config', function () {
            it('should load the new profile template', function () {
                expect(route.routes['/apply/:product/profile'].templateUrl).toBe('features/accountorigination/customerInformation/partials/newProfile.html');
            });

            it('should load the customer information controller', function () {
                expect(route.routes['/apply/:product/profile'].controller).toBe('CustomerInformationController');
            });

            it('should only allow from specific locations', function () {
                var expectedPaths = ['/apply/current-account/pre-screen',
                    '/apply/:product/profile/new', '/apply/:product/profile/edit',
                    '/apply/:product/contact/edit', '/apply/:product/address',
                    '/apply/:product/address/edit', '/apply/:product/employment',
                    '/apply/:product/employment/edit', '/apply/:product/employment/add',
                    '/apply/:product/income', '/apply/:product/income/edit',
                    '/apply/:product/submit', '/apply/:product/submit/edit',
                    '/otp/verify', '/apply', '/apply/savings-and-investments',
                    '/apply/pure-save', '/apply/market-link', '/apply/tax-free-call-account',
                    '/apply/rcp/pre-screen', '/secure-message'];

                _.forEach(route.routes['/apply/:product/profile'].allowedFrom, function (route) {
                    expect(_.includes(expectedPaths, route.path)).toBeTruthy();
                });
            });

            it('should specify the safe return path', function () {
                expect(route.routes['/apply/:product/profile'].safeReturn).toEqual('/apply');
            });

            describe('on resolving', function () {

                it('should not redirect to edit basic info page if customer needs additional basic info', function () {
                    route.routes['/apply/:product/profile'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(location.path()).not.toEqual('/apply/current-account/profile/edit');
                });
            });
        });

        describe('CustomerInformationController', function () {
            var scope, location, controller, window, mock, customerInformationData, cancelConfirmationService,
                accountOriginationProvider, customerInformationErrors, customerService, createCustomerSpy, User;
            var initialiseController = function (product) {
                controller('CustomerInformationController', {
                    $scope: scope,
                    $location: location,
                    $routeParams: {product: product},
                    CustomerInformationData: customerInformationData,
                    CancelConfirmationService: cancelConfirmationService,
                    AccountOriginationProvider: accountOriginationProvider,
                    CustomerInformationErrors: customerInformationErrors,
                    CustomerService: customerService,
                    User: User
                });
            };

            beforeEach(inject(function ($controller, $rootScope, $window, $location, _mock_, CustomerInformationData,
                                        AccountOriginationProvider, CancelConfirmationService, CustomerInformationErrors, CustomerService, _User_) {
                customerInformationData = CustomerInformationData;
                customerInformationData.initialize({
                    citizenshipCountryCode: 'ZA',
                    residenceCountryCode: 'ZA',
                    nationalityCountryCode: 'ZA',
                    birthCountryCode: 'ZA',
                    identityDocuments: [{
                        identityTypeCode: '01',
                        identityNumber: '5309015231095',
                        countryCode: 'ZA'
                    }]
                });
                scope = $rootScope.$new();
                controller = $controller;
                mock = _mock_;
                location = $location;
                window = spyOn($window.history, 'go');
                User = _User_;
                accountOriginationProvider = AccountOriginationProvider;
                cancelConfirmationService = CancelConfirmationService;
                spyOn(cancelConfirmationService, 'cancelEdit').and.callThrough();

                customerInformationErrors = CustomerInformationErrors;
                spyOn(customerInformationErrors, 'allDatesValid').and.callThrough();

                customerService = CustomerService;
                createCustomerSpy = spyOn(customerService, 'createCustomer').and.returnValue(_mock_.resolve({
                    headers: function () {
                    }
                }));

                initialiseController('current-account');
                scope.$digest();
            }));

            describe('on initialize', function () {
                it('should fetch the product info', function () {
                    expect(scope.product).toEqual('current-account');
                });
            });

            describe('on save', function () {
                it('should fetch customer information', function () {
                    scope.save();
                    expect(scope.customerInformationData).toBeTruthy();
                });

                it('should get customer address details', function () {
                    scope.save();
                    expect(scope.customerInformationData.addressDetails).not.toBeUndefined();
                    expect(scope.customerInformationData.addressDetails[0]).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        addressUsage: [{
                            usageCode: '05',
                            deleteIndicator: false,
                            validFrom: '2016-04-18'
                        }]
                    }));
                });

                it('should delete permit details for a customer with no passport details', function () {
                    customerInformationData.initialize({
                        identityDocuments: [{
                            identityNumber: '1231231231234',
                            identityTypeCode: '01',
                            countryCode: 'ZA'
                        }],
                        permitDetails: [{
                            identityNumber: 'PERMIT1242',
                            identityTypeCode: '03',
                            countryCode: 'AL',
                            issuedDate: '2010-10-10',
                            expiryDate: '2019-01-01'
                        }]
                    });
                    initialiseController();
                    scope.save();

                    expect(customerService.createCustomer).not.toHaveBeenCalledWith(jasmine.objectContaining({
                        permitDetails: [{
                            identityNumber: 'PERMIT1242',
                            identityTypeCode: '03',
                            countryCode: 'AL',
                            issuedDate: '2010-10-10',
                            expiryDate: '2019-01-01'
                        }]
                    }));
                });

                it('should not delete permit details for a customer with no passport details', function () {
                    customerInformationData.initialize({
                        identityDocuments: [{
                            identityNumber: 'PASSPORT12',
                            identityTypeCode: '06',
                            countryCode: 'UG'

                        }],
                        permitDetails: [{
                            identityNumber: 'PERMIT1242',
                            identityTypeCode: '03',
                            countryCode: 'AL',
                            issuedDate: '2010-10-10',
                            expiryDate: '2019-01-01'
                        }]
                    });
                    initialiseController();
                    scope.save();
                    var customerInformation = customerService.createCustomer.calls.allArgs()[0][0].customerInformation;
                    expect(customerInformation).toEqual(jasmine.objectContaining({
                        permitDetails: [{
                            identityNumber: 'PERMIT1242',
                            identityTypeCode: '03',
                            countryCode: 'AL',
                            issuedDate: '2010-10-10',
                            expiryDate: '2019-01-01'
                        }]
                    }))
                    ;
                });

                describe('on create customer', function () {

                    it('should set existing customer modal to true for current account when customer exists', function () {
                        initialiseController('current-account');
                        createCustomerSpy.and.returnValue(mock.response({}, 204, {
                            'x-sbg-response-type': "ERROR",
                            'x-sbg-response-code': "4444"
                        }));

                        scope.save();
                        scope.$digest();
                        expect(scope.showExistingCustomerModal).toEqual(true);
                    });

                    it('should navigate to decline path for rcp when customer exists', function () {
                        initialiseController('rcp');
                        createCustomerSpy.and.returnValue(mock.response({}, 204, {
                            'x-sbg-response-type': "ERROR",
                            'x-sbg-response-code': "4445"
                        }));

                        scope.save();
                        scope.$digest();
                        expect(scope.showExistingCustomerModal).toBeUndefined();
                        expect(location.path()).toEqual('/apply/rcp/declined');

                    });

                    it('should navigate to decline path for rcp when customer exists', function () {
                        initialiseController('rcp');
                        createCustomerSpy.and.returnValue(mock.response({}, 204, {
                            'x-sbg-response-type': "ERROR",
                            'x-sbg-response-code': "0000"
                        }));

                        scope.save();
                        scope.$digest();
                        expect(scope.showExistingCustomerModal).toBeUndefined();
                        expect(location.path()).not.toEqual('/apply/rcp/declined');

                    });

                    it('should not show modal when customer does not exist', function () {
                        initialiseController('rcp');
                        scope.showExistingCustomerModal = false;
                        createCustomerSpy.and.returnValue(mock.response({}, 200, {
                            'x-sbg-response-type': "SUCCESS"
                        }));
                        scope.save();
                        scope.$digest();
                        expect(scope.showExistingCustomerModal).toEqual(false);
                        expect(location.path()).not.toEqual('/apply/rcp/declined');
                        expect(location.path()).toEqual('/apply/rcp/unsupported');
                    });
                });
            });

            describe('on cancel', function () {
                it("should cancel edit using CancelConfirmationService", function () {
                    scope.cancel();
                    expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
                });

                it("should call cancel confirmation and go back one in history", function () {
                    scope.addressForm = {$pristine: true};
                    cancelConfirmationService.setEditForm(scope.addressForm);
                    scope.cancel();

                    expect(window).toHaveBeenCalledWith(-1);
                });
            });

            it('on allDatesValid', function () {
                scope.allDatesValid();
                expect(customerInformationErrors.allDatesValid).toHaveBeenCalled();
            });
        });
    });
});
