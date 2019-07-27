var customerManagementV4Feature = false;

{
    customerManagementV4Feature = true;
}

(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.customerInformation.captureBasic',
        [
            'refresh.lookups',
            'refresh.configuration',
            'refresh.accountOrigination.customerService',
            'refresh.accountOrigination.common.directives.cancelConfirmation',
            'refresh.accountOrigination.common.services.accountOriginationProvider',
            'refresh.dtmanalytics'
        ]);

    app.config(function ($routeProvider) {
        var isValidForCustomerInformation = function (CurrentAccountApplication, RcpApplication) {
            return CurrentAccountApplication.isNew() || RcpApplication.isNew();
        };

        $routeProvider.when('/apply/:product/profile/new', {
            templateUrl: 'features/accountorigination/customerInformation/partials/captureBasicInformation.html',
            controller: 'CaptureBasicController',
            allowedFrom: [
                {path: '/apply/current-account/pre-screen', condition: isValidForCustomerInformation},
                {path: '/apply/rcp/pre-screen', condition: isValidForCustomerInformation}
            ],
            safeReturn: '/apply'
        });
    });

    app.controller('CaptureBasicController',
        function ($scope, $window, LookUps, CustomerService, $location, User,
                  ApplicationParameters, capitalizeFilter, $routeParams,
                  CustomerInformationData, CancelConfirmationService, AccountOriginationProvider, DtmAnalyticsService) {

            if (User.hasBasicCustomerInformation()) {
                $location.path('/apply/' + $routeParams.product + '/profile').replace();
                return;
            }

            function setLookupTable(mapProperty, lookUp) {
                lookUp.promise().then(function (response) {
                    $scope[mapProperty] = response;
                });
            }

            setLookupTable('titles', LookUps.title);
            setLookupTable('maritalStatuses', LookUps.maritalStatus);

            LookUps.country.promise().then(function (countries) {
                $scope.countries = _.map(countries, function (country) {
                    country.label = function () {
                        return capitalizeFilter(country.description);
                    };
                    return country;
                });
            });

            $scope.customerInformationData = CustomerInformationData.current();
            $scope.genders = LookUps.gender.values();
            $scope.latestDateOfBirth = moment().format("DD MMMM YYYY");
            $scope.latestDateOfPermitIssue = moment().format("DD MMMM YYYY");
            $scope.dateOfBirthErrorMessage = 'You must be 18 years or older to open an account';
            $scope.passportExpiryDateErrorMessage =
                'We cannot offer you an account if your passport expires within 3 months';
            $scope.permitExpiryDateErrorMessage =
                'We cannot offer you an account if your permit expires within 3 months';
            $scope.idType = {value: '01'};
            $scope.idTypes = LookUps.idType.values();
            $scope.maritalTypes = LookUps.maritalType.values();
            $scope.permitTypes = LookUps.permitType.values();

            $scope.customerInformationData.preferredLanguageCode = 'EN';
            $scope.customerInformationData.communicationInformation = [{
                communicationTypeCode: '02',
                communicationDetails: ''
            }];
            $scope.customerInformationData.identityDocuments = [{
                identityNumber: '',
                identityTypeCode: '01',
                countryCode: '',
                expiryDate: ''
            }];
            var emptyPermit = {
                identityNumber: '',
                identityTypeCode: '',
                countryCode: '',
                expiryDate: ''
            };
            $scope.customerInformationData.permitDetails = [emptyPermit];

            $scope.customerInformationData.hasCellphoneContact = function () {
                return _.any($scope.customerInformationData.communicationInformation, function (item) {
                    return _.includes(['02'], item.communicationTypeCode);
                });
            };

            $scope.errorMessage = {};

            $scope.foreign = function () {
                return $scope.idType.value === '06';
            };

            $scope.isNotSACitizen = function () {
                if ($scope.foreign()) {
                    return true;
                }

                var nationalId = $scope.customerInformationData.getNationalId();
                if (!$scope.customerInformationData.isSACitizen() && !_.isUndefined(nationalId.identityNumber) &&
                    nationalId.identityNumber.length === 13) {
                    return true;
                }
                return false;
            };

            $scope.next = function () {
                $scope.customerInformationData.shouldCreate = true;
                $scope.customerInformationData.identityDocuments[0].identityTypeCode = $scope.idType.value;
                $scope.customerInformationData.customerInitials =
                    $scope.customerInformationData.customerInitials.replace(/ /g, '');

                DtmAnalyticsService.recordFormSubmission();
                $location.path('/apply/' + $routeParams.product + '/address/edit').replace();
            };

            // This method is being obviated and is only left here so that the redaction doesn't break the code coverage.
            // This method will not be called if the customerManagementV4 toggle is enabled.
            $scope.save = function () {
                $scope.customerInformationData.customerInitials =
                    $scope.customerInformationData.customerInitials.replace(/ /g, '');
                if (_.isEmpty($scope.customerInformationData.getPassport())) {
                    delete $scope.customerInformationData.permitDetails;
                }

                var customerRequest = {
                    customerInformation: _.cloneDeep($scope.customerInformationData)
                };

                CustomerService.createCustomer(customerRequest).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'ERROR') {
                        if (response.headers('x-sbg-response-code') === '4444') {
                            $scope.showExistingCustomerModal = true;
                            $scope.navigateToLinkCard = function () {
                                $location.path('/linkcard');
                            };
                        }
                        else if (response.headers('x-sbg-response-code') === '4445') {
                            var application = AccountOriginationProvider.for($routeParams.product).application;
                            application.decline({offer: {message: "You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan."}});
                            $location.path('/apply/' + $routeParams.product + '/declined').replace();
                        } else {
                            $scope.serverErrorMessage = response.headers('x-sbg-response-message');
                        }
                    } else {
                        User.setBpIdSystemPrincipalIdentifier(response.data.systemPrincipalIdentifier);
                        $location.path('/apply/' + $routeParams.product + '/profile').replace();
                    }
                });
            };

            $scope.cancel = function () {
                CancelConfirmationService.cancelEdit(function () {
                    $window.history.go(-1);
                });
            };

            function shouldShowExtensionMessage(element) {
                return element && element.$valid && element.$viewValue !== '';
            }

            function sumString(text) {
                return _.reduce(text, function (memo, num) {
                    return parseInt(memo) + parseInt(num);
                }, 0);
            }

            function calculateCheckDigit(idNumber) {
                var oddSum = sumString(idNumber[0] + idNumber[2] + idNumber[4] + idNumber[6] + idNumber[8] +
                idNumber[10]);
                var evenDigit = (idNumber[1] + idNumber[3] + idNumber[5] + idNumber[7] + idNumber[9] + idNumber[11]) *
                    2;
                var evenSum = sumString(evenDigit.toString());
                return ((10 - (oddSum + evenSum) % 10) % 10).toString();
            }

            function youngerThan18(birthDate) {
                return moment().startOf('day').diff(birthDate, 'years') < 18;
            }

            function expireWithin3Months(date) {
                return date.diff(moment().startOf('day'), 'months') < 3;
            }

            function isValidDateFormat(dateText) {
                return moment(dateText, 'YYYYMMDD').format('YYYYMMDD') === dateText;
            }

            function DOBInValidForID(dateOfBirth, idNumber) {
                var dobFromID = moment(getDateOfBirthFromId(idNumber), 'YYYY-MM-DD');

                if (!moment(dateOfBirth).isSame(dobFromID)) {
                    var centuryOldDOBFromID = moment(dobFromID).subtract(100, 'years');
                    return !moment(dateOfBirth).isSame(centuryOldDOBFromID);
                }
                return false;
            }

            $scope.checkDateOfBirth = function (dateOfBirth) {
                $scope.errorMessage.dateOfBirth = undefined;

                if (youngerThan18(dateOfBirth)) {
                    $scope.errorMessage.dateOfBirth = $scope.dateOfBirthErrorMessage;
                }

                var nationalId = $scope.customerInformationData.getNationalId();
                if (nationalId && nationalId.identityNumber &&
                    DOBInValidForID(dateOfBirth, nationalId.identityNumber)) {
                    $scope.errorMessage.dateOfBirth = 'Please ensure that your date of birth matches your ID number';
                }
            };

            $scope.checkPassportExpiryDate = function (passportExpiryDate) {
                $scope.errorMessage.passportExpiryDate = undefined;
                if (passportExpiryDate === undefined) {
                    passportExpiryDate = moment();
                }

                if (expireWithin3Months(passportExpiryDate)) {
                    $scope.errorMessage.passportExpiryDate = $scope.passportExpiryDateErrorMessage;
                }
            };

            $scope.checkPermitExpiryDate = function (permitExpiryDate) {
                $scope.errorMessage.permitExpiryDate = undefined;
                if (permitExpiryDate === undefined) {
                    permitExpiryDate = moment();
                }

                if (expireWithin3Months(permitExpiryDate)) {
                    $scope.errorMessage.permitExpiryDate = $scope.permitExpiryDateErrorMessage;
                }
            };

            $scope.populateCountries = function () {
                var defaultCountryCode = _.isEmpty($scope.errorMessage.idNumber) &&
                $scope.customerInformationData.isSACitizen() ? 'ZA' : undefined;
                $scope.customerInformationData.citizenshipCountryCode = defaultCountryCode;
            };

            $scope.populateOriginCountries = function () {
                $scope.customerInformationData.citizenshipCountryCode =
                    $scope.customerInformationData.getPassport().countryCode;
                if (customerManagementV4Feature) {
                    $scope.customerInformationData.nationalityCountryCode =
                        $scope.customerInformationData.getPassport().countryCode;
                }
            };

            function getDateOfBirthFromId(idNumber) {
                var firstDigit = parseInt(idNumber.substr(0, 1));
                return firstDigit <= 2 ? '20' + idNumber.substr(0, 6) : '19' + idNumber.substr(0, 6);
            }

            $scope.checkIdNumber = function (element) {
                $scope.errorMessage.idNumber = undefined;

                if (!shouldShowExtensionMessage(element)) {
                    return;
                }

                var uncheckedIdNumber = element.$viewValue;
                if ('012'.indexOf(uncheckedIdNumber[10]) < 0) {
                    $scope.errorMessage.idNumber =
                        'Please ensure that the 11th digit of your entered ID number is 0, 1 or 2';
                    return;
                }

                if (calculateCheckDigit(uncheckedIdNumber) !== uncheckedIdNumber[12]) {
                    $scope.errorMessage.idNumber = 'Please enter a valid 13-digit South African ID number';
                    return;
                }

                var birthDateText = getDateOfBirthFromId(uncheckedIdNumber);
                if (!isValidDateFormat(birthDateText)) {
                    $scope.errorMessage.idNumber = 'Please ensure that your ID number matches your date of birth';
                    return;
                }

                var birthDate = moment(birthDateText, 'YYYYMMDD');
                $scope.errorMessage.dateOfBirth = youngerThan18(birthDate) ? $scope.dateOfBirthErrorMessage : undefined;
                $scope.customerInformationData.dateOfBirth = birthDate.format('YYYY-MM-DD');
                $scope.customerInformationData.gender = getGenderFromIdNumber();

                $scope.checkGender();
            };

            function getGenderFromIdNumber() {
                var idNumber = $scope.customerInformationData.getNationalId().identityNumber;
                return '0' <= idNumber[6] && idNumber[6] <= '4' ? '2' : '1';
            }

            function getGenderFromTitle() {
                return {
                    '040': '2',
                    '041': '1',
                    '042': '2',
                    '043': '2',
                    '044': '0',
                    '046': '0',
                    '047': '1',
                    '052': '0',
                    '083': '0',
                    '088': '0',
                    '090': '0',
                    '095': '0',
                    '097': '0',
                    '122': '0'
                }[$scope.customerInformationData.customerTitleCode];
            }

            function titleAndGenderMismatch() {
                if ($scope.customerInformationData.customerTitleCode === undefined ||
                    $scope.customerInformationData.gender === undefined) {
                    return false;
                }

                return getGenderFromTitle() !== '0' && getGenderFromTitle() !== $scope.customerInformationData.gender;
            }

            function genderAndIdNumberMismatch() {
                if ($scope.customerInformationData.gender === undefined ||
                    !$scope.customerInformationData.getNationalId() ||
                    _.isEmpty($scope.customerInformationData.getNationalId().identityNumber)) {
                    return false;
                }

                return $scope.customerInformationData.gender !== getGenderFromIdNumber();
            }

            $scope.checkGender = function () {
                $scope.errorMessage.title = undefined;
                $scope.errorMessage.gender = undefined;
                $scope.errorMessage.idNumber = undefined;

                if (genderAndIdNumberMismatch()) {
                    if (getGenderFromTitle() !== '0') {
                        $scope.errorMessage.title =
                            'Your gender and/or title does not match the gender in your ID number';
                    }
                    $scope.errorMessage.gender = 'Your gender and/or title does not match the gender in your ID number';
                    $scope.errorMessage.idNumber =
                        'Your gender and/or title does not match the gender in your ID number';
                }
                else if (titleAndGenderMismatch()) {
                    $scope.errorMessage.title = "Your title and gender don't match";
                    $scope.errorMessage.gender = "Your title and gender don't match";
                }
            };

            $scope.changeGender = function () {
                if (getGenderFromTitle() !== '0') {
                    $scope.customerInformationData.gender = getGenderFromTitle();
                }
            };

            $scope.changeIdType = function () {
                $scope.customerInformationData.identityDocuments[0].identityTypeCode = $scope.idType.value;

                delete $scope.customerInformationData.identityDocuments[0].identityNumber;
                delete $scope.customerInformationData.identityDocuments[0].countryCode;
                delete $scope.customerInformationData.identityDocuments[0].expiryDate;
                delete $scope.customerInformationData.dateOfBirth;
                delete $scope.customerInformationData.nationalityCountryCode;
                delete $scope.customerInformationData.birthCountryCode;
                delete $scope.customerInformationData.citizenshipCountryCode;
                delete $scope.errorMessage.dateOfBirth;

                if ($scope.idType.value === '06') {
                    $scope.customerInformationData.permitDetails = [emptyPermit];
                    delete $scope.errorMessage.idNumber;
                } else {
                    delete $scope.customerInformationData.permitDetails;
                    delete $scope.errorMessage.passportExpiryDate;
                    delete $scope.errorMessage.permitExpiryDate;
                }
            };

            $scope.checkIdType = function () {
                $scope.errorMessage.idType = undefined;
                $scope.errorMessage.countryOfCitizenship = undefined;
                var idTypeErrorMessage = 'If you are a South African citizen, please select your South African ID rather than your passport';

                if ($scope.customerInformationData.citizenshipCountryCode === 'ZA' && $scope.idType.value === '06') {
                    $scope.errorMessage.idType = idTypeErrorMessage;
                    $scope.errorMessage.countryOfCitizenship = idTypeErrorMessage;
                }
            };

            $scope.checkInitial = function () {
                $scope.errorMessage.initial = undefined;
                $scope.errorMessage.firstName = undefined;

                if ($scope.customerInformationData.customerFirstName === undefined ||
                    $scope.customerInformationData.customerInitials === undefined) {
                    return;
                }

                if ($scope.customerInformationData.customerFirstName[0] !==
                    $scope.customerInformationData.customerInitials[0]) {
                    $scope.errorMessage.firstName =
                        'Your first name should begin with the same letter as your first initial, and be the same case';
                    $scope.errorMessage.initial =
                        'Your first name should begin with the same letter as your first initial, and be the same case';
                }
            };

            $scope.allDatesValid = function () {
                return $scope.errorMessage.dateOfBirth === undefined &&
                    $scope.errorMessage.passportExpiryDate === undefined &&
                    $scope.errorMessage.permitExpiryDate === undefined;
            };

            $scope.genderTitleIdMatch = function () {
                return $scope.errorMessage.gender === undefined &&
                    $scope.errorMessage.idNumber === undefined &&
                    $scope.errorMessage.title === undefined;
            };
        });

})();
