var accountSharingEnabled = false;
{
    accountSharingEnabled = true;
}

{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.addUser')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/user/permissions', {
                    templateUrl: 'features/accountSharing/manageOperator/addOperator/permissions/partials/addUserPermissions.html',
                    controller: 'PermissionsController',
                    controllerAs: "vm"
                });
            });
    })();
}