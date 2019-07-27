(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.currentAccount.screens.offers', [
        'refresh.flow',
        'refresh.metadata',
        'refresh.notifications.service',
        'refresh.security.user',
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.accountOrigination.currentAccount.services.overdraftLimits',
        'refresh.mapFilter',
        'refresh.accountOrigination.domain.customer'
    ]);

    app.config(function ($routeProvider) {
        var hasOfferAndIsCurrentAccount = function (CurrentAccountApplication, $routeParams) {
            return CurrentAccountApplication.offer() && $routeParams.product === 'current-account';
        };

        var hasOffer = function (CurrentAccountApplication) {
            return CurrentAccountApplication.offer();
        };

        $routeProvider.when('/apply/current-account/offer', {
            templateUrl: 'features/accountorigination/currentaccount/screens/offers/partials/currentAccountOffer.html',
            controller: 'CurrentAccountOffersController',
            allowedFrom: [
                {path: '/apply/:product/submit', condition: hasOfferAndIsCurrentAccount},
                {path: '/apply/current-account/accept', condition: hasOffer},
                {path: '/apply/current-account/pre-screen', condition: hasOffer}
            ],
            safeReturn: '/apply'
        });
        $routeProvider.when('/apply/current-account/unsupported', {
            templateUrl: 'features/accountorigination/common/screens/unsupportedOffer/partials/unsupportedOffer.html'
        });
    });

    app.controller('CurrentAccountOffersController',
        function ($scope, $location, Flow, BankService, mapFilter, $timeout, OverdraftLimitsService,
                  NotificationService, CurrentAccountApplication, CustomerInformationData, BranchLazyLoadingService) {
            var limitsService = new OverdraftLimitsService();

            var offer = CurrentAccountApplication.offer();

            $scope.accept = function () {
                CurrentAccountApplication.select({
                    product: offer.products[$scope.selectedProductIndex],
                    branch: $scope.selection.branch
                });

                Flow.next();
                $location.path('/apply/current-account/accept').replace();
            };

            $scope.offer = offer;
            $scope.letterDate = offer.timestamp;
            $scope.moreThanOne = offer.products.length > 1;
            $scope.isPrivateBankingProduct = offer.productFamily.name === 'Private Banking';
            $scope.selection = CurrentAccountApplication.selection();

            $scope.chooseProduct = function (index) {
                $scope.selectedProductIndex = index;
                $scope.selection.product = $scope.offer.products[$scope.selectedProductIndex];
            };

            if (!$scope.moreThanOne) {
                $scope.chooseProduct(0);
            }

            $scope.offeredOverdraft = function () {
                return $scope.offer.overdraft && $scope.offer.overdraft.limit > 0;
            };

            $scope.allowOverdraftApplication = function () {
                return CurrentAccountApplication.canApplyForOverdraft() && $scope.offeredOverdraft();
            };

            $scope.overdraftToggle = function () {
                offer.overdraft.statementsConsent.selected = $scope.offer.overdraft.selected;
                if (!$scope.offer.overdraft.selected) {
                    $scope.offer.overdraft.amount = 0;
                } else {
                    $scope.offer.overdraft.amount = $scope.offer.overdraft.limit;
                }
                $timeout(function () {
                    angular.element('section.overdraft input[name="amount"]').removeClass('ng-pristine').addClass('ng-dirty');
                });
            };

            $scope.hinter = function () {
                return limitsService.hint();
            };

            $scope.enforcer = function () {
                if ($scope.offer.overdraft && !$scope.offer.overdraft.selected) {
                    return {};
                }
                return limitsService.enforce({amount: $scope.amountViewValue(), limit: $scope.offer.overdraft.limit});
            };

            $scope.amountViewValue = function () {
                return $('input[name="amount"]').val();
            };

            var fetchWalkInBranches = function (initialBranchCode) {
                BankService.walkInBranches().then(function (branches) {
                    $scope.walkInBranches = branches;
                    $scope.selection.branch = _.find($scope.walkInBranches, {code: initialBranchCode});
                });
            };

            $scope.offer.overdraft.statementsConsent = {selected: false};
            $scope.branches = [];

            $scope.clearBranch = function () {
                $scope.offer.overdraft.statementsConsent.branch = undefined;
            };

            $scope.onBankChanged = function () {
                if ($scope.offer.overdraft.statementsConsent.bank) {
                    $scope.clearBranch();
                    if (!$scope.branches[$scope.offer.overdraft.statementsConsent.bank.code]) {
                        BranchLazyLoadingService.
                            bankUpdate($scope.branches, $scope.offer.overdraft.statementsConsent, $scope.offer.overdraft.statementsConsent.bank, null);
                    }
                }
            };

            $scope.bankAccountTypes = [
                { name: 'CURRENT', label: function () { return 'CURRENT'; }},
                { name: 'SAVINGS', label: function () { return 'SAVINGS'; }}
            ];

            var loadDebitOrderBankList = function () {
                BankService.list().then(function (banks) {
                    $scope.banks = _.map(banks, function (bank) {
                        bank.label = function () {
                            return bank.name;
                        };
                        return bank;
                    });
                });
            };

            $scope.selectedBankBranches = function () {
                if ($scope.offer.overdraft.statementsConsent.bank) {
                    return $scope.branches[$scope.offer.overdraft.statementsConsent.bank.code];
                } else {
                    return $scope.branches[undefined];
                }
            };

            $scope.overdraftConsentAnalytics = function(){
                return ($scope.offer.overdraft.statementsConsent.selected) ?
                    "Don't-Consent-To-Obtain-Account-Statements" :
                    "Consent-To-Obtain-Account-Statements";
            };

            var customer = CustomerInformationData.current();
            customer.letterData().then(function (letterData) {
                $scope.customer = letterData;
            });

            fetchWalkInBranches(
                $scope.selection.branch ? $scope.selection.branch.code : customer.branchCode.toString()
            );

            if ($scope.offeredOverdraft()) {
                loadDebitOrderBankList();
            }
        });
})();
