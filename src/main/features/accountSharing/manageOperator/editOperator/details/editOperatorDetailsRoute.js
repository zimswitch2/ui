if (feature.accountSharing) {
    (function () {
        'use strict';

        angular.module('refresh.accountSharing.editUserDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/users/:id/details', {
                    templateUrl: '/features/accountSharing/manageOperator/editOperator/details/partials/editOperatorDetails.html',
                    controller: 'EditOperatorDetailsController',
                    controllerAs: 'vm'
                });
            });
    })();
}