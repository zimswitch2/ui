(function () {
    'use strict';

    var module = angular.module('refresh.mapFilter', ['refresh.lookups']);

    module.filter('map', function (LookUps) {
        var mapFilter = function(input, mapType) {
            if (input !== undefined) {
                var map = LookUps[mapType].values();

                var match = _.find(map, {code: input});
                return match && match.description;
            }
        };
        mapFilter.$stateful = true;
        return mapFilter;
    });
})();
