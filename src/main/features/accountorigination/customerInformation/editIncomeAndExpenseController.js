(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.incomeAndExpense',
        ['refresh.lookups', 'refresh.accountOrigination.customerService',
            'refresh.accountOrigination.domain.customer', 'refresh.accountOrigination.common.directives.cancelConfirmation',
            'refresh.accountOrigination.customerInfoValidation'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:product/income/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editIncomeAndExpenses.html',
            controller: 'EditIncomeAndExpenseController'
        });
    });

    app.controller('EditIncomeAndExpenseController', function ($scope, $location, $routeParams, $window, LookUps,
                                                               CustomerService, CustomerInformationData,
                                                               CancelConfirmationService,
                                                               CustomerInfoValidation, User, ApplicationParameters) {

        $scope.customerInformationData = CustomerInformationData.current();
        $scope.product = $routeParams.product;
        $scope.cancelButtonText =
            new IncomeAndExpenseValidation().validateSection($scope.customerInformationData) ? 'Cancel' : 'Back';

        LookUps.incomeType.promise().then(function (values) {
            $scope.incomeTypes = values;
            $scope.showAddIncomeItemLink = function () {
                return $scope.customerInformationData.getIncomes().length !== $scope.incomeTypes.length;
            };
        });

        function addItem(expenditureIndicator) {
            var emptyItem = {
                itemExpenditureIndicator: expenditureIndicator
            };
            $scope.customerInformationData.incomeExpenseItems.push(emptyItem);
        }

        if (!$scope.customerInformationData.hasAnyIncome()) {
            addItem('I');
        }

        $scope.customerInformationData.filterExpenses();

        if (_.isUndefined($scope.customerInformationData.getTotalExpenseItem())) {
            var totalExpenseItem = {itemExpenditureIndicator: 'E', itemTypeCode: '99'};
            $scope.customerInformationData.incomeExpenseItems.push(totalExpenseItem);
        }

        $scope.addItem = function (expenditureIndicator) {
            addItem(expenditureIndicator);
        };

        $scope.removeItem = function (item) {
            _.remove($scope.customerInformationData.incomeExpenseItems, item);
            $scope.incomeAndExpensesForm.$setDirty();
        };

        $scope.getValidationNotification = function () {
            return CustomerInfoValidation.getValidationNotificationForSection('income');
        };

        $scope.next = function () {
            CancelConfirmationService.cancelEdit(function () {
                $location.path('/apply/' + $scope.product + '/submit');
            });
        };

        $scope.save = function () {
            CustomerService.updateIncomeAndExpenses($scope.customerInformationData).then(function (response) {

                $location.path('/apply/' + $scope.product + '/income').replace();
            }).catch(function (error) {

                $scope.serverErrorMessage = error.message;
                if (User.hasDashboards()) {
                    ApplicationParameters.pushVariable('otpErrorMessage', error.message);
                }
            });
        };

        $scope.cancel = function () {
            CancelConfirmationService.cancelEdit(function () {
                $window.history.go(-1);
            });
        };
    });

    app.filter('typesFilter', function () {
        return function (allTypesFromService, selectedItems, currentItemTypeCode) {
            return _.filter(allTypesFromService, function (item) {
                return !_.any(selectedItems, {itemTypeCode: item.code}) || item.code === currentItemTypeCode;
            });
        };
    });
})();
