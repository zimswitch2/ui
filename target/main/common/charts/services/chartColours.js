(function (app) {
    'use strict';

    app.service('chartColours', function () {
        var convertArgumentsIntoColourByteArray = function (colours) {
            if(colours.length !== 3 && colours.length === 1) {
                colours = colours[0];
            }
            if(colours.length !== 3) {
                throw new Error("input needs to be red, green and blue byte values or an array of byte values in order of red green and blue");
            }
            if(isNaN(colours[0]) || isNaN(colours[1]) || isNaN(colours[2])) {
                throw new Error("input values need to be numeric");
            }
            for(var i = 0; i < 3; i++) {
                if(colours[i] < 0 || colours[i] > 255) {
                    throw new Error("input values need to be within the range of byte");
                }
            }
            return colours;
        };
        return {
            highlightOpacityRatio:  0.8,
            cashIn:                 [159,235,171],
            cashInText:             [36 ,147,  9],
            cashOut:                [244,115,114],
            cashOutText:            [220, 24, 10],
            transactionalProduct1:  [2  ,93 ,140],
            transactionalProduct2:  [16, 127,201],
            transactionalProduct3:  [10 ,147,252],
            transactionalProduct4:  [115,194,255],
            transactionalProduct5:  [0  ,79 ,128],
            transactionalProduct6:  [0  ,97 ,158],
            transactionalProduct7:  [0  ,112,181],
            transactionalProduct8:  [0  ,132,214],
            transactionalProduct9:  [0  ,142,230],
            creditCardProduct1:     [244,141,44 ],
            creditCardProduct2:     [236,124,25 ],
            creditCardProduct3:     [253,153,64 ],
            creditCardProduct4:     [204,91 ,35 ],
            colour: function () {
                var colours = convertArgumentsIntoColourByteArray(arguments);
                return 'rgba(' + colours[0] + ',' + colours[1] + ',' + colours[2] + ',1)';
            },
            highlight: function () {
                var colours = convertArgumentsIntoColourByteArray(arguments);
                return 'rgba(' + colours[0] + ',' + colours[1] + ',' + colours[2] + ',' + this.highlightOpacityRatio + ')';
            },
            colourObject: function () {
                var colours = convertArgumentsIntoColourByteArray(arguments);
                return { color: this.colour(colours), highlight: this.highlight(colours) };
            }
        };
    });
})(angular.module('refresh.charts.chartColours', []));