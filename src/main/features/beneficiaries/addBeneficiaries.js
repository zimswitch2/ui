var verifyCompanyDepositIdentifierFeature = false;
if (feature.verifyCompanyDepositIdentifier) {
    verifyCompanyDepositIdentifierFeature = true;
}

(function () {
    'use strict';

    angular.module('refresh.beneficiaries.add', []);

    angular.module('refresh.beneficiaries.add').config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/add', {
            templateUrl: 'features/beneficiaries/partials/add.html',
            controller: 'AddBeneficiariesController'
        });
    });

    angular.module('refresh.beneficiaries.add').controller('AddBeneficiariesController', function ($scope, $location, BankService, Beneficiary,
                                                                                                   BeneficiaryFlowService, BeneficiariesState, Flow,
                                                                                                   CdiService, GroupsService, BranchLazyLoadingService,
                                                                                                   BeneficiariesFlow) {
        $scope.beneficiary = {
            "name": null,
            "accountNumber": null,
            "beneficiaryType": "PRIVATE",
            "recipientGroup": undefined,
            "bank": undefined,
            "customerReference": undefined,
            "recipientReference": undefined,
            "paymentConfirmation": {
                "address": null,
                "confirmationType": 'None',
                "recipientName": null,
                "sendFutureDated": null
            }
        };

        $scope.branches = {undefined: []};
        $scope.flags = {};

        $scope.addBeneficiary = true;
        $scope.editBeneficiary = false;
        BeneficiariesState.editBeneficiary = false;

        BankService.list().then(function (banks) {
            $scope.banks = _.map(banks, function (bank) {
                bank.label = function () {
                    return bank.name;
                };
                return bank;
            });
        });
        CdiService.list();

        $scope.selectedBankBranches = function () {
            if ($scope.beneficiary.bank) {
                return $scope.branches[$scope.beneficiary.bank.code];
            } else {
                return $scope.branches[undefined];
            }
        };

        var beneficiary = Beneficiary.newInstance();
        var heading = 'Add beneficiary';

        $scope.bankUpdate = function (newBank, oldBank) {
            BranchLazyLoadingService.bankUpdate($scope.branches, $scope.beneficiary, newBank, oldBank);
        };

        $scope.$watch('beneficiary.bank', $scope.bankUpdate);
        $scope.isListedBeneficiary = function () {
            return $scope.listedBeneficiary;
        };

        $scope.isPrivateBeneficiary = function () {
            return !$scope.isListedBeneficiary();
        };

        BeneficiariesFlow.setUpBeneficiaryFlow($scope, BeneficiaryFlowService, BeneficiariesState, beneficiary, heading, $location, CdiService, GroupsService)
            .then(function () {
                $scope.paymentConfirmation = BeneficiariesState.errorMessage ? BeneficiariesState.paymentConfirmation : true;

                if ($scope.beneficiary && $scope.beneficiary.beneficiaryType === 'COMPANY') {
                    var searchResultsByCdiNumber = _.filter($scope.cdi, function (listedBeneficiary) {
                        return listedBeneficiary.number === $scope.beneficiary.accountNumber;
                    });

                    $scope.listedBeneficiary = searchResultsByCdiNumber[0];
                }
                else {
                    $scope.listedBeneficiary = undefined;
                }
            });


        function prepareForConfirmation() {
            BeneficiaryFlowService.proceed();
            $scope.flow = Flow.get();
            $scope.editing = BeneficiariesState.editing;
        }

        $scope.proceed = function () {
            var isStandardBank = $scope.beneficiary.bank && $scope.beneficiary.bank.code === "051";
            if (verifyCompanyDepositIdentifierFeature && isStandardBank && $scope.beneficiary.accountNumber && $scope.beneficiary.accountNumber.length > 0) {

                CdiService.findCompany($scope.beneficiary.accountNumber).then(function (company) {
                    if (company) {
                        $scope.listedBeneficiary = _.find($scope.cdi, function (item) {
                            return item.name === company.name && item.number === company.number;
                        });

                        $scope.flags.cdiBeneficiaryAsPrivateBeneficiary = true;
                    } else {
                        $scope.flags.cdiBeneficiaryAsPrivateBeneficiary = false;
                    }

                    prepareForConfirmation();
                });
            } else {
                $scope.flags.cdiBeneficiaryAsPrivateBeneficiary = false;
                prepareForConfirmation();
            }
        };

        $scope.modify = function () {
            BeneficiaryFlowService.modify();
            $scope.flow = Flow.get();
            $scope.errorMessage = BeneficiariesState.errorMessage;
            $scope.editing = BeneficiariesState.editing;
        };

        $scope.confirm = function (beneficiary, card) {
            if ($scope.listedBeneficiary) {
                beneficiary.name = $scope.listedBeneficiary.name;
                beneficiary.accountNumber = $scope.listedBeneficiary.number;
                beneficiary.beneficiaryType = 'COMPANY';
            }
            else {
                beneficiary.beneficiaryType = 'PRIVATE';
            }

            var redirectLocation = '/beneficiaries/add';
            BeneficiariesFlow.setConfirmScope($scope, BeneficiaryFlowService, BeneficiariesState, redirectLocation, beneficiary, card);
        };

        $scope.clearFields = function () {
            $scope.beneficiary.paymentConfirmation.address = null;
            $scope.beneficiary.paymentConfirmation.recipientName = null;
            $scope.beneficiary.paymentConfirmation.confirmationType = "None";
        };

        $scope.setEmail = function () {
            $scope.beneficiary.paymentConfirmation.confirmationType = "Email";
        };

        $scope.$watch("paymentConfirmation", function () {
            var privateBeneficiary = $scope.isListedBeneficiary() === undefined;
            var recipientName = $scope.beneficiary.paymentConfirmation.recipientName;
            var shouldUpdateRecipientName = !recipientName && privateBeneficiary;
            if ($scope.paymentConfirmation && $scope.beneficiary.paymentConfirmation.confirmationType === "None") {
                $scope.setEmail();
                if (shouldUpdateRecipientName) {
                    $scope.beneficiary.paymentConfirmation.recipientName = $scope.beneficiary.name;
                }
            } else if ($scope.beneficiary.paymentConfirmation.confirmationType === "None" || !$scope.paymentConfirmation) {
                $scope.clearFields();
            }
        });

        $scope.$watch('beneficiary.name', function (newValue, oldValue) {
            var privateBeneficiary = ($scope.isListedBeneficiary() === undefined);
            var recipientName = $scope.beneficiary.paymentConfirmation.recipientName;

            if ((!recipientName || recipientName === oldValue) && privateBeneficiary) {
                $scope.beneficiary.paymentConfirmation.recipientName = newValue;
            }
        });

    });

})();
