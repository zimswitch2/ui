(function () {
    'use strict';

    var module = angular.module('refresh.customizedFilter', ['refresh.filters']);

    module.factory('CustomizedFilterService', function ($filter) {
        var textComparator = function (narrative, query) {
            var stringValue = _.isString(narrative) ? $filter('condenseSpaces')(narrative) : narrative.toString();
            return stringValue.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };

        var dateComparator = function (transactionDate, query) {
            return $filter('dateFormat')(transactionDate).toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };

        var randAmountComparator = function (amount, query) {
            return $filter('randAmount')(amount).replace(/ /g, '').indexOf(query.replace(/ /g, '')) >= 0;
        };

        var amountComparator = function (amount, query) {
            return $filter('amount')(amount).replace(/ /g, '').indexOf(query.replace(/ /g, '')) >= 0;
        };

        var currencyAmountComparator = function (amount, query, args) {
            return args && args.currencyCode ? $filter('currencyAmount')(amount, args.currencyCode).replace(/ /g, '').indexOf(query.replace(/ /g, '')) >= 0 : false;
        };

        var comparatorMap = {
            date: dateComparator,
            randAmount: randAmountComparator,
            currencyAmount: currencyAmountComparator,
            amount: amountComparator,
            text: textComparator
        };

        return {
            /***
             *[
             *  {path: 'beneficiaryName'},
             *  {path: 'amount', type: 'amount'},
             *  {path: 'randAmount', type: 'randAmount'},
             *  {path: 'currencyAmount', type: 'currencyAmount', args: {currencyCode: 'USD'}},
             *  {path: 'nextPaymentDate', type: 'date'},
             *  {path: 'frequency', type: 'text'}
             *]
             */
            create: function (descriptions) {
                return function (items, rawQuery, args) {
                    var query = _.trim(rawQuery);

                    if (_.size(items) === 0) {
                        return [];
                    }

                    if (query === '') {
                        return items;
                    }

                    var results = [];
                    _.each(descriptions, function (desc) {
                        results = _.union(results, $filter('filter')(items, function (item) {
                            var comparator = comparatorMap[desc.type] || textComparator;
                            var value = _.get(item, desc.path);
                            if(_.isUndefined(value)){
                                return false;
                            }
                            return args ? comparator(value, query, args) : comparator(value, query);
                        }));
                    });
                    return results;
                };
            }
        };
    });
})();
