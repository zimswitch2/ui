(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .controller('EditOperatorDetailsController', function ($route, $location, Flow, EditOperator, CancelDialogService) {
            var vm = this;

            Flow.create(['Edit details', 'Confirm details']);

            var id = $route.current.params.id;

            if (!_.startsWith($route.previous.originalPath, '/account-sharing/users/:id/details')) {
                EditOperator.edit(+id).then(function (user) {
                    vm.user = user;
                });
            } else {
                vm.user = EditOperator.currentOperator();
            }

            vm.next = function () {
                Flow.next();
                $location.path('/account-sharing/users/' + vm.user.id + '/details/confirm');
            };

            vm.cancel = function () {
                CancelDialogService.createDialog().then(function() {
                    $location.path('/account-sharing/users/' + vm.user.id);
                });
            };
        });
})();