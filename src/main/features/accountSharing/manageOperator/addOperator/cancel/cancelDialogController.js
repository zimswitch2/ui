(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser')
        .controller('CancelDialogController', function(CancelDialogService) {
            var vm = this;

            vm.shouldShow = function() {
                return CancelDialogService.shouldShow();
            };

            vm.confirm = function() {
                CancelDialogService.confirm();
            };

            vm.back = function() {
                CancelDialogService.cancel();
            };
        });
})();
