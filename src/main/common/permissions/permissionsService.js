(function () {
  'use strict';

    angular
        .module('refresh.permissions')
        .factory('PermissionsService', function ($q, Cacher, User) {
            function hasPermissionOnCurrentDashboard(permission) {

		console.log("userProfile.currentDashboard: " + JSON.stringify(User.userProfile.currentDashboard) );
		console.log("dashboard permissions: " + JSON.stringify(User.userProfile.currentDashboard.permissions) );
                return _(User.userProfile.currentDashboard.permissions)
                    .map(function (accountPermission) {
			console.log("==== accountPermission: " + JSON.stringify(accountPermission));
                        return accountPermission.permissionTypes;
                    })
                    .flatten()
                    .find(function (permissionType) {
			console.log("permissionType: " + permissionType);
                        var permissionString = permissionType.action + ':' + permissionType.activity;
			console.log("permissionString: " + permissionString);
			console.log("permission: " + permission);
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
			console.log("==== getOp permission : " + JSON.stringify(result));
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
