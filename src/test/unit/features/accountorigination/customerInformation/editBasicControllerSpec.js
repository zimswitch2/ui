describe('EditBasicController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.basic', 'refresh.accountOrigination.domain.customer',
        'refresh.dtmanalytics'));

    var scope, controller, timeout, window, location, mock, CustomerService, capitalizeFilter,
        CustomerInformationData, User, CancelConfirmationService, ApplicationParameters;

    var PromiseLookUp = function (values) {
        return {
            promise: function () {
                return mock.resolve(values);
            }
        };
    };

    var StaticLookUp = function (staticValues) {
        return {
            values: function () {
                return staticValues;
            }
        };
    };

    var LookUps = {
        country: new PromiseLookUp([{code: 'ZA', description: 'South Africa'}]),
        title: new PromiseLookUp([{code: '02', description: 'Mr'}]),
        gender: new StaticLookUp([{code: '1', description: 'Male'}, {code: '2', description: 'Female'}]),
        maritalType: new StaticLookUp([{code: '5', description: 'eee'}]),
        maritalStatus: new PromiseLookUp([{code: '3', description: 'ddd'}]),
        idType: new StaticLookUp([{code: '01', description: 'South African ID'}, {
            code: '06',
            description: 'Passport'
        }]),
        permitType: new StaticLookUp([{code: '01', description: 'Some Permit'}])
    };

    function initController() {
        controller('EditBasicController', {
            $scope: scope,
            $timeout: timeout,
            LookUps: LookUps,
            capitalizeFiler: capitalizeFilter,
            User: User,
            CancelConfirmationService: CancelConfirmationService,
            location: location,
            $routeParams: {product: 'current-account'},
            ApplicationParameters: ApplicationParameters
        });
        scope.$digest();
        timeout.flush();
    }

    beforeEach(inject(function ($rootScope, $controller, $window, $timeout, $location, _CustomerService_, _capitalizeFilter_,
                                _mock_, _CustomerInformationData_, _User_, _CancelConfirmationService_, _ApplicationParameters_) {
        CustomerInformationData = _CustomerInformationData_;

        scope = $rootScope.$new();
        timeout = $timeout;
        scope.editBasicForm = {
            $setDirty: function () {
            }
        };

        window = spyOn($window.history, 'go');

        scope.customerInformationData = CustomerInformationData.initialize({
            gender: '1',
            customerTitleCode: '02',
            identityDocuments: [{
                identityTypeCode: '01',
                identityNumber: '5309015231194',
                countryCode: 'ZA'
            }],
            branchCode: '1',
            maritalStatusCode: '3'
        });

        controller = $controller;
        location = $location;
        capitalizeFilter = _capitalizeFilter_;
        mock = _mock_;

        CustomerService = _CustomerService_;
        spyOn(CustomerService, 'updateBasicInfo').and.returnValue(mock.resolve());

        CancelConfirmationService = _CancelConfirmationService_;
        CancelConfirmationService.setEditForm({$pristine: true});
        spyOn(CancelConfirmationService, 'cancelEdit').and.callThrough();

        User = _User_;
        spyOn(User, 'hasDashboards').and.returnValue(true);

        ApplicationParameters = _ApplicationParameters_;
        spyOn(ApplicationParameters, 'pushVariable');

        initController();
    }));

    describe("initialize", function () {
        it("should populate countries", function () {
            expect(scope.countries).toEqual([{
                code: 'ZA',
                description: 'South Africa',
                label: jasmine.any(Function)
            }]);
            expect(scope.countries[0].label()).toEqual('South Africa');
        });

        describe("with countries", function () {
            describe("for a SA citizen", function () {
                it('should set citizenship to ZA when they are missing on customer profile',
                    function () {
                        scope.customerInformationData = CustomerInformationData.initialize({
                            identityDocuments: [{
                                identityTypeCode: '01',
                                identityNumber: '5309015231095',
                                countryCode: 'ZA'
                            }],
                            branchCode: '1'
                        });
                        initController();
                        expect(scope.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                    });

                it('should not update citizenship and nationality to ZA when they already exist', inject(function (CustomerInformationData) {
                    scope.customerInformationData = CustomerInformationData.initialize({
                        identityDocuments: [{
                            identityTypeCode: '01',
                            identityNumber: '5309015231095',
                            countryCode: 'ZA'
                        }],
                        branchCode: '1',
                        citizenshipCountryCode: 'AL',
                        nationalityCountryCode: 'CG'
                    });
                    initController();
                    expect(scope.customerInformationData.citizenshipCountryCode).toEqual('AL');
                    expect(scope.customerInformationData.nationalityCountryCode).toEqual('CG');
                }));
            });

            describe("for non-SA citizen", function () {
                it("should not populate citizenship and nationality", function () {
                    scope.customerInformationData = CustomerInformationData.initialize({
                        identityDocuments: [{
                            identityTypeCode: '01',
                            identityNumber: '5309015231194',
                            countryCode: 'ZA'
                        }],
                        branchCode: '1'
                    });
                    initController();
                    expect(scope.customerInformationData.citizenshipCountryCode).toBeUndefined();
                    expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
                });

            });
        });
    });

    describe("when customer has passport", function () {
        describe("With addBasicInformationAML feature toggled off", function () {
            beforeEach(inject(function (CustomerInformationData) {
                addBasicInformationAMLFeature = false;
                scope.customerInformationData = CustomerInformationData.initialize({
                    identityDocuments: [{
                        identityTypeCode: '06',
                        countryCode: 'ZA'
                    }],
                    branchCode: '1'
                });
                initController();
            }));

            describe('when populating permit', function () {
                it('should create empty permit if customer has no permit information', function () {
                    expect(scope.permit).toEqual(jasmine.objectContaining({cRUDIndicator: 'U'}));
                });

                it('should use customer existing permit information if available', function () {
                    scope.customerInformationData.permitDetails = [{
                        identityTypeCode: '05'
                    }];
                    initController();

                    expect(scope.permit).toEqual({identityTypeCode: '05', cRUDIndicator: 'U'});
                });
            });

            it("should populate permit types", function () {
                expect(scope.permitTypes).toEqual([{code: '01', description: 'Some Permit'}]);
            });

            it("should set latestDateOfPermitIssue to current date", function () {
                expect(scope.latestDateOfPermitIssue).toEqual(moment().format("DD MMMM YYYY"));
            });

            it("should populate passport origin", function () {
                expect(scope.passportOrigin).toEqual('South Africa');
            });

            it("should set permit expiry date error message when current moment", function () {
                scope.checkPermitExpiryDate(undefined);

                expect(scope.errorMessage.permitExpiryDate).toEqual('We cannot offer you an account if your permit expires within 3 months');

            });

            it("should set permit expiry date error message when it is within the next 3 months", function () {
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPermitExpiryDate(moment('20150313 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.errorMessage.permitExpiryDate).toEqual('We cannot offer you an account if your permit expires within 3 months');
                clock.restore();
            });

            it("should set permit expiry date error message when it is within the next 3 months", function () {
                scope.errorMessage.permitExpiryDate = 'some message';
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPermitExpiryDate(moment('20150314 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.errorMessage.permitExpiryDate).toBeUndefined();
                clock.restore();
            });

            describe("allDatesValid", function () {
                it("should return false if permit expiry date is not valid", function () {
                    scope.errorMessage.permitExpiryDate = 'some thing';

                    expect(scope.allDatesValid()).toBeFalsy();
                });

                it("should return true if all dates are valid", function () {
                    scope.errorMessage = {};

                    expect(scope.allDatesValid()).toBeTruthy();
                });
            });

            describe('on save', function () {
                describe('when updating permit info', function () {
                    beforeEach(inject(function (CustomerInformationData) {
                        scope.customerInformationData = CustomerInformationData.initialize({
                            identityDocuments: [{
                                identityTypeCode: '06',
                                countryCode: 'ZA'
                            }],
                            permitDetails: [{
                                identityTypeCode: '05'
                            }],
                            branchCode: '1'
                        });
                        scope.editBasicForm = {};

                        initController();
                    }));

                    it('should add cRUDIndicator "D" on existing customer permit details', function () {
                        scope.save();

                        expect(scope.customerInformationData.permitDetails).toContain({
                            identityTypeCode: '05',
                            cRUDIndicator: 'D'
                        });
                    });

                    it('should push permit onto customer permit details', function () {
                        scope.save();

                        expect(scope.customerInformationData.permitDetails).toContain({
                            identityTypeCode: '05',
                            cRUDIndicator: 'U'
                        });
                    });
                });

                it("should call save and redirect to view", function () {
                    scope.editBasicForm = {};
                    scope.save();
                    scope.$digest();
                    expect(CustomerService.updateBasicInfo).toHaveBeenCalledWith(scope.customerInformationData);
                    expect(location.path()).toBe('/apply/current-account/profile');
                });

                describe('on error', function () {

                    beforeEach(function () {
                        CustomerService.updateBasicInfo.and.returnValue(mock.reject({message: 'Random Server Error'}));
                    });

                    it("should not redirect to view on error", function () {

                        User.hasDashboards.and.returnValue(false);
                        scope.save();
                        scope.$digest();
                        expect(ApplicationParameters.pushVariable).not.toHaveBeenCalled();
                        expect(location.path()).not.toBe('/apply/current-account/profile');
                    });

                    it('should set server error message on scope', function () {
                        scope.save();
                        scope.$digest();

                        expect(scope.serverErrorMessage).toBe('Random Server Error');
                    });

                    it("should show any otp errors for an existing customer", function () {
                        scope.editBasicForm = {};
                        scope.save();
                        scope.$digest();
                        expect(ApplicationParameters.pushVariable).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("With addBasicInformationAML feature toggled on", function () {
            beforeEach(inject(function (CustomerInformationData) {
                addBasicInformationAMLFeature = true;
                scope.customerInformationData = CustomerInformationData.initialize({
                    identityDocuments: [{
                        identityTypeCode: '06',
                        countryCode: 'ZA'
                    }],
                    branchCode: '1'
                });
                initController();
            }));
            describe('when populating permit', function () {
                it('should not create empty permit if customer has no permit information', function () {
                    expect(scope.permit).toBeUndefined();
                    expect(scope.permitExpiryDateErrorMessage).toBeUndefined();
                    expect(scope.latestDateOfPermitIssue).toBeUndefined();
                    expect(scope.permitTypes).toBeUndefined();
                });
            });

            it("should always return true ", function () {
                scope.errorMessage.permitExpiryDate = 'some thing';

                expect(scope.allDatesValid()).toBeTruthy();
            });

            describe('on save', function () {
                describe('when updating permit info', function () {
                    beforeEach(inject(function (CustomerInformationData) {
                        scope.customerInformationData = CustomerInformationData.initialize({
                            identityDocuments: [{
                                identityTypeCode: '06',
                                countryCode: 'ZA'
                            }],
                            permitDetails: [{
                                identityTypeCode: '05'
                            }],
                            branchCode: '1'
                        });
                        scope.editBasicForm = {};

                        initController();
                    }));

                    it('should not add cRUDIndicator "D" on existing customer permit details', function () {
                        scope.save();

                        expect(scope.customerInformationData.permitDetails).not.toContain({
                            identityTypeCode: '05',
                            cRUDIndicator: 'D'
                        });
                    });

                    it('should not push permit onto customer permit details', function () {
                        scope.save();

                        expect(scope.customerInformationData.permitDetails).not.toContain({
                            identityTypeCode: '05',
                            cRUDIndicator: 'U'
                        });

                        expect(scope.customerInformationData.permitDetails).toContain({
                            identityTypeCode: '05'
                        });

                        expect(scope.customerInformationData.permitDetails.length).toEqual(1);
                    });
                });
            });
        });

    });

    describe('getValidationNotification', function () {
        it('should get customer info validation for basic info', inject(function (CustomerInfoValidation) {
            spyOn(CustomerInfoValidation, ['getValidationNotificationForSection']);
            scope.getValidationNotification();

            expect(CustomerInfoValidation.getValidationNotificationForSection).toHaveBeenCalledWith('basic');
        }));
    });

    describe('on cancel', function () {
        it("should call cancel confirmation and go back one in history ", function () {
            scope.cancel();
            expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));

            expect(window).toHaveBeenCalledWith(-1);
        });
    });

    describe("next", function () {
        it('should cancel editing of customer information', function () {
            scope.next();
            expect(CancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should go to address section', function () {
            scope.next();
            expect(location.path()).toEqual('/apply/' + scope.product + '/address');
        });
    });

});