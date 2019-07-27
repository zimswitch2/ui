var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

if(personalFinanceManagementFeature) {
    describe('accounts cashflows chart colours', function (){
        'use strict';

        var colourService;
        beforeEach(function () {
            module('refresh.accountSummary.accountsCashflowsChart', 'refresh.charts.chartColours');
            inject(function (accountsCashflowsChartColours) {
                colourService = accountsCashflowsChartColours;
            });
        });

        it('should return the correct colours', function () {
            expect(colourService.colours).toEqual([{
                accountType: "CURRENT",
                colours: [
                    {color: 'rgba(2,93,140,1)',highlight: 'rgba(2,93,140,0.8)'},
                    {color: 'rgba(16,127,201,1)',highlight: 'rgba(16,127,201,0.8)'},
                    {color: 'rgba(10,147,252,1)',highlight: 'rgba(10,147,252,0.8)'},
                    {color: 'rgba(115,194,255,1)',highlight: 'rgba(115,194,255,0.8)'},
                    {color: 'rgba(0,79,128,1)',highlight: 'rgba(0,79,128,0.8)'},
                    {color: 'rgba(0,97,158,1)',highlight: 'rgba(0,97,158,0.8)'},
                    {color: 'rgba(0,112,181,1)',highlight: 'rgba(0,112,181,0.8)'},
                    {color: 'rgba(0,132,214,1)',highlight: 'rgba(0,132,214,0.8)'},
                    {color: 'rgba(0,142,230,1)',highlight: 'rgba(0,142,230,0.8)'}]
            }, {
                accountType: "CREDIT_CARD",
                colours: [
                    {color: 'rgba(244,141,44,1)',highlight: 'rgba(244,141,44,0.8)'},
                    {color: 'rgba(236,124,25,1)',highlight: 'rgba(236,124,25,0.8)'},
                    {color: 'rgba(253,153,64,1)',highlight: 'rgba(253,153,64,0.8)'},
                    {color: 'rgba(204,91,35,1)',highlight: 'rgba(204,91,35,0.8)'}]
            }]);
            expect(colourService.cashInColour).toEqual('rgba(159,235,171,1)');
            expect(colourService.cashOutColour).toEqual('rgba(244,115,114,1)');
        });
    });
}