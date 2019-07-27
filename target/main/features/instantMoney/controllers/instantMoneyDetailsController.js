(function () {
    var module = angular.module('refresh.instantMoneyDetailsController', [
        'refresh.flow',
        'refresh.accounts',
        'refresh.flow',
        'refresh.instantMoney.limits'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money/details', {
            controller: 'InstantMoneyDetailsController',
            templateUrl: 'features/instantMoney/partials/instantMoneyDetails.html'
        });
    });

    module.controller('InstantMoneyDetailsController', function ($scope, $location, Flow, AccountsService, Card, ViewModel, InstantMoneyLimitsService, AccountsValidationService) {
        Flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Instant Money', '/instant-money');

        var instantMoneyLimitsService  = new InstantMoneyLimitsService();


        var existingVoucher = ViewModel.initial();
        $scope.errorMessage = existingVoucher ? existingVoucher.error: undefined;

        AccountsService.list(Card.current()).then(function (accountData) {
            $scope.monthlyEAPLimit = accountData.cardProfile.monthlyEAPLimit.amount;
            $scope.hasZeroEAPLimit = $scope.monthlyEAPLimit === 0;
            $scope.dailyWithdrawalLimit = accountData.cardProfile.dailyWithdrawalLimit.amount;
            $scope.usedLimit = accountData.cardProfile.usedEAPLimit.amount;
            $scope.remainingEAP = accountData.cardProfile.remainingEAP.amount;
            $scope.aliveAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
            if ($scope.aliveAccounts && $scope.aliveAccounts.length > 0) {
                if(existingVoucher && existingVoucher.account){
                    $scope.voucher = existingVoucher;
                } else {
                    $scope.voucher = {
                        account: $scope.aliveAccounts[0]
                    };
                }
            }
            $scope.payFromAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
            var validateResult = AccountsValidationService.validatePaymentFromMessage($scope.payFromAccounts);
            $scope.hasInfo = validateResult.hasInfo;
            $scope.infoMessage = validateResult.infoMessage;
        });


        $scope.next = function () {
            ViewModel.current($scope.voucher);
            Flow.next();
            $location.path('/instant-money/confirm').replace();
        };

        $scope.showDisclaimer = function() {
            $scope.isDisclaimerVisible = true;
        };

        $scope.hideDisclaimer = function() {
            $scope.isDisclaimerVisible = false;
        };

        $scope.enforcer = function () {
            return instantMoneyLimitsService.enforce({
                amount: $scope.voucher.amount,
                dailyWithdrawalLimit: $scope.dailyWithdrawalLimit,
                account: $scope.voucher.account,
                remainingEAP: $scope.remainingEAP,
                monthlyLimit: parseInt($scope.voucher.amount) + $scope.usedLimit
            });
        };

        $scope.hinter = function () {
            return instantMoneyLimitsService.hint();
        };
    });
}());