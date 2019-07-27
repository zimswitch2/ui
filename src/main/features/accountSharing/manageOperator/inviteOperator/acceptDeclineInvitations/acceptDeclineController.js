(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.inviteOperator')
        .controller('AcceptDeclineInvitationController', function (InvitationMenuService, Flow, OperatorInvitationService, $location, AuthenticationService, User, ApplicationParameters) {
            var vm = this;
            vm.showMenu = InvitationMenuService.setShowMenu();
            vm.invitationDetails = OperatorInvitationService.getDetails();

            vm.declineInvitation = function () {
                vm.showModal = true;
            };

            vm.declineInvitationOnModal = function () {
                vm.invitation = {
                    "idNumber": vm.invitationDetails.userDetails.idNumber,
                    "referenceNumber": vm.invitationDetails.userDetails.referenceNumber
                };

                OperatorInvitationService.declineInvite(vm.invitation);
                OperatorInvitationService.reset();

                AuthenticationService.logout();

            };

                vm.goBackToDetails = function(){
                    vm.showModal = false;
                $location.path('/account-sharing/accept-decline-invitation');
            };

            vm.acceptInvitation = function () {



                vm.invitation = {
                    "idNumber": vm.invitationDetails.userDetails.idNumber,
                    "referenceNumber": vm.invitationDetails.userDetails.referenceNumber
                };

                Flow.next();

                OperatorInvitationService.acceptInvite(vm.invitation).then(function (response) {

                    var profile = response.channelProfile;
                    var card = response.card;

                    var profileId = profile.profileId;
                    profile.card = card.cardNumber;

                    User.addDashboard(profile);

                    var newDashboard = User.findDashboardByProfileId(profileId);
                    User.switchToDashboard(newDashboard);

                    ApplicationParameters.pushVariable('customMessage', "Welcome " + vm.invitationDetails.userDetails.firstName +
                        ", your account has been activated. You can now access " +  vm.invitationDetails.business.name + " Accounts");
                    ApplicationParameters.popVariable('acceptInvitationRedirect');

                    $location.path('/account-summary');
                });
            };
        });
})();
