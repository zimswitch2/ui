{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.addUser')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/user/confirm', {
                    templateUrl: 'features/accountSharing/manageOperator/addOperator/confirm/partials/confirmUserDetails.html',
                    controller: 'ConfirmUserDetailsController',
                    controllerAs: 'vm'
                });
            });
    })();
}