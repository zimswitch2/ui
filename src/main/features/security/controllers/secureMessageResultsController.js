(function () {
    'use strict';

    var module = angular.module('refresh.secure.message.results',
        [
            'refresh.flow', 'refresh.filters'
        ]);

    module.config(function ($routeProvider) {
        var isSecureMessageSuccess = function (ViewModel) {
            var model = ViewModel.current();
            return model.secureMessage;
        };

        $routeProvider.when('/secure-message/results', {
            templateUrl: 'features/security/partials/secureMessageResults.html',
            controller: 'SecureMessageResultsController',
            allowedFrom: [{ path: '/otp/verify', condition: isSecureMessageSuccess }],
            safeReturn: '/account-summary'
        });
    });

    module.controller('SecureMessageResultsController', function ($scope, ViewModel, ApplicationParameters) {
        $scope.secureMessage = ViewModel.current().secureMessage;
        $scope.isSuccessful = true;
        $scope.successMessage = 'Secure message was successfully sent';
        $scope.hasInfo = true;
        $scope.currentDate = ApplicationParameters.getVariable('latestTimestampFromServer');
    });
}());