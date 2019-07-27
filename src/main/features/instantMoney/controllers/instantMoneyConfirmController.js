(function () {
    'use strict';
    var module = angular.module('refresh.instantMoney.confirmController', [
        'refresh.flow',
        'refresh.InstantMoneyService'
    ]);

    module.config(function($routeProvider) {
       $routeProvider.when('/instant-money/confirm', {
           controller: 'InstantMoneyConfirmController',
           templateUrl: 'features/instantMoney/partials/instantMoneyConfirm.html'
       });
    });


    module.controller('InstantMoneyConfirmController', function($scope, $location, $q, ViewModel, Flow, InstantMoneyService) {
        $scope.voucher = ViewModel.current();

        $scope.modify = function() {
            $location.path('/instant-money/details').replace();
            ViewModel.modifying();
            Flow.previous();
        };

        $scope.confirm = function () {
            Flow.next();
            InstantMoneyService.sendInstantMoney($scope.voucher).then(function (response) {
                var transactionSuccess =  _.find(response.transactionResults, {responseCode: {responseType: 'SUCCESS'}});
                if(transactionSuccess) {
                    var transactionResultMetaData = transactionSuccess.transactionResultMetaData;
                    var transactionReferenceResult = _.find(transactionResultMetaData, {transactionResultKey: 'REFERENCE'});
                    $scope.voucher.referenceNumber = transactionReferenceResult && transactionReferenceResult.value;

                    var transactionVoucherResult = _.find(transactionResultMetaData, {transactionResultKey: 'VOUCHERNUMBER'});
                    $scope.voucher.voucherNumber = transactionVoucherResult && transactionVoucherResult.value;


                    $scope.voucher.availableBalance = response.account[0].availableBalance.amount;

                    ViewModel.current($scope.voucher);
                    $location.path('/instant-money/success').replace();
                } else {
                    if(response.transactionResults && response.transactionResults[0] && response.transactionResults[0].responseCode) {
                        return $q.reject(mapErrorCodeToMessage(response.transactionResults[0].responseCode.code));
                    }
                    return $q.reject('An unexpected error has been encountered. Please try again later');
                }

            }).catch(function (error) {
                $location.path('/instant-money/details').replace();
                Flow.previous();
                ViewModel.error({message: error});
            });
        };
    });

    var mapErrorCodeToMessage = function (errorCode){
        var messagesAndCodes = [
            {
                code: "2807",
                message : "Voucher limit exceeded. You can send a maximum of R 5 000 per day"
            },
            {
                code: "2016",
                message: "You have insufficient funds in this account to make the requested payments"
            },
            {
                code: "2822",
                message: "Invalid Pin"
            }
        ];

        var messageAndCode = _.find(messagesAndCodes, {
            code: errorCode
        });

        return messageAndCode && messageAndCode.message || 'An unexpected error has been encountered. Please try again later';
    };

}());