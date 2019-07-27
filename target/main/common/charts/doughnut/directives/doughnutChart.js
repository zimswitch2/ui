(function (app) {
    'use strict';

    app.directive('sbDoughnutChart', function(chartService, $window, $timeout, ElementHelper) {

        var canDrawChartOnCanvas = function (canvasElement) {
            return ElementHelper.isVisible(canvasElement) &&
                ElementHelper.getWidth(canvasElement) > 0 &&
                ElementHelper.getHeight(canvasElement) > 0;
        };

        return {
            restrict: 'E',
            templateUrl: 'common/charts/doughnut/partials/doughnutChart.html',
            replace: true,
            scope: {
                data: '=',
                options: '=',
                colours: '=',
                onSegmentClicked: '&?'
            },
            link: function(scope, element, attributes) {
                var canvasElement = element.find('canvas')[0];
                var redrawChart = function () {
                    if(!canDrawChartOnCanvas($(canvasElement))) {
                        return;
                    }
                    if(scope.chart) {
                        scope.chart.destroy();
                    }
                    var chartOptions = { };
                    if(scope.options) {
                        chartOptions = angular.copy(scope.options);
                        if(chartOptions.customTooltips === true) {
                            chartOptions.customTooltips = function () { };
                        }
                    }
                    if(!scope.data) {
                        return;
                    }
                    var canvas = element.find('canvas')[0];

                    scope.chart = chartService.createChart(canvas).Doughnut(scope.data, chartOptions);

                    scope.chart.initialize(chartService.mergeDataAndColours(scope.data, scope.colours));

                    $(canvas).click(function(evt) {
                        var activeSegments = scope.chart.getSegmentsAtEvent(evt);
                        if(activeSegments.length === 0 || !scope.onSegmentClicked) {
                            return;
                        } else {
                            scope.onSegmentClicked({label: activeSegments[0].label});
                            scope.$apply();
                        }
                    });
                };
                scope.$watchCollection('data', redrawChart);
                var tryRenderChart = function () {
                    if(!scope.chart) {
                        redrawChart();
                    }
                    try {
                        scope.chart.resize(scope.chart.render, true);
                    } catch (err) { }
                };
                angular.element($window).on('resize', tryRenderChart);
                $timeout(tryRenderChart, 500);
            }
        };
    });
})(angular.module('refresh.charts.doughnut', ['refresh.elementHelper']));