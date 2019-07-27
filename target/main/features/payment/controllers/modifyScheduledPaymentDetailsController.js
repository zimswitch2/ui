(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/payment/scheduled/modify', {
            templateUrl: 'features/payment/partials/modifyScheduledPaymentDetails.html',
            controller: 'ModifyScheduledPaymentDetailsController'
        });
    });

    app.controller('ModifyScheduledPaymentDetailsController', function ($scope, $location, Flow, ViewModel,
                                                                        BeneficiariesListService, Card,
                                                                        AccountsService,
                                                                        ApplicationParameters, LimitsService) {

        Flow.create(['Modify details', 'Confirm details'], 'Modify Scheduled Payment', '/payment/scheduled/manage');

        AccountsService.list(Card.current()).then(function(accountData) {
            $scope.payFromAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
            $scope.account = $scope.payFromAccounts[0];
        });

        var model = ViewModel.initial();
        $scope.errorMessage = model.error;
        $scope.scheduledPayment = model.scheduledPayment;
        $scope.amount = model.amount || model.scheduledPayment.amount;
        $scope.paymentDetail = model.paymentDetail;
        $scope.isRecurringPayment = model.paymentDetail.isRecurringPayment();
        $scope.beneficiary = model.beneficiary;

        $scope.isNew = false;

        $scope.limitsService = new LimitsService();
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

        if (!$scope.beneficiary) {
            BeneficiariesListService.formattedBeneficiaryList(Card.current()).then(function (beneficiaries) {
                $scope.beneficiary = _.find(beneficiaries, {recipientId: $scope.scheduledPayment.recipientId});
            });
        }

        $scope.enforcer = function (value) {
            return $scope.limitsService.enforce({
                amount: value
            });
        };

        $scope.proceed = function () {
            ViewModel.current(
                {
                    scheduledPayment: $scope.scheduledPayment,
                    paymentDetail: $scope.paymentDetail,
                    beneficiary: $scope.beneficiary,
                    amount: $scope.amount
                });
            Flow.next();
            $location.path('/payment/scheduled/modify/confirm').replace();
        };
    });
})(angular.module('refresh.payment.future.controllers.modify.details', ['ngRoute', 'refresh.flow', 'refresh.filters', 'refresh.parameters', 'refresh.limits', 'refresh.datepicker']));

