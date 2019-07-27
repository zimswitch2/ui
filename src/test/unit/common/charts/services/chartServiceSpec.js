describe('Chart Service', function () {
    'use strict';

    beforeEach(module('refresh.charts'));

    var service;
    beforeEach(inject(function (chartService) {
        service = chartService;
    }));

    it('should provide the global chart JS chart object', function () {
       expect(service.chart).toEqual(Chart);
    });

    describe('create chart instance', function () {
        it('should return an instance of a chart', function () {
            var element = $('<canvas></canvas>');

            var chartInstance = service.createChart(element[0]);

            expect(chartInstance.hasOwnProperty('canvas')).toBeTruthy();
            expect(chartInstance.hasOwnProperty('ctx')).toBeTruthy();
            expect(chartInstance.hasOwnProperty('width')).toBeTruthy();
            expect(chartInstance.hasOwnProperty('height')).toBeTruthy();
            expect(chartInstance.hasOwnProperty('aspectRatio')).toBeTruthy();
        });

        it('return an object bound to the canvas passed to it', function () {
            var element = $('<canvas></canvas>');

            var chartInstance = service.createChart(element[0]);

            expect(chartInstance.canvas).toBe(element[0]);
        });
    });

    describe('merge data and colours', function () {
        it('should merge properties in colour objects with properties in data objects', function () {
            var data = [{
                label: "Label 1",
                value: 1000
            }, {
                label: "Label 2",
                value: 2000
            }];

            var colours = [{
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                colour: "#00FF00",
                highlight: "#00FD00"
            }];

            var mergedDataAndColours = service.mergeDataAndColours(data, colours);

            expect(mergedDataAndColours).toEqual([{
                label: "Label 1",
                value: 1000,
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                label: "Label 2",
                value: 2000,
                colour: "#00FF00",
                highlight: "#00FD00"
            }]);
        });

        it('should recycle colours when there are less colours than data items', function () {
            var data = [{
                label: "Label 1",
                value: 1000
            }, {
                label: "Label 2",
                value: 2000
            }, {
                label: "Label 3",
                value: 3000
            }];

            var colours = [{
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                colour: "#00FF00",
                highlight: "#00FD00"
            }];

            var mergedDataAndColours = service.mergeDataAndColours(data, colours);

            expect(mergedDataAndColours).toEqual([{
                label: "Label 1",
                value: 1000,
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                label: "Label 2",
                value: 2000,
                colour: "#00FF00",
                highlight: "#00FD00"
            }, {
                label: "Label 3",
                value: 3000,
                colour: "#FF0000",
                highlight: "#FD0000"
            }]);
        });

        it('should ignore extra colours when there are more colours than data items', function () {
            var data = [{
                label: "Label 1",
                value: 1000
            }, {
                label: "Label 2",
                value: 2000
            }];

            var colours = [{
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                colour: "#00FF00",
                highlight: "#00FD00"
            }, {
                colour: "#0000FF",
                highlight: "#0000FD"
            }];

            var mergedDataAndColours = service.mergeDataAndColours(data, colours);

            expect(mergedDataAndColours).toEqual([{
                label: "Label 1",
                value: 1000,
                colour: "#FF0000",
                highlight: "#FD0000"
            }, {
                label: "Label 2",
                value: 2000,
                colour: "#00FF00",
                highlight: "#00FD00"
            }]);
        });

        it('should return the data when colours are not defined', function () {
            var data = [{
                label: "Label 1",
                value: 1000
            }, {
                label: "Label 2",
                value: 2000
            }];

            var mergedDataAndColours = service.mergeDataAndColours(data);

            expect(mergedDataAndColours).toEqual([{
                label: "Label 1",
                value: 1000
            }, {
                label: "Label 2",
                value: 2000
            }]);
        });

        it('should return an empty array when data data not defined', function () {
            var mergedDataAndColours = service.mergeDataAndColours();

            expect(mergedDataAndColours).toEqual([]);
        });
    });
});
