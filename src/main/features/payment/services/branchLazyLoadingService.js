(function (app) {
    'use strict';

    app.factory('BranchLazyLoadingService', function ($timeout, BankService) {
        return {
            bankUpdate: function (branches, beneficiary, newBank, oldBank) {
                if (newBank) {
                    BankService.searchBranches(newBank.name).then(function (branchesFoundForBank) {
                        branches[newBank.code] = _.map(branchesFoundForBank, function (branch) {
                            branch.label = function () {
                                return branch.code + ' - ' + branch.name;
                            };
                            return branch;
                        });
                        $timeout(function () {
                            angular.element('input#branch-input').focus();
                        });
                    });
                }

                if ((newBank && oldBank) && newBank.code !== oldBank.code) {
                    if (beneficiary && beneficiary.bank) {
                        beneficiary.bank.branch = undefined;
                    }
                }
            }
        };
    });
})
(angular.module('refresh.branchLazyLoadingService', ['refresh.mcaHttp']));
