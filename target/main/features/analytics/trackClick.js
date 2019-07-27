
(function() {
    var app = angular.module('refresh.analytics.trackclick', []);

    app.directive('trackClick', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attributes) {
                element.on('click', function () {
                    $scope.$emit('trackButtonClick', attributes.trackClick);
                });
            }
        };
    });
}());

