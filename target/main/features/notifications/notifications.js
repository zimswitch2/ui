(function (app) {
    'use strict';

    app.directive('notification', function() {
        return {
            restrict: 'A',
            priority: 1,
            transclude: true,
            scope: true,
            replace: true,
            template: '<div class="notification"><span ng-transclude></span><i class="icon icon-times-circle"></i></div>',

            link: function(scope, element) {
                element.find('.icon-times-circle').on('click', function() {
                    angular.element(element).addClass('closing');

                    if (element.attr('cancelField')) {
                        scope.$parent[element.attr('cancelField')] = undefined;
                    }

                   if (element.hasClass('success')) {
                        scope.$parent.isSuccessful = false;
                    } else if (element.hasClass('error')) {
                        scope.$parent.errorMessage = undefined;
                    } else if (element.hasClass('info')) {
                        scope.$parent.hasInfo = false;
                        scope.$parent.customMessage = undefined;
                    }
                    scope.$apply();
                });
            }
        };
    });

    app.directive('info', function(){
        return {
            restrict: 'A',
            priority: 10,

            link: function(scope, element) {
                element.addClass('info');
            }
        };
    });

    app.directive('error', function(){
        return {
            restrict: 'A',
            priority: 10,

            link: function(scope, element) {
                element.addClass('error');
            }
        };
    });

    app.directive('success', function(){
        return {
            restrict: 'A',
            priority: 10,

            link: function(scope, element) {
                element.addClass('success');
            }
        };
    });
})(angular.module('refresh.notifications', []));
