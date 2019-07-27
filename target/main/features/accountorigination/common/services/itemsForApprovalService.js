(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.services.itemsForApprovalService',
        ['refresh.configuration', 'refresh.security.user', 'refresh.lookups']);

    app.factory('ItemsForApprovalService', function ($q, ServiceEndpoint, User, LookUps) {
        var categories = LookUps.productCategories.values();

        var codeToDescription = {};
        _.forEach(categories, function (category) {
            codeToDescription[category.code] = category.description;
        });

        return {
            list: function () {
                return ServiceEndpoint.getItemsForApproval.makeRequest(User.principal()).then(function (response) {
                    var products = {};
                    _.forEach(response.data.itemsForApproval, function (item) {

                        var description = codeToDescription[item.productCategory];
                        products[description] = item;
                    });
                    return products;
                });
            }
        };
    });
})();
