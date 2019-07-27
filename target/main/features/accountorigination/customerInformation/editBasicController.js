var addBasicInformationAMLFeature = false;

{
    addBasicInformationAMLFeature = true;
}


(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.basic',
        ['refresh.lookups',
            'refresh.configuration',
            'refresh.metadata',
            'refresh.accountOrigination.customerService',
            'refresh.filters',
            'refresh.accountOrigination.domain.customer',
            'refresh.accountOrigination.common.directives.cancelConfirmation',
            'refresh.accountOrigination.customerInfoValidation'
        ]);


    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/profile/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editBasicInformation.html',
            controller: 'EditBasicController'
        });
    });

    app.controller('EditBasicController', function ($scope, $location, $window, LookUps, CustomerService,
                                                    CustomerInformationData, CustomerInfoValidation, capitalizeFilter,
                                                    CancelConfirmationService, User, ApplicationParameters, $routeParams) {

        function expireWithin3Months(date) {
            return date.diff(moment().startOf('day'), 'months') < 3;
        }

        function populateCountries() {
            if (!$scope.customerInformationData.isSACitizen()) {
                return;
            }

                if (_.isEmpty($scope.customerInformationData.citizenshipCountryCode)) {
                    $scope.customerInformationData.citizenshipCountryCode = 'ZA';
                }
        }

        function editPermit() {
            $scope.permit = _.isEmpty($scope.customerInformationData.getPermit()) ? {} :
                _.cloneDeep($scope.customerInformationData.getPermit());
            $scope.permit.cRUDIndicator = 'U';
            $scope.latestDateOfPermitIssue = moment().format('DD MMMM YYYY');
            $scope.permitExpiryDateErrorMessage =
                'We cannot offer you an account if your permit expires within 3 months';
            $scope.permitTypes = LookUps.permitType.values();

            $scope.checkPermitExpiryDate = function (permitExpiryDate) {
                $scope.errorMessage.permitExpiryDate = undefined;
                if (permitExpiryDate === undefined) {
                    permitExpiryDate = moment();
                }

                if (expireWithin3Months(permitExpiryDate)) {
                    $scope.errorMessage.permitExpiryDate = $scope.permitExpiryDateErrorMessage;
                }
            };
        }

        $scope.customerInformationData = CustomerInformationData.current();

        $scope.originalCustomer = _.cloneDeep(CustomerInformationData.current());

        $scope.product = $routeParams.product;

        populateCountries();

        LookUps.country.promise().then(function (countries) {
            $scope.countries = _.map(countries, function (country) {
                country.label = function () {
                    return capitalizeFilter(country.description);
                };
                return country;
            });

            if ($scope.customerInformationData.getPassport()) {
                $scope.passportOrigin = _.find($scope.countries,
                    {code: $scope.customerInformationData.getPassport().countryCode}).label();
            }
        });

        $scope.errorMessage = {};

        if ($scope.customerInformationData.getPassport() && !addBasicInformationAMLFeature) {
            editPermit();
        }

        $scope.allDatesValid = function () {
            return $scope.errorMessage.permitExpiryDate === undefined || addBasicInformationAMLFeature;
        };

        $scope.getValidationNotification = function () {
            return CustomerInfoValidation.getValidationNotificationForSection('basic');
        };

        $scope.next = function () {
            CancelConfirmationService.cancelEdit(function () {
                $location.path('/apply/' + $scope.product + '/address');
            });
        };

        $scope.save = function () {
            if ($scope.permit && !addBasicInformationAMLFeature) {
                _.each($scope.customerInformationData.permitDetails, function (item) {
                    item.cRUDIndicator = 'D';
                });
                $scope.customerInformationData.permitDetails.push($scope.permit);
            }

            var customer = _.cloneDeep($scope.customerInformationData);

            CustomerService.updateBasicInfo(customer).then(function (response) {
                $location.path('/apply/' + $scope.product + '/profile').replace();
            }).catch(function (error) {
                $scope.serverErrorMessage = error.message;
                if (User.hasDashboards()) {
                    ApplicationParameters.pushVariable('otpErrorMessage', error.message);
                }

            });
        };

        $scope.cancel = function () {
            CancelConfirmationService.cancelEdit(function () {
                $window.history.go(-1);
            });
        };
    });
})();