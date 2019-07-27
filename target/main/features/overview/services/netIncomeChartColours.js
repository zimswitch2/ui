(function (app) {
    'use strict';

    app.service('netIncomeChartColours', function (chartColours) {
        return {
            cashOut: chartColours.colourObject(chartColours.cashOut),
            cashOutText: chartColours.colourObject(chartColours.cashOutText),
            cashIn: chartColours.colourObject(chartColours.cashIn),
            cashInText: chartColours.colourObject(chartColours.cashInText),
            colours: [chartColours.colourObject(chartColours.cashIn), chartColours.colourObject(chartColours.cashOut)]
        };
    });
})(angular.module('refresh.overview.netIncomeChart'));