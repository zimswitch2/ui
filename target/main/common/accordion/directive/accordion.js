(function (app) {
    'use strict';

    app.directive('sbAccordion', function ($location) {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                partial: '=',
                multiExpand: '='
            },

            controller: 'AccordionController',

            templateUrl: function (elem, attr) {
                return attr.partial;

            },

            link: function (scope) {

                scope.moreDetails = function (tabName) {
                    return scope.isOpenTab(tabName) ? 'Close' : 'Details';
                };

                scope.isOpenTab = function (tabName) {
                    return scope.activeTabs.indexOf(tabName) > -1;
                };

                function close(tabName) {
                    scope.activeTabs.pop(tabName);
                }

                function open(tabName) {
                    scope.activeTabs.push(tabName);
                }

                function closeOtherTabs() {
                    scope.activeTabs = [];
                }

                scope.isCurrentLocation = function (path) {
                    var contains = _.findIndex(path, function (menuItem) {
                        return $location.path().indexOf(menuItem) > -1;
                    });
                    return contains > -1;
                };

                scope.openTab = function (tabName) {
                    if (scope.isOpenTab(tabName)) {
                        close(tabName);
                    } else {
                        if (!scope.multiExpand) {
                            closeOtherTabs();
                        }

                        open(tabName);
                    }
                };
            }
        };
    });

    app.controller('AccordionController', function ($scope, $location) {

        var activeMenu = _.find($scope.items, function (item) {
            var contains = _.findIndex(item.url, function (menuItem) {
                return $location.path().indexOf(menuItem) > -1;
            });
            return contains > -1;
        });

        $scope.activeTabs = (activeMenu) ? [activeMenu.name] : [];

    });

})(angular.module('refresh.accordion', []));