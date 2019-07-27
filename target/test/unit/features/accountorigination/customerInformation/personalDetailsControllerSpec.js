describe('PersonalDetailsController', function () {

    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.personalDetails'));

    var scope, capitalizeFilter, mock, controller, customerInformationData, customerInformationErrors;

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

    var initialiseController = function () {
        controller('PersonalDetailsController', {
            $scope: scope,
            LookUps: LookUps,
            capitalizeFilter: capitalizeFilter,
            CustomerInformationData: customerInformationData,
            CustomerInformationErrors: customerInformationErrors
        });
    };

    beforeEach(inject(function ($rootScope, _capitalizeFilter_, $controller, _mock_, CustomerInformationData,
                                CustomerInformationErrors) {
        scope = $rootScope.$new();
        customerInformationData = CustomerInformationData;
        customerInformationErrors = CustomerInformationErrors;
        capitalizeFilter = _capitalizeFilter_;
        controller = $controller;
        mock = _mock_;

        initialiseController();
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
            expect(scope.customerInformationData.communicationInformation).toEqual(
                [{
                    communicationTypeCode: '02',
                    communicationDetails: ''
                }]
            );
        });

        it("should be have a cellphone contact", function () {
            expect(scope.customerInformationData.hasCellphoneContact()).toBeTruthy();
        });

        it('should set the preferred communication language to english', function () {
            expect(scope.customerInformationData.preferredLanguageCode).toEqual('EN');
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

    describe("on change", function () {
        using([
            {titleCode: '040', gender: '2', description: 'Ms'},
            {titleCode: '041', gender: '1', description: 'Mr'},
            {titleCode: '042', gender: '2', description: 'Mrs'},
            {titleCode: '043', gender: '2', description: 'Miss'},
            {titleCode: '047', gender: '1', description: 'Sir'}
        ], function (data) {
            it("should change gender to " + data.gender + " when select title " + data.description, function () {
                scope.customerInformationData.customerTitleCode = data.titleCode;
                scope.changeGender();

                expect(scope.customerInformationData.gender).toEqual(data.gender);
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
                scope.customerInformationData.gender = 'something';
                scope.customerInformationData.customerTitleCode = data.titleCode;
                scope.changeGender();

                expect(scope.customerInformationData.gender).toEqual('something');
            });
        });

        describe('when changing id type', function () {
            it("should remove date of birth and error as well as country of nationality, birth and citizenship",
                function () {
                    scope.customerInformationData.dateOfBirth = '2020-01-01';
                    customerInformationErrors.dateOfBirth = 'error';
                    scope.changeIdType();

                    expect(scope.customerInformationData.dateOfBirth).toBeUndefined();
                    expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
                    expect(scope.customerInformationData.citizenshipCountryCode).toBeUndefined();
                    expect(scope.customerInformationData.birthCountryCode).toBeUndefined();

                    expect(scope.errorMessage.dateOfBirth).toBeUndefined();
                });

            it("should remove ID number and error from scope when changing ID type to passport", function () {
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '1231231231234',
                    identityTypeCode: '01',
                    countryCode: 'ZA'
                }];
                scope.errorMessage.idNumber = 'error';
                scope.idType = {value: '06'};

                scope.changeIdType();

                expect(scope.customerInformationData.identityDocuments[0]).toEqual({
                    identityTypeCode: '06'
                });
                expect(scope.errorMessage.idNumber).toBeUndefined();
            });

            it("should remove passport related properties and errors from scope when changing ID type to south african ID",
                function () {
                    scope.customerInformationData.identityDocuments = [{
                        identityNumber: 'PASSPORT12',
                        identityTypeCode: '06',
                        countryCode: 'UG'
                    }];
                    scope.customerInformationData.permitDetails = [{
                        identityNumber: 'PERMIT1242',
                        identityTypeCode: '03',
                        countryCode: 'AL',
                        issuedDate: '2010-10-10',
                        expiryDate: '2019-01-01'
                    }];

                    customerInformationErrors.passportExpiryDate = 'error';
                    customerInformationErrors.permitExpiryDate = 'error';
                    scope.idType = {value: '01'};

                    scope.changeIdType();

                    expect(scope.customerInformationData.identityDocuments[0]).toEqual({
                        identityTypeCode: '01'
                    });

                    expect(customerInformationData.permitDetails).toBeUndefined();

                    expect(scope.customerInformationErrors.passportExpiryDate).toBeUndefined();
                    expect(scope.customerInformationErrors.permitExpiryDate).toBeUndefined();
                });
        });
    });

    describe("validation", function () {
        beforeEach(function () {
            scope.errorMessage = {};
            scope.dateOfBirthErrorMessage = 'You must be 18 years or older to open an account';
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
                expect(scope.customerInformationErrors.dateOfBirth).toBeUndefined();
            });

            it('should get dateOfBirth from ID for birth days in the 2000s and show dob error message',
                function () {
                    var element = {
                        $valid: true,
                        $viewValue: '1512269141084'
                    };
                    scope.checkIdNumber(element);
                    expect(scope.customerInformationData.dateOfBirth).toEqual('2015-12-26');
                    expect(scope.customerInformationErrors.dateOfBirth).toEqual('You must be 18 years or older to open an account');
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

                expect(scope.customerInformationErrors.dateOfBirth).toEqual('You must be 18 years or older to open an account');
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
                    scope.customerInformationData.citizenshipCountryCode = "AL";
                    scope.idType = {value: '06'};

                    scope.checkIdType();

                    expect(scope.errorMessage.idType).toBeUndefined();
                    expect(scope.errorMessage.countryOfCitizenship).toBeUndefined();
                });

            it("should set  error message when the Passport ID type is selected and the country of citizenship is South Africa",
                function () {
                    scope.customerInformationData.citizenshipCountryCode = "ZA";
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

                        expect(scope.customerInformationErrors.dateOfBirth).toEqual('Please ensure that your date of birth matches your ID number');
                        clock.restore();
                    });

                it("should not set dateOfBirth error message when date of birth matches that of ID", function () {
                    var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                    scope.checkDateOfBirth(moment('1956-03-17', 'YYYY-MM-DD'));

                    expect(scope.customerInformationErrors.dateOfBirth).toBeUndefined();
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

                        expect(scope.customerInformationErrors.dateOfBirth).toBeUndefined();
                        clock.restore();
                    });
            });
        });

        describe("passport", function () {
            it("should set date of birth error message when age is younger than 18", function () {
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkDateOfBirth(moment('19961215 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.dateOfBirth).toEqual('You must be 18 years or older to open an account');
                clock.restore();
            });

            it("should clear date of birth error message when age is younger than 18", function () {
                scope.errorMessage.idNumber = 'some message';
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkDateOfBirth(moment('19961214 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.dateOfBirth).toBeUndefined();
                clock.restore();
            });

            it("should set passport expiry date error message when current moment", function () {
                scope.checkPassportExpiryDate(undefined);

                expect(scope.customerInformationErrors.passportExpiryDate).toEqual('We cannot offer you an account if your passport expires within 3 months');
            });


            it("should set passport expiry date error message when it is within the next 3 months", function () {
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPassportExpiryDate(moment('20150313 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.passportExpiryDate).toEqual('We cannot offer you an account if your passport expires within 3 months');
                clock.restore();
            });

            it("should set passport expiry date error message when it is within the next 3 months", function () {
                scope.customerInformationErrors.passportExpiryDate = 'some message';
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPassportExpiryDate(moment('20150314 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.passportExpiryDate).toBeUndefined();
                clock.restore();
            });


            it("should set permit expiry date error message when current moment", function () {
                scope.checkPermitExpiryDate(undefined);

                expect(scope.customerInformationErrors.permitExpiryDate).toEqual('We cannot offer you an account if your permit expires within 3 months');

            });

            it("should set permit expiry date error message when it is within the next 3 months", function () {
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPermitExpiryDate(moment('20150313 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.permitExpiryDate).toEqual('We cannot offer you an account if your permit expires within 3 months');
                clock.restore();
            });

            it("should set permit expiry date error message when it is within the next 3 months", function () {
                scope.customerInformationErrors.permitExpiryDate = 'some message';
                var clock = sinon.useFakeTimers(moment('20141214 14:11:59', 'YYYYMMDD hh:mm:ss').valueOf());

                scope.checkPermitExpiryDate(moment('20150314 00:00:00', 'YYYYMMDD hh:mm:ss'));

                expect(scope.customerInformationErrors.permitExpiryDate).toBeUndefined();
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
                scope.customerInformationData.customerTitleCode = '040'; // Ms
                scope.customerInformationData.gender = '1';

                scope.checkGender();

                expect(scope.errorMessage.title).toEqual("Your title and gender don't match");
                expect(scope.errorMessage.gender).toEqual("Your title and gender don't match");
            });

            it("should clear title and gender error message when they are matching", function () {
                scope.customerInformationData.customerTitleCode = '040'; // Ms
                scope.customerInformationData.gender = '2';

                scope.checkGender();

                expect(scope.errorMessage.title).toBeUndefined();
                expect(scope.errorMessage.gender).toBeUndefined();
            });

            it("should clear title and gender error message when title is unisex", function () {
                scope.customerInformationData.customerTitleCode = '044'; // Dr
                scope.customerInformationData.gender = '1';

                scope.checkGender();

                expect(scope.errorMessage.title).toBeUndefined();
                expect(scope.errorMessage.gender).toBeUndefined();
            });

            it("should clear error messages if title, gender and id number match", function () {
                scope.customerInformationData.customerTitleCode = '040'; // Ms
                scope.customerInformationData.gender = '2';
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '1212124121212',
                    identityTypeCode: '01'
                }];

                scope.checkGender();

                expect(scope.errorMessage.title).toBeUndefined();
                expect(scope.errorMessage.gender).toBeUndefined();
                expect(scope.errorMessage.idNumber).toBeUndefined();
            });

            it("should set title, gender and id number error message if id number does not match", function () {
                scope.customerInformationData.customerTitleCode = '040'; // Ms
                scope.customerInformationData.gender = '2';
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '1212125121212',
                    identityTypeCode: '01'
                }];

                scope.checkGender();

                expect(scope.errorMessage.title).toEqual('Your gender and/or title does not match the gender in your ID number');
                expect(scope.errorMessage.gender).toEqual('Your gender and/or title does not match the gender in your ID number');
                expect(scope.errorMessage.idNumber).toEqual('Your gender and/or title does not match the gender in your ID number');
            });

            it("should not set id number error message if its empty", function () {
                scope.customerInformationData.customerTitleCode = '040'; // Ms
                scope.customerInformationData.gender = '1';
                scope.customerInformationData.identityDocuments = [{
                    identityTypeCode: '01'
                }];

                scope.checkGender();

                expect(scope.errorMessage.title).toEqual("Your title and gender don't match");
                expect(scope.errorMessage.gender).toEqual("Your title and gender don't match");
                expect(scope.errorMessage.idNumber).toBeUndefined();
            });

            it("should not set error messages if title and gender are empty", function () {
                scope.customerInformationData.customerTitleCode = undefined;
                scope.customerInformationData.gender = undefined;
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '1231231231234',
                    identityTypeCode: '01'
                }];

                scope.checkGender();

                expect(scope.errorMessage.title).toBeUndefined();
                expect(scope.errorMessage.gender).toBeUndefined();
                expect(scope.errorMessage.idNumber).toBeUndefined();
            });

            it("should not set title error message if title is unisex", function () {
                scope.customerInformationData.customerTitleCode = '044'; // Dr
                scope.customerInformationData.gender = '1';
                scope.customerInformationData.identityDocuments = [{
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
                scope.customerInformationData.customerFirstName = undefined;
                scope.customerInformationData.customerInitials = undefined;

                scope.checkInitial();

                expect(scope.errorMessage.initial).toBeUndefined();
                expect(scope.errorMessage.firstName).toBeUndefined();
            });

            it("should set error message if first letter of first name is different from first letter of initial",
                function () {
                    scope.customerInformationData.customerInitials = 'W';
                    scope.customerInformationData.customerFirstName = 'Someone';

                    scope.checkInitial();

                    expect(scope.errorMessage.initial).toEqual('Your first name should begin with the same letter as your first initial, and be the same case');
                    expect(scope.errorMessage.firstName).toEqual('Your first name should begin with the same letter as your first initial, and be the same case');
                });

            it("should clear error message if initial is equal to first name", function () {
                scope.errorMessage.initial = "Some error";
                scope.errorMessage.firstName = "Some error";

                scope.customerInformationData.customerInitials = 'SH';
                scope.customerInformationData.customerFirstName = 'Someone Haha';

                scope.checkInitial();

                expect(scope.errorMessage.initial).toBeUndefined();
                expect(scope.errorMessage.firstName).toBeUndefined();
            });
        });

    });

    describe("with countries", function () {
        afterEach(function () {
            customerManagementV4Feature = true;
        });

        describe("when dealing with a SA citizen", function () {
            it("should set country of birth, nationality and citizenship to 'ZA' if customer management v4 toggle is on",
                function () {
                    scope.customerInformationData.identityDocuments = [{
                        identityNumber: '5309015231095',
                        identityTypeCode: '01',
                        countryCode: 'ZA'
                    }];
                    scope.populateCountries();
                    expect(scope.customerInformationData.birthCountryCode).toEqual('ZA');
                    expect(scope.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                    expect(scope.customerInformationData.nationalityCountryCode).toEqual('ZA');
                });

            it("should only set citizenship to ZA if customer management v4 toggle is off", function () {
                customerManagementV4Feature = false;
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '5309015231095',
                    identityTypeCode: '01',
                    countryCode: 'ZA'
                }];
                scope.populateCountries();
                expect(scope.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
                expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
            });
        });

        describe("when dealing with non SA citizen", function () {
            it("should not set country of birth, nationality and citizenship to 'ZA'", function () {
                scope.errorMessage = {};
                scope.customerInformationData.identityDocuments = [{
                    identityNumber: '5309015231194',
                    countryCode: 'ZA',
                    identityTypeCode: '01'
                }];
                scope.populateCountries();
                expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
                expect(scope.customerInformationData.citizenshipCountryCode).toBeUndefined();
                expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
            });
        });

        describe("when dealing with passport holder", function () {
            it("should set country of nationality and citizenship to that of passport origin if customer management v4 toggle is on",
                function () {
                    scope.customerInformationData.identityDocuments = [{
                        identityNumber: '5309015231194',
                        countryCode: 'ZA',
                        identityTypeCode: '06'
                    }];
                    scope.populateOriginCountries();
                    expect(scope.customerInformationData.citizenshipCountryCode).toEqual('ZA');
                    expect(scope.customerInformationData.nationalityCountryCode).toEqual('ZA');
                    expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
                });

            it("should only set citizenship to that of passport origin if customer management v4 toggle is off",
                function () {
                    customerManagementV4Feature = false;
                    scope.customerInformationData.identityDocuments = [{
                        identityTypeCode: '06',
                        countryCode: 'UG'
                    }];
                    scope.populateOriginCountries();
                    expect(scope.customerInformationData.citizenshipCountryCode).toEqual('UG');
                    expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
                    expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
                });
        });

        it("should not set any country to 'ZA' if ID number is empty", function () {
            scope.errorMessage = {};
            delete scope.customerInformationData.idNumber;
            scope.populateCountries();
            expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
            expect(scope.customerInformationData.citizenshipCountryCode).toBeUndefined();
            expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
        });

        it("should not set any country to 'ZA' if ID number is invalid", function () {
            scope.errorMessage.idNumber = 'some error in ID';
            scope.populateCountries();
            expect(scope.customerInformationData.birthCountryCode).toBeUndefined();
            expect(scope.customerInformationData.citizenshipCountryCode).toBeUndefined();
            expect(scope.customerInformationData.nationalityCountryCode).toBeUndefined();
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
