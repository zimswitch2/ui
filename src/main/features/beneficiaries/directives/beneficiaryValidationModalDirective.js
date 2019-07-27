(function() {
    'use strict';
    angular.module('refresh.beneficiaries.directives.beneficiariesList')
        .directive('beneficiaryValidationModal', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/beneficiaries/partials/beneficiaryValidationModal.html',
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
