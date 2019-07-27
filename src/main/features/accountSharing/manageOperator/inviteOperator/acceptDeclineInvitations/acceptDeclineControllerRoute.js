var accountSharingEnabled = false;
if (feature.accountSharing) {
    accountSharingEnabled = true;
}

if (feature.accountSharing) {
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.inviteOperator')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/accept-decline-invitation', {
                    templateUrl: 'features/accountSharing/manageOperator/inviteOperator/acceptDeclineInvitations/partials/declineinvitation.html',
                    controller: 'AcceptDeclineInvitationController',
                    controllerAs: "operatorInvitation"
                });
            });
    })();
}

