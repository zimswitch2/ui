{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.addUser')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/user/finish', {
                    templateUrl: 'features/accountSharing/manageOperator/addOperator/finish/partials/finishAddUser.html',
                    controller: 'FinishAddUserController',
                    controllerAs: 'vm'
                });
            });
    })();
}