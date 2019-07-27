(function () {
  'use strict';

    angular
        .module('refresh.permissions')
        .factory('PermissionsService', function ($q, Cacher, User) {
            function hasPermissionOnCurrentDashboard(permission) {

                return _(User.userProfile.currentDashboard.permissions)
                    .map(function (accountPermission) {
                        return accountPermission.permissionTypes;
                    })
                    .flatten()
                    .find(function (permissionType) {
                        var permissionString = permissionType.action + ':' + permissionType.activity;
                        return permission && permission.toUpperCase() === permissionString.toUpperCase();
                    });
            }

            var checkPermission = function(permission) {
                return User.isCurrentDashboardCardHolder() || hasPermissionOnCurrentDashboard(permission);
            };

            var loadPermissionsForDashboard = function(dashboard) {
                if (dashboard.systemPrincipalKey !== 'SED') {
                    return $q.when([]);
                }

                var request = {
                    systemPrincipalIdentifier: {
                        systemPrincipalKey: dashboard.systemPrincipalKey,
                        systemPrincipalId: dashboard.systemPrincipalId
                    }
                };

                return Cacher.perennial
                    .fetch('getOperatorPermissions', request, dashboard.systemPrincipalId)
                    .then(function(result) {
                        return result.data.accountPermissionTypes;
                    }
                );
            };

            return {
                checkPermission: checkPermission,
                loadPermissionsForDashboard: loadPermissionsForDashboard
            };
        });
})();
