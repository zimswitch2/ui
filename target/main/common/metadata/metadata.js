(function (app) {
    'use strict';
    app.factory('BankService', function (Cacher, capitalizeFilter) {
        return {
            list: function () {
                return Cacher.perennial.fetch('listBanks', {}).then(function (response) {
                    return response.data.banks;
                });
            },
            searchBranches: function (bankName) {
                var request = {bank: {name: bankName}};
                return Cacher.perennial.fetch('searchBranches', request, 'branchesFor-' + bankName).then(function (response) {
                    return response.data.branches;
                });
            },
            walkInBranches: function () {
                return Cacher.perennial.fetch('walkInBranches', {}).then(function (response) {
                    return _.map(response.data.branches, function (branch) {
                        branch.label = function () {
                            return capitalizeFilter(branch.name);
                        };
                        return branch;
                    });
                });
            }
        };
    });

    app.factory('CdiService', function (Cacher, ServiceEndpoint) {


        return {
            list: function () {
                return Cacher.perennial.fetch('listCDI', {}).then(function (response) {
                    return _.uniq(response.data.cDIs, function (company) {
                        return company.name;
                    });
                });
            },
            findCompany: function (accountNumber) {
                var request = {
                    accountNumber: accountNumber
                };

                return ServiceEndpoint.findCompany.makeRequest(request).then(function (response) {
                    return response.data.company;
                });
            }
        };
    });

})(angular.module('refresh.metadata', ['refresh.cache', 'refresh.mcaHttp', 'refresh.filters', 'refresh.configuration']));
