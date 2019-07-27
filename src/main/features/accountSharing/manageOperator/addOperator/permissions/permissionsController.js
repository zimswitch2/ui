(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser')
        .controller('PermissionsController', function(Flow, Card, AddUserService, CancelDialogService, AccountsService, OperatorService, HomeService, $window, $location) {
            var vm = this;
            var activeTabs = [];

            vm.headerName = Flow.getHeaderName();
            vm.user = AddUserService.user();
            vm.accountRoles = AddUserService.accountRoles();

            var card = Card.current();
            AccountsService.list(card).then(function(response) {
                vm.accounts = _.map(response.accounts, function(account) {
                    return _.merge({
                        accountTypeName: AccountsService.accountTypeName(account.accountType)
                    }, account);
                });
            });

            OperatorService.roles().then(function(roles) {
                vm.roles = roles;
            });

            vm.name = function(n) {
                return _.capitalize(n);
            };

            vm.description = function(d) {
                var hyphenIndex = d.indexOf('-');
                if (hyphenIndex > 0 && hyphenIndex + 1 < d.length) {
                    return _.trim(d.substring(hyphenIndex + 1, d.length));
                }

                return _.trim(d);
            };

            vm.allAccountsHaveNoRole = function() {
                return _.any(vm.accounts, function(account) {
                        return vm.accountRoles[account.number] === undefined;
                    }) || _.every(vm.accounts, function(account) {
                        return vm.accountRoles[account.number] === 'None';
                    });
            };

            function close(tabName) {
                activeTabs.pop(tabName);
            }

            function open(tabName) {
                activeTabs.push(tabName);
            }

            vm.isOpenTab = function(tabName) {
                return activeTabs.indexOf(tabName) > -1;
            };

            vm.openTab = function(tabName) {
                if (vm.isOpenTab(tabName)) {
                    close(tabName);
                } else {
                    open(tabName);
                }
            };

            vm.next = function() {
                AddUserService.createPermissions(vm.accounts, vm.roles, vm.accountRoles);
                Flow.next();
                $location.path('/account-sharing/user/confirm').replace();
            };

            vm.back = function() {
                $window.history.back();
            };

            vm.cancel = function() {
                CancelDialogService.createDialog().then(
                    function() {
                        AddUserService.reset();
                        HomeService.goHome();
                    });
            };

            if (AddUserService.entryMode !== undefined && AddUserService.entryMode.mode === 'editOperator') {
                AddUserService.createPermissions(vm.accounts, vm.roles, AddUserService.accountRoles());
            }
        });
}());
