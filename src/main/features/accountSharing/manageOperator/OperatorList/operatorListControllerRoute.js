var accountSharingEnabled = false;
if (feature.accountSharing) {
    accountSharingEnabled = true;
}

if (feature.accountSharing) {
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.operatorList')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/operators', {
                    templateUrl: 'features/accountSharing/manageOperator/OperatorList/operatorList.html',
                    controller: 'OperatorsController',
                    controllerAs: "getOperator"

                });
            });
    })();
}
