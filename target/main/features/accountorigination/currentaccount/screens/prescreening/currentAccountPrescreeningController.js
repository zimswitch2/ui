var newCaptureCustomerInformationFeature = false;


(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.currentAccount.screens.preScreening',
        [
            'refresh.security.user',
            'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
            'refresh.accountOrigination.domain.customerInformationLoader',
            'refresh.dtmanalytics'
        ]);

    app.config(function ($routeProvider) {
        var isValidForPrescreening = function (CurrentAccountApplication) {
            return CurrentAccountApplication.isPending() || CurrentAccountApplication.isNew();
        };

        $routeProvider.when('/apply/current-account/pre-screen', {
            templateUrl: 'features/accountorigination/currentaccount/screens/prescreening/partials/prescreening.html',
            controller: 'CurrentAccountPrescreeningController',
            allowedFrom: [{path: new RegExp('.*'), condition: isValidForPrescreening}],
            safeReturn: '/apply'
        });
    });

    app.controller('CurrentAccountPrescreeningController', function ($scope, $location, User, CurrentAccountApplication, CustomerInformationLoader, DtmAnalyticsService) {
        $scope.preScreening = CurrentAccountApplication.preScreening;
        $scope.isNewApplication = function () {
            if (CurrentAccountApplication.isPending()) {
                $scope.preScreening.creditAndFraudCheckConsent = true;
                return false;
            } else {
                return true;
            }
        };

        $scope.submit = function () {
            if ($scope.preScreening.sequestration || $scope.preScreening.insolvent) {
                $scope.showCannotProceedModal = true;
            }
            else {
                CurrentAccountApplication.completePreScreening();
                DtmAnalyticsService.recordFormSubmissionCompletion();

                if (User.hasBasicCustomerInformation()) {
                    CustomerInformationLoader.load().then(function () {
                        if (CurrentAccountApplication.isPending()) {
                            $location.path('/apply/current-account/offer').replace();
                        }
                        else {
                            $location.path('/apply/current-account/profile').replace();
                        }
                    });
                }
                else {
                    if (newCaptureCustomerInformationFeature) {
                        $location.path('/apply/current-account/profile').replace();
                    } else {
                        $location.path('/apply/current-account/profile/new').replace();
                    }

                }
            }
        };

        $scope.headingText = function () {
            if (CurrentAccountApplication.isPending()) {
                return 'Before You Continue with Your Application';
            }

            return 'Before You Start Your Application';
        };
    });
})();