(function (app) {
    'use strict';

    app.factory('chartService', function() {
        return {
            chart: Chart,
            createChart: function(canvasElement) {
                var ctx = canvasElement.getContext("2d");
                ctx.canvas.width = 100;
                ctx.canvas.height = 100;
                return new Chart(ctx);
            },
            mergeDataAndColours: function (data, colours) {
                if(!data)
                {
                    return [];
                }
                if(!colours)
                {
                    return data;
                }
                var mergedDataAndColours = [];
                var colourIndex = 0;
                for(var i = 0; i < data.length; i++) {
                    if(colours.length <= colourIndex) {
                        colourIndex = 0;
                    }
                    var mergedDataAndColour = { };
                    for (var dataProperty in data[i]) { mergedDataAndColour[dataProperty] = data[i][dataProperty]; }
                    for (var colourProperty in colours[colourIndex]) { mergedDataAndColour[colourProperty] = colours[colourIndex][colourProperty]; }
                    mergedDataAndColours.push(mergedDataAndColour);
                    colourIndex++;
                }
                return mergedDataAndColours;
            }
        };
    });
})(angular.module('refresh.charts.chartService', []));