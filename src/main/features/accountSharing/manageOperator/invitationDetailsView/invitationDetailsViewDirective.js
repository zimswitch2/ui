(function() {
    'use strict';
    angular.module('refresh.accountSharing.invitationDetailsView')
        .directive('accountSharingInvitationDetailsView', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/invitationDetailsView/invitationDetailsView.html',
                scope: {
                    operatorDetails: '=',
                    referenceNo: '=',
                    editOperator: "&",
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