(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.screens.offer', [
        'ngRoute',
        'ngSanitize',
        'refresh.accountOrigination.rcp.domain.rcpApplication',
        'refresh.flow',
        'refresh.metadata',
        'refresh.accountOrigination.rcp.services.OfferService',
        'refresh.accountOrigination.rcp.services.rcpRequestLimitsService',
        'refresh.accountOrigination.rcp.domain.rcpCalculator',
        'refresh.accountOrigination.rcp.domain.debitOrder',
        'refresh.accounts',
        'refresh.card',
        'refresh.accountOrigination.rcp.services.rcpDebitOrderLimits',
        'refresh.lookups',
        'refresh.bankAndBranch.walkInBranches'
    ]);

    app.config(function ($routeProvider) {
        var isNewApplication = function (RcpApplication, $routeParams) {
            var applicationInCorrectState = RcpApplication.isNew();
            var fromRcpFlow = $routeParams.product === 'rcp';
            return applicationInCorrectState && RcpApplication.isPreScreeningComplete() && fromRcpFlow;
        };

        var isApplicationInProgress = function (RcpApplication) {
            return RcpApplication.isInProgress();
        };

        var isPendingApplication = function (RcpApplication) {
            return RcpApplication.isPending();
        };
        
        $routeProvider.when('/apply/rcp/offer',
            {
                templateUrl: 'features/accountorigination/rcp/screens/offer/partials/rcpOffer.html',
                controller: 'RcpOfferController',
                safeReturn: '/apply',
                allowedFrom: [
                    {path: '/apply/:product/submit', condition: isNewApplication},
                    {path: '/apply/rcp/confirm', condition: isApplicationInProgress},
                    {path: '/apply', condition: isPendingApplication}
                ]
            });
        $routeProvider.when('/apply/rcp/unsupported', {
            templateUrl: 'features/accountorigination/common/screens/unsupportedOffer/partials/unsupportedOffer.html'
        });
    });

    app.controller('RcpOfferController',
        function ($scope, $location, $timeout, RcpApplication, Flow, BankService, RcpOfferService, $route,
                  BranchLazyLoadingService, AccountsService, Card, RcpCalculator, RcpDebitOrderLimitsService,
                  RcpRequestLimitsService, LookUps, DebitOrder, URL, User, $q) {
            var limitsService = new RcpDebitOrderLimitsService();
            var requestLimitService = new RcpRequestLimitsService();

            var loadData = [];

            var loadDebitOrderBankList = function () {
                var loadBanksPromise = BankService.list();
                loadData.push(loadBanksPromise);

                loadBanksPromise.then(function (banks) {

                    $scope.banks = _.map(banks, function (bank) {
                        bank.label = function () {
                            return bank.name;
                        };
                        return bank;
                    });
                });
            };

            var loadStandardBankAccounts = function () {
                $scope.standardBankAccounts = [];
                $scope.debitOrder.account = {};

                var loadAccountsPromise = AccountsService.list(Card.current());

                loadData.push(loadAccountsPromise);
                loadAccountsPromise.then(function (accountDetails) {
                    var bankAccounts = accountDetails.accounts;

                    $scope.standardBankAccounts = _(bankAccounts).filter(function (account) {
                        return account.accountType === 'CURRENT' ||
                            (account.accountType === 'SAVINGS' && account.productName === 'PLUS PLAN');
                    }).sortBy(function (account) {
                        return account.accountType;
                    }).map(function (account) {
                        return _.merge({
                            isStandardBank: true
                        }, account);
                    }).value();

                    $scope.debitOrder.account = _.first($scope.standardBankAccounts) || {};

                });
            };

            var loadDebitOrderRepaymentDays = function () {
                $scope.days = [];
                for (var i = 1; i <= 31; i++) {
                    $scope.days.push(i);
                }

                $scope.debitOrder.repayment.day = 1;
            };

            $scope.selectedDebitOrderBankBranches = function () {

                if ($scope.debitOrder.account.bank) {
                    return $scope.branches[$scope.debitOrder.account.bank.code];
                } else {
                    return $scope.branches[undefined];
                }
            };

            $scope.onBankChanged = function () {
                if ($scope.debitOrder.account.bank) {
                    $scope.clearBranch();
                    reloadBranchList();
                }
            };

            var reloadBranchList = function () {
                if (!$scope.branches[$scope.debitOrder.account.bank.code]) {
                    BranchLazyLoadingService.bankUpdate($scope.branches, $scope.debitOrder,
                        $scope.debitOrder.account.bank,
                        null);
                }
            };

            $scope.clearBranch = function () {
                $scope.debitOrder.account.branch = undefined;
            };

            var init = function () {
                $scope.selection = {selectedBranch: undefined};

                var offer = RcpApplication.offer();
                $scope.applicationNumber = offer.applicationNumber;
                $scope.offerDetails = offer.rcpOfferDetails;
                $scope.selectedOffer = {
                    requestedLimit: offer.rcpOfferDetails.maximumLoanAmount
                };

                $scope.debitOrder = {
                    repayment: {},
                    electronicConsent: true
                };

                $scope.branches = {undefined: []};
                $scope.newToBank = !Card.anySelected();
                loadStandardBankAccounts();
                loadDebitOrderBankList();
                loadDebitOrderRepaymentDays();
                $scope.minimumRepayment = calculateMinimumRepayment();

                $scope.debitOrder.repayment.amount = $scope.minimumRepayment;
                $scope.downloadRcpPreAgreementURL = URL.downloadRcpPreAgreement;
                $scope.principal = User.principal().systemPrincipalIdentifier;

                restoreState();
            };

            $scope.hasStandardBankAccount = function () {
                return $scope.standardBankAccounts && $scope.standardBankAccounts.length > 0;
            };

            $scope.accept = function () {
                Flow.next();
                $location.path('/apply/rcp/confirm');


                var repayment = {
                    day: $scope.debitOrder.repayment.day,
                    amount: $scope.debitOrder.repayment.amount
                };
                var debitOrder;
                if ($scope.debitOrder.account.isStandardBank) {
                    debitOrder = DebitOrder.fromStandardBankAccount($scope.debitOrder.account, repayment);
                }
                else {
                    var account = _.merge({formattedNumber: $scope.debitOrder.account.number},
                        $scope.debitOrder.account);
                    debitOrder = DebitOrder.fromOtherBanksAccount(account, repayment,
                        $scope.debitOrder.electronicConsent);
                }
                RcpApplication.select({
                    selectedBranch: $scope.selection.selectedBranch,
                    debitOrder: debitOrder,
                    requestedLimit: $scope.selectedOffer.requestedLimit
                });
            };

            var restoreState = function () {

                $q.all(loadData).then(function () {
                    if (RcpApplication.isInProgress()) {

                        var selection = RcpApplication.selection();

                        $scope.debitOrder = selection.debitOrder;
                        $scope.selectedOffer.requestedLimit = selection.requestedLimit;
                        $scope.minimumRepayment = calculateMinimumRepayment();

                        if ($scope.debitOrder.account.bank) {
                            reloadBranchList();
                        }
                    }
                });
            };

            var updateMinimumRepaymentTimeout;

            $scope.requestedLoanAmountChanged = function () {
                if (updateMinimumRepaymentTimeout) {
                    $timeout.cancel(updateMinimumRepaymentTimeout);
                }
                updateMinimumRepaymentTimeout = $timeout(function () {
                    updateMinimumRepayment();
                }, 1000);
            };

            var updateMinimumRepayment = function () {
                var minimumRepayment = $scope.rcpOfferForm.$error.loanamount ? undefined : calculateMinimumRepayment();
                $scope.minimumRepayment = minimumRepayment;
                $scope.debitOrder.repayment.amount = minimumRepayment;
            };

            var calculateMinimumRepayment = function () {
                return RcpCalculator.getMinimumRepaymentAmountForOffer(RcpApplication.offer(),
                    $scope.selectedOffer.requestedLimit);
            };

            $scope.hinter = function () {
                if ($scope.debitOrder.repayment.amount &&
                    $scope.debitOrder.repayment.amount > $scope.minimumRepayment) {
                    return limitsService.hint();
                }
            };

            $scope.enforcer = function () {
                return limitsService.enforce({
                    amount: $scope.debitOrder.repayment.amount,
                    limit: $scope.minimumRepayment
                });
            };

            $scope.showPreAgreement = function () {
                var currentOffer = RcpApplication.offer();
                var details = {
                    applicationNumber: currentOffer.applicationNumber,
                    productNumber: currentOffer.rcpOfferDetails.productNumber,
                    requestedLimit: $scope.selectedOffer.requestedLimit
                };

                RcpOfferService.getPreAgreementHtml(details).then(function (html) {
                    $scope.preagreementHtml = html;
                    $scope.showQuote = true;
                });

            };

            $scope.requestedLimitEnforcer = function () {
                return requestLimitService.enforce({
                    amount: $scope.selectedOffer.requestedLimit,
                    minimumLoanAmount: $scope.offerDetails.minimumLoanAmount,
                    maximumLoanAmount: $scope.offerDetails.maximumLoanAmount
                });
            };

            $scope.requestedLimitHinter = function () {
                if (!$scope.rcpOfferForm.$error.loanamount) {
                    return 'Please enter an amount between <span class="rand-amount">R ' +
                        $scope.offerDetails.minimumLoanAmount + '</span> and <span class="rand-amount">R ' +
                        $scope.offerDetails.maximumLoanAmount + '</span>';
                }
            };

            init();
        });
}());
