if (feature.accountSharing) {
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.operatorInvitationDetails')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/invitation/:idNumber', {
                    templateUrl: 'features/accountSharing/manageOperator/viewOperatorInvitationDetails/operatorInvitationDetails.html',
                    controller: 'OperatorInvitationDetailsController',
                    controllerAs: 'vm'
                });
            });
    })();
}