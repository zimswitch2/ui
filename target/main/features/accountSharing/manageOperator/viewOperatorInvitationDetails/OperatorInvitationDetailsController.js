(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.operatorInvitationDetails')
        .controller('OperatorInvitationDetailsController', function (OperatorService, OperatorInvitationService, $routeParams, $location, AddUserService) {
            var vm = this;
            var idNumber = $routeParams.idNumber;
            this.showDeleteModal = false;

            vm.operator = {active: false, status: ""};
            var invitation = OperatorInvitationService.getDetails();
            OperatorInvitationService.getInvitationDetails(invitation).then(function (invitationDetail) {
                vm.operator = invitationDetail;
            });

            vm.done = function () {
                $location.path('/account-sharing/operators/');
            };

            vm.cancel = function () {
                $location.path('/account-sharing/operators/');
            };

            vm.isPending = function () {
                return vm.operator.status.toLowerCase() === 'pending';
            };

            vm.isExpired = function () {
                return vm.operator.status.toLowerCase() === 'otp expired' || vm.operator.status.toLowerCase() === 'rejected' || vm.operator.status.toLowerCase() === 'escalated';
             };



            vm.reInviteOperator = function () {
                OperatorService.reInviteOperator(vm.operator.userDetails.idNumber, vm.operator.referenceNo).then(function (response) {
                    AddUserService.entryMode = {
                        mode: 'reinviteOperator',
                        desc: 'Re-invited user: ' + vm.operator.userDetails.firstName
                    };
                    var inviteDetails = {};
                    inviteDetails.referenceNumber = response.data.referenceNumber;
                    inviteDetails.timeToExpiry = response.data.timeToExpiry;
                    AddUserService.invitation(inviteDetails);
                    AddUserService.setUser(vm.operator.userDetails);
                    $location.path('/account-sharing/user/finish');
                }).catch(function (error) {
                    vm.errorMessage = error.message;
                });
            };

            vm.editOperatorDetails = function () {
                AddUserService.entryMode = {
                    mode: 'editOperator',
                    desc: 'Edit invitation details for ' + vm.operator.userDetails.firstName
                };
                AddUserService.setUser(vm.operator.userDetails);
                var inviteIdentifier = {
                    idNumber: vm.operator.userDetails.idNumber,
                    referenceNumber: vm.operator.userDetails.referenceNumber
                };
                AddUserService.setInviteIdentifier(inviteIdentifier);
                AddUserService.setAccountRoles(vm.operator.permissions);
                $location.path('/account-sharing/user/details');
            };

            vm.showDelete = function () {
                this.showDeleteModal = true;
            };

            vm.confirmDelete = function () {
                OperatorInvitationService.deleteInvite(OperatorInvitationService.getDetails())
                    .then(function () {
                        $location.path('/account-sharing/operators/');
                    });
            };

            vm.cancelDelete = function () {
                this.showDeleteModal = false;
            };
        });
})();