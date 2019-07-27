var personalFinanceManagementFeature = false;


if(personalFinanceManagementFeature) {
    describe('net income chart colours', function (){
        'use strict';

        var chartColourService, colourService;
        beforeEach(function () {
            module('refresh.overview.netIncomeChart', 'refresh.charts');
            inject(function (netIncomeChartColours, chartColours) {
                chartColourService = netIncomeChartColours;
                colourService = chartColours;
            });
        });

        it('should return the correct shade of red for cash out', function () {
            expect(chartColourService.cashOut.color).toEqual(colourService.colour(colourService.cashOut));
        });

        it('should return the correct shade of red for cash out text', function () {
            expect(chartColourService.cashOutText.color).toEqual(colourService.colour(colourService.cashOutText));
        });

        it('should return the correct shade of red for cash out highlight', function () {
            expect(chartColourService.cashOut.highlight).toEqual(colourService.highlight(colourService.cashOut));
        });

        it('should return the correct shade of red for cash in', function () {
            expect(chartColourService.cashIn.color).toEqual(colourService.colour(colourService.cashIn));
        });

        it('should return the correct shade of red for cash in text', function () {
            expect(chartColourService.cashInText.color).toEqual(colourService.colour(colourService.cashInText));
        });

        it('should return the correct shade of red for cash in highlight', function () {
            expect(chartColourService.cashIn.highlight).toEqual(colourService.highlight(colourService.cashIn));
        });

        it('should return the an array of colours in the correct order for the chart', function () {
            expect(chartColourService.colours[0]).toEqual(colourService.colourObject(colourService.cashIn));
            expect(chartColourService.colours[1]).toEqual(colourService.colourObject(colourService.cashOut));
        });
    });
}