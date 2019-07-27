{
    (function () {
        'use strict';

        angular.module('refresh.accountSharing.editUserDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/users/:id/permissions/confirm', {
                    templateUrl: '/features/accountSharing/manageOperator/editOperator/confirmPermissions/partials/confirmOperatorPermissions.html',
                    controller: 'ConfirmOperatorPermissionsController',
                    controllerAs: 'vm',
                    allowedFrom: ['/account-sharing/users/:id/permissions'],
                    safeReturn: '/account-sharing/operators'
                });
            });
    })();
}