(function () {
    'use strict';

    var module = angular.module('refresh.bankAndBranch.walkInBranches',
        [
            'refresh.metadata',
            'refresh.accountOrigination.domain.customer'
        ]);

    module.directive('walkInBranches', function (BankService, CustomerInformationData) {

        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: 'common/bankAndBranch/partials/walkInBranches.html',
            scope: {
                ngRequired: '=',
                id: '@',
                name: '@',
                placeholder: '@',
                defaultToPreferredBranch: '=',
                defaultBranchSelected: '='
            },
            link: function (scope, element, attrs, ngModel) {
                scope.values = {};

                function setModelValue(){
                    var modelValue = scope.values.modelValue;
                    var useBranchCode = element.attr('use-branchcode-value');
                    if(modelValue && useBranchCode){
                        modelValue = parseInt(modelValue.code);
                    }
                    ngModel.$setViewValue(modelValue);
                }

                scope.modelChanged = function() {
                    setModelValue();
                };

                ngModel.$render = function() {
                    scope.values.modelValue = ngModel.$modelValue;
                };

                BankService.walkInBranches().then(function (branches) {
                    scope.walkInBranches = branches;

                    var branchCode = CustomerInformationData.current().branchCode;
                    if (scope.defaultToPreferredBranch && branchCode) {
                        var customerPreferredBranch = _.find(scope.walkInBranches, {code: branchCode.toString()});
                        scope.values.modelValue = customerPreferredBranch;
                        scope.defaultBranchSelected = customerPreferredBranch;

                        setModelValue();
                    }
                });
            }
        };
    });
})();
