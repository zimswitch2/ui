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
                $routeProvider.when('/account-sharing/user/details', {
                    templateUrl: 'features/accountSharing/manageOperator/addOperator/details/partials/addUserDetails.html',
                    controller: 'AddUserDetailsController',
                    controllerAs: "userDetails"
                });
            });
    })();
}