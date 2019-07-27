(function (app) {
    'use strict';
    app.directive('dropdownMenu', function () {

        return {
            restrict: 'A',
            link: function (scope, element) {

                var closeDropdown = function () {
                    scope.showDropdown = false;
                    scope.$apply();
                };

                element.bind('click', closeDropdown);
                element.parent().bind('mouseleave', closeDropdown);
            },
            scope: {
                showDropdown: '=ngShow'
            }
        };
    });
})(angular.module('refresh.dropdownMenu', []));
