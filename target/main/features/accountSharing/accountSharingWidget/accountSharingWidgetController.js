(function() {
    'use strict';

    angular
        .module('refresh.accountSharing')
        .controller('AccountSharingWidgetController', function(OperatorService, User, AddUserService, $location) {
            var vm = this;

            if (User.isCurrentDashboardSEDPrincipal()) {
                OperatorService.getOperators().then(function (operators) {
                    return vm.numberOfOperators = operators.length;
                });
                OperatorService.getPendingOperators().then(function (pendingOperators) {
                    return vm.numberOfPendingOperators = pendingOperators.length;
                });
            }

            vm.viewName = function() {
                if (User.isCurrentDashboardSEDPrincipal()) {
                    if (vm.numberOfOperators > 0) {
                        return "viewUsers";
                    }

                    return "getStarted";
                }

                return "register";
            };

            vm.addUser = function(){
                    AddUserService.entryMode = {mode : 'addOperator', desc : 'Add a user'};
                $location.path('/account-sharing/user/details');
            };
        });
})();
