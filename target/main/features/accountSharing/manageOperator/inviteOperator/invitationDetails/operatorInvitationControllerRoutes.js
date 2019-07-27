var accountSharingEnabled = false;
{
    accountSharingEnabled = true;
}

{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.inviteOperator')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/invitation-details', {
                    templateUrl: 'features/accountSharing/manageOperator/inviteOperator/invitationDetails/partials/invitationDetails.html',
                    controller: 'InviteOperatorController',
                    controllerAs: "operatorInvitationDetails",
                    unauthenticated: true

                });
            })
            .run(function ($rootScope, $route, InvitationMenuService) {
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if (current && current.originalPath === '/account-sharing/invitation-details' && next.originalPath !== '/account-sharing/accept-decline-invitation') {
                        InvitationMenuService.resetShowMenu();
                    }
                });

            });
    })();
}
