(function() {
    'use strict';

    angular
        .module('refresh.accountSharing')
        .directive('accountSharingWidget', function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'features/accountSharing/accountSharingWidget/partials/accountSharing.html',
                scope: true,
                controller: 'AccountSharingWidgetController',
                controllerAs: 'vm',
                bindToController: true
            };

            return directive;
        });
})();
