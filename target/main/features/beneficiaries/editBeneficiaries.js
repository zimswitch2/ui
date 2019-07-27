(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        var allowedToEdit = function (BeneficiariesState) {
            return !!BeneficiariesState.beneficiary;
        };

        $routeProvider.when('/beneficiaries/edit', {
            templateUrl: 'features/beneficiaries/partials/add.html',
            controller: 'EditBeneficiariesController',
            allowedFrom: [{
                path: '/beneficiaries/list',
                condition: allowedToEdit
            }, {
                path: new RegExp('/beneficiaries/view/.*'),
                condition: allowedToEdit
            }],
            safeReturn: '/transaction/dashboard'
        });
    });

    app.controller('EditBeneficiariesController', function ($scope, BankService, $location, BeneficiaryFlowService,
                                                            BeneficiariesState, Flow, CdiService, Card,
                                                            GroupsService, ScheduledPaymentsService,
                                                            BranchLazyLoadingService, BeneficiariesFlow) {

        var beneficiary = BeneficiariesState.beneficiary;
        if (!beneficiary) {
            return;
        }

        $scope.branches = {undefined: []};
        BankService.list().then(function (banks) {
            $scope.banks = _.map(banks, function (bank) {
                bank.label = function () {
                    return bank.name;
                };
                return bank;
            });
        });

        ScheduledPaymentsService.list(Card.current()).then(function (futureTransactions) {
            var beneficiaryFutureTransactions = _.find(futureTransactions, function (transaction) {
                return transaction.recipientId === beneficiary.recipientId;
            });

            $scope.hasScheduledPayments = !!beneficiaryFutureTransactions;
        });

        var heading = 'Edit beneficiary';

        $scope.selectedBankBranches = function () {
            if ($scope.beneficiary.bank) {
                return $scope.branches[$scope.beneficiary.bank.code];
            } else {
                return $scope.branches[undefined];
            }
        };

        $scope.bankUpdate = function (newBank, oldBank) {
            BranchLazyLoadingService.bankUpdate($scope.branches, $scope.beneficiary, newBank, oldBank);
        };

        $scope.$watch('beneficiary.bank', $scope.bankUpdate);

        $scope.isListedBeneficiary = function () {
            return $scope.beneficiary && $scope.beneficiary.beneficiaryType === 'COMPANY';
        };

        $scope.isPrivateBeneficiary = function () {
            return !$scope.isListedBeneficiary();
        };

        $scope.errorMessage = BeneficiariesState.errorMessage;
        $scope.editBeneficiary = BeneficiariesState.editBeneficiary;
        BeneficiaryFlowService.initialize(beneficiary, heading);

        $scope.card = BeneficiariesState.card;
        $scope.beneficiary = BeneficiariesState.modifiedBeneficiary;

        $scope.previousGroupName = $scope.beneficiary && $scope.beneficiary.recipientGroup ? $scope.beneficiary.recipientGroup.name : undefined;

        if ($scope.beneficiary && $scope.beneficiary.bank) {
            var branch = _.cloneDeep($scope.beneficiary.bank.branch);
            $scope.beneficiary.bank.label = function () {
                return $scope.beneficiary.bank.name;
            };
            branch.label = function () {
                return branch.code + ' - ' + branch.name;
            };
            $scope.beneficiary.bank.branch = branch;
        }
        if ($scope.beneficiary && $scope.beneficiary.recipientGroup) {
            $scope.beneficiary.recipientGroup.label = function () {
                return $scope.beneficiary.recipientGroup.name;
            };
        }

        $scope.editing = BeneficiariesState.editing;
        $scope.paymentConfirmation = $scope.beneficiary.paymentConfirmation.confirmationType !== "None";

        BeneficiariesFlow.setUpBeneficiaryFlow($scope, BeneficiaryFlowService, BeneficiariesState, beneficiary, heading, $location, CdiService, GroupsService)
            .then(function () {
                if ($scope.isListedBeneficiary()) {
                    $scope.listedBeneficiary = {
                        name: $scope.beneficiary.name,
                        number: $scope.beneficiary.accountNumber
                    };
                }
            });

        $scope.proceed = function () {
            if ($scope.beneficiary.recipientGroup) {
                $scope.beneficiary.recipientGroup.oldName = $scope.previousGroupName;
            } else {
                $scope.beneficiary.recipientGroup = {
                    name: undefined,
                    oldName: $scope.previousGroupName,
                    orderIndex: null
                };
            }

            BeneficiaryFlowService.proceed();
            $scope.flow = Flow.get();
            $scope.editing = BeneficiariesState.editing;
        };

        $scope.modify = function () {
            BeneficiaryFlowService.modify();
            $scope.flow = Flow.get();
            $scope.errorMessage = BeneficiariesState.errorMessage;
            $scope.editing = BeneficiariesState.editing;
        };

        $scope.confirm = function (beneficiary, card) {
            var redirectLocation = '/beneficiaries/edit';
            BeneficiariesFlow.setConfirmScope($scope, BeneficiaryFlowService, BeneficiariesState, redirectLocation, beneficiary, card);
        };

        $scope.clearFields = function () {
            $scope.beneficiary.paymentConfirmation.address = null;
            $scope.beneficiary.paymentConfirmation.recipientName = null;
            $scope.beneficiary.paymentConfirmation.confirmationType = "None";
        };

        $scope.$watch("paymentConfirmation", function () {
            if ($scope.paymentConfirmation && $scope.beneficiary.paymentConfirmation.confirmationType === "None") {
                $scope.setEmail();
                if ($scope.isPrivateBeneficiary()) {
                    $scope.beneficiary.paymentConfirmation.recipientName = $scope.beneficiary.name;
                }
            } else if ($scope.beneficiary.paymentConfirmation.confirmationType === "None" || !$scope.paymentConfirmation) {
                $scope.clearFields();
            }
        });

        $scope.$watch('beneficiary.name', function (newValue, oldValue) {
            var recipientName = $scope.beneficiary.paymentConfirmation.recipientName;
            if ((recipientName === oldValue || !recipientName) && $scope.isPrivateBeneficiary()) {
                $scope.beneficiary.paymentConfirmation.recipientName = newValue;
            }
        });

        $scope.setEmail = function () {
            $scope.beneficiary.paymentConfirmation.confirmationType = "Email";
        };
    });

})(angular.module('refresh.beneficiaries.edit', ['refresh.beneficiaries.flow']));
