if (feature.accountSharing) {
    (function () {
        'use strict';

        angular.module('refresh.accountSharing.editUserDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/users/:id/permissions', {
                    templateUrl: '/features/accountSharing/manageOperator/editOperator/permissions/partials/editOperatorPermissions.html',
                    controller: 'EditOperatorPermissionsController',
                    controllerAs: 'vm'
                });
            });
    })();
}