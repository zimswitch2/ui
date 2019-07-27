(function() {
    'use strict';
    angular.module('refresh.accountSharing.addUser')
        .directive('cancelDialog', function(CancelDialogService) {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/manageOperator/addOperator/cancel/cancelDialogDirective.html',
                scope: true,
                link: function() {
                    CancelDialogService.hide();
                },
                controller: 'CancelDialogController',
                controllerAs: 'cancel',
                bindToController: true
            };

            return directive;
        });
})();
