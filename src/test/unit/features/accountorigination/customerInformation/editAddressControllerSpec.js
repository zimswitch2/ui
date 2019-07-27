describe('EditAddressController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.address',
        'refresh.accountOrigination.domain.customer', 'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should load the edit address controller', function () {
            expect(route.routes['/apply/:product/address/edit'].controller).toBe('EditAddressController');
        });
    });

    describe('controller', function () {
        var scope, controller, location, window, timeout, mock, CustomerService, clock, customerInformationData,
            cancelConfirmationService, createCustomerSpy, updateCustomerSpy, User, AccountOriginationProvider, DtmAnalyticsService;

        var PromiseLookUp = function (values) {
            return {
                promise: function () {
                    return mock.resolve(values);
                }
            };
        };

        var LookUps = {
            residentialStatus: new PromiseLookUp([{code: 1, description: 'Owner'}])
        };

        function initController(product) {
            controller('EditAddressController', {
                $scope: scope,
                $location: location,
                $timeout: timeout,
                LookUps: LookUps,
                CancelConfirmationService: cancelConfirmationService,
                CustomerService: CustomerService,
                User: User,
                $routeParams: {product: product || 'current-account'},
                DtmAnalyticsService: DtmAnalyticsService
            });
            scope.$digest();
            timeout.flush();
        }

        beforeEach(inject(function ($rootScope, $controller, $timeout, $window, $location, _mock_, _CustomerInformationData_,
                                    _CustomerService_, _User_, _CancelConfirmationService_, _AccountOriginationProvider_) {
            timeout = $timeout;
            window = spyOn($window.history, 'go');
            clock = sinon.useFakeTimers(moment('2015-04-20').valueOf());
            customerInformationData = _CustomerInformationData_;

            scope = $rootScope.$new();
            scope.customerInformationData = customerInformationData.initialize({addressDetails: []});

            cancelConfirmationService = _CancelConfirmationService_;
            spyOn(cancelConfirmationService, ['cancelEdit']).and.callThrough();

            CustomerService = _CustomerService_;
            createCustomerSpy = spyOn(CustomerService, 'createCustomer').and.returnValue(_mock_.resolve({
                headers: function () {
                }
            }));
            updateCustomerSpy = spyOn(CustomerService, 'updateAddress').and.returnValue(_mock_.resolve());

            User = _User_;
            spyOn(User, 'setBpIdSystemPrincipalIdentifier');
            spyOn(User, 'hasDashboards').and.returnValue(true);

            controller = $controller;
            mock = _mock_;
            location = $location;

            AccountOriginationProvider = _AccountOriginationProvider_;
            DtmAnalyticsService = jasmine.createSpyObj('DtmAnalyticsService', ['recordFormSubmissionCompletion']);

            initController();
        }));

        afterEach(function () {
            clock.restore();
        });

        describe("initialize", function () {
            it("should retrieve all the accommodation types", function () {
                expect(scope.accommodationTypes).toEqual([{code: 1, description: 'Owner'}]);
            });

            it('should make customer info available on the scope', function () {
                expect(scope.customerInformationData).not.toBeUndefined();
            });

            it('should record form submission completion for analytics if the customer is to be created', function() {
                scope.customerInformationData.shouldCreate = true;
                initController();
                expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
            });

            it('should not record form submission completion for analytics if the customer not is to be created', function() {
                scope.customerInformationData.shouldCreate = false;
                initController();
                expect(DtmAnalyticsService.recordFormSubmissionCompletion).not.toHaveBeenCalled();
            });

            describe('when getting residential address', function () {
                it('should set empty residential address on scope if customer address does not exist', function () {
                    expect(scope.residentialAddress).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        validFrom: '2015-04-20',
                        addressUsage: [{
                            usageCode: '05',
                            deleteIndicator: false,
                            validFrom: '2015-04-20'
                        }]
                    }));
                });

                it('should set residential address on scope if customer address does exist', function () {
                    scope.customerInformationData = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '05',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();

                    expect(scope.residentialAddress).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        suburb: 'Sandton',
                        addressUsage: [{
                            usageCode: '05',
                            validFrom: '2013-01-01'
                        }]
                    }));
                });
            });

            describe('when getting postal address', function () {
                it('should set empty postal address on scope if customer address does not exist', function () {
                    expect(scope.postalAddress).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        validFrom: '2015-04-20',
                        addressUsage: [{
                            usageCode: '02',
                            deleteIndicator: false,
                            validFrom: '2015-04-20'
                        }]
                    }));
                });

                it('should set postal address on scope if customer address does exist', function () {
                    scope.customerInformationData = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '02',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();

                    expect(scope.postalAddress).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        suburb: 'Sandton',
                        addressUsage: [{
                            usageCode: '02',
                            validFrom: '2013-01-01'
                        }]
                    }));
                });
            });

            describe('when setting isSamePostalAndResidential on scope', function () {
                it('should set isSamePostalAndResidential to undefined if customer has no residential address',
                    function () {
                        scope.customerInformationData = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                suburb: 'Sandton',
                                addressUsage: [{
                                    usageCode: '05',
                                    validFrom: '2013-01-01'
                                }]
                            }]
                        });
                        initController();
                        expect(scope.isSamePostalAndResidential).toBeUndefined();
                    });

                it('should set isSamePostalAndResidential to undefined if customer has no postal address', function () {
                    scope.customerInformationData = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '02',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();

                    expect(scope.isSamePostalAndResidential).toBeUndefined();
                });

                it('should set isSamePostalAndResidential to true if customer residential and postal address match',
                    function () {
                        scope.customerInformationData = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                suburb: 'Sandton',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2013-01-01'
                                }, {
                                    usageCode: '05',
                                    validFrom: '2013-01-01'
                                }]
                            }]
                        });
                        initController();

                        expect(scope.isSamePostalAndResidential).toBeTruthy();
                    });

                it('should set isSamePostalAndResidential to false if customer residential and postal address do not match',
                    function () {
                        scope.customerInformationData = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                suburb: 'Sandton',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2013-01-01'
                                }]
                            },
                                {
                                    addressType: '01',
                                    suburb: 'Grayston',
                                    addressUsage: [{
                                        usageCode: '05',
                                        validFrom: '2013-01-01'
                                    }]
                                }]
                        });
                        initController();

                        expect(scope.isSamePostalAndResidential).toBeFalsy();
                    });
            });
        });

        describe("when setting postal address", function () {
            beforeEach(function () {
                initController();

                scope.residentialAddress = new Address({
                    addressType: '01',
                    validFrom: moment().format('YYYY-MM-DD'),
                    suburb: 'some',
                    addressUsage: [{
                        usageCode: '05',
                        deleteIndicator: false,
                        validFrom: moment().format('YYYY-MM-DD')
                    }]
                }, '05');
            });

            it("should set isSamePostalAndResidential to false if setPostalSameAsResidential called with false",
                function () {
                    scope.setPostalSameAsResidential(false);
                    expect(scope.isSamePostalAndResidential).toBeFalsy();
                });

            it("should set isSamePostalAndResidential to true if setPostalSameAsResidential called with true",
                function () {
                    scope.setPostalSameAsResidential(true);
                    expect(scope.isSamePostalAndResidential).toBeTruthy();
                });

            it("should clear postal address if setPostalSameAsResidential called with false", function () {
                scope.setPostalSameAsResidential(false);
                expect(scope.postalAddress).toEqual(jasmine.objectContaining({
                    addressType: '01',
                    suburb: '',
                    validFrom: '2015-04-20',
                    addressUsage: [{
                        usageCode: '02',
                        deleteIndicator: false,
                        validFrom: '2015-04-20'
                    }]
                }));
            });
        });

        describe("check street details", function () {
            describe("when editing residential address", function () {
                it("should not set error message if street PO Box is undefined", function () {
                    scope.residentialAddress.streetPOBox = undefined;
                    scope.checkStreetDetails();
                    expect(scope.errorMessage.streetPOBox).toBeUndefined();
                });

                it("should know when street name is missing", function () {
                    scope.residentialAddress.streetPOBox = "34";
                    scope.checkStreetDetails();
                    expect(scope.errorMessage.streetPOBox).toContain('The street name is missing');
                });

                it("should know when street number is missing", function () {
                    scope.residentialAddress.streetPOBox = "some street";
                    scope.checkStreetDetails();
                    expect(scope.errorMessage.streetPOBox).toContain('The street number is missing');
                });

            });
        });

        describe("on next", function () {
            it("should navigate to employment page while cancelling customer information edit",
                function () {
                    scope.addressForm = {$pristine: true};
                    scope.customerInformationData.shouldCreate = false;
                    cancelConfirmationService.setEditForm(scope.addressForm);

                    scope.next();

                    expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(location.path()).toBe('/apply/current-account/employment');
                });

        });

        describe("cancel", function () {
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

        describe("on save", function () {

            describe("residential address usage validFrom", function () {
                it('should set validFrom to today if residential address has been changed', function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '05',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();
                    scope.residentialAddress.suburb = 'Greyston';

                    scope.save();
                    expect(scope.residentialAddress.getUsage().validFrom).toEqual('2015-04-20');
                });

                it('should not set validFrom to today if residential address has not been changed', function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '05',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();
                    scope.postalAddress.suburb = 'Greyston';

                    scope.save();
                    expect(scope.residentialAddress.getUsage().validFrom).toEqual('2013-01-01');
                });
            });

            describe("postal address usage validFrom", function () {
                it('should set validFrom to today if postal address has been changed', function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '02',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();
                    scope.postalAddress.suburb = 'Greyston';

                    scope.save();
                    expect(scope.postalAddress.getUsage().validFrom).toEqual('2015-04-20');
                });

                it('should not set validFrom to today if postal address has not been changed', function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '02',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });
                    initController();
                    scope.residentialAddress.suburb = 'Grayston';

                    scope.save();
                    expect(scope.postalAddress.getUsage().validFrom).toEqual('2013-01-01');
                });
            });

            describe('on create', function () {
                beforeEach(function () {
                    scope.residentialAddress.suburb = 'changed';
                    scope.customerInformationData.shouldCreate = true;
                    scope.customerInformationData.branchCode = { code: "1234", name: "Test Branch"};
                });

                it("should call save when the customer should be created", function () {
                    createCustomerSpy.and.returnValue(mock.resolve({
                        headers: function (header) {
                            return {
                                'x-sbg-response-type': 'SUCCESS'
                            }[header];
                        },
                        data: {
                            systemPrincipalIdentifier: 12345
                        }
                    }));

                    scope.save();
                    scope.$digest();
                    expect(CustomerService.createCustomer).toHaveBeenCalled();
                    expect(User.setBpIdSystemPrincipalIdentifier).toHaveBeenCalledWith(12345);
                    expect(location.url()).toBe('/apply/current-account/address');
                });

                it('should not delete the permit details if a passport has been captured', function () {
                    scope.customerInformationData.identityDocuments = [{identityTypeCode: '06'}];
                    createCustomerSpy.and.returnValue(mock.resolve({
                        headers: function (header) {
                            return {
                                'x-sbg-response-type': 'SUCCESS'
                            }[header];
                        },
                        data: {
                            systemPrincipalIdentifier: 12345
                        }
                    }));

                    scope.save();
                    scope.$digest();
                    expect(CustomerService.createCustomer).toHaveBeenCalled();
                    expect(scope.customerInformationData.shouldCreate).toBeUndefined();
                    expect(User.setBpIdSystemPrincipalIdentifier).toHaveBeenCalledWith(12345);
                    expect(location.url()).toBe('/apply/current-account/address');
                });

                it("should show the modal when save fails for an existing customer", function () {
                    createCustomerSpy.and.returnValue(mock.resolve({
                        headers: function (header) {
                            return {
                                'x-sbg-response-type': 'ERROR',
                                'x-sbg-response-code': '4444'
                            }[header];
                        }
                    }));

                    scope.save();
                    scope.$digest();
                    expect(scope.customerInformationData.shouldCreate).toBeTruthy();
                    expect(scope.showExistingCustomerModal).toBe(true);
                });

                it("should show the server error message when save fails because of an invalid address", function () {
                    createCustomerSpy.and.returnValue(mock.resolve({
                        headers: function (header) {
                            return {
                                'x-sbg-response-type': 'ERROR',
                                'x-sbg-response-code': '3',
                                'x-sbg-response-message': 'Invalid address'
                            }[header];
                        }
                    }));

                    scope.save();
                    scope.$digest();
                    expect(scope.serverErrorMessage).toEqual('Invalid address');
                });

                it("should navigate to link card if customer chooses to link existing card", function () {
                    scope.navigateToLinkCard();
                    expect(location.path()).toEqual('/linkcard');
                });

                describe("because customer has open RCP account", function () {
                    beforeEach(function () {
                        initController('rcp');

                        scope.residentialAddress.suburb = 'changed';

                        createCustomerSpy.and.returnValue(mock.response({}, 204, {
                            'x-sbg-response-type': "ERROR",
                            'x-sbg-response-code': "4445",
                            'x-sbg-response-message': 'You already have a Revolving Credit Plan (RCP)'
                        }));

                    });

                    it("should set declined reason on rcp application if error code is '4445'", function () {
                        scope.save();
                        scope.$digest();

                        var rcpOffer = {offer: {message: "You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan."}};

                        var application = AccountOriginationProvider.for('rcp').application;
                        expect(application.isDeclined()).toBeTruthy();
                        expect(application.offer()).toEqual(rcpOffer.offer);
                    });

                    it("should navigate to rcp decline path", inject(function ($location) {
                        scope.save();
                        scope.$digest();
                        expect($location.path()).toEqual('/apply/rcp/declined');
                    }));
                });

                it("should return to edit address when save fails for a customer", function () {
                    createCustomerSpy.and.returnValue(mock.resolve({
                        headers: function (header) {
                            return {
                                'x-sbg-response-type': 'ERROR',
                                'x-sbg-response-code': '9999'
                            }[header];
                        }
                    }));

                    scope.save();
                    scope.$digest();
                    expect(scope.customerInformationData.shouldCreate).toBeTruthy();
                    expect(location.url()).not.toBe('/apply/current-account/address');
                });
            });

            describe('on update', function () {
                beforeEach(function () {
                    scope.residentialAddress.suburb = 'changed';
                    scope.customerInformationData.shouldCreate = false;
                });

                it("should call update when the customer should not be created", function () {
                    scope.save();
                    scope.$digest();
                    expect(CustomerService.updateAddress).toHaveBeenCalled();
                });

                describe("on success", function () {
                    beforeEach(function() {
                        updateCustomerSpy.and.returnValue(mock.resolve({
                            headers: function () {

                            }
                        }));
                    });

                    it("should redirect to view address page", function () {
                        scope.save();
                        scope.$digest();

                        expect(location.path()).toEqual('/apply/current-account/address');
                    });
                });

                describe("on error", function () {
                    beforeEach(function () {
                        updateCustomerSpy.and.returnValue(mock.reject({message: 'Random Service error.'}));
                    });

                    it("should push error message into ApplicationParameters for an existing customer", function () {
                        scope.save();
                        scope.$digest();
                        expect(CustomerService.updateAddress).toHaveBeenCalled();
                        expect(User.hasDashboards).toHaveBeenCalled();
                    });

                    it("should not push error message into ApplicationParameters for a new customer", function () {
                        User.hasDashboards.and.returnValue(false);
                        scope.save();
                        scope.$digest();
                        expect(CustomerService.updateAddress).toHaveBeenCalled();
                        expect(User.hasDashboards).toHaveBeenCalled();
                    });

                    it("should make the error message available to the scope", function () {
                        scope.save();
                        scope.$digest();

                        expect(scope.serverErrorMessage).toEqual('Random Service error.');
                    });

                    it("should not redirect the customer to view address page", function () {
                        scope.save();
                        scope.$digest();

                        expect(location.path()).not.toEqual('/apply/current-account/address');
                    });
                });


            });

            describe("on saving residential and postal address", function () {
                beforeEach(function () {
                    scope.residentialAddress.suburb = 'changed';
                    scope.postalAddress.suburb = 'changed';
                });

                it("should set validFrom of address usage to today's date for both addresses", function () {
                    scope.save();

                    var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                    expect(customerRequest.addressDetails[0].getUsage().validFrom).toEqual('2015-04-20');
                    expect(customerRequest.addressDetails[1].getUsage().validFrom).toEqual('2015-04-20');
                });

                describe('adding addresses', function () {
                    it('should ensure address details in customer request only contains one residential and one postal address',
                        function () {
                            scope.residentialAddress = new Address({
                                addressType: '01',
                                validFrom: moment().format('YYYY-MM-DD'),
                                suburb: 'some',
                                addressUsage: [{
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: moment().format('YYYY-MM-DD')
                                }]
                            }, '05');
                            scope.postalAddress = new Address({
                                addressType: '01',
                                validFrom: moment().format('YYYY-MM-DD'),
                                suburb: 'some postal',
                                addressUsage: [{
                                    usageCode: '02',
                                    deleteIndicator: false,
                                    validFrom: moment().format('YYYY-MM-DD')
                                }]
                            }, '02');

                            scope.save();
                            scope.$digest();

                            var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                            expect(customerRequest.addressDetails.length).toEqual(2);
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'some',
                                validFrom: '2015-04-20',
                                addressUsage: [{
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: '2015-04-20'
                                }]
                            }));
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'some postal',
                                validFrom: '2015-04-20',
                                addressUsage: [{
                                    usageCode: '02',
                                    deleteIndicator: false,
                                    validFrom: '2015-04-20'
                                }]
                            }));
                        });

                    it('should ensure address details in customer request contains both residential and postal address if postal equals residential',
                        function () {
                            scope.residentialAddress = new Address({
                                addressType: '01',
                                validFrom: moment().format('YYYY-MM-DD'),
                                suburb: 'some',
                                addressUsage: [{
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: moment().format('YYYY-MM-DD')
                                }]
                            }, '05');
                            scope.isSamePostalAndResidential = true;

                            scope.save();
                            scope.$digest();

                            var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                            expect(customerRequest.addressDetails.length).toEqual(2);
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'some',
                                validFrom: '2015-04-20',
                                addressUsage: [{
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: '2015-04-20'
                                }]
                            }));
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'some',
                                validFrom: '2015-04-20',
                                addressUsage: [{
                                    usageCode: '02',
                                    deleteIndicator: false,
                                    validFrom: '2015-04-20'
                                }]
                            }));

                        });
                });

                describe('editing addresses', function () {
                    beforeEach(function () {
                        scope.customerInformationData = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                suburb: 'residential address',
                                addressUsage: [{
                                    usageCode: '05',
                                    validFrom: '2013-01-01'
                                }]
                            }, {
                                addressType: '01',
                                suburb: 'other residential address',
                                addressUsage: [{
                                    usageCode: '05',
                                    validFrom: '2015-01-01'
                                }]
                            }, {
                                addressType: '01',
                                suburb: 'postal address',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2015-01-03'
                                }]
                            }]
                        });
                        initController();

                        scope.residentialAddress.suburb = "new residential suburb";
                        scope.postalAddress.suburb = "new postal suburb";
                    });

                    it("should ensure address details in customer request only contains residential address being edited",
                        function () {
                            scope.save();

                            var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                            expect(customerRequest.addressDetails.length).toEqual(2);
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'new residential suburb',
                                addressUsage: [{
                                    usageCode: '05',
                                    validFrom: '2015-04-20'
                                }]
                            }));
                            expect(customerRequest.addressDetails).not.toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'other residential address',
                                addressUsage: [{
                                    usageCode: '05',
                                    validFrom: '2015-01-01'
                                }]
                            }));
                        });

                    it("should ensure address details in customer request only contains postal address being edited",
                        function () {
                            scope.save();

                            var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'new postal suburb',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2015-04-20'
                                }]
                            }));
                            expect(customerRequest.addressDetails).not.toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'postal address',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2015-01-03'
                                }]
                            }));
                        });

                    it("should ensure address details in customer request has matching residential and postal addresses if isSamePostalAndResidential is true",
                        function () {
                            scope.isSamePostalAndResidential = true;
                            scope.save();

                            var customerRequest = CustomerService.updateAddress.calls.argsFor(0)[0];

                            expect(customerRequest.addressDetails.length).toEqual(2);
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'new residential suburb',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2015-04-20'
                                }]
                            }));
                            expect(customerRequest.addressDetails).toContain(jasmine.objectContaining({
                                addressType: '01',
                                suburb: 'new residential suburb',
                                addressUsage: [{
                                    usageCode: '02',
                                    validFrom: '2015-04-20'
                                }]
                            }));
                        });
                });
            });

            describe('residential and postal address is unchanged', function() {

                it("should not change the residential address usage periods", function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '05',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });

                    initController();

                    scope.save();

                    expect(scope.residentialAddress.getUsage().validFrom).toEqual('2013-01-01');
                });

                it("should not change the postal address usage periods", function () {
                    customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            suburb: 'Sandton',
                            addressUsage: [{
                                usageCode: '02',
                                validFrom: '2013-01-01'
                            }]
                        }]
                    });

                    initController();

                    scope.save();

                    expect(scope.postalAddress.getUsage().validFrom).toEqual('2013-01-01');
                });
            });
        });
    });
});
