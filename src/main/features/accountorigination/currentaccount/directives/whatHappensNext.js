(function (app) {
    'use strict';

    app.directive('whatHappensNext', function () {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/currentaccount/directives/partials/whatHappensNext.html',
            scope: {
                hasOverdraft: '=',
                statementsConsentSelected: '=',
                accountNumber: '=',
                shortVersion: '=',
                customerKyc: '=',
                newToBank: '='
            }
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.directives.whatHappensNext', []));