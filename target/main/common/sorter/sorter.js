(function (app) {
    'use strict';

    app.factory('$sorter', function () {
        return function (field) {
            this.sort = this.sort || {};
            angular.extend(this.sort, {criteria: field, descending: !this.sort.descending});
        };
    });
})(angular.module('refresh.sorter', []));
