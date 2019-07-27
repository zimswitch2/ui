var newCaptureCustomerInformationFeature = false;


(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.screens.preScreen', [
        'ngRoute',
        'refresh.accountOrigination.rcp.domain.rcpApplication',
        'refresh.accountOrigination.domain.customerInformationLoader',
        'refresh.security.user',
        'refresh.flow',
        'refresh.metadata',
        'refresh.dtmanalytics'
    ]);

    app.config(function ($routeProvider) {
        var isValidForPrescreening = function (RcpApplication) {
            return RcpApplication.isNew();
        };
        $routeProvider
            .when('/apply/rcp/pre-screen',
                {
                    templateUrl: 'features/accountorigination/rcp/screens/prescreen/partials/rcpPreScreen.html',
                    controller: 'RcpPreScreenController',
                    allowedFrom: [{path: new RegExp('.*'), condition: isValidForPrescreening}],
                    safeReturn: '/apply'
                });
    });

    app.controller('RcpPreScreenController',
        function ($scope, $location, RcpApplication, CustomerInformationLoader, User, DtmAnalyticsService) {
            $scope.preScreen = {
                debtReview: false,
                insolvent: false,
                sequestration: false

            };

            $scope.next = function () {
                if ($scope.preScreen.debtReview || $scope.preScreen.insolvent || $scope.preScreen.sequestration) {
                    $scope.showCannotProceedModal = true;

                }
                else {
                    RcpApplication.completePreScreening();
                    DtmAnalyticsService.recordFormSubmissionCompletion();
                    proceedApplication();
                }

            };

            function proceedApplication() {
                if (newCaptureCustomerInformationFeature) {
                    $location.path('/apply/rcp/profile').replace();
                } else {
                    if (User.hasBasicCustomerInformation()) {
                        CustomerInformationLoader.load().then(function () {
                            $location.path('/apply/rcp/profile').replace();
                        });
                    }
                    else {
                        $location.path('/apply/rcp/profile/new').replace();
                    }
                }
            }

        });
}());