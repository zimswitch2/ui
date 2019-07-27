(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .controller('ConfirmOperatorDetailsController', function ($location, EditOperator, CancelDialogService) {
            var vm = this;

            vm.user = EditOperator.currentOperator();

            vm.confirm = function () {
                EditOperator.updateOperator()
                    .then(function () {
                        //TODO: notification
                        $location.path('/account-sharing/users/' + vm.user.id);
                    });
            };

            vm.cancel = function () {
                CancelDialogService.createDialog().then(function() {
                    $location.path('/account-sharing/users/' + vm.user.id);
                });
            };

            vm.editUserDetails = function() {
                $location.path('/account-sharing/users/' + vm.user.id + '/details');
            };
        });
})();
