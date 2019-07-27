var personalFinanceManagementFeature = false;


(function (app) {
    'use strict';

    app.service('accountsCashflowsChartColours', function (chartColours) {
        return {
            cashInColour: chartColours.colour(chartColours.cashIn),
            cashInTextColour: chartColours.colour(chartColours.cashInText),
            cashOutColour: chartColours.colour(chartColours.cashOut),
            cashOutTextColour: chartColours.colour(chartColours.cashOutText),
            colours: [
                {
                    accountType: "CURRENT",
                    colours: [
                        chartColours.colourObject(chartColours.transactionalProduct1),
                        chartColours.colourObject(chartColours.transactionalProduct2),
                        chartColours.colourObject(chartColours.transactionalProduct3),
                        chartColours.colourObject(chartColours.transactionalProduct4),
                        chartColours.colourObject(chartColours.transactionalProduct5),
                        chartColours.colourObject(chartColours.transactionalProduct6),
                        chartColours.colourObject(chartColours.transactionalProduct7),
                        chartColours.colourObject(chartColours.transactionalProduct8),
                        chartColours.colourObject(chartColours.transactionalProduct9)
                    ]
                },
                {
                    accountType: "CREDIT_CARD",
                    colours: [
                        chartColours.colourObject(chartColours.creditCardProduct1),
                        chartColours.colourObject(chartColours.creditCardProduct2),
                        chartColours.colourObject(chartColours.creditCardProduct3),
                        chartColours.colourObject(chartColours.creditCardProduct4)
                    ]
                }
            ]
        };
    });
})(angular.module('refresh.accountSummary.accountsCashflowsChart'));