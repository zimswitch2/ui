(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .controller('EditOperatorPermissionsController', function ($route, $location, Flow, Card, AccountsService, OperatorService, CancelDialogService, EditOperatorPermissions) {
            var vm = this;

            Flow.create(['Edit', 'Confirm']);

            var id = $route.current.params.id;

            var card = Card.current();
            AccountsService.list(card).then(function(response) {
                vm.accounts = _.map(response.accounts, function(account) {
                    return _.merge({
                        accountTypeName: AccountsService.accountTypeName(account.accountType)
                    }, account);
                });
            });

            if (_.startsWith($route.previous.originalPath, '/account-sharing/users/:id/permissions')) {
                vm.user = EditOperatorPermissions.current();
            } else {
                EditOperatorPermissions.editOperatorPermissions(Number(id)).then(function (operator) {
                    vm.user = operator;
                });
            }

            OperatorService.roles().then(function(roles) {
                vm.roles = roles;
            });

            vm.next = function () {
                Flow.next();
                $location.path('/account-sharing/users/' + vm.user.id + '/permissions/confirm');
            };

            vm.cancel = function () {
                CancelDialogService.createDialog().then(function() {
                    $location.path('/account-sharing/users/' + vm.user.id);
                });
            };

            vm.isRoleSelectionValid = function () {
                if (vm.user) {
                    return vm.user.permissions.length > 0;
                }

                return false;
            };
        });
})();