var debitOrderSwitchingFeature = false;
if (feature.debitOrderSwitching) {
    debitOrderSwitchingFeature = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.currentAccount.screens.finishApplication', [
        'refresh.flow',
        'refresh.card',
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.accountOrigination.domain.customer'
    ]);

    app.config(function ($routeProvider) {
        var isValidAccountState = function (CurrentAccountApplication) {
            return CurrentAccountApplication.isInProgress();
        };

        var allowedFrom = [
            {path: '/apply/current-account/accept/card', condition: isValidAccountState},
            {path: '/apply/current-account/accept', condition: isValidAccountState}
        ];

        if (debitOrderSwitchingFeature) {
            allowedFrom = [
            {path: '/apply/current-account/debit-order-switching', condition: isValidAccountState},
            {path: '/apply/current-account/accept/card', condition: isValidAccountState}];
        }

        $routeProvider.when('/apply/current-account/finish', {
            templateUrl: 'features/accountorigination/currentaccount/screens/finish/partials/currentAccountFinishApplication.html',
            controller: 'CurrentAccountFinishApplicationController',
            allowedFrom: allowedFrom,
            safeReturn: '/apply'
        });
    });

    app.controller('CurrentAccountFinishApplicationController', function ($scope, $location, Card, CurrentAccountApplication,
                                                       CustomerInformationData) {
        var offer = CurrentAccountApplication.offer();
        var selection = CurrentAccountApplication.selection();

        $scope.product = selection.product;
        $scope.offer = offer;

        var acceptResponse = CurrentAccountApplication.acceptOfferResponse();

        $scope.accountNumber = acceptResponse.accountNumber;
        $scope.applicationNumber = offer.applicationNumber;
        $scope.acceptedTimestamp = acceptResponse.timestamp;

        $scope.preferredBranchName = selection.branch.name;
        $scope.selectedChequeCardName = selection.chequeCard ? selection.chequeCard.name : undefined;
        $scope.crossSellError = CurrentAccountApplication.chequeCardError();
        $scope.letterDate = $scope.acceptedTimestamp;
        $scope.isPrivateBankingProduct = offer.productFamily.name.toUpperCase() === 'PRIVATE BANKING';

        var customer = CustomerInformationData.current();
        customer.letterData().then(function (letterData) {
            $scope.customer = letterData;
        });
        $scope.isCustomerKycCompliant = customer.isKycCompliant();
        $scope.newToBankCustomer = !Card.anySelected();

        $scope.hasOverdraft = function () {
            return $scope.offer.overdraft.selected;
        };

        $scope.statementsConsentSelected = function () {
            return $scope.offer.overdraft.selected &&
                $scope.offer.overdraft.statementsConsent.selected;
        };
    });
})();