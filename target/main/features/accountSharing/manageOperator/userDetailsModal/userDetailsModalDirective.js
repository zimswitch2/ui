(function() {
    'use strict';
    angular.module('refresh.accountSharing.operatorDetails')
        .directive('userDetailsModal', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/userDetailsModal/userDetailsModal.html',
                transclude: true,
                scope: {
                    title: '@',
                    showModal: '=',
                    onConfirm: '&',
                    onCancel: '&',
                    confirmText: '@',
                    cancelText: '@'
                }
            };

            return directive;
        });
})();
