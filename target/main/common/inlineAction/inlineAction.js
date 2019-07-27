(function () {
    'use strict';

    var module = angular.module('refresh.inlineAction', ['refresh.filters']);

    module.directive('inlineAction', function ($sce) {
        return {
            restrict:'A',
            controller: 'InlineActionController',
            templateUrl: 'common/inlineAction/partials/inlineAction.html',
            scope: {
                actionMessage: '=',
                errorMessage: '=',
                confirmFn: '&',
                showWhen: '=',
                action: '@inlineAction',
                buttonTrack: '&',
                confirmDtmid: '@',
                confirmDtmtext: '@',
                cancelDtmid: '@',
                cancelDtmtext: '@'
            },
            link: function (scope, element, attr) {
                scope.htmlMessage = $sce.trustAsHtml(scope.actionMessage);

                var container = element.parent().parent();
                element.find('.action-item').detach().appendTo(container);

                scope.isDanger = scope.action === 'delete';

                scope.$watch('actionState', function (newValue) {
                    if (newValue === 'doing' || newValue === 'success') {
                        container.addClass('action-item');
                    } else {
                        container.removeClass('action-item');
                    }
                });

                scope.$watch('showWhen', function (newValue) {
                    if (newValue === false) {
                        scope.actionState = '';
                    }
                });

                if(attr['buttonTrack']) {
                    container.find('.confirm').attr('track-click', scope.buttonTrack);
                }
                if(attr["confirmDtmid"]) {
                    container.find('.confirm').attr('data-dtmid', scope.confirmDtmid);
                }
                if(attr['confirmDtmtext']) {
                    container.find('.confirm').attr('data-dtmtext', scope.confirmDtmtext);
                }
                if(attr['cancelDtmid']) {
                    container.find('.cancel').attr('data-dtmid', scope.cancelDtmid);
                }
                if(attr['cancelDtmtext']) {
                    container.find('.cancel').attr('data-dtmtext', scope.cancelDtmtext);
                }
            }
        };
    });

    module.controller('InlineActionController', function ($scope) {
        $scope.execAction = function () {
            $scope.confirmFn().then(function () {
                $scope.actionState = 'success';
            }).catch(function () {
                $scope.actionState = 'failed';
            });
        };
    });

}());