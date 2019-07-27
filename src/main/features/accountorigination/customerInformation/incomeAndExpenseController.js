(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.incomeAndExpense', ['refresh.accountOrigination.domain.customer']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/income', {
            templateUrl: 'features/accountorigination/customerInformation/partials/incomeAndExpenses.html',
            controller: 'IncomeAndExpenseController',
            resolve: {
                checkRouting: function ($location, $route, CustomerInformationData) {
                    if (!new IncomeAndExpenseValidation().validateSection(CustomerInformationData.current())) {
                        CustomerInformationData.stash();
                        $location.path('/apply/' + $route.current.params.product + '/income/edit').replace();
                    }
                }
            }
        });
    });

    app.controller('IncomeAndExpenseController', function ($scope, $location, $routeParams, CustomerInformationData) {
        $scope.product = $routeParams.product;
        $scope.customerInformationData = CustomerInformationData.current();

        $scope.edit = function () {
            CustomerInformationData.stash();
            $location.path('/apply/' + $scope.product + '/income/edit');
        };

        $scope.next = function () {
            $location.path('/apply/' + $scope.product + '/submit');
        };
    });
})();
