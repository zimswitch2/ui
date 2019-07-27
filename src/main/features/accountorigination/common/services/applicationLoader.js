(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.services.applicationLoader', [
        'refresh.accountsService',
        'refresh.accountOrigination.common.services.quotations',
        'refresh.accountOrigination.common.services.itemsForApprovalService',
        'refresh.card',
        'refresh.security.user',
        'refresh.lookups'
    ]);

    app.factory('ApplicationLoader',
        function ($q, AccountsService, Card, User, LookUps, QuotationsService, ItemsForApprovalService) {

            function findAccount(accountType, accounts) {
                return _.find(accounts, function (account) {
                    return account.accountType === accountType;
                });
            }

            function determineStatus(type, accounts, itemsForApproval, quotations) {
                var account = findAccount(type.toUpperCase(), accounts);
                if (account) {
                    return {
                        status: 'EXISTING',
                        reference: account.formattedNumber,
                        productName: account.productName
                    };
                }
                else if (itemsForApproval[type]) {
                    return {
                        status: 'ACCEPTED',
                        reference: itemsForApproval[type].accountNumber,
                        productName: itemsForApproval[type].productName,
                        date: itemsForApproval[type].acceptedDate,
                        limitAmount: itemsForApproval[type].limitAmount
                    };
                }
                else if (quotations[type]) {
                    return {
                        status: 'PENDING',
                        reference: quotations[type].applicationNumber,
                        date: quotations[type].applicationDate,
                        aboutToExpire: quotations[type].aboutToExpire

                    };
                }
                else {
                    return {status: 'NEW'};
                }
            }

            return {
                loadAll: function () {
                    var deferred = $q.defer();
                    var types = LookUps.productCategories.values();
                    var applications = {};

                    if (User.hasBasicCustomerInformation()) {
                        var outcomes = [
                            ItemsForApprovalService.list(),
                            QuotationsService.list()
                        ];

                        if (Card.anySelected()) {
                            outcomes.push(AccountsService.list(Card.current()));
                        }

                        $q.all(outcomes).then(function (data) {
                            _.forEach(types, function (type) {

                                var itemsForApproval = data[0];
                                var quotations = data[1];

                                var accounts = [];

                                if (data.length > 2) {
                                    accounts = data[2].accounts;
                                }

                                applications[type.description] =
                                    determineStatus(type.description, accounts, itemsForApproval, quotations);
                            });
                            deferred.resolve(applications);
                        }).catch(function (e) {
                            deferred.reject(e);
                        });
                    } else {
                        _.forEach(types, function (type) {
                            applications[type.description] = {status: 'NEW'};
                        });
                        deferred.resolve(applications);
                    }

                    return deferred.promise;
                }
            };
        });
})();
