(function (app) {
    'use strict';

    app.factory('AccountsService', function ($q, Cacher, ServiceEndpoint, ServiceError, User) {
        var _transferFromAccounts = [];
        var _transferToAccounts = [];
        var _listOfFormalStatementAccountTypes = ['CURRENT','HOME_LOAN','CREDIT_CARD'];
        var _accountMapping = {
            'CURRENT': 'Current Account',
            'CREDIT_CARD': 'Credit Card',
            'HOME_LOAN': 'Home Loan',
            'TERM_LOAN': 'Term Loan',
            'RCP': 'Revolving Credit Plan',
            'SAVINGS': 'Savings Account',
            'NOTICE': 'Investment Account',
            'FIXED_TERM_INVESTMENT': 'Fixed Term Investment',
            'BUSINESS_CURRENT_ACCOUNT': 'Business Current Account',
            'UNKNOWN': ''
        };

        return {
            list: function (card) {
                var deferred = $q.defer();
                if (card.number) {

                    var requestBody = {
                        card: {number: card.number},
                        systemPrincipalId: User.principalForCurrentDashboard().systemPrincipalIdentifier.systemPrincipalId
                    };

                    Cacher.shortLived.fetch('listAccounts', requestBody).then(function (response) {
                        if (response.headers('x-sbg-response-type') !== 'ERROR') {
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject(response);
                        }
                    });
                } else {
                    deferred.resolve({accounts: []});
                }
                return deferred.promise;
            },
            hasCurrentAccount: function (card) {
                return this.list(card).then(function (response) {
                    return _.any(response.accounts, function (account) {
                        return account.accountType === 'CURRENT';
                    });
                });
            },
            hasFormalStatementAccounts: function (card) {
                return this.list(card).then(function (response) {
                    return _.any(response.accounts, function (account) {
                        return _.indexOf(_listOfFormalStatementAccountTypes, account.accountType) !== -1;
                    });
                });
            },
            hasPrivateBankingAccount: function(card){
                return this.list(card).then(function (response) {
                    return _.any(response.accounts, function (account) {
                        return account.accountType === 'CURRENT' && account.name === "PRIVATE B";
                    });
                });
            },
            getEAPLimit: function (cardNumber) {
                var request = {"card": {"number": cardNumber}};
                return ServiceEndpoint.getEAPLimit.makeRequest(request)
                    .then(function (response) {
                        var responseCode = response.headers('x-sbg-response-code');
                        if (responseCode === "0000") {
                            return response.data;
                        } else {
                            return $q.reject(ServiceError.newInstance('An error has occurred', cardNumber));
                        }

                    }).catch(function () {
                        return $q.reject(ServiceError.newInstance('An error has occurred', cardNumber));
                    });
            },
            clear: function () {
                Cacher.shortLived.flushEndpoint('listAccounts');
            },
            availableBalanceFor: function (accountList, accountNumber) {
                var account = _.filter(accountList, function (account) {
                    return account.number === accountNumber;
                });
                return account[0].availableBalance.amount;
            },
            hasPayFromFeature: function (account) {
                var payFromFeature = _.find(account.accountFeature, function (accountFeature) {
                    return accountFeature.feature === 'PAYMENTFROM';
                });
                return payFromFeature ? payFromFeature.value : false;
            },
            validFromPaymentAccounts: function (accounts) {
                var payFromAccountsList = [];
                for (var account = 0; account <= accounts.length - 1; account++) {
                    for (var accountFeature = 0; accountFeature <= accounts[account].accountFeature.length - 1; accountFeature++) {
                        if (accounts[account].accountFeature[accountFeature].feature === 'PAYMENTFROM' && accounts[account].accountFeature[accountFeature].value === true) {
                            payFromAccountsList.push(accounts[account]);
                        }
                    }
                }
                return payFromAccountsList;
            },
            validTransferFromAccounts: function (accounts, toAccount) {
                while (_transferFromAccounts.length > 0) {
                    _transferFromAccounts.pop();
                }
                _transferFromAccounts.push.apply(_transferFromAccounts, _.where(accounts, {
                    'accountFeature': [
                        {feature: 'TRANSFERFROM', value: true}
                    ]
                }));

                return _transferFromAccounts;
            },
            validTransferToAccounts: function (accounts, fromAccount) {
                while (_transferToAccounts.length > 0) {
                    _transferToAccounts.pop();
                }
                _transferToAccounts.push.apply(_transferToAccounts, _.where(accounts, {
                    'accountFeature': [
                        {feature: 'TRANSFERTO', value: true}
                    ]
                }));

                return _transferToAccounts;
            },
            currentAndSavingsAccounts: function (card) {
                return this.list(card).then(function (response) {
                    return _.filter(response.accounts, function (account) {
                        return _.includes(['SAVINGS', 'CURRENT'], account.accountType);
                    });
                });
            },
            accountTypeName: function(accountType) {
                return _accountMapping[accountType];
            }
        };
    });

})(angular.module('refresh.accountsService', ['refresh.cache', 'refresh.configuration', 'refresh.mcaHttp', 'refresh.error.service', 'refresh.security.user']));
