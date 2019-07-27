(function () {
    'use strict';

    var module = angular.module('refresh.instantMoneyController', [
        'refresh.sorter',
        'refresh.InstantMoneyService',
        'refresh.card',
        'refresh.filters',
        'refresh.customizedFilter',
        'refresh.accounts'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money', {
            controller: 'InstantMoneyController',
            templateUrl: 'features/instantMoney/partials/instantMoney.html'
        });
    });

    module.filter('uncollectedInstantMoneyFilter', function (CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path: 'createdDate', type: 'date'},
            {path: 'voucherNumber'},
            {path: 'contact.address'},
            {path: 'fromAccount'}
        ]);
    });

    module.controller('InstantMoneyController', function ($sorter, $scope, InstantMoneyService, Card, ViewModel, $location, AccountsService) {
        $scope.sortBy = $sorter;
        $scope.sortBy('createdDate');
        $scope.haveVouchers = true;

        $scope.sortArrowClass = function (criteria) {
            return "icon icon-sort" + (this.sort.criteria === criteria ? ' active' : '');
        };

        InstantMoneyService.getUncollectedVouchers(Card.current()).then(function (response) {
            AccountsService.list(Card.current()).then(function (accountData) {
                var aliveAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
                _.forEach(response, function (voucher) {
                    _.some(aliveAccounts, function(account){
                        if(account.number === voucher.accNo.toString() && account.productName === voucher.accProductName){
                            voucher.accAvailableBalance = account.availableBalance;
                            voucher.fromAccount = voucher.accProductName+" - "+account.formattedNumber;
                            return true;
                        }
                    });
                });
                $scope.haveVouchers = !!(response && response.length);
                if (!$scope.haveVouchers) {
                    return;
                }
                $scope.instantMoneyHistory = response;
            });
        });

        $scope.modify = function (uncollectedInstantMoneyVoucher) {
            ViewModel.current(uncollectedInstantMoneyVoucher);
            ViewModel.modifying();
            $location.path('/instant-money/change-pin');
        };

        $scope.delete = function (voucher) {
            $scope.voucherToDelete = voucher;
        };

        $scope.confirmDelete = function () {
            $scope.errorMessage = null;
            $scope.success = null;
            $scope.isSuccessful = false;

            InstantMoneyService.cancelVoucher(Card.current(), $scope.voucherToDelete).then(function () {
                var indexToRemove = $scope.instantMoneyHistory.indexOf($scope.voucherToDelete);
                $scope.instantMoneyHistory.splice(indexToRemove, 1);
                $scope.isSuccessful = true;
                $scope.success = 'Voucher ' + $scope.voucherToDelete.voucherNumber + ' successfully cancelled.';
            }).catch(function (error) {
                var errorMessage = 'Error cancelling voucher ' + $scope.voucherToDelete.voucherNumber + '. ';
                if (error) {
                    errorMessage += 'Reason: ' + error + '.';
                }

                $scope.errorMessage = errorMessage;
                $scope.voucherToDelete.voucherPin = null;
            }).finally(function () {
                $scope.voucherToDelete = null;
            });
        };

        $scope.cancelDelete = function () {
            $scope.errorMessage = null;
            $scope.success = null;
            $scope.isSuccessful = false;
            $scope.voucherToDelete.voucherPin = null;
            $scope.voucherToDelete = null;
        };
    });
}());