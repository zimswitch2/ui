(function (app) {
    'use strict';

    app.filter('beneficiaryFilter', function ($filter) {
        function searchByDateAndAmount(results, beneficiaries, query) {
            results = _.union(results, $filter('filter')(beneficiaries, {formattedLastPaymentDate: query}));
            results = _.union(results, $filter('filter')(beneficiaries, {amountPaid: query}));
            return results;
        }

        return function (beneficiaries, query, isNotAddingGroup) {
            var results = [];
            results = _.union(results, $filter('filter')(beneficiaries, {name: query}));
            results = _.union(results, $filter('filter')(beneficiaries, {customerReference: query}));
            results = _.union(results, $filter('filter')(beneficiaries, {recipientGroupName: query}));

            if (isNotAddingGroup) {
                results = searchByDateAndAmount(results, beneficiaries, query);
            }
            return results;
        };
    });

})(angular.module('refresh.beneficiaries.filters.beneficiaryFilter', []));