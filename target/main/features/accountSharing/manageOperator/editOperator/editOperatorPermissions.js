(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .factory('EditOperatorPermissions', function (OperatorService) {
            var current;

            return {
                editOperatorPermissions: function (operatorId) {
                    return OperatorService.getOperator(operatorId).then(function (operator) {
                        current = operator;
                        return operator;
                    });
                    
                },
                current: function() {
                    return current;
                },
                updateOperatorPermissions: function () {
                    return OperatorService.updateOperatorPermissions(current);
                }
            };
        });
})();