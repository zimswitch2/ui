(function() {
    'use strict';
    angular.module('refresh.accountSharing.userDetails')
        .directive('accountSharingUserDetails', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/userDetails/userDetails.html',
                scope: {
                    user: '=',
                    editUser: "&",
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
