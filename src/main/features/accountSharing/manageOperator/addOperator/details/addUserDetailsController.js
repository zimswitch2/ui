(function () {
  'use strict';

  angular
      .module('refresh.accountSharing.addUser')
      .controller('AddUserDetailsController', function ($scope, OperatorService, HomeService, Flow, AddUserService, CancelDialogService, $location, ApplicationParameters) {
        var vm = this;
        var entryMode = AddUserService.entryMode;

        Flow.create(['Enter details', 'Permissions', 'Confirm', 'Enter OTP' ], entryMode !== undefined ? entryMode.desc : 'Add a user');
        if (ApplicationParameters.getVariable('resetUser') === true) {
          if (entryMode === undefined || entryMode.mode !== 'editOperator' ) {
            vm.user = AddUserService.reset();
          }
          ApplicationParameters.popVariable('resetUser');
        }
        vm.headerName = Flow.getHeaderName();
        vm.user = AddUserService.user();

        vm.next = function () {

          OperatorService.operatorExists(vm.user.idNumber).then(function (exists) {
            if (exists) {
              $scope.errorMessage = vm.user.firstName + " has been previously added";
            }
            else {
              Flow.next();
              $location.path('/account-sharing/user/permissions');
            }
          });

        };

        vm.cancel = function () {
          CancelDialogService.createDialog().then(
              function () {
                AddUserService.reset();
                if ( AddUserService.entryMode !== undefined && AddUserService.entryMode.mode === 'editOperator') {
                  $location.path('/account-sharing/invitation/' + vm.user.idNumber);
                } else {
                  HomeService.goHome();
                }
              });
        };

      }
  )
  ;
}());
