(function (){
    'use strict';

    angular.module('refresh.accountSharing.addUser')
        .controller('ConfirmUserDetailsController', function($scope, AddUserService, Flow, $location, CancelDialogService, HomeService, ApplicationParameters) {
            var vm = this;

            $scope.errorMessage = ApplicationParameters.popVariable('errorMessage');

            vm.entryModeDesc = function() {
                return AddUserService.entryMode !== undefined ? AddUserService.entryMode.desc : 'Add a user';
            };

            vm.userDetails = AddUserService.user();

            vm.permissions = AddUserService.permissions();

            vm.cancel = function () {
                CancelDialogService.createDialog().then(function() {
                    AddUserService.reset();
                    HomeService.goHome();
                });
            };

            vm.editPermissions = function () {
                $location.path('/account-sharing/user/permissions').replace();
                Flow.previous();
            };

            vm.editUserDetails = function () {
                $location.path('/account-sharing/user/details').replace();
                Flow.previous();
                Flow.previous();
            };

            vm.confirmUserDetails = function () {
                ApplicationParameters.pushVariable('resetUser', true);

                Flow.next();

                if (AddUserService.entryMode.mode === 'editOperator') {
                    AddUserService.editInvitation().then(function (result) {
                        AddUserService.invitation(result);
                        $location.path('/account-sharing/user/finish').replace();
                    });
                }  else {
                    AddUserService.addUser().then(function (result) {
                        AddUserService.invitation(result);
                        $location.path('/account-sharing/user/finish').replace();
                    }).catch(function (error) {
                        vm.errorMessage = error.message;
                        ApplicationParameters.pushVariable('errorMessage', error.message);
                        $location.path('/account-sharing/user/confirm').replace();
                    });
                }
            };
        });
})();