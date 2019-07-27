{
    (function () {
        'use strict';

        angular.module('refresh.accountSharing.editUserDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/users/:id/details/confirm', {
                    templateUrl: '/features/accountSharing/manageOperator/editOperator/confirmDetails/partials/confirmOperatorDetails.html',
                    controller: 'ConfirmOperatorDetailsController',
                    controllerAs: 'vm',
                    allowedFrom: ['/account-sharing/users/:id/details'],
                    safeReturn: '/account-sharing/operators'
                });
            });
    })();
}