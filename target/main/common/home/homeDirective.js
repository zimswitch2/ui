(function () {
    'use strict';

    var app = angular.module('refresh.common.homeDirective', ['refresh.common.homeService']);

    app.directive('goHome', function (HomeService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('click', function () {
                    HomeService.goHome();
                    scope.$apply();
                });
            }
        };
    });
})();