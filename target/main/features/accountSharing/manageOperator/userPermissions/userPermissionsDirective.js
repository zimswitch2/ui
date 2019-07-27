(function() {
    'use strict';
    angular.module('refresh.accountSharing.userPermissions')
        .directive('accountSharingUserPermissions', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/userPermissions/userPermissions.html',
                scope: {
                    permissions: '=',
                    editPermissions: "&",
                    hideFields: '='
                },
                link: function(scope) {
                    scope.hide = _.reduce(scope.hideFields, function(result, field) {
                        result[field] = true;
                        return result;
                    }, {});
                }
            };

            return directive;
        });
})();
