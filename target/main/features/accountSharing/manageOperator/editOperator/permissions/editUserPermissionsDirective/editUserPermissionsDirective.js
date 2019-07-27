(function () {
    'use strict';
    angular.module('refresh.accountSharing.userDetails')
        .directive('editUserPermissions', function () {
            return {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/editOperator/permissions/editUserPermissionsDirective/editUserPermissions.html',
                scope: {
                    permissions: '=',
                    roles: '=',
                    accounts: '=',
                    userName: '='
                },
                controller: function () {
                    var vm = this;

                    vm.name = function (n) {
                        return _.capitalize(n);
                    };
                },
                controllerAs: 'vm',
                link: function (scope) {
                    function account(originalAccount) {
                        return {
                            accountTypeName: originalAccount.accountTypeName,
                            formattedNumber: originalAccount.formattedNumber,
                            productName: originalAccount.productName,
                            number: originalAccount.number
                        };
                    }

                    function role(originalRole) {
                        return originalRole ? {
                            "id": originalRole.id,
                            "name": originalRole.name,
                        } : {
                            id: 0,
                            name: 'None'
                        };
                    }

                    function loadPermissions(permissions) {
                        _.forEach(permissions, function (p) {
                            scope.accountRoles[p.accountReference.number] = p.role.name;
                        });
                    }

                    scope.accountRoles = {};

                    if (!scope.permissions) {
                        scope.$watch('permissions', function () {
                            loadPermissions(scope.permissions);
                        }, true);
                    } else {
                        loadPermissions(scope.permissions);
                    }

                    scope.$watch('accountRoles', function () {
                        var permissions = _(scope.accountRoles)
                            .map(function (roleName, accNumber) {
                                return {
                                    accountReference: account(_.find(scope.accounts, {
                                        number: accNumber
                                    })),
                                    role: role(_.find(scope.roles, {
                                        name: roleName
                                    }))
                                };
                            })
                            .reject(function (p) {
                                return p.role.name === 'None';
                            })
                            .value();

                        scope.permissions = permissions;
                    }, true);
                }
            };
        });
})();
