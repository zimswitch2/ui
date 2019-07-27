describe('Doughnut Chart Directive', function () {
    'use strict';

    var chartService, templateTest, outerScope, chartBase, doughnutChart, testChartData, testChartOptions, testSegmentColours, windowService, elementHelper;
    beforeEach(function () {
        testChartOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 50,
            animationSteps : 20,
            animationEasing : "swing",
            animateRotate : true,
            animateScale : false
        };
        testChartData = [{
            label: "Label 1",
            value: 1000
        }, {
            label: "Label 2",
            value: 2000
        }];
        testSegmentColours = [{
            color: "#FF0000",
            highlight: "#FD0000"
        }, {
            color: "#00FF00",
            highlight: "#00FD00"
        }];
        module('refresh.charts', 'refresh.charts.doughnut', 'refresh.test', 'refresh.elementHelper', function($provide) {
            $provide.decorator('chartService', function($delegate) {
                $delegate.createChart = jasmine.createSpy();
                return $delegate;
            });
        });
        inject(function (TemplateTest, _chartService_, _$window_, _ElementHelper_) {
            templateTest = TemplateTest;
            templateTest.allowTemplate('common/charts/doughnut/partials/doughnutChart.html');
            outerScope = templateTest.scope;
            chartService = _chartService_;
            windowService = _$window_;
            elementHelper = _ElementHelper_;
            spyOn(elementHelper, 'isVisible');
            spyOn(elementHelper, 'getWidth');
            spyOn(elementHelper, 'getHeight');
            doughnutChart = jasmine.createSpyObj('doughnutChart', ['initialize', 'resize', 'render', 'destroy', 'getSegmentsAtEvent', 'generateLegend']);
            doughnutChart.chart = {
                width: 300,
                height: 150,
                aspectRatio: 1
            };
            chartBase = jasmine.createSpyObj('chartInstance', ['Doughnut']);
            chartBase.Doughnut.and.returnValue(doughnutChart);

            chartService.createChart.and.returnValue(chartBase);
        });
    });

    it('should replace the custom tag', function () {
        var element = templateTest.compileTemplate('<sb-doughnut-chart data="[]"></sb-doughnut-chart>');

        expect(element[0].tagName).not.toEqual('SB-DOUGHNUT-CHART');
    });

    it('should render a div', function () {
        var element = templateTest.compileTemplate('<sb-doughnut-chart data="[]"></sb-doughnut-chart>');
        expect(element[0].tagName).toEqual("DIV");
    });

    it('should render a canvas', function () {
        var element = templateTest.compileTemplate('<sb-doughnut-chart></sb-doughnut-chart>');

        expect(element.find('canvas').length).toBe(1);
    });

    it('should have isolated scope', function () {
        var element = templateTest.compileTemplate('<sb-doughnut-chart></sb-doughnut-chart>');

        var directiveScope = element.isolateScope();

        expect(directiveScope).toBeDefined();
    });

    describe('with data, colours and options bound to it', function () {
        var element, directiveScope;
        beforeEach(function () {
            outerScope = templateTest.scope;
            outerScope.TestData = testChartData;
            outerScope.ChartOptions = testChartOptions;
            outerScope.SegmentColours = testSegmentColours;
            element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="ChartOptions" colours="SegmentColours"></sb-doughnut-chart>');

            directiveScope = element.isolateScope();
        });

        it('should set the data on the the directive\'s scope', function () {
            expect(directiveScope.data).toEqual(outerScope.TestData);
        });

        it('should set the options on the the directive\'s scope', function () {
            expect(directiveScope.options).toEqual(outerScope.ChartOptions);
        });

        it('should set the colours on the the directive\'s scope', function () {
            expect(directiveScope.colours).toEqual(outerScope.SegmentColours);
        });
    });

    describe('when canvas is visible and of a valid size', function () {
        beforeEach(function () {
            elementHelper.isVisible.and.returnValue(true);
            elementHelper.getWidth.and.returnValue(300);
            elementHelper.getHeight.and.returnValue(150);
        });

        describe('with changing data bound to it', function () {
            var element, directiveScope,mergedDataAndColours;
            beforeEach(function () {
                outerScope = templateTest.scope;
                outerScope.TestData = [];
                outerScope.ChartOptions = testChartOptions;
                outerScope.SegmentColours = testSegmentColours;
                element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="ChartOptions" colours="SegmentColours"></sb-doughnut-chart>');
                directiveScope = element.isolateScope();
                outerScope.$digest();
            });

            it('should re initialise the chart', function () {
                outerScope.TestData = testChartData;
                mergedDataAndColours = chartService.mergeDataAndColours(outerScope.TestData, outerScope.SegmentColours);

                outerScope.$digest();

                expect(directiveScope.chart.initialize).toHaveBeenCalledWith(mergedDataAndColours);
            });

            it('should destroy the chart if a chart already exists', function () {
                outerScope.TestData = testChartData;
                mergedDataAndColours = chartService.mergeDataAndColours(outerScope.TestData, outerScope.SegmentColours);

                outerScope.$digest();

                expect(directiveScope.chart.destroy).toHaveBeenCalled();
            });
        });

        describe('when window is resized', function () {
            describe('and chart is defined', function () {

                var element, directiveScope, mergedDataAndColours;
                beforeEach(function () {
                    outerScope = templateTest.scope;
                    outerScope.TestData = testChartData;
                    outerScope.ChartOptions = testChartOptions;
                    outerScope.SegmentColours = testSegmentColours;
                    mergedDataAndColours = chartService.mergeDataAndColours(outerScope.TestData, outerScope.SegmentColours);
                    element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="ChartOptions" colours="SegmentColours"></sb-doughnut-chart>');
                    directiveScope = element.isolateScope();
                    outerScope.$digest();
                });

                it('should redraw the chart', function () {
                    $(window).trigger('resize');
                    outerScope.$digest();

                    expect(doughnutChart.resize).toHaveBeenCalled();
                });
            });

            describe('and chart is undefined', function () {
                var element, directiveScope, mergedDataAndColours;
                beforeEach(function () {
                    outerScope = templateTest.scope;
                    element = templateTest.compileTemplate('<sb-doughnut-chart></sb-doughnut-chart>');
                    directiveScope = element.isolateScope();
                    outerScope.$digest();
                });

                it('should not try to redraw a chart', function () {
                    $(window).trigger('resize');
                    outerScope.$digest();

                    expect(doughnutChart.resize).not.toHaveBeenCalled();
                });
            });
        });

        describe('segment click method', function () {
            describe('when defined', function () {
                describe('and chart returns a segment that was clicked on', function () {
                    it('click should call the method passed', function () {
                        doughnutChart.getSegmentsAtEvent.and.returnValue([testChartData[0]]);
                        var segmentLabelClickedOn = null;
                        outerScope.TestData = testChartData;
                        outerScope.onSegmentClicked = function (label) {
                            segmentLabelClickedOn = label;
                        };

                        var element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" on-segment-clicked="onSegmentClicked(label)"></sb-doughnut-chart>');
                        var canvas = element.find('canvas')[0];
                        canvas.click();

                        expect(segmentLabelClickedOn).toEqual(outerScope.TestData[0].label);
                    });
                });

                describe('and chart returns no segments that was clicked on', function () {
                    it('click should not call the method passed', function () {
                        doughnutChart.getSegmentsAtEvent.and.returnValue([]);
                        var segmentLabelClickedOn = null;
                        outerScope.TestData = testChartData;
                        outerScope.onSegmentClicked = function (label) {
                            segmentLabelClickedOn = label;
                        };

                        var element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" on-segment-clicked="onSegmentClicked(label)"></sb-doughnut-chart>');
                        var canvas = element.find('canvas')[0];
                        canvas.click();

                        expect(segmentLabelClickedOn).toBeNull();
                    });
                });
            });

            describe('when not defined', function () {
                it('click should any method', function () {
                    doughnutChart.getSegmentsAtEvent.and.returnValue([testChartData[0]]);
                    var segmentLabelClickedOn = null;
                    outerScope.TestData = testChartData;
                    outerScope.onSegmentClicked = function (label) {
                        segmentLabelClickedOn = label;
                    };

                    var element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData"></sb-doughnut-chart>');
                    var canvas = element.find('canvas')[0];
                    canvas.click();

                    expect(segmentLabelClickedOn).toBeNull();
                });
            });
        });

        describe('with custom tooltips set to true', function () {var element, directiveScope;
            beforeEach(function () {
                outerScope = templateTest.scope;
                outerScope.TestData = testChartData;
                element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="{customTooltips:true}"></sb-doughnut-chart>');

                directiveScope = element.isolateScope();
                outerScope.$digest();
            });

            it('should not set the chart\'s customTooltips property to a boolean', function () {
                expect(chartBase.Doughnut).not.toHaveBeenCalledWith(testChartData, {customTooltips:true});
            });

            it('should set custom tooltips to a function', function () {
                expect(chartBase.Doughnut).toHaveBeenCalled();
                expect(chartBase.Doughnut.calls.argsFor(0)[1].customTooltips()).not.toBeDefined();
            });

        });

    });

    describe('when canvas is not visible', function () {
        beforeEach(function () {
            elementHelper.isVisible.and.returnValue(false);
            elementHelper.getWidth.and.returnValue(300);
            elementHelper.getHeight.and.returnValue(150);
        });

        describe('with changing data bound to it', function () {
            var element, directiveScope,mergedDataAndColours;
            beforeEach(function () {
                outerScope = templateTest.scope;
                outerScope.TestData = [];
                outerScope.ChartOptions = testChartOptions;
                outerScope.SegmentColours = testSegmentColours;
                element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="ChartOptions" colours="SegmentColours"></sb-doughnut-chart>');
                directiveScope = element.isolateScope();
                outerScope.$digest();
            });

            it('should not create a chart', function () {
                outerScope.TestData = testChartData;
                mergedDataAndColours = chartService.mergeDataAndColours(outerScope.TestData, outerScope.SegmentColours);

                outerScope.$digest();

                expect(directiveScope.chart).not.toBeDefined();
            });
        });
    });

    describe('when canvas is not a valid size', function () {
        beforeEach(function () {
            elementHelper.isVisible.and.returnValue(true);
            elementHelper.getWidth.and.returnValue(0);
            elementHelper.getHeight.and.returnValue(0);
        });

        describe('with changing data bound to it', function () {
            var element, directiveScope,mergedDataAndColours;
            beforeEach(function () {
                outerScope = templateTest.scope;
                outerScope.TestData = [];
                outerScope.ChartOptions = testChartOptions;
                outerScope.SegmentColours = testSegmentColours;
                element = templateTest.compileTemplate('<sb-doughnut-chart data="TestData" options="ChartOptions" colours="SegmentColours"></sb-doughnut-chart>');
                directiveScope = element.isolateScope();
                outerScope.$digest();
            });

            it('should not create a chart', function () {
                outerScope.TestData = testChartData;
                mergedDataAndColours = chartService.mergeDataAndColours(outerScope.TestData, outerScope.SegmentColours);

                outerScope.$digest();

                expect(directiveScope.chart).not.toBeDefined();
            });
        });
    });
});
