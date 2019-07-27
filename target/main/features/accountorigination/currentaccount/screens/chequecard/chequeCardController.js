var debitOrderSwitchingFeature = false;
{
    debitOrderSwitchingFeature = true;
}

(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        var isValidApplicationState = function (CurrentAccountApplication) {
            return  CurrentAccountApplication.isInProgress();
        };

        var allowedFrom = [{path: '/apply/current-account/accept', condition: isValidApplicationState}];

        if (debitOrderSwitchingFeature) {
            allowedFrom = [{path: '/apply/current-account/debit-order-switching', condition: isValidApplicationState}];
        }
        $routeProvider.when('/apply/current-account/accept/card', {
            templateUrl: 'features/accountorigination/currentaccount/screens/chequecard/partials/chequeCard.html',
            controller: 'ChequeCardController',
            allowedFrom: allowedFrom,
            safeReturn: '/apply'
        });
    });

    app.controller('ChequeCardController', function ($scope, $location, Flow, AcceptCardCrossSellService, CurrentAccountApplication) {
        var acceptResponse = CurrentAccountApplication.acceptOfferResponse();
        var offer = CurrentAccountApplication.offer();
        var productSelection = CurrentAccountApplication.selection();

        $scope.chequeCardOptions = acceptResponse.crossSell.offerDetails[0].productDetails;
        $scope.chequeCardImage = acceptResponse.crossSell.offerDetails[0].productImage;

        $scope.selection = {};
        $scope.productFamily = offer.productFamily.id;

        $scope.moreThanOne = $scope.chequeCardOptions.length > 1;
        if (!$scope.moreThanOne) {
            $scope.selection.chequeCard = $scope.chequeCardOptions[0];
        }

        $scope.next = function () {
            AcceptCardCrossSellService.accept(offer.applicationNumber, $scope.selection.chequeCard.number, parseInt(productSelection.branch.code))
                .then(function () {
                    CurrentAccountApplication.acceptChequeCard($scope.selection.chequeCard);
                }).catch(function () {
                    CurrentAccountApplication.chequeCardError(true);
                }).finally(function () {
                    Flow.next();
                    $location.path('/apply/current-account/finish').replace();
                });
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.screens.chequeCard', ['refresh.flow', 'refresh.accountOrigination.currentAccount.services.acceptCardCrossSellService',
    'refresh.accountOrigination.currentAccount.domain.currentAccountApplication']));
