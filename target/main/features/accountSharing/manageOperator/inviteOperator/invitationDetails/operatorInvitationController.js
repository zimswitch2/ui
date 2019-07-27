(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.inviteOperator')
        .controller('InviteOperatorController', function ($scope, InvitationMenuService, Flow, OperatorInvitationService, $location, ApplicationParameters) {
            var vm = this;
            vm.showMenu = InvitationMenuService.setShowMenu();
            Flow.create(['Enter details', 'Accept / Decline', 'Enter OTP'], 'Accept / Decline Invitation');
            vm.headerName = Flow.getHeaderName();

            vm.invitationDetails = null;
            $scope.errorMessage = undefined;
            vm.invite = {};

            vm.next = function () {
                OperatorInvitationService.searchInvite(vm.invite).then(function (response) {
                    vm.invitationDetails = response.searchInviteResponse;

                    vm.showModal = true;
                    OperatorInvitationService.setInvitationDetails(vm.invitationDetails);
                    Flow.next();

                }).catch(function (error) {
                    $scope.errorMessage = error.message;
                  //  vm.errorMessage = error.message;
                });

            };

            vm.redirectToSignIn = function () {
                vm.showModal = false;
                ApplicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
                ApplicationParameters.pushVariable('acceptInvitationExistingCustomer', 'true');
                return $location.path('/login');
            };

            vm.redirectToRegister = function () {
                vm.showModal = false;
                ApplicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
                return $location.path('/register');
            };

            vm.cancel = function () {
                vm.showMenu = InvitationMenuService.resetShowMenu();
                OperatorInvitationService.reset();
                $scope.errorMessage = undefined;
                $location.path('/account-sharing/operators');
            };

        });
})();
