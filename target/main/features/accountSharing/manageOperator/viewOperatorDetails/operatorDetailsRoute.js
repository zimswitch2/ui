{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.operatorDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/users/:id', {
                    templateUrl: 'features/accountSharing/manageOperator/viewOperatorDetails/operatorDetails.html',
                    controller: 'OperatorDetailsController',
                    controllerAs: "vm"
                });
            });
    })();
}
