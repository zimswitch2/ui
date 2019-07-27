(function () {
    'use strict';

    var module = angular.module('refresh.internationalPhoneNumber', [
        'refresh.lookups',
        'refresh.filters',
        'refresh.inputValidationController',
        'refresh.typeahead'
    ]);

    module.directive('internationalPhoneNumber', function ($filter, LookUps) {
        return {
            restrict: 'E',
            templateUrl: 'common/internationalPhoneNumber/partials/internationalPhoneNumber.html',
            require: ['^form', 'ngModel'],
            scope: {},
            link: function (scope, element, attrs, ctrls) {
                scope.form = ctrls[0];
                scope.ngModel = ctrls[1];
                scope.showCountries = false;

                scope.initialize = function (countryDialingCodes, contactDetails) {
                    if (contactDetails) {
                        scope.phoneNumber = contactDetails.cellPhoneNumber;
                        scope.country =
                            _.find(countryDialingCodes, {
                                internationalDialingCode: contactDetails.internationalDialingCode
                            });
                    } else {
                        scope.country = _.find(countryDialingCodes, {
                            internationalDialingCode: '27'
                        });
                    }
                    scope.selectedCountry = scope.country;
                };

                var lookup = LookUps.dialingCodes.promise();
                lookup.then(function (dialingCodes) {
                    scope.countryDialingCodes = _.map(dialingCodes, function (dialingCode) {
                        dialingCode.label = function () {
                            return $filter('capitalizeCountry')(dialingCode.description) + ' +' +
                                dialingCode.internationalDialingCode;
                        };
                        dialingCode.internationalDialingCode = dialingCode.internationalDialingCode.toString().trim();
                        return dialingCode;
                    });
                });

                scope.ngModel.$render = function () {
                    lookup.then(function () {
                        scope.initialize(scope.countryDialingCodes, scope.ngModel.$modelValue);
                    });
                };

                var viewValueObject = function (number) {
                    return {
                        countryCode: scope.country ? scope.country.countryCode : undefined,
                        internationalDialingCode: scope.country ? scope.country.internationalDialingCode : undefined,
                        cellPhoneNumber: number
                    };
                };

                scope.exactLength = 10;
                scope.minLength = 10;
                scope.maxLength = 10;
                scope.changePhoneNumber = function () {
                    if (scope.phoneNumber) {
                        var strippedNumber = scope.phoneNumber.replace(/^0/, '');
                        scope.warningMessage = _.startsWith(strippedNumber, scope.country.internationalDialingCode) ? 'The number you entered contains the same prefix as the international dialling code. Please review and amend if incorrect.' : '';
                        if (scope.country.internationalDialingCode === '27') {
                            scope.exactLength = scope.phoneNumber.match(/^0/) ? 10 : 9;
                            scope.form.cellPhoneNumber.$setValidity('exactlength', scope.phoneNumber.length === scope.exactLength);
                            scope.form.cellPhoneNumber.$setValidity('minlength', true);
                            scope.form.cellPhoneNumber.$setValidity('maxlength', true);
                            scope.ngModel.$setViewValue(viewValueObject(scope.phoneNumber));
                        } else {
                            scope.form.cellPhoneNumber.$setValidity('exactlength', true);
                            scope.minLength = 1;
                            scope.form.cellPhoneNumber.$setValidity('minlength', scope.phoneNumber.length > scope.minLength);
                            scope.maxLength = scope.phoneNumber.match(/^0/) ? (18 - scope.country.internationalDialingCode.length) : (17 - scope.country.internationalDialingCode.length);
                            scope.form.cellPhoneNumber.$setValidity('maxlength', scope.phoneNumber.length <= scope.maxLength);
                            scope.ngModel.$setViewValue(viewValueObject(strippedNumber));
                        }
                    } else {
                        scope.ngModel.$setViewValue(viewValueObject());
                    }
                };

                scope.changeCountry = function () {
                    if (scope.selectedCountry) {
                        scope.showCountries = false;
                        scope.country = scope.selectedCountry;
                        scope.changePhoneNumber();
                    }
                };

            }
        };
    });
}());
