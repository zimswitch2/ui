(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .controller('ConfirmOperatorPermissionsController', function ($location, EditOperatorPermissions, CancelDialogService) {
            var vm = this;

            vm.operator = EditOperatorPermissions.current();

            vm.cancel = function () {
                CancelDialogService.createDialog().then(function () {
                    $location.path('/account-sharing/users/' + vm.operator.id);
                });
            };

            vm.editPermissions = function () {
                $location.path('/account-sharing/users/' + vm.operator.id + '/permissions');
            };
            
            vm.confirm = function () {
                EditOperatorPermissions.updateOperatorPermissions().then(function () {
                    $location.path('/account-sharing/users/' + vm.operator.id);
                });
            };
        });
})();