(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.screens.confirmOffer',
        [
            'ngRoute',
            'refresh.accountOrigination.rcp.domain.rcpApplication',
            'refresh.flow',
            'refresh.metadata',
            'refresh.accountOrigination.rcp.services.OfferService'
        ]);

    app.config(function ($routeProvider) {
        var isValidState = function(RcpApplication) {
            return RcpApplication.isInProgress();
        };

        $routeProvider.when('/apply/rcp/confirm',
            {
                //TODO: Should this screen be called confirm? It is called confirm in the flow step but maybe it should be renamed to accept in order to be consistent with other products
                templateUrl: 'features/accountorigination/rcp/screens/confirm/partials/rcpConfirmOffer.html',
                controller: 'RcpConfirmOfferController',
                allowedFrom: [{path: '/apply/rcp/offer', condition: isValidState}],
                safeReturn: '/apply'
            });
    });

    app.controller('RcpConfirmOfferController',
        function ($scope, $location, Flow, RcpApplication, RcpOfferService, URL, User) {

            var offer = RcpApplication.offer();

            var debitOrder = RcpApplication.selection().debitOrder;

            var debitOrderDetails = debitOrder.transformToServiceDebitOrder();

            $scope.offerDetails = offer.rcpOfferDetails;

            $scope.selection = RcpApplication.selection();

            $scope.preferredBranch = RcpApplication.selection().selectedBranch.name;

            $scope.requestedLimit = RcpApplication.selection().requestedLimit;

            $scope.downloadRcpDebitOrderMandate = URL.downloadRcpDebitOrderMandate;

            $scope.downloadRcpCostOfCreditAgreement = URL.downloadRcpCostOfCreditAgreement;

            $scope.debitOrder = debitOrder;

            $scope.principal = User.principal().systemPrincipalIdentifier;

            $scope.debitOrderDetails = debitOrderDetails;

            $scope.applicationNumber = offer.applicationNumber;
            $scope.confirm = function () {
                var selection = RcpApplication.selection();

                var newAccountDetails = new NewAccountDetails(offer.rcpOfferDetails.productNumber,
                    offer.applicationNumber, selection.selectedBranch.code,
                    selection.requestedLimit);

                RcpOfferService.accept(newAccountDetails, debitOrderDetails
                ).then(function (offerConfirmationDetails) {
                        RcpApplication.confirm(offerConfirmationDetails);
                        Flow.next();
                        $location.path('/apply/rcp/finish');
                    });
            };

            $scope.backToRevolvingCreditPlan = function () {
                Flow.previous();
                $location.path('/apply/rcp/offer');
            };
        });

}());
