var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

if(personalFinanceManagementFeature) {
    describe('chart colours', function (){
        'use strict';

        var colourService;
        beforeEach(function () {
            module('refresh.charts');
            inject(function (chartColours) {
                colourService = chartColours;
            });
        });

        it('should return the correct colours', function () {
            expect(colourService).toEqual(jasmine.objectContaining({
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
                creditCardProduct4:     [204,91 ,35 ]
            }));
        });

        describe('colour method', function () {
            it('should calculate the rgba colour string based on the red green and blue values provided', function () {
                expect(colourService.colour(159,235,171)).toEqual('rgba(159,235,171,1)');
            });

            it('should calculate the rgba colour string based on an ordered array of red, green and blue values provided', function () {
                expect(colourService.colour([159,235,171])).toEqual('rgba(159,235,171,1)');
            });

            describe('invalid input', function () {
                it('should throw an error if exactly three values are not provided', function() {
                    expect(function() {
                        colourService.colour(159,235);
                    }).toThrow();

                    expect(function() {
                        colourService.colour(159);
                    }).toThrow();

                    expect(function() {
                        colourService.colour();
                    }).toThrow();

                    expect(function() {
                        colourService.colour([159,235]);
                    }).toThrow();

                    expect(function() {
                        colourService.colour([159]);
                    }).toThrow();

                    expect(function() {
                        colourService.colour([]);
                    }).toThrow();
                });

                it('should throw an error if values provided are not numeric', function() {
                    expect(function() {
                        colourService.colour(159,235,"test");
                    }).toThrow();
                });

                it('should throw an error if values provided are out of range', function() {
                    expect(function() {
                        colourService.colour(-1,256,257);
                    }).toThrow();
                });
            });
        });

        describe('highlight method', function () {
            it('should calculate the rgba colour string based on the red green and blue values provided', function () {
                expect(colourService.highlight(159,235,171)).toEqual('rgba(159,235,171,0.8)');
            });

            it('should calculate the rgba colour string based on an ordered array of red, green and blue values provided', function () {
                expect(colourService.highlight([159,235,171])).toEqual('rgba(159,235,171,0.8)');
            });

            describe('invalid input', function () {
                it('should throw an error if exactly three values are not provided', function() {
                    expect(function() {
                        colourService.highlight(159,235);
                    }).toThrow();

                    expect(function() {
                        colourService.highlight(159);
                    }).toThrow();

                    expect(function() {
                        colourService.highlight();
                    }).toThrow();

                    expect(function() {
                        colourService.highlight([159,235]);
                    }).toThrow();

                    expect(function() {
                        colourService.highlight([159]);
                    }).toThrow();

                    expect(function() {
                        colourService.highlight([]);
                    }).toThrow();
                });

                it('should throw an error if values provided are not numeric', function() {
                    expect(function() {
                        colourService.highlight(159,235,"test");
                    }).toThrow();
                });

                it('should throw an error if values provided are out of range', function() {
                    expect(function() {
                        colourService.highlight(-1,256,257);
                    }).toThrow();
                });
            });
        });

        describe('chart colour object method', function () {
            it('should return an object with colour value set to the result of the colour function and highlight value set to the result of the highlight function', function () {
                var colourValues = colourService.creditCardProduct2;
                var colour = colourService.colour(colourValues);
                var highlight = colourService.highlight(colourValues);

                expect(colourService.colourObject(colourValues)).toEqual({ color: colour, highlight: highlight});
            });
        });
    });
}