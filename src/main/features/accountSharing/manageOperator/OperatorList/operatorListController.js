(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.operatorList')
        .controller('OperatorsController', function($location, OperatorService, OperatorInvitationService, User, AddUserService) {
            var vm = this;

            OperatorService.getOperators().then(function (operators) {
                vm.operators = operators;
                return vm.numberOfOperators = vm.operators.length;
            });

            OperatorService.getPendingOperators().then(function(pendingOperators){
                vm.pendingOperators = pendingOperators;
                return vm.numberOfPendingOperators = vm.pendingOperators.length;
            });

            vm.operatorStatus = function (operator) {
                if (operator.active) {
                    return 'text-notification success';
                } else{
                    return 'text-notification error';
                }
            };
            vm.changeStatusToUpper = function(operator){
                if (operator.active) {
                    return "Active";
                } else{
                    return 'Inactive';
                }
            };

            vm.addUser = function() {
                AddUserService.entryMode = {type : 'addOperator', desc : 'Add a user'};
                $location.path('/account-sharing/user/details');
            };

            vm.viewInvitationDetails = function (operator) {
                OperatorInvitationService.setInvitationDetails({
                    idNumber: operator.userDetails.idNumber,
                    referenceNumber: operator.referenceNo,
                    systemPrincipalIdentifier: User.principal().systemPrincipalIdentifier
                });
                $location.path('/account-sharing/invitation/' + operator.userDetails.idNumber);
            };
        });
})();
