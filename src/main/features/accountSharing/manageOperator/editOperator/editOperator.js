(function () {
    'use strict';

    angular
        .module('refresh.accountSharing.editUserDetails')
        .factory('EditOperator', function (OperatorService, $q) {
            var _currentOperator;

            function currentOperator() {
                return _currentOperator;
            }

            function edit(id) {
                return OperatorService.getOperator(id)
                    .then(function (operator) {
                        if (!operator) {
                            return $q.reject('Operator not found');
                        }

                        _currentOperator = operator;
                        return operator;
                    });
            }

            function updateOperator() {
                return OperatorService.updateOperator(_currentOperator);
            }

            return  {
                currentOperator: currentOperator,
                edit: edit,
                updateOperator: updateOperator
            };
        });
})();