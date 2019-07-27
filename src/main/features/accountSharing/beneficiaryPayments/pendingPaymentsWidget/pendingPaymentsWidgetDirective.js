(function(){
    'use strict';

    angular.module('refresh.accountSharing.beneficiaryPayments').directive('pendingPaymentsWidget', function(){
        var directive = {
            restrict: 'E',
            templateUrl: 'features/accountSharing/beneficiaryPayments/pendingPaymentsWidget/partials/pendingPaymentsWidget.html',
            scope: true,
            controller: 'PendingPaymentsWidgetController',
            controllerAs: 'vm2',
            bindToController: true
        };

        return directive;
    });
})();