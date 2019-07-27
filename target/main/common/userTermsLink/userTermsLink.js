(function () {
    'use strict';

    var module = angular.module('refresh.userTermsLink', []);

    module.directive('userTermsLink', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            template: '<a class="user-terms-link" href="{{termUrl}}" track-click="{{trackToken}}" target="_blank" ng-transclude></a>',
            link: function (scope) {
                scope.termUrl = 'https://www.standardbank.co.za/standimg/South%20Africa/Personal/PDFs%28Personal%29/T&C%20Electronic%20Banking%20agreement.pdf';
                scope.trackToken = 'View Terms and Conditions.view';
            }
        };
    });
}());
