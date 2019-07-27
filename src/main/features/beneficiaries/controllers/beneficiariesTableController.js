var accountSharing = false;
if (feature.accountSharing){
    accountSharing = true;
}

(function (app) {
    'use strict';

    app.controller('BeneficiariesTableController',
        function ($scope, BeneficiariesListService, BeneficiariesService, Card, ApplicationParameters, $sorter, $filter,
                  LastRequest, $route, $location, BeneficiariesState, PermissionsService, BeneficiaryPayment, User) {
            $scope.sortBy = $sorter;

            $scope.$on('resetFilter', function () {
                $scope.resetFilter();
            });

            $scope.showInvalidBeneficiaryModal = false;

            $scope.initialize = function () {
                $scope.resetFilter();
                $scope.beneficiary = null;
                $scope.editBeneficiary = false;
                BeneficiariesState.beneificiary = $scope.beneficiary;
                BeneficiariesState.editBeneficiary = $scope.editBeneficiary;
                BeneficiariesState.errorMessage = undefined;
                $scope.placeHolderMessage = "Search by name, reference, group, date or amount";
                $scope.noBeneficiariesMessage = "There are no beneficiaries linked to your profile. Please add a beneficiary in order to pay.";

                if(accountSharing) {
                    if (!PermissionsService.checkPermission("view:last-amount-paid") && !PermissionsService.checkPermission("view:last-payment-date")) {
                        $scope.placeHolderMessage = "Search by name, reference or group";
                        $scope.noBeneficiariesMessage = "There are no beneficiaries linked to your profile.";
                    }
                }

                this.sortBy('name');
                LastRequest.clear();
                listBeneficiaries();
            };

            var listBeneficiaries = function() {
                BeneficiariesListService.formattedBeneficiaryList(Card.current()).then(function (beneficiaryList) {
                    $scope.beneficiaries = beneficiaryList;
                    _.forEach($scope.beneficiaries, function (beneficiary) {
                        if (beneficiary.amountPaid === 0) {
                            beneficiary.amountPaid = null;
                        }
                    });
                    $scope.hasGroup = false;
                    $scope.hasPayment = false;

                    $scope.checkNonZeroGroups(beneficiaryList);
                    $scope.checkNonZeroPayments(beneficiaryList);

                    if (BeneficiariesState.addBeneficiaryFlow) {
                        var latestBeneficiary = _.find($scope.beneficiaries, function (beneficiary) {
                            return beneficiary.recipientId === BeneficiariesState.latestBeneficiaryRecipientID;
                        });

                        _.remove($scope.beneficiaries, function (beneficiary) {
                            return beneficiary.recipientId === BeneficiariesState.latestBeneficiaryRecipientID;
                        });

                        $scope.beneficiaries.splice(0, 0, latestBeneficiary);
                        $scope.sortBy("");

                        $scope.highlightBeneficiary = $scope.beneficiaries[0];
                        $scope.highlightBeneficiary.highlightClass = "highlight";
                        BeneficiariesState.addBeneficiaryFlow = false;
                    }
                    $scope.beneficiaryList = $scope.beneficiaries;
                    $scope.beneficiaryWithoutGroups = _.compact(_.map($scope.beneficiaryList, function (beneficiary) {
                        if (beneficiary.recipientGroupName === "") {
                            return beneficiary;
                        }
                    }));
                    $scope.beneficiaryWithGroups = _.compact(_.map($scope.beneficiaryList, function (beneficiary) {
                        if (beneficiary.recipientGroupName !== "") {
                            return beneficiary;
                        }
                    }));
                });
            };

            $scope.viewBeneficiary = function (recipientId) {
                $location.path("/beneficiaries/view/" + recipientId);
            };

            $scope.checkNonZeroPayments = function (beneficiariesList) {
                _.map(beneficiariesList, function (beneficiary) {
                    if (beneficiary.formattedLastPaymentDate !== undefined) {
                        $scope.hasPayment = true;
                    }
                });
            };
            $scope.checkNonZeroGroups = function (beneficiariesList) {
                _.map(beneficiariesList, function (beneficiary) {
                    if (beneficiary.recipientGroupName !== "") {
                        $scope.hasGroup = true;
                    }
                });
            };

            $scope.payBeneficiary = function (beneficiary) {

                if (User.isCurrentDashboardSEDPrincipal()) {

                    BeneficiariesListService
                        .isBeneficiaryValid(Card.current(), beneficiary.recipientId)
                        .then(function (isValid) {
                            if (isValid) {
                                BeneficiaryPayment.start(beneficiary);
                                $location.path('/payment/beneficiary');
                            } else {
                                showInvalidBeneficiaryModel(true);
                            }
                        });
                } else {
                    BeneficiaryPayment.start(beneficiary);
                    $location.path('/payment/beneficiary');
                }
            };

            var showInvalidBeneficiaryModel = function(show) {
                $scope.showInvalidBeneficiaryModal = show;
            };

            $scope.refreshBeneficiaryList = function(){
                showInvalidBeneficiaryModel(false);
                listBeneficiaries();
            };

            $scope.onceOffPayment = function(){
                showInvalidBeneficiaryModel(false);
                $location.path('/payment/onceoff');
            };

            $scope.edit = function (beneficiary) {
                $scope.editBeneficiary = true;
                $scope.beneficiary = beneficiary;
                BeneficiariesState.editBeneficiary = $scope.editBeneficiary;
                BeneficiariesState.beneficiary = $scope.beneficiary;
                $location.path('/beneficiaries/edit');
            };

            $scope.confirmDeleteMessage = function (beneficiary) {
                return 'Delete ' + beneficiary.name + '? Any scheduled future payments will be cancelled';
            };

            $scope.errorDeleteMessage = function (beneficiary) {
                return 'Could not delete beneficiary ' + beneficiary.name + ', try again later.';
            };

            $scope.$watch('query', function () {
                $scope.beingDeleted = undefined;
            });

            $scope.isBeingDeleted = function (beneficiary) {
                return (Boolean($scope.beingDeleted && beneficiary.recipientId === $scope.beingDeleted.recipientId));
            };

            $scope.delete = function (beneficiary) {
                return BeneficiariesService.deleteBeneficiary(beneficiary.originalBeneficiary,
                    Card.current()).then(function () {
                    _.remove($scope.beneficiaries, function (b) {
                        return b.recipientId === beneficiary.recipientId;
                    });
                });
            };

            $scope.markForDeletion = function (beneficiary) {
              $scope.beingDeleted = beneficiary;
            };

            $scope.resetFilter = function () {
              $scope.query = '';
            };

            $scope.sortArrowClass = function (criteria) {
              var output = "icon icon-sort";

              if (this.sort.criteria === criteria) {
                if ($scope.highlightBeneficiary) {
                  $scope.highlightBeneficiary.highlightClass = "";
                }
                output = "active icon icon-sort";
              }
              return output;
            };
      });

})(angular.module('refresh.beneficiaries.controllers.beneficiariesTable', ['refresh.sorter', 'refresh.mcaHttp', 'refresh.permissions', 'refresh.payment']));