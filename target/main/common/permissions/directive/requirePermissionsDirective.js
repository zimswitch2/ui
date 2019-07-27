(function () {
    'use strict';

    {

        angular
            .module('refresh.permissions')
            .directive('requirePermission', ['PermissionsService', function (PermissionsService) {
                return {
                    restrict: 'A',
                    priority: 999,
                    link: function (scope, element, attr) {
                        if (!PermissionsService.checkPermission(attr['requirePermission'])) {
                            element.remove();
                        }
                    }
                };
            }]);
        }
})();
