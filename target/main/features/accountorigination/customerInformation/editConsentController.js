(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.consent',
        ['refresh.metadata', 'refresh.accountOrigination.customerService', 'refresh.accountOrigination.domain.customer',
            'refresh.accountOrigination.common.directives.cancelConfirmation', 'refresh.dtmanalytics']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/submit/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editConsent.html',
            controller: 'EditConsentController'
        });
    });

    app.controller('EditConsentController', function ($scope, $routeParams, $window, $location, LookUps, CustomerService,
                                                      CustomerInformationData, CancelConfirmationService,
                                                      ApplicationParameters, User) {

        $scope.customerInformationData = CustomerInformationData.current();
        $scope.consents = LookUps.consent.values();
        $scope.hasNoMarketingConsent = !$scope.customerInformationData.hasMarketingConsent();
        $scope.product = $routeParams.product;

        if ($scope.hasNoMarketingConsent) {
            _.each($scope.consents, function (consent) {
                $scope.customerInformationData.setConsent(consent.code, true);
            });
        }

        $scope.save = function () {
            if ($scope.hasNoMarketingConsent) {
                $scope.consentForm.$setDirty();
            }

            if (!CustomerInformationData.hasEditedConsentClauses()) {
                $scope.cancel();
                return;
            }

            var customer = _.cloneDeep($scope.customerInformationData);

            CustomerService.updateConsent(customer).then(function () {
                $location.path('/apply/' + $scope.product + '/submit').replace();
            })
                .catch(function (error) {

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

