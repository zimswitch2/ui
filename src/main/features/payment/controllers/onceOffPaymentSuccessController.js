(function (app) {
    'use strict';
    app.config(function($routeProvider) {
        $routeProvider.when('/payment/onceoff/success', {
            templateUrl: 'features/payment/partials/payBeneficiaryOnceOffSuccess.html',
            controller: 'OnceOffPaymentSuccessController'
        });
    });

    app.controller('OnceOffPaymentSuccessController',
        function ($scope, $location, OnceOffPaymentService, Flow, ApplicationParameters, $window,
                  OnceOffPaymentModel) {
            $scope.flow = Flow.get();
            $scope.statementDate = moment();
            $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

            $scope.onceOffPaymentModel = OnceOffPaymentModel.getOnceOffPaymentModel();

            var cardProfile = $scope.onceOffPaymentModel.cardProfile;
            cardProfile.usedEAPLimit.amount = parseFloat(cardProfile.usedEAPLimit.amount) + parseFloat($scope.onceOffPaymentModel.amount);
            var account = $scope.onceOffPaymentModel.account;
            account.availableBalance.amount =
                parseFloat($scope.onceOffPaymentModel.account.availableBalance.amount) - parseFloat($scope.onceOffPaymentModel.amount);
            $scope.onceOffPaymentModel.setAccount(account);
            $scope.onceOffPaymentModel.setCardProfile( cardProfile);

            $scope.done = function () {
                $location.path('/transaction/dashboard');
            };

        });
}) (angular.module('refresh.onceOffPayment') );
