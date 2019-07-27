(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser')
        .controller('FinishAddUserController', function (AddUserService, LookUps, $location, $scope) {
            var vm = this;

            vm.invitation = AddUserService.invitation();
            vm.userDetails = AddUserService.user();

            vm.finishAddUserHeader = function () {
                return (AddUserService.entryMode !== undefined && AddUserService.entryMode.mode === 'editOperator' ?
                        "Edited user: " : "New user: ") + vm.userDetails.firstName;
            };
            vm.communicationChannels = LookUps.communicationChannel.values();
            vm.sendReferenceNumberDetails = AddUserService.sendReferenceNumberDetails();

            vm.successMessage = "You have successfully invited a user to this account";
            $scope.isSuccessful = true;  //This is to plugin to the notification bar's behaviour (notification.js).

            vm.showFlowHeader = function () {
                return (AddUserService.entryMode === undefined || AddUserService.entryMode.mode !== 'reinviteOperator');
            };
            vm.finishUserDetails = function () {
                var sendInviteReferenceNumber = false;

                if (vm.sendReferenceNumberDetails.channelType !== 'none') {
                    vm.sendReferenceNumberDetails.referenceNumber = vm.invitation.referenceNumber;
                    vm.sendReferenceNumberDetails.firstName = vm.userDetails.firstName;
                    vm.sendReferenceNumberDetails.lastName = vm.userDetails.surname;
                    vm.sendReferenceNumberDetails.emailAddress = vm.userDetails.email;
                    vm.sendReferenceNumberDetails.cellphoneNumber = vm.userDetails.cellPhone.cellPhoneNumber;

                    sendInviteReferenceNumber = true;
                }

                if (sendInviteReferenceNumber) {
                    AddUserService.sendInviteReferenceNumber();

                }
                var editMode = AddUserService.entryMode !== undefined ? (AddUserService.entryMode.mode === 'editOperator' || AddUserService.entryMode.mode === 'reinviteOperator') : false;
                $location.path(editMode ? "/account-sharing/operators" : AddUserService.originUrl());
                AddUserService.reset();

            };

        });
})();