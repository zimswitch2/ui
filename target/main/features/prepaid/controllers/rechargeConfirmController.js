(function (app) {
    'use strict';

    app.controller('RechargeConfirmController', function ($scope, $location, ViewModel, RechargeService, Flow,
                                                          ApplicationParameters, $routeParams) {
        var providerId = $routeParams.providerId;
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.recharge = ViewModel.current();

        $scope.confirm = function () {
            Flow.next();
            RechargeService.recharge($scope.recharge)
                .then(function (result) {
                    $scope.recharge.dailyWithdrawalLimit = result.cardProfile.dailyWithdrawalLimit.amount;
                    $scope.recharge.account.availableBalance = result.account[0].availableBalance;

                    var metadataKeys = {
                        VOUCHERNUMBER: 'voucherNumber',
                        KILOWATTS: 'quantityPurchased',
                        REFERENCE: 'referenceNumber',
                        VAT: 'vatRegistrationNumber',
                        FREEVOUCHERNUMBER: 'freeVoucherNumber',
                        FREEVOUCHERQUANTITY: 'freeVoucherQuantity'
                    };

                    if (!_.isUndefined(result.transactionResults[0])) {
                        $scope.recharge.results = _.reduce(result.transactionResults[0].transactionResultMetaData, function (result, metadata) {
                            result[metadataKeys[metadata.transactionResultKey]] = metadata.value;
                            return result;
                        }, {});
                    }

                    ViewModel.current($scope.recharge);
                    Flow.next();
                    $location.path('/prepaid/recharge/' + providerId + "/results");
                })
                .catch(function (serviceError) {
                    ViewModel.error(serviceError);
                    Flow.previous();
                    $location.path('/prepaid/recharge/' + providerId);
                });
        };

        $scope.cancel = function () {
            ViewModel.initial();
        };

        $scope.modify = function () {
            ViewModel.modifying();
            Flow.previous();
        };
    });
})(angular.module('refresh.prepaid.recharge.controllers.confirm', ['ngRoute', 'refresh.prepaid.recharge.services', 'refresh.filters']));
