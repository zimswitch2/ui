describe('Capture Basic', function () {
    /* global customerManagementV4Feature:true */

    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.captureBasic'));

    var scope, location, customerService, mock, window, user, applicationParametersService,
        cancelConfirmationService, AccountOriginationProvider, DtmAnalyticsService;

    function PromiseLookUp(values) {
        return {
            promise: function () {
                return mock.resolve(values);
            }
        };
    }

    function StaticLookUp(staticValues) {
        return {
            values: function () {
                return staticValues;
            }
        };
    }

    var LookUps = {
        title: new PromiseLookUp([{code: 1, description: 'aaa'}]),
        country: new PromiseLookUp([{code: 2, description: 'democratic republic of congo'}]),
        maritalStatus: new PromiseLookUp([{code: 4, description: 'ddd'}]),
        maritalType: new StaticLookUp([{code: 5, description: 'eee'}]),
        permitType: new StaticLookUp([{code: '01', description: 'Some Permit'}]),
        gender: new StaticLookUp([{code: '1', description: 'Male'}, {code: '2', description: 'Female'}]),
        idType: new StaticLookUp([{code: '01', description: 'South African ID'}, {
            code: '06',
            description: 'Passport'
        }])
    };

    describe('Routing', function () {
        var route, location, createProfilePath;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
            createProfilePath = '/apply/:product/profile/new';
        }));

        it('should get the correct capture basic template', function () {
            expect(route.routes[createProfilePath].templateUrl).toBe('features/accountorigination/customerInformation/partials/captureBasicInformation.html');
        });

        it('should get the correct capture basic controller', function () {
            expect(route.routes[createProfilePath].controller).toBe('CaptureBasicController');
        });

        it('should specify the safe return path', function () {
            expect(route.routes[createProfilePath].safeReturn).toEqual('/apply');
        });

        it('should only allow pre-screening', function () {
            var expectedPathOne = '/apply/current-account/pre-screen';
            var expectedPathTwo = '/apply/rcp/pre-screen';
            var allowedRoutes = route.routes['/apply/:product/profile/new'].allowedFrom;

            expect(allowedRoutes.length).toEqual(2);
            expect(allowedRoutes[0].path).toEqual(expectedPathOne);
            expect(allowedRoutes[1].path).toEqual(expectedPathTwo);
        });

        describe('path conditions', function () {
            var currentAccountApplication, rcpApplication;

            beforeEach(function () {
                currentAccountApplication = jasmine.createSpyObj('CurrentAccountApplication', ['isPending', 'isNew']);
                rcpApplication = jasmine.createSpyObj('RcpApplication', ['isNew']);
            });

            describe('for current account application', function () {
                it('should allow new application', function () {
                    currentAccountApplication.isNew.and.returnValue(true);
                    rcpApplication.isNew.and.returnValue(false);

                    _.forEach(route.routes[createProfilePath].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(currentAccountApplication, rcpApplication)).toBeTruthy();
                    });
                });

                it('should not allow application in any other state', function () {
                    currentAccountApplication.isNew.and.returnValue(false);
                    currentAccountApplication.isPending.and.returnValue(true);
                    rcpApplication.isNew.and.returnValue(false);

                    _.forEach(route.routes[createProfilePath].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(currentAccountApplication, rcpApplication)).toBeFalsy();
                    });
                });
            });

            describe('for RCP application', function () {
                it('should allow new application', function () {
                    rcpApplication.isNew.and.returnValue(true);
                    currentAccountApplication.isNew.and.returnValue(false);

                    _.forEach(route.routes[createProfilePath].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(currentAccountApplication, rcpApplication)).toBeTruthy();
                    });
                });
            });
        });
    });

    describe('CaptureBasicController', function () {
        beforeEach(inject(function ($rootScope, $controller, $window, $location, _mock_, User,
                                    ApplicationParameters, CustomerInformationData, _CancelConfirmationService_,
                                    _AccountOriginationProvider_) {
            scope = $rootScope.$new();
            scope.$parent.customerInformationData = CustomerInformationData.initialize({customerInitials: ''});
            scope.$parent.gotoBasicInfoPage = jasmine.createSpy('gotoBasicInfoPage');
            scope.$parent.cancelCapture = jasmine.createSpy('cancelCapture');
            location = $location;
            mock = _mock_;
            user = User;
            applicationParametersService = ApplicationParameters;
            spyOn(user, 'hasBasicCustomerInformation').and.returnValue(false);
            window = spyOn($window.history, 'go');

            customerService = jasmine.createSpyObj('customerService', ['createCustomer']);
            customerService.createCustomer.and.returnValue(mock.response({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '12345',
                        systemPrincipalKey: 'SBSA_SAP'
                    }
                }, 200,
                {'x-sbg-response-type': "SUCCESS", 'x-sbg-response-code': "0000"}));

            cancelConfirmationService = _CancelConfirmationService_;
            spyOn(cancelConfirmationService, 'cancelEdit').and.callThrough();

            AccountOriginationProvider = _AccountOriginationProvider_;
            DtmAnalyticsService = jasmine.createSpyObj('DtmAnalyticsService', ['recordFormSubmission']);

            $controller('CaptureBasicController', {
                $scope: scope,
                CustomerService: customerService,
                LookUps: LookUps,
                User: user,
                DtmAnalyticsService: DtmAnalyticsService
            });

            scope.$digest();
        }));

        describe("drop down options", function () {
            it("titles", function () {
                expect(scope.titles).toEqual([{code: 1, description: 'aaa'}]);
            });

            it("countries", function () {
                expect(scope.countries).toEqual([{
                    code: 2,
                    description: 'democratic republic of congo',
                    label: jasmine.any(Function)
                }]);
                expect(scope.countries[0].label()).toEqual('Democratic Republic of Congo');
            });

            it("marital statuses", function () {
                expect(scope.maritalStatuses).toEqual([{code: 4, description: 'ddd'}]);
            });

            it("marital types", function () {
                expect(scope.maritalTypes).toEqual([{code: 5, description: 'eee'}]);
            });

            it("permit types", function () {
                expect(scope.permitTypes).toEqual([{code: '01', description: 'Some Permit'}]);
            });

            it("ID types", function () {
                expect(scope.idTypes).toEqual([{code: '01', description: 'South African ID'}, {
                    code: '06',
                    description: 'Passport'
                }]);
            });

            it("genders", function () {
                expect(scope.genders).toEqual([{code: '1', description: 'Male'}, {code: '2', description: 'Female'}]);
            });
        });

        describe("initialize", function () {
            it("should set ID type to South African ID", function () {
                expect(scope.idType.value).toEqual('01');
            });

            it("should set an empty cell phone as contact", function () {
                expect(scope.$parent.customerInformationData.communicationInformation).toEqual(
                    [{
                        communicationTypeCode: '02',
                        communicationDetails: ''
                    }]
                );
            });

            it("should be have a cellphone contact", function () {
                expect(scope.$parent.customerInformationData.hasCellphoneContact()).toBeTruthy();
            });

            it('should set the preferred communication language to english', function () {
                expect(scope.$parent.customerInformationData.preferredLanguageCode).toEqual('EN');
            });

            it("should set latestDateOfBirth to current date", function () {
                expect(scope.latestDateOfBirth).toEqual(moment().format("DD MMMM YYYY"));
            });

            it("should set latestDateOfPermitIssue to current date", function () {
                expect(scope.latestDateOfPermitIssue).toEqual(moment().format("DD MMMM YYYY"));
            });
        });

        describe("conditions", function () {
            it("should return false if idType value is 'South African ID'", function () {
                scope.idType = {value: '01'};
                expect(scope.foreign()).toBeFalsy();
            });

            it("should return true if idType value is 'Passport'", function () {
                scope.idType = {value: '06'};
                expect(scope.foreign()).toBeTruthy();
            });
        });

        describe("complete the form", function () {
            var communicationInformation = [
                {
                    communicationTypeCode: '01',
                    communicationTypeDescription: 'Voice',
                    communicationDetails: '0810810811'
                },
                {
                    communicationTypeCode: '04',
                    communicationTypeDescription: 'E-mail address',
                    communicationDetails: 'prieska@sb.co.za'
                }
            ];

            var customerInformationData = {
                customerTitleCode: '043',
                customerSurname: 'Tizora',
                customerFirstName: 'Prieska',
                customerInitials: 'P',
                gender: '2',
                identityDocuments: [{
                    identityNumber: '5309015231095',
                    identityTypeCode: '01'
                }],
                dateOfBirth: '1953-09-01',
                residenceCountryCode: 'ZAF',
                citizenshipCountryCode: 'ZWE',
                maritalStatusCode: '2',
                maritalTypeCode: 'W',
                communicationInformation: communicationInformation
            };

            beforeEach(inject(function ($controller, CustomerInformationData) {
                scope.idType = {value: '01'};
                scope.$parent.customerInformationData = CustomerInformationData.initialize(customerInformationData);

                $controller('CaptureBasicController', {
                    $scope: scope,
                    $routeParams: {product: 'current-account'},
                    CustomerService: customerService,
                    LookUps: LookUps,
                    User: user,
                    DtmAnalyticsService: DtmAnalyticsService
                });

                // The communication information gets set to a default value on initialisation, so we
                // re-add it.
                scope.$parent.customerInformationData.communicationInformation = communicationInformation;

                scope.$digest();
            }));

            describe("next", function () {
                it("should navigate to the capture address page", function () {
                    scope.next();
                    expect(scope.$parent.customerInformationData.shouldCreate).toBeTruthy();
                });

                it('should record a form submission for analytics', function() {
                    scope.next();
                    expect(DtmAnalyticsService.recordFormSubmission).toHaveBeenCalled();
                });
            });

            describe("save", function () {
                it("should clear the permit details when customer has no passport", function () {
                    scope.$parent.customerInformationData.permitDetails = {somePermit: true};
                    scope.save();

                    expect(scope.$parent.customerInformationData.permitDetails).toBeUndefined();
                });

                it("should not clear the permit details when customer has passport", function () {
                    scope.$parent.customerInformationData.identityDocuments = [
                        {
                            identityNumber: 'C12345678',
                            identityTypeCode: '06',
                            expiryDate: '2020-02-02'
                        }
                    ];
                    var permitDetails = {somePermit: true};
                    scope.$parent.customerInformationData.permitDetails = permitDetails;
                    scope.save();

                    expect(scope.$parent.customerInformationData.permitDetails).toEqual(permitDetails);
                });

                it("should call createCustomer with correct request when using SA ID", function () {
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '5309015231095',
                        identityTypeCode: '01'
                    }];

                    scope.save();
                    var customerInformation = customerService.createCustomer.calls.allArgs()[0][0].customerInformation;
                    expect(customerInformation).toEqual(jasmine.objectContaining({
                        customerTitleCode: '043',
                        gender: '2',
                        customerFirstName: 'Prieska',
                        customerInitials: 'P',
                        identityDocuments: [{
                            identityNumber: '5309015231095',
                            identityTypeCode: '01'
                        }],
                        dateOfBirth: '1953-09-01',
                        citizenshipCountryCode: 'ZWE',
                        maritalStatusCode: '2',
                        maritalTypeCode: 'W'
                    }));
                    var communicationInformation = customerInformation.communicationInformation;
                    expect(communicationInformation).toContain(jasmine.objectContaining({
                        communicationTypeCode: '01',
                        communicationDetails: '0810810811'
                    }));
                    expect(communicationInformation).toContain(jasmine.objectContaining({
                        communicationTypeCode: '04',
                        communicationDetails: 'prieska@sb.co.za'
                    }));
                });

                it("should call createCustomer with correct request when using passport",
                    inject(function (CustomerInformationData) {
                        scope.idType = {value: '06'};
                        scope.$parent.customerInformationData.identityDocuments = [{
                            identityNumber: 'C12345678',
                            identityTypeCode: '06',
                            expiryDate: '2020-02-02'
                        }];
                        scope.$parent.customerInformationData.workPermitExpiryDate = '2019-03-03';

                        scope.save();

                        var customerInformation = customerService.createCustomer.calls.allArgs()[0][0].customerInformation;
                        expect(customerInformation).toEqual(jasmine.objectContaining({
                            customerTitleCode: '043',
                            gender: '2',
                            customerFirstName: 'Prieska',
                            customerInitials: 'P',
                            customerSurname: 'Tizora',
                            identityDocuments: [{
                                identityNumber: 'C12345678',
                                identityTypeCode: '06',
                                expiryDate: '2020-02-02'
                            }],
                            residenceCountryCode: 'ZAF',
                            citizenshipCountryCode: 'ZWE',
                            workPermitExpiryDate: '2019-03-03',
                            dateOfBirth: '1953-09-01',
                            maritalStatusCode: '2',
                            maritalTypeCode: 'W'
                        }));
                        var communicationInformation = customerInformation.communicationInformation;
                        expect(communicationInformation).toContain(jasmine.objectContaining({
                            communicationTypeCode: '01',
                            communicationDetails: '0810810811'
                        }));
                    }));

                it("should remove any space from customer initial", function () {
                    scope.$parent.customerInformationData.customerFirstName = 'Prieska';
                    scope.$parent.customerInformationData.customerInitials = 'P W L';

                    scope.save();
                    var customerInformation = customerService.createCustomer.calls.allArgs()[0][0].customerInformation;
                    expect(customerInformation).toEqual(jasmine.objectContaining({
                        customerFirstName: 'Prieska',
                        customerInitials: 'PWL'
                    }));
                });

                it("should goto customer information page", function () {
                    scope.idType = {value: '06'};
                    scope.$parent.customerInformationData.customerInitials = 'P W L';
                    scope.save();
                    scope.$digest();

                    expect(location.path()).toEqual('/apply/current-account/profile');
                });

                it("should goto customer information page", function () {
                    scope.idType = {value: '06'};
                    scope.$parent.customerInformationData.customerInitials = 'P W L';

                    scope.save();
                    scope.$digest();

                    user.hasBasicCustomerInformation.and.callThrough();
                    expect(user.principal()).toEqual({
                        systemPrincipalIdentifier: {
                            systemPrincipalId: '12345',
                            systemPrincipalKey: 'SBSA_SAP'
                        }
                    });
                });

                describe("when server returns error", function () {
                    beforeEach(inject(function () {
                        scope.idType = {value: '06'};
                        scope.$parent.customerInformationData.customerInitials = 'P W L';
                    }));

                    it("should set server error message if error code is not '4444'", function () {
                        customerService.createCustomer.and.returnValue(mock.response({}, 204, {
                            'x-sbg-response-type': "ERROR",
                            'x-sbg-response-code': "1003",
                            'x-sbg-response-message': 'Please complete all fields and ensure your details are correct'
                        }));

                        scope.save();
                        scope.$digest();

                        expect(scope.serverErrorMessage).toEqual('Please complete all fields and ensure your details are correct');
                    });

                    describe("because customer already exists", function () {
                        beforeEach(function () {
                            customerService.createCustomer.and.returnValue(mock.response({}, 204, {
                                'x-sbg-response-type': "ERROR",
                                'x-sbg-response-code': "4444",
                                'x-sbg-response-message': 'Customer already exists error message'
                            }));
                        });

                        it("should show 'customer already exists' modal if error code is '4444'", function () {
                            scope.save();
                            scope.$digest();

                            expect(scope.serverErrorMessage).toBeUndefined();
                            expect(scope.showExistingCustomerModal).toBeTruthy();
                        });

                        it("should navigate to link card if customer chooses to link existing card",
                            inject(function ($location) {
                                scope.save();
                                scope.$digest();
                                scope.navigateToLinkCard();
                                expect($location.path()).toEqual('/linkcard');
                            }));
                    });

                    describe("because customer has open RCP account", function () {
                        beforeEach(inject(function ($controller) {
                            customerService.createCustomer.and.returnValue(mock.response({}, 204, {
                                'x-sbg-response-type': "ERROR",
                                'x-sbg-response-code': "4445",
                                'x-sbg-response-message': 'You already have a Revolving Credit Plan (RCP)'
                            }));

                            $controller('CaptureBasicController', {
                                $scope: scope,
                                $routeParams: {product: 'rcp'},
                                User: user,
                                CustomerService: customerService,
                                LookUps: LookUps
                            });
                        }));

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
                });
            });

            describe("cancel", function () {
                it("should call parent cancelCapture", function () {
                    scope.cancel();
                    expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
                    cancelConfirmationService.confirmCancel();
                    expect(window).toHaveBeenCalledWith(-1);
                });
            });
        });

        describe("on change", function () {
            using([
                {titleCode: '040', gender: '2', description: 'Ms'},
                {titleCode: '041', gender: '1', description: 'Mr'},
                {titleCode: '042', gender: '2', description: 'Mrs'},
                {titleCode: '043', gender: '2', description: 'Miss'},
                {titleCode: '047', gender: '1', description: 'Sir'}
            ], function (data) {
                it("should change gender to " + data.gender + " when select title " + data.description, function () {
                    scope.$parent.customerInformationData.customerTitleCode = data.titleCode;
                    scope.changeGender();

                    expect(scope.$parent.customerInformationData.gender).toEqual(data.gender);
                });
            });

            using([
                {titleCode: '044', gender: '', description: 'Dr'},
                {titleCode: '046', gender: '', description: 'Prof'},
                {titleCode: '052', gender: '', description: 'The honourable'},
                {titleCode: '083', gender: '', description: 'Sgt'},
                {titleCode: '088', gender: '', description: 'Lt'},
                {titleCode: '090', gender: '', description: 'Maj'},
                {titleCode: '095', gender: '', description: 'Major-general'},
                {titleCode: '097', gender: '', description: 'Gen'},
                {titleCode: '122', gender: '', description: 'Rev'}
            ], function (data) {
                it("should not change gender when select title " + data.description, function () {
                    scope.$parent.customerInformationData.gender = 'something';
                    scope.$parent.customerInformationData.customerTitleCode = data.titleCode;
                    scope.changeGender();

                    expect(scope.$parent.customerInformationData.gender).toEqual('something');
                });
            });

            describe('when changing id type', function () {
                it("should remove date of birth and error as well as country of nationality, birth and citizenship",
                    function () {
                        scope.$parent.customerInformationData.dateOfBirth = '2020-01-01';
                        scope.errorMessage.dateOfBirth = 'error';
                        scope.changeIdType();

                        expect(scope.$parent.customerInformationData.dateOfBirth).toBeUndefined();
                        expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
                        expect(scope.$parent.customerInformationData.citizenshipCountryCode).toBeUndefined();
                        expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();

                        expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                    });

                it("should remove ID number and error from scope when changing ID type to passport", function () {
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '1231231231234',
                        identityTypeCode: '01',
                        countryCode: 'ZA'
                    }];
                    scope.errorMessage.idNumber = 'error';
                    scope.idType = {value: '06'};

                    scope.changeIdType();

                    expect(scope.$parent.customerInformationData.identityDocuments[0]).toEqual({
                        identityTypeCode: '06'
                    });
                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should remove passport related properties and errors from scope when changing ID type to south african ID",
                    function () {
                        scope.$parent.customerInformationData.identityDocuments = [{
                            identityNumber: 'PASSPORT12',
                            identityTypeCode: '06',
                            countryCode: 'UG'
                        }];
                        scope.$parent.customerInformationData.permitDetails = [{
                            identityNumber: 'PERMIT1242',
                            identityTypeCode: '03',
                            countryCode: 'AL',
                            issuedDate: '2010-10-10',
                            expiryDate: '2019-01-01'
                        }];

                        scope.errorMessage.passportExpiryDate = 'error';
                        scope.errorMessage.permitExpiryDate = 'error';
                        scope.idType = {value: '01'};

                        scope.changeIdType();

                        expect(scope.$parent.customerInformationData.identityDocuments[0]).toEqual({
                            identityTypeCode: '01'
                        });

                        expect(scope.$parent.customerInformationData.permitDetails).toBeUndefined();

                        expect(scope.errorMessage.passportExpiryDate).toBeUndefined();
                        expect(scope.errorMessage.permitExpiryDate).toBeUndefined();
                    });
            });
        });

        describe("validation", function () {
            beforeEach(function () {
                scope.errorMessage = {};
            });

            describe("SA ID number", function () {
                it("should set idNumber error message when the eleventh digit is not equal to zero, one, or two",
                    function () {
                        var element = {
                            $valid: true,
                            $viewValue: '1234567890323'
                        };

                        scope.checkIdNumber(element);

                        expect(scope.errorMessage.idNumber).toEqual('Please ensure that the 11th digit of your entered ID number is 0, 1 or 2');
                    });

                it('should get dateOfBirth from ID and not show dob error message', function () {
                    var element = {
                        $valid: true,
                        $viewValue: '5603175379086'
                    };
                    scope.checkIdNumber(element);
                    expect(scope.customerInformationData.dateOfBirth).toEqual('1956-03-17');
                    expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                });

                it('should get dateOfBirth from ID for birth days in the 2000s and show dob error message',
                    function () {
                        var element = {
                            $valid: true,
                            $viewValue: '1512269141084'
                        };
                        scope.checkIdNumber(element);
                        expect(scope.customerInformationData.dateOfBirth).toEqual('2015-12-26');
                        expect(scope.errorMessage.dateOfBirth).toEqual('You must be 18 years or older to open an account');
                    });

                it("should not set idNumber error message when the eleventh digit is equal to zero, one, or two",
                    function () {
                        var element = {
                            $valid: true,
                            $viewValue: '5309015231095'
                        };

                        scope.checkIdNumber(element);

                        expect(scope.errorMessage.idNumber).toBeUndefined();
                    });

                it("should not set idNumber error message when the element is undefined", function () {
                    scope.checkIdNumber(undefined);

                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should clear idNumber error message when the element is invalid", function () {
                    scope.errorMessage.idNumber = 'some message';

                    var element = {
                        $valid: false,
                        $viewValue: '1234567890323'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should clear idNumber error message when the element is empty", function () {
                    scope.errorMessage.idNumber = 'some message';

                    var element = {
                        $valid: true,
                        $viewValue: ''
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should clear idNumber error message when the calculated last digit is 0", function () {
                    scope.errorMessage.idNumber = 'some message';

                    var element = {
                        $valid: true,
                        $viewValue: '7204115078090'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should set idNumber error message when the check digit is wrong", function () {
                    var element = {
                        $valid: true,
                        $viewValue: '8001015009088'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toEqual('Please enter a valid 13-digit South African ID number');
                });

                it("should call checkGender if IdNumber is valid", function () {
                    spyOn(scope, 'checkGender');
                    var element = {
                        $valid: true,
                        $viewValue: '8606118643184'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.checkGender).toHaveBeenCalled();
                });

                it("should set idNumber error message when birth date is wrong format", function () {
                    var element = {
                        $valid: true,
                        $viewValue: '8210320090118'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toEqual('Please ensure that your ID number matches your date of birth');
                });

                it("should set idNumber error message when the check digit is wrong", function () {
                    var element = {
                        $valid: true,
                        $viewValue: '8001015009088'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toEqual('Please enter a valid 13-digit South African ID number');
                });

                it("should set dob error message when age is less than 18", function () {
                    var clock = sinon.useFakeTimers(moment('20141214', 'YYYYMMDD').valueOf());

                    var element = {
                        $valid: true,
                        $viewValue: '9612155009080'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.dateOfBirth).toEqual('You must be 18 years or older to open an account');
                    clock.restore();
                });

                it("should not set idNumber error message when age is 18", function () {
                    scope.errorMessage.idNumber = 'some message';
                    var clock = sinon.useFakeTimers(moment('20141214', 'YYYYMMDD').valueOf());

                    var element = {
                        $valid: true,
                        $viewValue: '9612145009083'
                    };

                    scope.checkIdNumber(element);

                    expect(scope.errorMessage.idNumber).toBeUndefined();
                    clock.restore();
                });

                it("should not set error messages when the Passport ID type is selected and the country of citizenship is not South Africa",
                    function () {
                        scope.$parent.customerInformationData.citizenshipCountryCode = "AL";
                        scope.idType = {value: '06'};

                        scope.checkIdType();

                        expect(scope.errorMessage.idType).toBeUndefined();
                        expect(scope.errorMessage.countryOfCitizenship).toBeUndefined();
                    });

                it("should set  error message when the Passport ID type is selected and the country of citizenship is South Africa",
                    function () {
                        scope.$parent.customerInformationData.citizenshipCountryCode = "ZA";
                        scope.idType = {value: '06'};

                        scope.checkIdType();

                        expect(scope.errorMessage.idType).toEqual('If you are a South African citizen, please select your South African ID rather than your passport');
                        expect(scope.errorMessage.countryOfCitizenship).toEqual('If you are a South African citizen, please select your South African ID rather than your passport');
                    });

                describe("with date of birth", function () {
                    beforeEach(function () {
                        scope.customerInformationData.identityDocuments = [{
                            identityNumber: '5603175379086',
                            identityTypeCode: '01'
                        }];
                    });

                    it("should set dateOfBirth error message when date of birth does not match that of ID",
                        function () {
                            var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                            scope.checkDateOfBirth(moment('1957-03-17', 'YYYY-MM-DD'));

                            expect(scope.errorMessage.dateOfBirth).toEqual('Please ensure that your date of birth matches your ID number');
                            clock.restore();
                        });

                    it("should not set dateOfBirth error message when date of birth matches that of ID", function () {
                        var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                        scope.checkDateOfBirth(moment('1956-03-17', 'YYYY-MM-DD'));

                        expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                        clock.restore();
                    });

                    it("should not set dateOfBirth error message when date of birth matches that of ID for a century ago",
                        function () {
                            scope.customerInformationData.identityDocuments = [{
                                identityNumber: '1512269141084',
                                identityTypeCode: '01'
                            }];

                            var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                            scope.checkDateOfBirth(moment('1915-12-26', 'YYYY-MM-DD'));

                            expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                            clock.restore();
                        });
                });
            });

            describe("passport", function () {
                it("should set date of birth error message when age is younger than 18", function () {
                    var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                    scope.checkDateOfBirth(moment('19961215 00:00:00', 'YYYYMMDD hh:mm:ss'));

                    expect(scope.errorMessage.dateOfBirth).toEqual('You must be 18 years or older to open an account');
                    clock.restore();
                });

                it("should clear date of birth error message when age is younger than 18", function () {
                    scope.errorMessage.idNumber = 'some message';
                    var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                    scope.checkDateOfBirth(moment('19961214 00:00:00', 'YYYYMMDD hh:mm:ss'));

                    expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                    clock.restore();
                });

                it("should set passport expiry date error message when current moment", function () {
                    scope.checkPassportExpiryDate(undefined);

                    expect(scope.errorMessage.passportExpiryDate).toEqual('We cannot offer you an account if your passport expires within 3 months');
                });


                it("should set passport expiry date error message when it is within the next 3 months", function () {
                    var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                    scope.checkPassportExpiryDate(moment('20150313 00:00:00', 'YYYYMMDD hh:mm:ss'));

                    expect(scope.errorMessage.passportExpiryDate).toEqual('We cannot offer you an account if your passport expires within 3 months');
                    clock.restore();
                });

                it("should set passport expiry date error message when it is within the next 3 months", function () {
                    scope.errorMessage.passportExpiryDate = 'some message';
                    var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                    scope.checkPassportExpiryDate(moment('20150314 00:00:00', 'YYYYMMDD hh:mm:ss'));

                    expect(scope.errorMessage.passportExpiryDate).toBeUndefined();
                    clock.restore();
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
            });

            describe("gender", function () {
                beforeEach(function () {
                    scope.errorMessage.title = 'some error';
                    scope.errorMessage.gender = 'some error';
                    scope.errorMessage.idNumber = 'some error';
                });

                it("should set title and gender error message when they are not matching", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '040'; // Ms
                    scope.$parent.customerInformationData.gender = '1';

                    scope.checkGender();

                    expect(scope.errorMessage.title).toEqual("Your title and gender don't match");
                    expect(scope.errorMessage.gender).toEqual("Your title and gender don't match");
                });

                it("should clear title and gender error message when they are matching", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '040'; // Ms
                    scope.$parent.customerInformationData.gender = '2';

                    scope.checkGender();

                    expect(scope.errorMessage.title).toBeUndefined();
                    expect(scope.errorMessage.gender).toBeUndefined();
                });

                it("should clear title and gender error message when title is unisex", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '044'; // Dr
                    scope.$parent.customerInformationData.gender = '1';

                    scope.checkGender();

                    expect(scope.errorMessage.title).toBeUndefined();
                    expect(scope.errorMessage.gender).toBeUndefined();
                });

                it("should clear error messages if title, gender and id number match", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '040'; // Ms
                    scope.$parent.customerInformationData.gender = '2';
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '1212124121212',
                        identityTypeCode: '01'
                    }];

                    scope.checkGender();

                    expect(scope.errorMessage.title).toBeUndefined();
                    expect(scope.errorMessage.gender).toBeUndefined();
                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should set title, gender and id number error message if id number does not match", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '040'; // Ms
                    scope.$parent.customerInformationData.gender = '2';
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '1212125121212',
                        identityTypeCode: '01'
                    }];

                    scope.checkGender();

                    expect(scope.errorMessage.title).toEqual('Your gender and/or title does not match the gender in your ID number');
                    expect(scope.errorMessage.gender).toEqual('Your gender and/or title does not match the gender in your ID number');
                    expect(scope.errorMessage.idNumber).toEqual('Your gender and/or title does not match the gender in your ID number');
                });

                it("should not set id number error message if its empty", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '040'; // Ms
                    scope.$parent.customerInformationData.gender = '1';
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityTypeCode: '01'
                    }];

                    scope.checkGender();

                    expect(scope.errorMessage.title).toEqual("Your title and gender don't match");
                    expect(scope.errorMessage.gender).toEqual("Your title and gender don't match");
                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should not set error messages if title and gender are empty", function () {
                    scope.$parent.customerInformationData.customerTitleCode = undefined;
                    scope.$parent.customerInformationData.gender = undefined;
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '1231231231234',
                        identityTypeCode: '01'
                    }];

                    scope.checkGender();

                    expect(scope.errorMessage.title).toBeUndefined();
                    expect(scope.errorMessage.gender).toBeUndefined();
                    expect(scope.errorMessage.idNumber).toBeUndefined();
                });

                it("should not set title error message if title is unisex", function () {
                    scope.$parent.customerInformationData.customerTitleCode = '044'; // Dr
                    scope.$parent.customerInformationData.gender = '1';
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '1231231231234',
                        identityTypeCode: '01'
                    }];

                    scope.checkGender();

                    expect(scope.errorMessage.title).toBeUndefined();
                    expect(scope.errorMessage.gender).toEqual('Your gender and/or title does not match the gender in your ID number');
                    expect(scope.errorMessage.idNumber).toEqual('Your gender and/or title does not match the gender in your ID number');
                });
            });

            describe("first name", function () {
                it("should not validate if first name and initial is empty", function () {
                    scope.$parent.customerInformationData.customerFirstName = undefined;
                    scope.$parent.customerInformationData.customerInitials = undefined;

                    scope.checkInitial();

                    expect(scope.errorMessage.initial).toBeUndefined();
                    expect(scope.errorMessage.firstName).toBeUndefined();
                });

                it("should set error message if first letter of first name is different from first letter of initial",
                    function () {
                        scope.$parent.customerInformationData.customerInitials = 'W';
                        scope.$parent.customerInformationData.customerFirstName = 'Someone';

                        scope.checkInitial();

                        expect(scope.errorMessage.initial).toEqual('Your first name should begin with the same letter as your first initial, and be the same case');
                        expect(scope.errorMessage.firstName).toEqual('Your first name should begin with the same letter as your first initial, and be the same case');
                    });

                it("should clear error message if initial is equal to first name", function () {
                    scope.errorMessage.initial = "Some error";
                    scope.errorMessage.firstName = "Some error";

                    scope.$parent.customerInformationData.customerInitials = 'SH';
                    scope.$parent.customerInformationData.customerFirstName = 'Someone Haha';

                    scope.checkInitial();

                    expect(scope.errorMessage.initial).toBeUndefined();
                    expect(scope.errorMessage.firstName).toBeUndefined();
                });
            });

            describe("date", function () {
                it("should return false if date of birth is not valid", function () {
                    scope.errorMessage.dateOfBirth = 'some thing';

                    expect(scope.allDatesValid()).toBeFalsy();
                });

                it("should return false if passport expiry date is not valid", function () {
                    scope.errorMessage.passportExpiryDate = 'some thing';

                    expect(scope.allDatesValid()).toBeFalsy();
                });

                it("should return false if permit expiry date is not valid", function () {
                    scope.errorMessage.permitExpiryDate = 'some thing';

                    expect(scope.allDatesValid()).toBeFalsy();
                });

                it("should return true if all dates are valid", function () {
                    scope.errorMessage = {};

                    expect(scope.allDatesValid()).toBeTruthy();
                });
            });

            describe("genderTitleIdMatch ", function () {
                it("should return false if date of birth is not valid", function () {
                    scope.errorMessage.gender = 'some thing';

                    expect(scope.genderTitleIdMatch()).toBeFalsy();
                });

                it("should return false if passport expiry date is not valid", function () {
                    scope.errorMessage.idNumber = 'some thing';

                    expect(scope.genderTitleIdMatch()).toBeFalsy();
                });

                it("should return false if permit expiry date is not valid", function () {
                    scope.errorMessage.title = 'some thing';

                    expect(scope.genderTitleIdMatch()).toBeFalsy();
                });

                it("should return true if all dates are valid", function () {
                    scope.errorMessage = {};

                    expect(scope.genderTitleIdMatch()).toBeTruthy();
                });
            });
        });

        describe("with countries", function () {
            afterEach(function () {
                customerManagementV4Feature = true;
            });

            describe("when dealing with a SA citizen", function () {
                it("should set country of citizenship to 'ZA' if customer management v4 toggle is on",
                    function () {
                        scope.$parent.customerInformationData.identityDocuments = [{
                            identityNumber: '5309015231095',
                            identityTypeCode: '01',
                            countryCode: 'ZA'
                        }];
                        scope.populateCountries();
                       // expect(scope.$parent.customerInformationData.birthCountryCode).toEqual('ZA');
                        expect(scope.$parent.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                     //   expect(scope.$parent.customerInformationData.nationalityCountryCode).toEqual('ZA');
                    });

                it("should only set citizenship to ZA if customer management v4 toggle is off", function () {
                    customerManagementV4Feature = false;
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '5309015231095',
                        identityTypeCode: '01',
                        countryCode: 'ZA'
                    }];
                    scope.populateCountries();
                    expect(scope.$parent.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                    expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                    expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
                });
            });

            describe("when dealing with non SA citizen", function () {
                it("should not set country of birth, nationality and citizenship to 'ZA'", function () {
                    scope.errorMessage = {};
                    scope.$parent.customerInformationData.identityDocuments = [{
                        identityNumber: '5309015231194',
                        countryCode: 'ZA',
                        identityTypeCode: '01'
                    }];
                    scope.populateCountries();
                    expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                    expect(scope.$parent.customerInformationData.citizenshipCountryCode).toBeUndefined();
                    expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
                });
            });

            describe("when dealing with passport holder", function () {
                it("should set country of nationality and citizenship to that of passport origin if customer management v4 toggle is on",
                    function () {
                        scope.$parent.customerInformationData.identityDocuments = [{
                            identityNumber: '5309015231194',
                            countryCode: 'ZA',
                            identityTypeCode: '06'
                        }];
                        scope.populateOriginCountries();
                        expect(scope.$parent.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                        expect(scope.$parent.customerInformationData.nationalityCountryCode).toEqual('ZA');
                        expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                    });

                it("should only set citizenship to that of passport origin if customer management v4 toggle is off",
                    function () {
                        customerManagementV4Feature = false;
                        scope.$parent.customerInformationData.identityDocuments = [{
                            identityTypeCode: '06',
                            countryCode: 'UG'
                        }];
                        scope.populateOriginCountries();
                        expect(scope.$parent.customerInformationData.citizenshipCountryCode).toEqual('UG');
                        expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
                        expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                    });
            });

            it("should not set any country to 'ZA' if ID number is empty", function () {
                scope.errorMessage = {};
                delete scope.$parent.customerInformationData.idNumber;
                scope.populateCountries();
                expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                expect(scope.$parent.customerInformationData.citizenshipCountryCode).toBeUndefined();
                expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
            });

            it("should not set any country to 'ZA' if ID number is invalid", function () {
                scope.errorMessage.idNumber = 'some error in ID';
                scope.populateCountries();
                expect(scope.$parent.customerInformationData.birthCountryCode).toBeUndefined();
                expect(scope.$parent.customerInformationData.citizenshipCountryCode).toBeUndefined();
                expect(scope.$parent.customerInformationData.nationalityCountryCode).toBeUndefined();
            });
        });

        describe("isNotSACitizen", function () {
            it('should return true if customer selects idType as passport ', function () {
                scope.idType.value = '06';
                expect(scope.isNotSACitizen()).toBeTruthy();
            });

            it('should return false if customer has no national id ', function () {
                expect(scope.isNotSACitizen()).toBeFalsy();
            });

            it('should return false if customer\'s SA identityNumber is undefined', function () {
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: undefined,
                    identityTypeCode: '01'
                }];
                expect(scope.isNotSACitizen()).toBeFalsy();
            });

            it('should return false if customer\'s SA identityNumber is not equal to 13 digits', function () {
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '890101516383',
                    identityTypeCode: '01'
                }];
                expect(scope.isNotSACitizen()).toBeFalsy();
            });

            it('should return false if customer\'s SA identityNumber has a 11th digit of 0', function () {
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '8901015163083',
                    identityTypeCode: '01'
                }];
                expect(scope.isNotSACitizen()).toBeFalsy();
            });

            it('should return true if customer\'s SA identityNumber has a 11th digit of 1', function () {
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '8901015163183',
                    identityTypeCode: '01'
                }];
                expect(scope.isNotSACitizen()).toBeTruthy();
            });
        });
    });

    describe('CaptureBasicController on user with customer information', function () {
        beforeEach(inject(function ($rootScope, $controller, $location, User) {
            scope = $rootScope.$new();
            location = $location;
            user = User;
            spyOn(user, 'hasBasicCustomerInformation').and.returnValue(true);

            $controller('CaptureBasicController', {
                $scope: scope,
                $routeParams: {product: 'current-account'},
                User: user
            });
        }));

        it("should goto customer information page", inject(function ($location) {
            expect($location.path()).toEqual('/apply/current-account/profile');
        }));
    });

    describe('CustomerService', function () {
        var test, customerService;

        beforeEach(inject(function (_ServiceTest_, _CustomerService_) {
            customerService = _CustomerService_;
            test = _ServiceTest_;
            test.spyOnEndpoint('createCustomer');
        }));

        it('should update the customer information', function () {
            test.stubResponse('createCustomer', 200, {BpID: "0001"}, {});
            customerService.createCustomer({
                some: "thing"
            });
            test.resolvePromise();

            var createCustomerEndpoint = test.endpoint('createCustomer');
            expect(createCustomerEndpoint).toHaveBeenCalledWith(({some: 'thing'}));
        });
    });
});
