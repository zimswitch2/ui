'use strict';

(function (app) {

    app.controller('GoToAnchorController', function ($scope) {
        $scope.goToAnchor = function (name) {
            $.scrollTo("#" + name, 1000);
        };
    });
})(angular.module('refresh.goToAnchorController', []));


