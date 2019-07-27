describe('mapFilter', function () {
    'use strict';

    beforeEach(module('refresh.mapFilter'));

    var mapFilter, lookUps;

    beforeEach(inject(function (_mapFilter_, LookUps) {
        lookUps = LookUps;
        mapFilter = _mapFilter_;
    }));

    it('should return undefined if lookup values is undefined', function () {
        lookUps.country = { values: function () {} };
        expect(mapFilter('ZA', 'country')).toBeUndefined();
    });

    describe('with lookup values', function () {
        beforeEach(function () {
            lookUps.country = {
                values: function () {
                    return [
                        { code: 'ZA', description: 'South Africa' }
                    ];
                }
            };
        });

        it('should return mapped value', function () {
            expect(mapFilter('ZA', 'country')).toEqual('South Africa');
        });

        it('should return undefined if value is not mapped', function () {
            expect(mapFilter('trash', 'country')).toBeUndefined();
        });

        it('should return undefined if value is undefined', function () {
            expect(mapFilter(undefined, 'trash')).toBeUndefined();
        });
    });
});
